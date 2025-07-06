const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
const SimpleMapperService = require('../services/simpleMapperService');
// const mappingService = require('../services/mappingService');
const formFieldMappingService = require('../services/formFieldMappingService');
const dynamicFormMapper = require('../services/dynamicFormMapper');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class WyomingForLLC extends BaseFormHandler {
    constructor() {
        super();
        this.mapperService = new SimpleMapperService();
    }
    
    /**
     * Utility function to get value from payload using multiple possible paths
     * @param {Object} payload - The payload object
     * @param {Array} paths - Array of possible paths to try
     * @returns {string|null} The found value or null
     */
    getValueFromPayload(payload, paths) {
        for (const path of paths) {
            const value = this.getValueFromPath(payload, path);
            if (value) {
                return value;
            }
        }
        return null;
    }
    
    /**
     * Get value from nested object using dot notation path
     * @param {Object} obj - The object to search in
     * @param {string} path - The dot notation path
     * @returns {string|null} The found value or null
     */
    getValueFromPath(obj, path) {
        try {
            return path.split('.').reduce((current, key) => {
                return current && current[key] !== undefined ? current[key] : null;
            }, obj);
        } catch (error) {
            return null;
        }
    }
    
    async WyomingForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to wyoming form submission page...');
            
            // Debug: Log original payload structure
            logger.info('Original payload structure:', JSON.stringify(payload, null, 2));
            
            // Debug: Examine payload structure to find business name
            debugPayloadStructure(payload);
            
            // Additional debugging for name object specifically
            if (payload.name) {
                logger.info('=== NAME OBJECT DEBUG ===');
                logger.info('Name object keys:', Object.keys(payload.name));
                logger.info('Full name object:', JSON.stringify(payload.name, null, 2));
                
                // Try each key in the name object
                Object.keys(payload.name).forEach(key => {
                    logger.info(`name.${key}: "${payload.name[key]}"`);
                });
            } else {
                logger.error('No "name" object found in payload');
            }
            
            // Use payload directly instead of mappingService
            const mappedPayload = payload;
            
            // Debug: Log mapped payload structure
            logger.info('Mapped payload structure:', JSON.stringify(mappedPayload, null, 2));
            
            const data = Object.values(jsonData)[0];
            const url = data.State.stateUrl;
            
            // Get form field mappings from database
            const formMappings = await formFieldMappingService.getFormFieldMappings('Entity_Formation', 'LLC', 'Wyoming');
            logger.info('Form field mappings loaded:', Object.keys(formMappings).length, 'mappings');
            
            await this.navigateToPage(page, url);
            
            // Get all dynamic selectors
            const buttonSelectors = await dynamicFormMapper.getButtonSelectors('Entity_Formation', 'LLC', payload, 'Wyoming');
            const businessNameSelectors = await dynamicFormMapper.getBusinessNameSelectors('Entity_Formation', 'LLC', payload, 'Wyoming');
            const raSelectors = await dynamicFormMapper.getRegisteredAgentSelectors('Entity_Formation', 'LLC', payload, 'Wyoming');
            const paSelectors = await dynamicFormMapper.getPrincipalAddressSelectors('Entity_Formation', 'LLC', payload, 'Wyoming');
            const mailSelectors = await dynamicFormMapper.getMailingAddressSelectors('Entity_Formation', 'LLC', payload, 'Wyoming');
            const orgSelectors = await dynamicFormMapper.getOrganizerSelectors('Entity_Formation', 'LLC', payload, 'Wyoming');
            
            // Validate all required selectors
            this.validateSelectors({
                buttonSelectors,
                businessNameSelectors,
                raSelectors,
                paSelectors,
                mailSelectors,
                orgSelectors
            });
            
            // Start form submission
            logger.info('About to click start button:', buttonSelectors.start_button);
            await this.clickButton(page, buttonSelectors.start_button);
            logger.info('Start button clicked successfully');
            
            // Wait a bit for the page to load
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const agreementCheckboxId = buttonSelectors.agreement_checkbox.replace('#', '');
            logger.info('About to select agreement checkbox:', agreementCheckboxId);
            
            // Check if the element exists before trying to select it
            const elementExists = await page.evaluate((id) => {
                return document.getElementById(id) !== null;
            }, agreementCheckboxId);
            
            if (!elementExists) {
                logger.error(`Element with ID "${agreementCheckboxId}" not found on page`);
                // Take a screenshot to see what's on the page
                await page.screenshot({ path: 'debug-element-not-found.png' });
                logger.info('Screenshot saved: debug-element-not-found.png');
                
                // List all elements with similar IDs
                const similarElements = await page.evaluate(() => {
                    const elements = Array.from(document.querySelectorAll('[id*="chkAgree"], [id*="agree"], [id*="Agree"]'));
                    return elements.map(el => ({ id: el.id, tagName: el.tagName, className: el.className }));
                });
                logger.info('Similar elements found:', similarElements);
                
                throw new Error(`Agreement checkbox element not found. Expected: ${agreementCheckboxId}`);
            }
            
            await this.selectRadioButtonById(page, agreementCheckboxId);
            logger.info('Agreement checkbox selected successfully');
            
            // Take another screenshot
            await page.screenshot({ path: 'debug-after-checkbox.png' });
            logger.info('Screenshot saved: debug-after-checkbox.png');
            
            // Business type selection - database driven with simple mapper
            logger.info('Available form mapping keys:', Object.keys(formMappings));
            
            // Get business type mapping from database using simple mapper
            const businessTypeMapping = await this.mapperService.getBusinessTypeMapping(50, 'LLC');
            
            if (!businessTypeMapping.selector) {
                throw new Error('Business type mapping not found in database for Wyoming LLC');
            }
            
            const businessTypeSelector = businessTypeMapping.selector;
            const businessTypeValue = businessTypeMapping.value;
            
            logger.info('Business type selector:', businessTypeSelector);
            logger.info('Business type value:', businessTypeValue);
            
            // Check if the business type selector exists on the page
            const businessTypeExists = await page.evaluate((selector) => {
                return document.querySelector(selector) !== null;
            }, businessTypeSelector);
            
            if (!businessTypeExists) {
                logger.error(`Business type selector "${businessTypeSelector}" not found on page`);
                await page.screenshot({ path: 'debug-business-type-not-found.png' });
                logger.info('Screenshot saved: debug-business-type-not-found.png');
                
                // List all select elements on the page
                const allSelects = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('select')).map(select => ({
                        id: select.id,
                        name: select.name,
                        className: select.className
                    }));
                });
                logger.info('All select elements on page:', JSON.stringify(allSelects, null, 2));
                
                throw new Error(`Business type selector not found. Expected: ${businessTypeSelector}`);
            }
            
            await this.clickDropdown(page, businessTypeSelector, businessTypeValue);
            logger.info('Business type dropdown clicked successfully');
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Get all field selectors from database
            const fieldSelectors = await this.getWyomingFieldSelectors();
            
            // Continue to business name section - use database-driven selector for first page
            await page.waitForSelector(fieldSelectors.continueButtonFirstPage);
            await page.click(fieldSelectors.continueButtonFirstPage);
            
            // Get business name with multiple fallback paths for the actual payload structure
            logger.info('=== BUSINESS NAME EXTRACTION DEBUG ===');
            
            // Try all possible business name paths and log what we find
            const businessNamePaths = [
                ['name', 'legal_name'],
                ['name', 'business_name'],
                ['name', 'company_name'],
                ['name', 'name'],
                ['name', 'entity_name'],
                ['name', 'organization_name'],
                ['name', 'firm_name'],
                ['Legal_Name'],
                ['Name', 'Legal_Name'],
                ['Name', 'CD_LLC_Name']
            ];
            
            let legalName = null;
            for (const path of businessNamePaths) {
                const value = this.getValueFromPath(payload, path.join('.'));
                if (value) {
                    logger.info(`Found business name at path ${path.join('.')}: "${value}"`);
                    legalName = value;
                    break;
                } else {
                    logger.info(`No value found at path ${path.join('.')}`);
                }
            }
            
            if (!legalName) {
                logger.error('Business name not found in payload. Available keys: ' + JSON.stringify(Object.keys(payload)));
                logger.error('Payload structure:', JSON.stringify(payload, null, 2));
                throw new Error('Business name not found in payload. Available keys: ' + JSON.stringify(Object.keys(payload)));
            }
            
            // Fill business name fields
            await this.fillInputByName(page, businessNameSelectors.business_name, legalName);
            await this.fillInputByName(page, businessNameSelectors.business_name_confirm, legalName);
            
            await this.clickButton(page, fieldSelectors.continueButtonOtherPages);
            
            // Handle alternate legal name with updated payload structure
            const alternateLegalName = this.getValueFromPayload(payload, [
                ['name', 'alternate_legal_name'],
                ['name', 'dba_name'],
                ['Alternate_Legal_Name'],
                ['Name', 'Alternate_Legal_Name']
            ]);
            
            // Use database-driven field selectors
            const isNameREplaced = await this.tryAlternate1(
                page, 
                fieldSelectors.txtNameField,
                fieldSelectors.txtDelayedDateField,
                alternateLegalName
            );
            
            if (isNameREplaced) {
                await this.fillInputByName(page, businessNameSelectors.business_name_confirm, alternateLegalName);
                await this.clickButton(page, fieldSelectors.continueButtonOtherPages);
            }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.randomSleep(1000, 3000);

            // Continue button handling
            const continueButtonId = fieldSelectors.continueButtonOtherPages.replace('#', '');
            await page.evaluate((buttonId) => {
                const continueButton = document.getElementById(buttonId);
                if (continueButton) {
                continueButton.scrollIntoView();
                continueButton.click();
                }
            }, continueButtonId);
            await this.clickButton(page, fieldSelectors.continueButtonOtherPages);

            // Get registered agent information with updated payload structure
            const raName = this.getValueFromPayload(payload, [
                ['registered_agent', 'name'],
                ['registered_agent', 'full_name'],
                ['Registered_Agent', 'keyPersonnelName'],
                ['Registered_Agent', 'RA_Name']
            ]);
            
            const raAddress = this.getValueFromPayload(payload, [
                ['registered_agent', 'address', 'street_address'],
                ['registered_agent', 'address', 'line_1'],
                ['Registered_Agent', 'Address', 'Street_Address'],
                ['Registered_Agent', 'Address', 'RA_Address_Line_1']
            ]);
            
            const raCity = this.getValueFromPayload(payload, [
                ['registered_agent', 'address', 'city'],
                ['Registered_Agent', 'Address', 'City'],
                ['Registered_Agent', 'Address', 'RA_City']
            ]);
            
            const raContactNo = this.getValueFromPayload(payload, [
                ['registered_agent', 'phone'],
                ['registered_agent', 'contact_number'],
                ['Registered_Agent', 'ContactNo'],
                ['Registered_Agent', 'CI_Contact_No']
            ]);
            
            const raEmail = this.getValueFromPayload(payload, [
                ['registered_agent', 'email'],
                ['registered_agent', 'email_address'],
                ['Registered_Agent', 'EmailId'],
                ['Registered_Agent', 'CI_Email_Address']
            ]);

            const fullName = raName;
            const [firstName, lastName] = await this.ra_split(fullName);
            
            // Fill registered agent fields
            const inputFieldsforRA = [
                { selector: raSelectors.registered_agent_name, value: firstName },
                { selector: raSelectors.registered_agent_name, value: lastName },
                { selector: raSelectors.registered_agent_address, value: raAddress },
                { selector: raSelectors.registered_agent_city, value: raCity },
            ];
            await this.addInput(page, inputFieldsforRA);
            
            // Phone field handling
            await this.clickButton(page, raSelectors.registered_agent_phone);
            
            // Use database-driven postal code selector
            await this.clickButton(page, fieldSelectors.postalCodeItem);
            
            // Contact information
            await this.fillInputByName(page, raSelectors.registered_agent_phone, raContactNo);
            await this.fillInputByName(page, raSelectors.registered_agent_email, raEmail);
            
            // Use database-driven consent checkbox
            await page.click(fieldSelectors.consentCheckbox);
            await this.clickButton(page, fieldSelectors.continueButtonOtherPages);
            
            // Use database-driven error message selector
            try {
                await page.waitForSelector(fieldSelectors.errorMessageSelector, { visible: true, timeout: 5000 });
                console.log('Error message detected.');
                await this.clickButton(page, fieldSelectors.continueButtonOtherPages);
            } catch (error) {
                console.log('Error message not found or other issue:', error.message);
                await this.clickButton(page, fieldSelectors.continueButtonOtherPages);
            }
            await this.clickButton(page, fieldSelectors.continueButtonOtherPages);
            await this.clickButton(page, fieldSelectors.continueButtonOtherPages);

            // Get principal address information with updated payload structure
            const paStreetAddress = this.getValueFromPayload(payload, [
                ['principal_address', 'street_address'],
                ['principal_address', 'line_1'],
                ['Principal_Address', 'Street_Address'],
                ['Principal_Address', 'PA_Address_Line_1']
            ]);
            
            const paAddressLine2 = this.getValueFromPayload(payload, [
                ['principal_address', 'line_2'],
                ['principal_address', 'address_line_2'],
                ['Principal_Address', 'Address_Line_2'],
                ['Principal_Address', 'PA_Address_Line_2']
            ]) || " ";
            
            const paCity = this.getValueFromPayload(payload, [
                ['principal_address', 'city'],
                ['Principal_Address', 'City'],
                ['Principal_Address', 'PA_City']
            ]);
            
            const paState = this.getValueFromPayload(payload, [
                ['principal_address', 'state'],
                ['Principal_Address', 'State'],
                ['Principal_Address', 'PA_State']
            ]);
            
            const paZipCode = this.getValueFromPayload(payload, [
                ['principal_address', 'zip_code'],
                ['principal_address', 'postal_code'],
                ['Principal_Address', 'Zip_Code'],
                ['Principal_Address', 'PA_Zip_Code']
            ]);

            // Use database-driven principal address field selectors
            // Fill principal address fields
            await this.fillInputByName(page, paSelectors.principal_address, paStreetAddress);
            await this.fillInputByName(page, fieldSelectors.paAddress2Field, paAddressLine2);
            await this.fillInputByName(page, paSelectors.principal_city, paCity);
            await this.fillInputByName(page, paSelectors.principal_state, paState);
            await this.fillInputByName(page, paSelectors.principal_zip, String(paZipCode));
            await this.fillInputByName(page, fieldSelectors.paPhoneField, raContactNo);
            await this.fillInputByName(page, fieldSelectors.paEmailField, raEmail);
            
            // Get mailing information with updated payload structure
            const mailStreetAddress = this.getValueFromPayload(payload, [
                ['registered_agent', 'mailing_address', 'street_address'],
                ['registered_agent', 'mailing_address', 'line_1'],
                ['Registered_Agent', 'Mailing_Information', 'Street_Address'],
                ['Registered_Agent', 'Mailing_Information', 'MI_Address_Line_1']
            ]);
            
            const mailAddressLine2 = this.getValueFromPayload(payload, [
                ['registered_agent', 'mailing_address', 'line_2'],
                ['registered_agent', 'mailing_address', 'address_line_2'],
                ['Registered_Agent', 'Mailing_Information', 'Address_Line_2'],
                ['Registered_Agent', 'Mailing_Information', 'MI_Address_Line_2']
            ]) || " ";
            
            const mailCity = this.getValueFromPayload(payload, [
                ['registered_agent', 'mailing_address', 'city'],
                ['Registered_Agent', 'Mailing_Information', 'City'],
                ['Registered_Agent', 'Mailing_Information', 'MI_City']
            ]);
            
            const mailState = this.getValueFromPayload(payload, [
                ['registered_agent', 'mailing_address', 'state'],
                ['Registered_Agent', 'Mailing_Information', 'State'],
                ['Registered_Agent', 'Mailing_Information', 'MI_State']
            ]);
            
            const mailZipCode = this.getValueFromPayload(payload, [
                ['registered_agent', 'mailing_address', 'zip_code'],
                ['registered_agent', 'mailing_address', 'postal_code'],
                ['Registered_Agent', 'Mailing_Information', 'Zip_Code'],
                ['Registered_Agent', 'Mailing_Information', 'MI_Zip_Code']
            ]);

            // Use database-driven mailing address field selector
            // Fill mailing address fields
            await this.fillInputByName(page, mailSelectors.mailing_address, mailStreetAddress);
            await this.fillInputByName(page, fieldSelectors.mailAddress2Field, mailAddressLine2);
            await this.fillInputByName(page, mailSelectors.mailing_city, mailCity);
            await this.fillInputByName(page, mailSelectors.mailing_state, mailState);
            await this.fillInputByName(page, mailSelectors.mailing_zip, String(mailZipCode));
 
            await this.clickButton(page, fieldSelectors.continueButtonOtherPages);
            
            // Get organizer information with updated payload structure
            const orgName = this.getValueFromPayload(payload, [
                ['organizer_information', 'name'],
                ['organizer_information', 'full_name'],
                ['Organizer_Information', 'keyPersonnelName'],
                ['Organizer_Information', 'Organizer_Details', 'Org_Name']
            ]);
            
            const orgAddress = this.getValueFromPayload(payload, [
                ['organizer_information', 'address', 'street_address'],
                ['organizer_information', 'address', 'line_1'],
                ['Organizer_Information', 'Address', 'Street_Address'],
                ['Organizer_Information', 'Address', 'Org_Address_Line_1']
            ]);
            
            const orgCity = this.getValueFromPayload(payload, [
                ['organizer_information', 'address', 'city'],
                ['Organizer_Information', 'Address', 'City'],
                ['Organizer_Information', 'Address', 'Org_City']
            ]);
            
            const orgState = this.getValueFromPayload(payload, [
                ['organizer_information', 'address', 'state'],
                ['Organizer_Information', 'Address', 'State'],
                ['Organizer_Information', 'Address', 'Org_State']
            ]);
            
            const orgZipCode = this.getValueFromPayload(payload, [
                ['organizer_information', 'address', 'zip_code'],
                ['organizer_information', 'address', 'postal_code'],
                ['Organizer_Information', 'Address', 'Zip_Code'],
                ['Organizer_Information', 'Address', 'Org_Zip_Code']
            ]);

            const OrgfullName = orgName;
            const [OrgfirstName, OrglastName] = OrgfullName.split(' ');
            
            // Fill organizer fields
            await this.fillInputByName(page, orgSelectors.organizer_name, OrgfirstName);
            await this.fillInputByName(page, orgSelectors.organizer_name, OrglastName);
            await this.fillInputByName(page, orgSelectors.organizer_address, 
                orgAddress + ' ,' +
                orgCity + ', ' +
                orgState + ', ' +
                String(orgZipCode)
            );
            
            await this.randomSleep(3000, 5000);
            
            // Save and continue
            await this.clickButton(page, fieldSelectors.saveButton);
            await this.clickButton(page, fieldSelectors.saveButton);

            await this.randomSleep(3000, 5000);

            await page.waitForSelector(fieldSelectors.continueButtonOtherPages);
            await page.click(fieldSelectors.continueButtonOtherPages);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector(fieldSelectors.continueButtonOtherPages);
            await page.click(fieldSelectors.continueButtonOtherPages);
            await page.waitForSelector(fieldSelectors.continueButtonOtherPages);
            await page.click(fieldSelectors.continueButtonOtherPages);
            
            const res = "form filled successfully";
            return res;
        } catch (error) {
            logger.error('Error in wyoming For LLC form handler:', error.stack);
            throw new Error(`wyoming For LLC form submission failed: ${error.message}`);
        }
    }
    
    /**
     * Validate all required selectors are present
     * @param {Object} selectors - Object containing all selector groups
     */
    validateSelectors(selectors) {
        const { buttonSelectors, businessNameSelectors, raSelectors, paSelectors, mailSelectors, orgSelectors } = selectors;
        
        // Validate button selectors
        if (!buttonSelectors.start_button) {
            throw new Error('Start button selector not found in dynamic mappings');
        }
        if (!buttonSelectors.continue_button) {
            throw new Error('Continue button selector not found in dynamic mappings');
        }
        if (!buttonSelectors.save_button) {
            throw new Error('Save button selector not found in dynamic mappings');
        }
        if (!buttonSelectors.agreement_checkbox) {
            throw new Error('Agreement checkbox selector not found in dynamic mappings');
        }
        if (!buttonSelectors.business_type_selector) {
            throw new Error('Business type selector not found in dynamic mappings');
        }
        
        // Validate business name selectors
        if (!businessNameSelectors.business_name) {
            throw new Error('Business name field selector not found in dynamic mappings');
        }
        if (!businessNameSelectors.business_name_confirm) {
            throw new Error('Business name confirm field selector not found in dynamic mappings');
        }
        
        // Validate registered agent selectors
        if (!raSelectors.registered_agent_name) {
            throw new Error('Registered agent name field selector not found in dynamic mappings');
        }
        if (!raSelectors.registered_agent_address) {
            throw new Error('Registered agent address field selector not found in dynamic mappings');
        }
        if (!raSelectors.registered_agent_city) {
            throw new Error('Registered agent city field selector not found in dynamic mappings');
        }
        if (!raSelectors.registered_agent_phone) {
            throw new Error('Registered agent phone field selector not found in dynamic mappings');
        }
        if (!raSelectors.registered_agent_email) {
            throw new Error('Registered agent email field selector not found in dynamic mappings');
        }
        
        // Validate principal address selectors
        if (!paSelectors.principal_address) {
            throw new Error('Principal address field selector not found in dynamic mappings');
        }
        if (!paSelectors.principal_city) {
            throw new Error('Principal city field selector not found in dynamic mappings');
        }
        if (!paSelectors.principal_state) {
            throw new Error('Principal state field selector not found in dynamic mappings');
        }
        if (!paSelectors.principal_zip) {
            throw new Error('Principal zip field selector not found in dynamic mappings');
        }
        
        // Validate mailing address selectors
        if (!mailSelectors.mailing_address) {
            throw new Error('Mailing address field selector not found in dynamic mappings');
        }
        if (!mailSelectors.mailing_city) {
            throw new Error('Mailing city field selector not found in dynamic mappings');
        }
        if (!mailSelectors.mailing_state) {
            throw new Error('Mailing state field selector not found in dynamic mappings');
        }
        if (!mailSelectors.mailing_zip) {
            throw new Error('Mailing zip field selector not found in dynamic mappings');
        }
        
        // Validate organizer selectors
        if (!orgSelectors.organizer_name) {
            throw new Error('Organizer name field selector not found in dynamic mappings');
        }
        if (!orgSelectors.organizer_address) {
            throw new Error('Organizer address field selector not found in dynamic mappings');
        }
    }

    /**
     * Get all field selectors from database for Wyoming LLC
     * @returns {Promise<Object>} Object with all field selectors
     */
    async getWyomingFieldSelectors() {
        const mappings = await this.mapperService.getMappings(50, 'Entity_Formation', 'LLC');
        
        // Define the field selectors we need
        const fieldSelectors = {
            // Business name fields
            txtNameField: mappings['txt_name_field'] || '#MainContent_ucName_txtName',
            txtDelayedDateField: mappings['txt_delayed_date_field'] || '#MainContent_ucName_txtDelayedDate',
            
            // Postal code
            postalCodeItem: mappings['postal_code_item'] || '#MainContent_ucRA_ddlPostalCode',
            
            // Consent checkbox
            consentCheckbox: mappings['consent_checkbox'] || '#MainContent_ucRA_chkConsent',
            
            // Error message
            errorMessageSelector: mappings['error_message_selector'] || '#MainContent_lblError',
            
            // Principal address fields
            paAddress2Field: mappings['principal_address_line_2'] || '#MainContent_ucAddress_txtAddr2',
            paPhoneField: mappings['principal_phone'] || '#MainContent_ucAddress_txtPhone',
            paEmailField: mappings['principal_email'] || '#MainContent_ucAddress_txtEmail',
            
            // Mailing address fields
            mailAddress2Field: mappings['mailing_address_line_2'] || '#MainContent_ucAddress_txtAddr2Mail',
            
            // Continue button selectors
            continueButtonFirstPage: mappings['continue_button_first_page'] || '#MainContent_ContinueButton',
            continueButtonOtherPages: mappings['continue_button_other_pages'] || '#ContinueButton',
            
            // Save button
            saveButton: mappings['save_button'] || '#MainContent_SaveButton'
        };
        
        logger.info('Loaded field selectors from database:', Object.keys(fieldSelectors));
        return fieldSelectors;
    }
}

// Debug function to examine payload structure
function debugPayloadStructure(payload) {
    console.log('=== PAYLOAD STRUCTURE DEBUG ===');
    console.log('Top-level keys:', Object.keys(payload));
    
    // Examine the 'name' object
    if (payload.name) {
        console.log('\n=== NAME OBJECT ===');
        console.log('Keys in name object:', Object.keys(payload.name));
        console.log('Full name object:', JSON.stringify(payload.name, null, 2));
        
        // Check for business name variations
        const nameKeys = Object.keys(payload.name);
        nameKeys.forEach(key => {
            console.log(`name.${key}:`, payload.name[key]);
        });
    }
    
    // Search for any field that might contain the business name
    console.log('\n=== SEARCHING FOR BUSINESS NAME ===');
    const searchForBusinessName = (obj, path = '') => {
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'string') {
                // Check if this string looks like a business name
                if (value.length > 3 && 
                    (value.toLowerCase().includes('llc') || 
                     value.toLowerCase().includes('inc') || 
                     value.toLowerCase().includes('corp') ||
                     value.toLowerCase().includes('company') ||
                     value.toLowerCase().includes('business'))) {
                    console.log(`Potential business name found at ${currentPath}: "${value}"`);
                }
            } else if (typeof value === 'object' && value !== null) {
                searchForBusinessName(value, currentPath);
            }
        }
    };
    
    searchForBusinessName(payload);
    
    console.log('\n=== END DEBUG ===');
}

module.exports = WyomingForLLC;
