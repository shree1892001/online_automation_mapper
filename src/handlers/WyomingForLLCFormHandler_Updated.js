const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const mappingService = require('../services/mappingService');
const formFieldMappingService = require('../services/formFieldMappingService');
const dynamicFormMapper = require('../services/dynamicFormMapper');

class WyomingForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    
    async WyomingForLLC(page, jsonData, payload) {
        try {
            logger.info('Navigating to wyoming form submission page...');
            
            // Debug: Log original payload structure
            logger.info('Original payload structure:', JSON.stringify(payload, null, 2));
            
            // Map the payload keys using database-driven mapping
            const mappedPayload = await mappingService.mapPayloadKeys(payload, 'llc');
            
            // Debug: Log mapped payload structure
            logger.info('Mapped payload structure:', JSON.stringify(mappedPayload, null, 2));
            
            // Get form field mappings from database
            const formMappings = await formFieldMappingService.getFormFieldMappings('Wyoming_LLC_Formation', 'LLC');
            logger.info('Form field mappings loaded:', Object.keys(formMappings).length, 'mappings');
            
            const data = Object.values(jsonData)[0];
            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            
            // Get all dynamic selectors
            const buttonSelectors = await dynamicFormMapper.getButtonSelectors('Wyoming_LLC_Formation', 'LLC', payload);
            const businessNameSelectors = await dynamicFormMapper.getBusinessNameSelectors('Wyoming_LLC_Formation', 'LLC', payload);
            const raSelectors = await dynamicFormMapper.getRegisteredAgentSelectors('Wyoming_LLC_Formation', 'LLC', payload);
            const paSelectors = await dynamicFormMapper.getPrincipalAddressSelectors('Wyoming_LLC_Formation', 'LLC', payload);
            const mailSelectors = await dynamicFormMapper.getMailingAddressSelectors('Wyoming_LLC_Formation', 'LLC', payload);
            const orgSelectors = await dynamicFormMapper.getOrganizerSelectors('Wyoming_LLC_Formation', 'LLC', payload);
            
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
            await this.clickButton(page, buttonSelectors.start_button);
            await this.selectRadioButtonById(page, buttonSelectors.agreement_checkbox);
            
            // Business type selection
            const businessTypeValue = formMappings['business_type_value'];
            if (!businessTypeValue) {
                throw new Error('Business type value not found in form mappings');
            }
            await this.clickDropdown(page, buttonSelectors.business_type_selector, businessTypeValue);
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Continue to business name section
            await page.waitForSelector(buttonSelectors.continue_button);
            await page.click(buttonSelectors.continue_button);
            
            // Get business name with multiple fallback paths
            const legalName = mappingService.getValueFromPath(mappedPayload, [
                'Legal_Name',
                'Name.Legal_Name',
                'Name.CD_LLC_Name'
            ]) || mappingService.getValueFromPath(payload, [
                'Name.Legal_Name',
                'Name.CD_LLC_Name',
                'Legal_Name'
            ]);
            
            if (!legalName) {
                throw new Error('Business name not found in payload. Available keys: ' + JSON.stringify(Object.keys(mappedPayload)));
            }
            
            // Fill business name fields
            await this.fillInputByName(page, businessNameSelectors.business_name, legalName);
            await this.fillInputByName(page, businessNameSelectors.business_name_confirm, legalName);
            
            await this.clickButton(page, buttonSelectors.continue_button);
            
            // Handle alternate legal name
            const alternateLegalName = mappingService.getValueFromPath(mappedPayload, [
                'Alternate_Legal_Name',
                'Name.Alternate_Legal_Name'
            ]) || mappingService.getValueFromPath(payload, [
                'Name.Alternate_Legal_Name',
                'Alternate_Legal_Name'
            ]);
            
            // Get additional field selectors for alternate name handling
            const txtNameField = await dynamicFormMapper.getFormSelector('txt_name_field', 'Wyoming_LLC_Formation', 'LLC', payload);
            const txtDelayedDateField = await dynamicFormMapper.getFormSelector('txt_delayed_date_field', 'Wyoming_LLC_Formation', 'LLC', payload);
            
            if (!txtNameField || !txtDelayedDateField) {
                throw new Error('Required field selectors for alternate name handling not found');
            }
            
            const isNameREplaced = await this.tryAlternate1(
                page, 
                txtNameField,
                txtDelayedDateField,
                alternateLegalName
            );
            
            if (isNameREplaced) {
                await this.fillInputByName(page, businessNameSelectors.business_name_confirm, alternateLegalName);
                await this.clickButton(page, buttonSelectors.continue_button);
            }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.randomSleep(1000, 3000);

            // Continue button handling
            const continueButtonId = buttonSelectors.continue_button.replace('#', '');
            await page.evaluate((buttonId) => {
                const continueButton = document.getElementById(buttonId);
                if (continueButton) {
                    continueButton.scrollIntoView();
                    continueButton.click();
                }
            }, continueButtonId);
            await this.clickButton(page, buttonSelectors.continue_button);

            // Get registered agent information
            const raName = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.keyPersonnelName',
                'Registered_Agent.RA_Name'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.keyPersonnelName',
                'Registered_Agent.RA_Name'
            ]);
            
            const raAddress = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Address.Street_Address',
                'Registered_Agent.Address.RA_Address_Line_1'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Address.Street_Address',
                'Registered_Agent.Address.RA_Address_Line_1'
            ]);
            
            const raCity = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Address.City',
                'Registered_Agent.Address.RA_City'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Address.City',
                'Registered_Agent.Address.RA_City'
            ]);
            
            const raContactNo = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.ContactNo',
                'Registered_Agent.CI_Contact_No'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.ContactNo',
                'Registered_Agent.CI_Contact_No'
            ]);
            
            const raEmail = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.EmailId',
                'Registered_Agent.CI_Email_Address'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.EmailId',
                'Registered_Agent.CI_Email_Address'
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
            
            const postalCodeItem = await dynamicFormMapper.getFormSelector('postal_code_item', 'Wyoming_LLC_Formation', 'LLC', payload);
            if (!postalCodeItem) {
                throw new Error('Postal code item selector not found');
            }
            await this.clickButton(page, postalCodeItem);
            
            // Contact information
            await this.fillInputByName(page, raSelectors.registered_agent_phone, raContactNo);
            await this.fillInputByName(page, raSelectors.registered_agent_email, raEmail);
            
            // Consent checkbox
            const consentCheckbox = await dynamicFormMapper.getFormSelector('consent_checkbox', 'Wyoming_LLC_Formation', 'LLC', payload);
            if (!consentCheckbox) {
                throw new Error('Consent checkbox selector not found');
            }
            await page.click(consentCheckbox);
            await this.clickButton(page, buttonSelectors.continue_button);
            
            // Error message handling
            const errorMessageSelector = await dynamicFormMapper.getFormSelector('error_message_selector', 'Wyoming_LLC_Formation', 'LLC', payload);
            if (!errorMessageSelector) {
                throw new Error('Error message selector not found');
            }
            
            try {
                await page.waitForSelector(errorMessageSelector, { visible: true, timeout: 5000 });
                console.log('Error message detected.');
                await this.clickButton(page, buttonSelectors.continue_button);
            } catch (error) {
                console.log('Error message not found or other issue:', error.message);
                await this.clickButton(page, buttonSelectors.continue_button);
            }
            await this.clickButton(page, buttonSelectors.continue_button);
            await this.clickButton(page, buttonSelectors.continue_button);

            // Get principal address information
            const paStreetAddress = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.Street_Address',
                'Principal_Address.PA_Address_Line_1'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.Street_Address',
                'Principal_Address.PA_Address_Line_1'
            ]);
            
            const paAddressLine2 = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.Address_Line_2',
                'Principal_Address.PA_Address_Line_2'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.Address_Line_2',
                'Principal_Address.PA_Address_Line_2'
            ]) || " ";
            
            const paCity = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.City',
                'Principal_Address.PA_City'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.City',
                'Principal_Address.PA_City'
            ]);
            
            const paState = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.State',
                'Principal_Address.PA_State'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.State',
                'Principal_Address.PA_State'
            ]);
            
            const paZipCode = mappingService.getValueFromPath(mappedPayload, [
                'Principal_Address.Zip_Code',
                'Principal_Address.PA_Zip_Code'
            ]) || mappingService.getValueFromPath(payload, [
                'Principal_Address.Zip_Code',
                'Principal_Address.PA_Zip_Code'
            ]);

            // Get additional principal address field selectors
            const paAddress2Field = await dynamicFormMapper.getFormSelector('principal_address_line_2', 'Wyoming_LLC_Formation', 'LLC', payload);
            const paPhoneField = await dynamicFormMapper.getFormSelector('principal_phone', 'Wyoming_LLC_Formation', 'LLC', payload);
            const paEmailField = await dynamicFormMapper.getFormSelector('principal_email', 'Wyoming_LLC_Formation', 'LLC', payload);
            
            if (!paAddress2Field || !paPhoneField || !paEmailField) {
                throw new Error('Required principal address field selectors not found');
            }

            // Fill principal address fields
            await this.fillInputByName(page, paSelectors.principal_address, paStreetAddress);
            await this.fillInputByName(page, paAddress2Field, paAddressLine2);
            await this.fillInputByName(page, paSelectors.principal_city, paCity);
            await this.fillInputByName(page, paSelectors.principal_state, paState);
            await this.fillInputByName(page, paSelectors.principal_zip, String(paZipCode));
            await this.fillInputByName(page, paPhoneField, raContactNo);
            await this.fillInputByName(page, paEmailField, raEmail);
            
            // Get mailing information
            const mailStreetAddress = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.Street_Address',
                'Registered_Agent.Mailing_Information.MI_Address_Line_1'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.Street_Address',
                'Registered_Agent.Mailing_Information.MI_Address_Line_1'
            ]);
            
            const mailAddressLine2 = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.Address_Line_2',
                'Registered_Agent.Mailing_Information.MI_Address_Line_2'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.Address_Line_2',
                'Registered_Agent.Mailing_Information.MI_Address_Line_2'
            ]) || " ";
            
            const mailCity = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.City',
                'Registered_Agent.Mailing_Information.MI_City'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.City',
                'Registered_Agent.Mailing_Information.MI_City'
            ]);
            
            const mailState = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.State',
                'Registered_Agent.Mailing_Information.MI_State'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.State',
                'Registered_Agent.Mailing_Information.MI_State'
            ]);
            
            const mailZipCode = mappingService.getValueFromPath(mappedPayload, [
                'Registered_Agent.Mailing_Information.Zip_Code',
                'Registered_Agent.Mailing_Information.MI_Zip_Code'
            ]) || mappingService.getValueFromPath(payload, [
                'Registered_Agent.Mailing_Information.Zip_Code',
                'Registered_Agent.Mailing_Information.MI_Zip_Code'
            ]);

            // Get additional mailing address field selector
            const mailAddress2Field = await dynamicFormMapper.getFormSelector('mailing_address_line_2', 'Wyoming_LLC_Formation', 'LLC', payload);
            if (!mailAddress2Field) {
                throw new Error('Mailing address line 2 field selector not found');
            }

            // Fill mailing address fields
            await this.fillInputByName(page, mailSelectors.mailing_address, mailStreetAddress);
            await this.fillInputByName(page, mailAddress2Field, mailAddressLine2);
            await this.fillInputByName(page, mailSelectors.mailing_city, mailCity);
            await this.fillInputByName(page, mailSelectors.mailing_state, mailState);
            await this.fillInputByName(page, mailSelectors.mailing_zip, String(mailZipCode));
 
            await this.clickButton(page, buttonSelectors.continue_button);
            
            // Get organizer information
            const orgName = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.keyPersonnelName',
                'Organizer_Information.Organizer_Details.Org_Name'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.keyPersonnelName',
                'Organizer_Information.Organizer_Details.Org_Name'
            ]);
            
            const orgAddress = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.Address.Street_Address',
                'Organizer_Information.Address.Org_Address_Line_1'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.Address.Street_Address',
                'Organizer_Information.Address.Org_Address_Line_1'
            ]);
            
            const orgCity = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.Address.City',
                'Organizer_Information.Address.Org_City'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.Address.City',
                'Organizer_Information.Address.Org_City'
            ]);
            
            const orgState = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.Address.State',
                'Organizer_Information.Address.Org_State'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.Address.State',
                'Organizer_Information.Address.Org_State'
            ]);
            
            const orgZipCode = mappingService.getValueFromPath(mappedPayload, [
                'Organizer_Information.Address.Zip_Code',
                'Organizer_Information.Address.Org_Zip_Code'
            ]) || mappingService.getValueFromPath(payload, [
                'Organizer_Information.Address.Zip_Code',
                'Organizer_Information.Address.Org_Zip_Code'
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
            await this.clickButton(page, buttonSelectors.save_button);
            await this.clickButton(page, buttonSelectors.save_button);

            await this.randomSleep(3000, 5000);

            await page.waitForSelector(buttonSelectors.continue_button);
            await page.click(buttonSelectors.continue_button);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector(buttonSelectors.continue_button);
            await page.click(buttonSelectors.continue_button);
            await page.waitForSelector(buttonSelectors.continue_button);
            await page.click(buttonSelectors.continue_button);
            
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
}

module.exports = WyomingForLLC; 