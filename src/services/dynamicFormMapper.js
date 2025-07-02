const formFieldMappingService = require('./formFieldMappingService');
const logger = require('../utils/logger');

class DynamicFormMapper {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Get form selector using multiple strategies without relying on hardcoded keys
     * @param {string} fieldPurpose - The purpose of the field (e.g., 'business_name', 'registered_agent_name')
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data
     * @param {string} fallbackSelector - Fallback selector if not found
     * @param {string} stateIdentifier - The state identifier
     * @returns {Promise<string>} The form selector
     */
    async getFormSelector(fieldPurpose, formType, entityType, payload = {}, fallbackSelector = null, stateIdentifier = null) {
        const cacheKey = `${formType}_${entityType}_${fieldPurpose}_${stateIdentifier || 'default'}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // First, try to get from form field mapping service
            const selector = await formFieldMappingService.findSelectorByPurpose(
                fieldPurpose, 
                'input', 
                formType, 
                entityType, 
                payload,
                stateIdentifier
            );
            
            if (selector) {
                this.cache.set(cacheKey, selector);
                return selector;
            }

            // Fallback to hardcoded selector if provided
            if (fallbackSelector) {
                this.cache.set(cacheKey, fallbackSelector);
                return fallbackSelector;
            }

            return null;
        } catch (error) {
            logger.error(`Error getting form selector for ${fieldPurpose}:`, error);
            return fallbackSelector;
        }
    }

    /**
     * Get multiple form selectors for a group of related fields
     * @param {Array} fieldPurposes - Array of field purposes
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data
     * @param {Object} fallbackSelectors - Object with fallback selectors
     * @param {string} stateIdentifier - The state identifier
     * @returns {Promise<Object>} Object with field purposes as keys and selectors as values
     */
    async getFormSelectors(fieldPurposes, formType, entityType, payload = {}, fallbackSelectors = {}, stateIdentifier = null) {
        const selectors = {};
        
        for (const purpose of fieldPurposes) {
            const fallback = fallbackSelectors[purpose] || null;
            selectors[purpose] = await this.getFormSelector(purpose, formType, entityType, payload, fallback, stateIdentifier);
        }
        
        return selectors;
    }

    /**
     * Get business name related selectors
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data
     * @param {string} stateIdentifier - The state identifier
     * @returns {Promise<Object>} Business name selectors
     */
    async getBusinessNameSelectors(formType, entityType, payload = {}, stateIdentifier = null) {
        return await this.getFormSelectors(
            ['business_name', 'business_name_confirm'],
            formType,
            entityType,
            payload,
            {
                business_name: 'ctl00$MainContent$ucName$txtName',
                business_name_confirm: 'ctl00$MainContent$ucName$txtNameConfirm'
            },
            stateIdentifier
        );
    }

    /**
     * Get registered agent related selectors
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data
     * @param {string} stateIdentifier - The state identifier
     * @returns {Promise<Object>} Registered agent selectors
     */
    async getRegisteredAgentSelectors(formType, entityType, payload = {}, stateIdentifier = null) {
        return await this.getFormSelectors(
            [
                'registered_agent_name',
                'registered_agent_address', 
                'registered_agent_city',
                'registered_agent_phone',
                'registered_agent_email'
            ],
            formType,
            entityType,
            payload,
            {
                registered_agent_name: '#txtFirstName',
                registered_agent_address: '#txtAddr1',
                registered_agent_city: '#txtCity',
                registered_agent_phone: 'ctl00$MainContent$ucRA$txtPhone',
                registered_agent_email: 'ctl00$MainContent$ucRA$txtEmail'
            },
            stateIdentifier
        );
    }

    /**
     * Get principal address related selectors
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data
     * @param {string} stateIdentifier - The state identifier
     * @returns {Promise<Object>} Principal address selectors
     */
    async getPrincipalAddressSelectors(formType, entityType, payload = {}, stateIdentifier = null) {
        return await this.getFormSelectors(
            [
                'principal_address',
                'principal_city',
                'principal_state',
                'principal_zip'
            ],
            formType,
            entityType,
            payload,
            {
                principal_address: 'ctl00$MainContent$ucAddress$txtAddr1',
                principal_city: 'ctl00$MainContent$ucAddress$txtCity',
                principal_state: 'ctl00$MainContent$ucAddress$txtState',
                principal_zip: 'ctl00$MainContent$ucAddress$txtPostal'
            },
            stateIdentifier
        );
    }

    /**
     * Get mailing address related selectors
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data
     * @param {string} stateIdentifier - The state identifier
     * @returns {Promise<Object>} Mailing address selectors
     */
    async getMailingAddressSelectors(formType, entityType, payload = {}, stateIdentifier = null) {
        return await this.getFormSelectors(
            [
                'mailing_address',
                'mailing_city',
                'mailing_state',
                'mailing_zip'
            ],
            formType,
            entityType,
            payload,
            {
                mailing_address: 'ctl00$MainContent$ucAddress$txtAddr1Mail',
                mailing_city: 'ctl00$MainContent$ucAddress$txtCityMail',
                mailing_state: 'ctl00$MainContent$ucAddress$txtStateMail',
                mailing_zip: 'ctl00$MainContent$ucAddress$txtPostalMail'
            },
            stateIdentifier
        );
    }

    /**
     * Get organizer related selectors
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data
     * @param {string} stateIdentifier - The state identifier
     * @returns {Promise<Object>} Organizer selectors
     */
    async getOrganizerSelectors(formType, entityType, payload = {}, stateIdentifier = null) {
        return await this.getFormSelectors(
            [
                'organizer_name',
                'organizer_address'
            ],
            formType,
            entityType,
            payload,
            {
                organizer_name: 'ctl00$MainContent$ucParties$txtFirstName',
                organizer_address: 'ctl00$MainContent$ucParties$txtMail1'
            },
            stateIdentifier
        );
    }

    /**
     * Get button and navigation selectors
     * @param {string} formType - The form type
     * @param {string} entityType - The entity type
     * @param {Object} payload - The payload data
     * @param {string} stateIdentifier - The state identifier
     * @returns {Promise<Object>} Button selectors
     */
    async getButtonSelectors(formType, entityType, payload = {}, stateIdentifier = null) {
        return await this.getFormSelectors(
            [
                'start_button',
                'continue_button',
                'save_button',
                'agreement_checkbox',
                'business_type_selector'
            ],
            formType,
            entityType,
            payload,
            {
                start_button: '#regStartNow',
                continue_button: '#ContinueButton',
                save_button: '#SaveButton',
                agreement_checkbox: '#MainContent_chkAgree',
                business_type_selector: '#MainContent_slctBusType'
            },
            stateIdentifier
        );
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

module.exports = new DynamicFormMapper(); 