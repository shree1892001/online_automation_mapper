const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const path = require('path');  // Ensure path is imported here


class IowaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async IowaForLLC(page,jsonData,payload) {
        try {
            console.log(payload)
            logger.info('Navigating to New York form submission page...');
const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            const inputFields = [
                { label: 'UserName', value: data.State.filingWebsiteUsername },
                { label: 'Password', value: data.State.filingWebsitePassword }
            ];

            await this.addInput(page, inputFields);
            await this.clickButton(page, '#btnLogin');
            await new Promise(resolve => setTimeout(resolve, 4000))
            await this.clickOnLinkByText(page, 'Form an Iowa limited liability company');
            await this.selectDropdownOptionnyplaceholder(page,'select[display-name="Chapter"]','CODE 489 DOMESTIC LIMITED LIABILITY COMPANY')
            await this.fillInputByPlaceholder(page, 'Corporation Name', payload.Name.Legal_Name);
            await this.clickButton(page, 'button[data-cmd="CheckName"]');
        
            await page.click('.btn.btn-primary'); 
            const error = ".glyphicon.glyphicon-warning-sign";
            const errorElement = await page.$(error);
            await this.randomSleep(1000,3000);
 
             if(errorElement){
                console.log("got error ")
 
                await this.clearFieldWithstarting(page, '[placeholder="Corporation Name"]');
 


                 await this.fillInputByPlaceholder(page, 'Corporation Name', payload.Name.Alternate_Legal_Name);
 
 
             }

            const fileInputSelector = '[id$="_Upload"]';
            await page.waitForSelector(fileInputSelector, { timeout: 0 });

            const filePath = path.resolve(__dirname, '"C:/Users/Redberyl/Downloads/CertificateOfOrganization.pdf"');

            const inputUploadHandle = await page.$(fileInputSelector);
            await inputUploadHandle.uploadFile(filePath);
           // Principal Office
            const principalOfficeFields = [
                { label: 'Address Line  1', value: payload.Principal_Address.Street_Address, sectionText: 'Principal office' },
                { label: 'Address Line  2', value: payload.Principal_Address['Address_Line_2'] ||"", sectionText: 'Principal office' },
                { label: 'City', value: payload.Principal_Address.City, sectionText: 'Principal office' },
                // { label: 'State', value: payload.Principal_Address.State, sectionText: 'Principal office' },
                
                { label: 'Zip', value: String(payload.Principal_Address.Zip_Code), sectionText: 'Principal office' },
            ];
            await this.addInputbyselector(page, principalOfficeFields);
            
              
                    (() => {
                    if (payload.Principal_Address.State === 'IA') {
                        return 'IOWA';
                    } else if (payload.Principal_Address.State === 'ID') {
                        return 'IDAHO';
                    } else {
                        return payload.Principal_Address.State; // Default to the provided state value
                    }
                })(), 
                await this.clickDropdown(page,'[id$="_State"]',payload.Principal_Address.State);
            

            //Mailing Principal Office
            const principalOfficemailingFields = [
                { label: 'Address Line  1', value: payload.Principal_Address.Street_Address, sectionText: 'The mailing address of the entity’s principal office' },
                { label: 'Address Line  2', value: payload.Principal_Address['Address_Line_2'] || "", sectionText: 'The mailing address of the entity’s principal office' },
                { label: 'City', value: payload.Principal_Address.City, sectionText: 'The mailing address of the entity’s principal office' },
                { 
                    label: 'State', 
                    value: (() => {
                        if (payload.Principal_Address.State === 'IA') {
                            return 'IOWA';
                        } else if (payload.Principal_Address.State === 'ID') {
                            return 'IDAHO';
                        } else {
                            return payload.Principal_Address.State; // Default to the provided state value
                        }
                    })(), 
                    sectionText: 'The mailing address of the entity’s principal office' 
                },
                { label: 'Zip', value: String(payload.Principal_Address.Zip_Code), sectionText: 'The mailing address of the entity’s principal office' },
            ];
            await this.addInputbyselector(page, principalOfficemailingFields);
            const registeredAgentFields = [
               
                { label: 'Address Line  1', value: payload.Registered_Agent.Address.Street_Address, sectionText: 'Registered Agent and Address of the Registered Agent' },
                { label: 'Address Line  2', value: payload.Registered_Agent.Address['Address_Line_2'] ||"", sectionText: 'Registered Agent and Address of the Registered Agent' },
                { label: 'City', value: payload.Registered_Agent.Address.City, sectionText: 'Registered Agent and Address of the Registered Agent' },
                { label: 'Zip', value: String(payload.Registered_Agent.Address.Zip_Code), sectionText: 'Registered Agent and Address of the Registered Agent' },
            ];
            await this.addInputbyselector(page, registeredAgentFields);

            await this.clickDropdown(page,'[id$="_AgentName"]',payload.Registered_Agent.keyPersonnelName); 
            

            // Mailing RegisteredAgent
            const registeredAgentField = [
                { label: 'Address Line  1', value: payload.Registered_Agent.Mailing_Information.Street_Address, sectionText: 'The mailing address of its registered agent' },
                { label: 'Address Line  2', value: payload.Registered_Agent.Mailing_Information['Address_Line_2'] ||"", sectionText: 'The mailing address of its registered agent' },
                { label: 'City', value: payload.Registered_Agent.Mailing_Information.City, sectionText: 'The mailing address of its registered agent' },
                
                // { label: 'State', value: payload.Registered_Agent.Address.RA_State, sectionText: 'The mailing address of its registered agent' },
                { 
                    label: 'State', 
                    value: (() => {
                        if (payload.Registered_Agent.Mailing_Information.State === 'IA') {
                            return 'IOWA';
                        } else if (payload.Registered_Agent.Mailing_Information.State === 'ID') {
                            return 'IDAHO';
                        } else {
                            return payload.Registered_Agent.Mailing_Information.State; // Default to the provided state value
                        }
                    })(), 
                    sectionText: 'The mailing address of its registered agent' 
                },
                { label: 'Zip', value: String(payload.Registered_Agent.Mailing_Information.Zip_Code), sectionText: 'The mailing address of its registered agent' },
            ];
            await this.addInputbyselector(page, registeredAgentField);
            await page.waitForSelector('input[aria-label^="I certify under penalty of perjury"]', { visible: true, timeout:0 });
            // Click the checkbox
            await page.click('input[aria-label^="I certify under penalty of perjury"]');
            await page.waitForSelector('input[placeholder="Full Legal Name"]', { visible: true, timeout:0 });
            await page.type('input[placeholder="Full Legal Name"]',payload.Organizer_Information.keyPersonnelName, { delay: 100 });
            const res = "form filled successfully";
            return res

        } catch (error) {
            logger.error('Error in Iowa For LLC form handler:', error.stack);
            throw new Error(`Iowa For LLC form submission failed: ${error.message}`);
        }
    }
    async addInputbyselector(page, inputFields) {
        try {
            for (let field of inputFields) {
                const { value, label, sectionText } = field;
    
                // Find the section that contains the specified text
                const inputSelector = await page.evaluate((label, sectionText) => {
                    // Find the section based on the panel-header text
                    const panels = Array.from(document.querySelectorAll('div.panel'));
                    let container = null;
    
                    for (let panel of panels) {
                        const header = panel.querySelector('.panel-header-text');
                        if (header && header.textContent.trim().includes(sectionText)) {
                            container = panel;
                            break;
                        }
                    }
    
                    // If the container is found, look for the label and associated input
                    if (container) {
                        const labelElement = Array.from(container.querySelectorAll('label')).find(el => el.textContent.trim() === label);
                        if (labelElement) {
                            const inputElement = labelElement.closest('.form-group').querySelector('input, select');
                            return inputElement ? `#${inputElement.id}` : null;
                        }
                    }
                    return null;
                }, label, sectionText);
    
                if (inputSelector) {
                    await page.waitForSelector(inputSelector, { visible: true, timeout:0 });
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


module.exports = IowaForLLC;


