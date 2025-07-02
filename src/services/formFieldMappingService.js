const { Pool } = require('pg');
const logger = require('../utils/logger');

class FormFieldMappingService {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 5432,
        });
    }

    async getFormFieldMappings(formType, entityType, stateIdentifier = null) {
        try {
            // First, get all state IDs that have mappings for this form type and entity type
            const stateQuery = `
                SELECT DISTINCT state_id 
                FROM form_field_mappings 
                WHERE form_type = $1 AND entity_type = $2
                ORDER BY state_id
            `;
            
            const stateResult = await this.pool.query(stateQuery, [formType, entityType]);
            
            if (stateResult.rows.length === 0) {
                logger.warn(`No mappings found for form_type: ${formType}, entity_type: ${entityType}`);
                return this.getDefaultMappings(formType, entityType);
            }
            
            let stateId;
            
            // If multiple states exist, try to determine which one to use
            if (stateResult.rows.length > 1) {
                if (stateIdentifier) {
                    // Try to find a state that matches the identifier
                    // For Wyoming, we could look for state_id = 50
                    if (stateIdentifier === 'Wyoming' || stateIdentifier === 50) {
                        stateId = 50;
                    } else if (stateIdentifier === 'NewJersey' || stateIdentifier === 30) {
                        stateId = 30;
                    } else {
                        // Default to first state if identifier doesn't match
                        stateId = stateResult.rows[0].state_id;
                        logger.warn(`State identifier '${stateIdentifier}' not found, using first state: ${stateId}`);
                    }
                } else {
                    // Default to first state if no identifier provided
                    stateId = stateResult.rows[0].state_id;
                    logger.warn(`Multiple states found for form_type: ${formType}, entity_type: ${entityType}. Using first state: ${stateId}`);
                }
            } else {
                // Only one state found
                stateId = stateResult.rows[0].state_id;
            }
            
            logger.info(`Using state_id: ${stateId} for form_type: ${formType}, entity_type: ${entityType}`);
            
            // Now get the mappings for this specific state
            const query = `
                SELECT payload_key, form_selector, static_value 
                FROM form_field_mappings 
                WHERE form_type = $1 AND entity_type = $2 AND state_id = $3
                ORDER BY id
            `;
            
            const result = await this.pool.query(query, [formType, entityType, stateId]);
            
            // Convert to simple key-value pairs for direct replacement
            const mappings = {};
            
            result.rows.forEach(row => {
                if (row.static_value && row.form_selector) {
                    // For static values like "NJ Domestic Limited Liability Company (LLC)" -> "#BusinessType"
                    mappings[row.static_value] = row.form_selector;
                }
                if (row.payload_key && row.form_selector) {
                    // For payload keys like "payload.Name.Legal_Name" -> "BusinessName"
                    mappings[row.payload_key] = row.form_selector;
                }
                // Handle cases where payload_key is NULL but form_selector exists
                if (!row.payload_key && row.form_selector) {
                    // Create mapping from form_selector to itself for direct lookup
                    mappings[row.form_selector] = row.form_selector;
                }
            });
            
            return mappings;
        } catch (error) {
            logger.error('Error fetching form field mappings:', error);
            // Fallback to default mappings if database is not available
            return this.getDefaultMappings(formType, entityType);
        }
    }

    getDefaultMappings(formType, entityType) {
        // Simple fallback mappings
        if (formType === 'Entity_Formation' && entityType === 'llc') {
            return {
                'NJ Domestic Limited Liability Company (LLC)': '#BusinessType',
                'designator': '#BusinessNameDesignator',
                'Authorized Representative': '#Title',
                'I attest that the Registered Agent information entered is correct for this business': '',
                'payload.Name.Legal_Name': 'BusinessName',
                'payload.Name.Alternate_Legal_Name': 'BusinessName',
                'payload.Registered_Agent.keyPersonnelName': 'RegisteredAgentName',
                'payload.Registered_Agent.Address.Street_Address': 'OfficeAddress1',
                'payload.Registered_Agent.Address["Address_Line_2"]': 'OfficeAddress2',
                'payload.Registered_Agent.Address.City': 'OfficeCity',
                'payload.Registered_Agent.Address.Zip_Code': 'OfficeZip',
                'payload.Organizer_Information.keyPersonnelName': 'Name'
            };
        }
        return {};
    }

    // Simple method to get value from database mapping
    async getValue(key, formType = 'Entity_Formation', entityType = 'llc') {
        const mappings = await this.getFormFieldMappings(formType, entityType);
        return mappings[key] || key; // Return original key if not found
    }

    /**
     * Dynamically find form selector based on field purpose and data structure
     * @param {string} fieldPurpose - The purpose of the field (e.g., 'business_name', 'registered_agent_name', 'address')
     * @param {string} fieldType - The type of field (e.g., 'input', 'select', 'checkbox', 'button')
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data to help identify the correct field
     * @param {string} stateIdentifier - The state identifier
     * @returns {string} The form selector
     */
    async findSelectorByPurpose(fieldPurpose, fieldType, formType, entityType, payload = {}, stateIdentifier = null) {
        try {
            const mappings = await this.getFormFieldMappings(formType, entityType, stateIdentifier);
            
            // Define field purpose patterns and their corresponding selectors
            const purposePatterns = {
                'business_name': {
                    patterns: ['name', 'legal', 'business', 'company'],
                    selectors: ['txtName', 'txtBusinessName', 'txtCompanyName', 'txtLegalName']
                },
                'business_name_confirm': {
                    patterns: ['name', 'legal', 'business', 'company', 'confirm'],
                    selectors: ['txtNameConfirm', 'txtBusinessNameConfirm', 'txtCompanyNameConfirm']
                },
                'registered_agent_name': {
                    patterns: ['agent', 'ra', 'registered'],
                    selectors: ['txtFirstName', 'txtLastName', 'txtAgentName', 'txtRAName']
                },
                'registered_agent_address': {
                    patterns: ['address', 'street', 'addr'],
                    selectors: ['txtAddr1', 'txtStreet', 'txtAddress', 'txtRAAddress']
                },
                'registered_agent_city': {
                    patterns: ['city'],
                    selectors: ['txtCity', 'txtRACity']
                },
                'registered_agent_phone': {
                    patterns: ['phone', 'contact', 'tel'],
                    selectors: ['txtPhone', 'txtContact', 'txtTelephone']
                },
                'registered_agent_email': {
                    patterns: ['email', 'mail'],
                    selectors: ['txtEmail', 'txtMail']
                },
                'principal_address': {
                    patterns: ['principal', 'address', 'street'],
                    selectors: ['txtAddr1', 'txtPrincipalAddr', 'txtStreet']
                },
                'principal_city': {
                    patterns: ['city'],
                    selectors: ['txtCity', 'txtPrincipalCity']
                },
                'principal_state': {
                    patterns: ['state'],
                    selectors: ['txtState', 'txtPrincipalState']
                },
                'principal_zip': {
                    patterns: ['zip', 'postal'],
                    selectors: ['txtPostal', 'txtZip', 'txtPrincipalZip']
                },
                'mailing_address': {
                    patterns: ['mailing', 'address', 'street'],
                    selectors: ['txtAddr1Mail', 'txtMailingAddr', 'txtMailStreet']
                },
                'mailing_city': {
                    patterns: ['city'],
                    selectors: ['txtCityMail', 'txtMailingCity']
                },
                'mailing_state': {
                    patterns: ['state'],
                    selectors: ['txtStateMail', 'txtMailingState']
                },
                'mailing_zip': {
                    patterns: ['zip', 'postal'],
                    selectors: ['txtPostalMail', 'txtMailingZip']
                },
                'organizer_name': {
                    patterns: ['organizer', 'member', 'owner'],
                    selectors: ['txtFirstName', 'txtLastName', 'txtOrganizerName']
                },
                'organizer_address': {
                    patterns: ['organizer', 'address', 'street'],
                    selectors: ['txtMail1', 'txtOrganizerAddr', 'txtStreet']
                },
                'continue_button': {
                    patterns: ['continue', 'next', 'button'],
                    selectors: ['#ContinueButton', '#NextButton', '.btn-continue']
                },
                'save_button': {
                    patterns: ['save', 'submit', 'button'],
                    selectors: ['#SaveButton', '#SubmitButton', '.btn-save']
                },
                'start_button': {
                    patterns: ['start', 'begin', 'button'],
                    selectors: ['#regStartNow', '#StartButton', '.btn-start']
                },
                'agreement_checkbox': {
                    patterns: ['agree', 'consent', 'checkbox'],
                    selectors: ['#MainContent_chkAgree', '#chkAgree', '.chk-agree']
                },
                'business_type_selector': {
                    patterns: ['business', 'type', 'select'],
                    selectors: ['#MainContent_slctBusType', '#BusinessType', '.business-type-select']
                }
            };

            const purpose = purposePatterns[fieldPurpose];
            if (!purpose) {
                // Fallback: try to find by field purpose in the mappings
                for (const [key, value] of Object.entries(mappings)) {
                    if (key.toLowerCase().includes(fieldPurpose.toLowerCase()) || 
                        (typeof value === 'string' && value.toLowerCase().includes(fieldPurpose.toLowerCase()))) {
                        return value;
                    }
                }
                return null;
            }

            // First, try to find exact matches in the mappings
            for (const [key, value] of Object.entries(mappings)) {
                if (key.toLowerCase().includes(fieldPurpose.toLowerCase()) || 
                    (typeof value === 'string' && value.toLowerCase().includes(fieldPurpose.toLowerCase()))) {
                    return value;
                }
            }

            // Second, try to find by selector patterns
            for (const selector of purpose.selectors) {
                for (const [key, value] of Object.entries(mappings)) {
                    if (value && value.includes(selector)) {
                        return value;
                    }
                }
            }

            // Third, try to find by payload key patterns
            for (const pattern of purpose.patterns) {
                for (const [key, value] of Object.entries(mappings)) {
                    if (key && key.toLowerCase().includes(pattern.toLowerCase())) {
                        return value;
                    }
                }
            }

            // Fourth, try to find by static value patterns
            for (const pattern of purpose.patterns) {
                for (const [key, value] of Object.entries(mappings)) {
                    if (value && value.toLowerCase().includes(pattern.toLowerCase())) {
                        return value;
                    }
                }
            }

            return null;
        } catch (error) {
            logger.error('Error finding selector by purpose:', error);
            return null;
        }
    }

    /**
     * Smart selector finder that uses multiple strategies to find the correct form selector
     * @param {string} fieldPurpose - The purpose of the field
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data
     * @param {string} fallbackSelector - Fallback selector if not found
     * @returns {string} The form selector
     */
    async getSmartSelector(fieldPurpose, formType, entityType, payload = {}, fallbackSelector = null) {
        try {
            // Strategy 1: Try to find by purpose
            let selector = await this.findSelectorByPurpose(fieldPurpose, 'input', formType, entityType, payload);
            
            if (selector) {
                logger.info(`Found selector for ${fieldPurpose}: ${selector}`);
                return selector;
            }

            // Strategy 2: Try to find by payload key patterns
            const payloadKeys = this.extractPayloadKeys(payload);
            for (const key of payloadKeys) {
                const keySelector = await this.getValue(key, formType, entityType);
                if (keySelector && keySelector !== key) {
                    logger.info(`Found selector for ${fieldPurpose} via payload key ${key}: ${keySelector}`);
                    return keySelector;
                }
            }

            // Strategy 3: Try common field name patterns
            const commonPatterns = this.getCommonFieldPatterns(fieldPurpose);
            for (const pattern of commonPatterns) {
                const patternSelector = await this.findSelectorByPurpose(pattern, 'input', formType, entityType, payload);
                if (patternSelector) {
                    logger.info(`Found selector for ${fieldPurpose} via pattern ${pattern}: ${patternSelector}`);
                    return patternSelector;
                }
            }

            // Strategy 4: Return fallback or null
            if (fallbackSelector) {
                logger.warn(`Using fallback selector for ${fieldPurpose}: ${fallbackSelector}`);
                return fallbackSelector;
            }

            logger.warn(`No selector found for ${fieldPurpose}`);
            return null;
        } catch (error) {
            logger.error('Error in getSmartSelector:', error);
            return fallbackSelector;
        }
    }

    /**
     * Extract all possible payload keys from the payload object
     * @param {Object} payload - The payload object
     * @returns {Array} Array of payload keys
     */
    extractPayloadKeys(payload) {
        const keys = [];
        
        const extractKeys = (obj, prefix = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                keys.push(fullKey);
                
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    extractKeys(value, fullKey);
                }
            }
        };

        extractKeys(payload);
        return keys;
    }

    /**
     * Get common field patterns for a given field purpose
     * @param {string} fieldPurpose - The field purpose
     * @returns {Array} Array of common patterns
     */
    getCommonFieldPatterns(fieldPurpose) {
        const patternMap = {
            'business_name': ['legal_name', 'company_name', 'entity_name', 'name'],
            'registered_agent_name': ['agent_name', 'ra_name', 'registered_agent'],
            'registered_agent_address': ['agent_address', 'ra_address', 'registered_agent_address'],
            'registered_agent_phone': ['agent_phone', 'ra_phone', 'registered_agent_phone'],
            'registered_agent_email': ['agent_email', 'ra_email', 'registered_agent_email'],
            'principal_address': ['business_address', 'office_address', 'principal_address'],
            'mailing_address': ['mailing_address', 'correspondence_address'],
            'organizer_name': ['organizer', 'member', 'owner', 'founder']
        };

        return patternMap[fieldPurpose] || [fieldPurpose];
    }
}

module.exports = new FormFieldMappingService(); 