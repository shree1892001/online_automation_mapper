const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class DcForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    // Helper function to get selector by field name
    async getSelectorByFieldName(stateMapping, fieldName) {
        try {
            logger.info(`Looking for selector for field: ${fieldName}`);
            const mapping = stateMapping.find(item => 
                item.online_field_mapping === fieldName || 
                item.online_field_mapping === `select[name="${fieldName}"]` ||
                item.online_field_mapping === `input[name="${fieldName}"]` ||
                item.online_field_mapping === `textarea[name="${fieldName}"]`
            );
            
            if (mapping && mapping.online_field_mapping) {
                logger.info(`Found selector for ${fieldName}: ${mapping.online_field_mapping}`);
                return mapping.online_field_mapping;
            }
            
            logger.warn(`No selector found for field: ${fieldName}`);
            return null;
        } catch (error) {
            logger.error(`Error getting selector for ${fieldName}:`, error);
            return null;
        }
    }

    // Helper function to get JSON key by field name
    async getJsonKeyByFieldName(stateMapping, fieldName) {
        try {
            logger.info(`Looking for JSON key for field: ${fieldName}`);
            const mapping = stateMapping.find(item => 
                item.online_field_mapping === fieldName || 
                item.online_field_mapping === `select[name="${fieldName}"]` ||
                item.online_field_mapping === `input[name="${fieldName}"]` ||
                item.online_field_mapping === `textarea[name="${fieldName}"]`
            );
            
            if (mapping && mapping.json_key) {
                logger.info(`Found JSON key for ${fieldName}: ${mapping.json_key}`);
                return mapping.json_key;
            }
            
            logger.warn(`No JSON key found for field: ${fieldName}`);
            return null;
        } catch (error) {
            logger.error(`Error getting JSON key for ${fieldName}:`, error);
            return null;
        }
    }

    // Helper function to get value from payload using JSON key path
    getValueFromPayload(payload, jsonKeyPath) {
        try {
            if (!jsonKeyPath) return null;
            
            const keys = jsonKeyPath.split('.');
            let value = payload;
            
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
                    logger.warn(`Key ${key} not found in payload path: ${jsonKeyPath}`);
                    return null;
                }
            }
            
            logger.info(`Retrieved value for ${jsonKeyPath}: ${value}`);
            return value;
        } catch (error) {
            logger.error(`Error getting value from payload for ${jsonKeyPath}:`, error);
            return null;
        }
    }

    async DcForLLC(page,jsonData,payload) {
        try {
            logger.info('Starting DC LLC form submission...');
            const data = Object.values(jsonData)[0];
            const stateMapping = await fetchByState(data.State.id);
            
            logger.info(`Retrieved ${stateMapping.length} mappings from database`);
            
            // Debug: Log all mappings
            for(let i=0; i<stateMapping.length; i++){
                if(data.orderType === stateMapping[i].order_type || data.orderFullDesc === stateMapping[i].entity_type){
                    logger.info(`Mapping ${i}: ${stateMapping[i].online_field_mapping} -> ${stateMapping[i].json_key}`);
                }
            }

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            
            // Get login link selector
            const loginLinkSelector = await this.getSelectorByFieldName(stateMapping, 'a[href="/Account.aspx/AccessDcLogOn?isAccessDc=true"]');
            if (loginLinkSelector) {
                await page.click(loginLinkSelector);
            } else {
                logger.warn('Login link selector not found, using fallback');
                await page.click('a[href="/Account.aspx/AccessDcLogOn?isAccessDc=true"]');
            }
            
            const inputFields = [
                { label: 'input28', value: data.State.filingWebsiteUsername },
                { label: 'input36', value: data.State.filingWebsitePassword }
            ];
            await this.addInput(page,inputFields);
            
            // Get remember me selector
            const rememberMeSelector = await this.getSelectorByFieldName(stateMapping, 'input[name="rememberMe"]');
            if (rememberMeSelector) {
                await page.click(rememberMeSelector);
            } else {
                await page.click('input[name="rememberMe"]');
            }
            
            // Get sign in button selector
            const signInSelector = await this.getSelectorByFieldName(stateMapping, 'input.button.button-primary[type="submit"][value="Sign in"]');
            if (signInSelector) {
                await page.click(signInSelector);
            } else {
                await page.click('input.button.button-primary[type="submit"][value="Sign in"]');
            }
            
            // Get wizard1 link selector
            const wizard1Selector = await this.getSelectorByFieldName(stateMapping, 'a[href="/Home.aspx/wizard1"]');
            await page.waitForSelector(wizard1Selector || 'a[href="/Home.aspx/wizard1"]');
            await page.click(wizard1Selector || 'a[href="/Home.aspx/wizard1"]');
            
            // Get wizard3 link selector
            const wizard3Selector = await this.getSelectorByFieldName(stateMapping, 'a.my-button[href="/Home.aspx/wizard3"]');
            await page.waitForSelector(wizard3Selector || 'a.my-button[href="/Home.aspx/wizard3"]');
            await page.click(wizard3Selector || 'a.my-button[href="/Home.aspx/wizard3"]');
            
            // Get service redirect selector (LLC uses 119)
            const serviceRedirectSelector = await this.getSelectorByFieldName(stateMapping, 'a[href="/Biz.aspx/RedirectFromNewService/119"]');
            await page.waitForSelector(serviceRedirectSelector || 'a[href="/Biz.aspx/RedirectFromNewService/119"]');
            await page.click(serviceRedirectSelector || 'a[href="/Biz.aspx/RedirectFromNewService/119"]');
            
            // Get next button selector
            const nextButtonSelector = await this.getSelectorByFieldName(stateMapping, '#NextButton');
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton');
            
            // Fill business name
            const businessNameSelector = await this.getSelectorByFieldName(stateMapping, 'BizData.BusinessName');
            const businessNameJsonKey = await this.getJsonKeyByFieldName(stateMapping, 'BizData.BusinessName');
            const businessNameValue = this.getValueFromPayload(payload, businessNameJsonKey) || payload.Name.Legal_Name;
            if (businessNameSelector) {
                await this.fillInputByName(page, businessNameSelector, businessNameValue);
            } else {
                await this.fillInputByName(page, 'BizData.BusinessName', businessNameValue);
            }
            
            // Click business suffix dropdown
            const businessSuffixSelector = await this.getSelectorByFieldName(stateMapping, 'select[name="BizData.BusinessSuffix"]');
            if (businessSuffixSelector) {
                await this.clickDropdown(page, businessSuffixSelector, 'Limited Liability Company');
            } else {
                await this.clickDropdown(page, 'select[name="BizData.BusinessSuffix"]', 'Limited Liability Company');
            }
            
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton');
            
            // Fill business address
            const addressLine1Selector = await this.getSelectorByFieldName(stateMapping, 'CurrentBusinessAddress.Line1');
            const addressLine1JsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentBusinessAddress.Line1');
            const addressLine1Value = this.getValueFromPayload(payload, addressLine1JsonKey) || payload.Principal_Address.Street_Address;
            if (addressLine1Selector) {
                await this.fillInputByName(page, addressLine1Selector, addressLine1Value);
            } else {
                await this.fillInputByName(page, 'CurrentBusinessAddress.Line1', addressLine1Value);
            }
            
            const addressLine2Selector = await this.getSelectorByFieldName(stateMapping, 'CurrentBusinessAddress.Line2');
            const addressLine2JsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentBusinessAddress.Line2');
            const addressLine2Value = this.getValueFromPayload(payload, addressLine2JsonKey) || payload.Principal_Address['Address_Line_2'] || " ";
            if (addressLine2Selector) {
                await this.fillInputByName(page, addressLine2Selector, addressLine2Value);
            } else {
                await this.fillInputByName(page, 'CurrentBusinessAddress.Line2', addressLine2Value);
            }
            
            const citySelector = await this.getSelectorByFieldName(stateMapping, 'CurrentBusinessAddress.City');
            const cityJsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentBusinessAddress.City');
            const cityValue = this.getValueFromPayload(payload, cityJsonKey) || payload.Principal_Address.City;
            if (citySelector) {
                await this.fillInputByName(page, citySelector, cityValue);
            } else {
                await this.fillInputByName(page, 'CurrentBusinessAddress.City', cityValue);
            }
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Click state dropdown
            const stateSelector = await this.getSelectorByFieldName(stateMapping, 'select[name="CurrentBusinessAddress.State"]');
            if (stateSelector) {
                await this.clickDropdown(page, stateSelector, 'District of Columbia');
            } else {
                await this.clickDropdown(page, 'select[name="CurrentBusinessAddress.State"]', 'District of Columbia');
            }
            
            const zipSelector = await this.getSelectorByFieldName(stateMapping, 'CurrentBusinessAddress.Zip');
            const zipJsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentBusinessAddress.Zip');
            const zipValue = this.getValueFromPayload(payload, zipJsonKey) || String(payload.Principal_Address.Zip_Code);
            if (zipSelector) {
                await this.fillInputByName(page, zipSelector, zipValue);
            } else {
                await this.fillInputByName(page, 'CurrentBusinessAddress.Zip', zipValue);
            }
            
            await page.click(nextButtonSelector || '#NextButton');
            
            // Click registered agent dropdown
            const registeredAgentSelector = await this.getSelectorByFieldName(stateMapping, 'select[name="BizData.RegisteredAgent.RegisteredAgentId"]');
            if (registeredAgentSelector) {
                await this.clickDropdown(page, registeredAgentSelector, 'Business Filings');
            } else {
                await this.clickDropdown(page, 'select[name="BizData.RegisteredAgent.RegisteredAgentId"]', 'Business Filings');
            }
            
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton');
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton');
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton');
            
            // Fill contact information
            const rafullname = payload.Organizer_Information.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(rafullname);
            
            const firstNameSelector = await this.getSelectorByFieldName(stateMapping, 'CurrentContact[0].FirstName');
            const firstNameJsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentContact[0].FirstName');
            const firstNameValue = this.getValueFromPayload(payload, firstNameJsonKey) || firstName;
            if (firstNameSelector) {
                await this.fillInputByName(page, firstNameSelector, firstNameValue);
            } else {
                await this.fillInputByName(page, 'CurrentContact[0].FirstName', firstNameValue);
            }
            
            const lastNameSelector = await this.getSelectorByFieldName(stateMapping, 'CurrentContact[0].LastName');
            const lastNameJsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentContact[0].LastName');
            const lastNameValue = this.getValueFromPayload(payload, lastNameJsonKey) || lastName;
            if (lastNameSelector) {
                await this.fillInputByName(page, lastNameSelector, lastNameValue);
            } else {
                await this.fillInputByName(page, 'CurrentContact[0].LastName', lastNameValue);
            }
            
            logger.info('Form submission complete for DC LLC');
            
            // Fill contact address
            const contactAddressLine1Selector = await this.getSelectorByFieldName(stateMapping, 'CurrentContact[0].Address.Line1');
            const contactAddressLine1JsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentContact[0].Address.Line1');
            const contactAddressLine1Value = this.getValueFromPayload(payload, contactAddressLine1JsonKey) || payload.Organizer_Information.Address.Street_Address;
            if (contactAddressLine1Selector) {
                await this.fillInputByName(page, contactAddressLine1Selector, contactAddressLine1Value);
            } else {
                await this.fillInputByName(page, 'CurrentContact[0].Address.Line1', contactAddressLine1Value);
            }
            
            const contactAddressLine2Selector = await this.getSelectorByFieldName(stateMapping, 'CurrentContact[0].Address.Line2');
            const contactAddressLine2JsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentContact[0].Address.Line2');
            const contactAddressLine2Value = this.getValueFromPayload(payload, contactAddressLine2JsonKey) || payload.Organizer_Information.Address.Address_Line_2 || " ";
            if (contactAddressLine2Selector) {
                await this.fillInputByName(page, contactAddressLine2Selector, contactAddressLine2Value);
            } else {
                await this.fillInputByName(page, 'CurrentContact[0].Address.Line2', contactAddressLine2Value);
            }
            
            const contactCitySelector = await this.getSelectorByFieldName(stateMapping, 'CurrentContact[0].Address.City');
            const contactCityJsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentContact[0].Address.City');
            const contactCityValue = this.getValueFromPayload(payload, contactCityJsonKey) || payload.Organizer_Information.Address.City;
            if (contactCitySelector) {
                await this.fillInputByName(page, contactCitySelector, contactCityValue);
            } else {
                await this.fillInputByName(page, 'CurrentContact[0].Address.City', contactCityValue);
            }
            
            // Click contact state dropdown
            const contactStateSelector = await this.getSelectorByFieldName(stateMapping, 'select[name="CurrentContact[0].Address.State"]');
            if (contactStateSelector) {
                await this.clickDropdown(page, contactStateSelector, 'District of Columbia');
            } else {
                await this.clickDropdown(page, 'select[name="CurrentContact[0].Address.State"]', 'District of Columbia');
            }
            
            const contactZipSelector = await this.getSelectorByFieldName(stateMapping, 'CurrentContact[0].Address.Zip');
            const contactZipJsonKey = await this.getJsonKeyByFieldName(stateMapping, 'CurrentContact[0].Address.Zip');
            const contactZipValue = this.getValueFromPayload(payload, contactZipJsonKey) || String(payload.Organizer_Information.Address.Zip_Code);
            if (contactZipSelector) {
                await this.fillInputByName(page, contactZipSelector, contactZipValue);
            } else {
                await this.fillInputByName(page, 'CurrentContact[0].Address.Zip', contactZipValue);
            }
            
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton');
            
            // Fill stipulation description
            const stipulationSelector = await this.getSelectorByFieldName(stateMapping, 'textarea[name="CurrentStipulation[0].Description"]');
            await page.waitForSelector(stipulationSelector || 'textarea[name="CurrentStipulation[0].Description"]');
            await page.type(stipulationSelector || 'textarea[name="CurrentStipulation[0].Description"]', 
                'Miscellaneous Provisions include various clauses and stipulations that cover areas not addressed elsewhere in the document.');
            
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton'); 
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton'); 
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton'); 
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton'); 
            await page.waitForSelector(nextButtonSelector || '#NextButton');
            await page.click(nextButtonSelector || '#NextButton'); 
            
            const res = "form filled successfully";
            return res;

        } catch (error) {
            logger.error('Error in Dc For LLC form handler:', error.stack);
            throw new Error(`Dc For LLC form submission failed: ${error.message}`);
        }
    }
}
module.exports = DcForLLC;