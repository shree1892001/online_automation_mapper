const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
const { add } = require('winston');
const { json } = require('express/lib/response');

class ArkansasForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    // Helper function to get selector from mapping table
    getSelectorFromMapping(stateMapping, index) {
        const mapping = stateMapping.find(m => m.id === index);
        return mapping ? mapping.online_field_mapping : null;
    }

    // Helper function to get JSON key from mapping table
    getJsonKeyFromMapping(stateMapping, index) {
        const mapping = stateMapping.find(m => m.id === index);
        return mapping ? mapping.json_key : null;
    }

    // Helper function to get value from payload using JSON key path
    getValueFromPayload(payload, jsonKeyPath) {
        if (!jsonKeyPath) return null;
        
        const keys = jsonKeyPath.split('.');
        let value = payload;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return null;
            }
        }
        
        return value;
    }

    // Helper function to convert plain text selector to CSS selector
    convertToCssSelector(selector) {
        if (!selector) return null;
        
        // If it's already a CSS selector, return as is
        if (selector.startsWith('#') || selector.startsWith('.') || selector.startsWith('input[') || selector.startsWith('tr[')) {
            return selector;
        }
        
        // Convert plain text to input selector
        return `input[name="${selector}"]`;
    }

    async ArkansasForLLC(page, jsonData, payload) {
        try {
            logger.info('Navigating to Arkansas form submission page...');
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            for(let i=0; i<stateMapping.length; i++){
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                    console.log(stateMapping[i].online_field_mapping, stateMapping[i].json_key, i);
                }
            }

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            await this.randomSleep(20000,30000); 
            
            await page.evaluate(() => {
                const link = document.querySelector('a[href="javascript:showOptions(13)"]');
                if (link) {
                    link.click();
                } else {
                    console.error("Link not found!");
                }
            });

            // start form - using mapping index 35
            const startFormSelector = this.getSelectorFromMapping(stateMapping, 35);
            if (startFormSelector) {
                await page.click(startFormSelector);
            }

            // Entity Name - using mapping index 0
            const entityNameSelector = this.getSelectorFromMapping(stateMapping, 0);
            const entityNameValue = this.getValueFromPayload(payload, this.getJsonKeyFromMapping(stateMapping, 0));
            if (entityNameSelector && entityNameValue) {
                const entityname = [{label: entityNameSelector, value: entityNameValue}];
                await this.addInput(page, entityname);
            }

            await new Promise(resolve => setTimeout(resolve, 4000))

            // Principal Information - using mapping indices 1-5
            const princinfo = [];
            for (let i = 1; i <= 5; i++) {
                const selector = this.getSelectorFromMapping(stateMapping, i);
                const jsonKey = this.getJsonKeyFromMapping(stateMapping, i);
                const value = this.getValueFromPayload(payload, jsonKey);
                if (selector && value !== null) {
                    princinfo.push({label: selector, value: String(value)});
                }
            }
            await this.addInput(page, princinfo);

            // Registered Agent Information - using mapping indices 6-10
            const inputFields = [];
            for (let i = 6; i <= 10; i++) {
                const selector = this.getSelectorFromMapping(stateMapping, i);
                const jsonKey = this.getJsonKeyFromMapping(stateMapping, i);
                const value = this.getValueFromPayload(payload, jsonKey);
                if (selector && value !== null) {
                    inputFields.push({
                        label: selector,
                        value: String(value),
                        sectionText: 'Registered Agent'
                    });
                }
            }
            await this.addInputbyselector(page, inputFields);

            // Organizer Information - using mapping indices 11, 19, 12-15
            const orgFullName = this.getValueFromPayload(payload, this.getJsonKeyFromMapping(stateMapping, 19));
            const [orgFirstName, orgLastName] = orgFullName ? orgFullName.split(' ') : ['', ''];
            
            // Get officer_first_name selector from mapping index 62
            const officerFirstNameSelector = this.getSelectorFromMapping(stateMapping, 62);
            const officerLastNameSelector = this.getSelectorFromMapping(stateMapping, 11);
            
            const organizerDetails = [];
            if (officerFirstNameSelector && orgFirstName) {
                organizerDetails.push({ label: officerFirstNameSelector, value: orgFirstName });
            }
            if (officerLastNameSelector && orgLastName) {
                organizerDetails.push({ label: officerLastNameSelector, value: orgLastName });
            }
            await this.addInput(page, organizerDetails);

            // Click dropdown for Incorporator/Organizer - using mapping index 36
            const officerTitleSelector = this.getSelectorFromMapping(stateMapping, 36);
            if (officerTitleSelector) {
                await this.clickDropdown(page, officerTitleSelector, 'Incorporator/Organizer');
            }

            const Manageradd = [];
            for (let i = 12; i <= 15; i++) {
                const selector = this.getSelectorFromMapping(stateMapping, i);
                const jsonKey = this.getJsonKeyFromMapping(stateMapping, i);
                const value = this.getValueFromPayload(payload, jsonKey);
                if (selector && value !== null) {
                    Manageradd.push({label: selector, value: String(value)});
                }
            }
            await this.addInput(page, Manageradd);

            // Click save add officer - using mapping index 37
            const saveOfficerSelector = this.getSelectorFromMapping(stateMapping, 37);
            if (saveOfficerSelector) {
                await page.click(saveOfficerSelector);
            }

            // Member or manager - using mapping indices 16, 64-67
            const memFullName = this.getValueFromPayload(payload, this.getJsonKeyFromMapping(stateMapping, 64));
            const [memFirstName, memLastName] = memFullName ? memFullName.split(' ') : ['', ''];
            
            const memberDetails = [];
            if (officerFirstNameSelector && memFirstName) {
                memberDetails.push({ label: officerFirstNameSelector, value: memFirstName });
            }
            const memberLastNameSelector = this.getSelectorFromMapping(stateMapping, 16);
            if (memberLastNameSelector && memLastName) {
                memberDetails.push({ label: memberLastNameSelector, value: memLastName });
            }
            await this.addInput(page, memberDetails);

            // Click dropdown for Member - using mapping index 36
            if (officerTitleSelector) {
                await this.clickDropdown(page, officerTitleSelector, 'Member');
            }

            const Memberadd = [];
            for (let i = 65; i <= 67; i++) {
                const selector = this.getSelectorFromMapping(stateMapping, i);
                const jsonKey = this.getJsonKeyFromMapping(stateMapping, i);
                const value = this.getValueFromPayload(payload, jsonKey);
                if (selector && value !== null) {
                    Memberadd.push({label: selector, value: String(value)});
                }
            }
            // Add address_1 from index 18
            const address1Selector = this.getSelectorFromMapping(stateMapping, 18);
            const address1Value = this.getValueFromPayload(payload, this.getJsonKeyFromMapping(stateMapping, 18));
            if (address1Selector && address1Value) {
                Memberadd.unshift({label: address1Selector, value: String(address1Value)});
            }
            await this.addInput(page, Memberadd);

            // Click save add officer again - using mapping index 37
            if (saveOfficerSelector) {
                await page.click(saveOfficerSelector);
            }

            // Submitter Contact Info - using mapping indices 17, 20-25
            const submittor = [];
            const contactOrgSelector = this.getSelectorFromMapping(stateMapping, 17);
            const contactOrgValue = this.getValueFromPayload(payload, this.getJsonKeyFromMapping(stateMapping, 17));
            if (contactOrgSelector && contactOrgValue) {
                submittor.push({label: contactOrgSelector, value: contactOrgValue});
            }
            await this.addInput(page, submittor);

            const submittoradd = [];
            for (let i = 20; i <= 25; i++) {
                const selector = this.getSelectorFromMapping(stateMapping, i);
                const jsonKey = this.getJsonKeyFromMapping(stateMapping, i);
                const value = this.getValueFromPayload(payload, jsonKey);
                if (selector && value !== null) {
                    submittoradd.push({label: selector, value: String(value)});
                }
            }
            await this.addInput(page, submittoradd);

            // Annual Report Contact Information - using mapping indices 26-33
            const Annual = [];
            const taxContactOrgSelector = this.getSelectorFromMapping(stateMapping, 26);
            const taxContactOrgValue = this.getValueFromPayload(payload, this.getJsonKeyFromMapping(stateMapping, 26));
            if (taxContactOrgSelector && taxContactOrgValue) {
                Annual.push({label: taxContactOrgSelector, value: taxContactOrgValue});
            }
            await this.addInput(page, Annual);

            const Annualadd = [];
            for (let i = 27; i <= 33; i++) {
                const selector = this.getSelectorFromMapping(stateMapping, i);
                const jsonKey = this.getJsonKeyFromMapping(stateMapping, i);
                const value = this.getValueFromPayload(payload, jsonKey);
                if (selector && value !== null) {
                    Annualadd.push({label: selector, value: String(value)});
                }
            }
            await this.addInput(page, Annualadd);

            // Click agreement - using mapping index 38
            const agreementSelector = this.getSelectorFromMapping(stateMapping, 38);
            if (agreementSelector) {
                await page.click(agreementSelector);
            }

            // Filing signature - using mapping index 34
            const filingSignatureSelector = this.getSelectorFromMapping(stateMapping, 34);
            const filingSignatureValue = this.getValueFromPayload(payload, this.getJsonKeyFromMapping(stateMapping, 34));
            if (filingSignatureSelector && filingSignatureValue) {
                const sign = [{label: filingSignatureSelector, value: filingSignatureValue}];
                await this.addInput(page, sign);
            }

            // Click save form - using mapping index 39
            const saveFormSelector = this.getSelectorFromMapping(stateMapping, 39);
            if (saveFormSelector) {
                await page.click(saveFormSelector);
            }

            await new Promise(resolve => setTimeout(resolve, 4000))

            // Click Next - using mapping index 40
            const nextSelector = this.getSelectorFromMapping(stateMapping, 40);
            if (nextSelector) {
                await page.click(nextSelector);
            }

            const res = "form filled successfully";
            return res

        } catch (error) {
            // Log full error stack for debugging
            logger.error('Error in Arkansas LLC form handler:', error.stack);
            throw new Error(`Arkansas LLC form submission failed: ${error.message}`);
        }
    }

    async addInputbyselector(page, inputFields) {
        try {
            for (let field of inputFields) {
                const { value, label, sectionText } = field;

                // Log the current field being processed
                console.log(`Processing field: ${label}`);

                // Find the section that contains the specified text
                const inputSelector = await page.evaluate((label, sectionText) => {
                    // Find the fieldset for Registered Agent
                    const fieldsets = Array.from(document.querySelectorAll('fieldset.group'));
                    const registeredAgentFieldset = fieldsets.find(fieldset => {
                        const legend = fieldset.querySelector('legend');
                        return legend && legend.textContent.trim() === sectionText; // Ensure we're checking the right section
                    });

                    if (registeredAgentFieldset) {
                        // Find the label element
                        const labelElement = Array.from(registeredAgentFieldset.querySelectorAll('label'))
                            .find(el => el.textContent.trim() === label);
                        
                        if (labelElement) {
                            // Log the found label
                            console.log(`Found label: ${label}`);
                            // Find the associated input
                            const inputElement = labelElement.closest('p').querySelector('input, select');
                            return inputElement ? `#${inputElement.id}` : null;
                        } else {
                            console.log(`Label not found: ${label}`);
                        }
                    }
                    return null;
                }, label, sectionText);

                if (inputSelector) {
                    await page.waitForSelector(inputSelector, { visible: true });
                    console.log(`Attempting to fill input for label "${label}" with value "${value}"`);
                    await page.type(inputSelector, value, { delay: 100 });
                    console.log(`Filled input for label "${label}" with value "${value}" in section containing "${sectionText}"`);
                } else {
                    console.error(`Input not found for label "${label}" in section containing "${sectionText}"`);
                }
            }
        } catch (error) {
            console.error("Error filling input fields:", error.message);
            throw error;
        }
    }
}

module.exports = ArkansasForLLC;

