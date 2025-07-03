const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
// const fs = require('fs');
// const puppeteer = require('puppeteer');

class IowaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async IowaForCORP(page,jsonData,payload) {
        try {
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
            await this.clickOnLinkByText(page, 'Form an Iowa corporation');
            await this.selectDropdownOptionnyplaceholder(page,'select[display-name="Chapter"]','CODE 490 DOMESTIC PROFIT')
            await this.fillInputByPlaceholder(page, 'Corporation Name', payload.Name.Legal_Name);
            await this.clickButton(page, 'button[data-cmd="CheckName"]');

            const errorSelector = ".has-warning.alert-danger";  // Error message container
            await this.randomSleep(1000,3000);
            const errorElement = await page.$(errorSelector);
            if(errorElement){
                console.log("got error")
                await this.clearFieldWithstarting(page, '[placeholder="Corporation Name"]');
                await this.fillInputByPlaceholder(page, 'Corporation Name', payload.Name.Alternate_Legal_Name);
                await this.clickButton(page, 'button[data-cmd="CheckName"]');
             }
 

            await page.waitForSelector('select.form-control[data-property="Type"]', { visible: true , timeout:0});


            // Click the select element to open the dropdown
            await page.click('select.form-control[data-property="Type"]');

            await page.click('select.form-control[data-property="Type"]');

            await page.select('select.form-control[data-property="Type"]', 'Common');

            await page.type('input[placeholder="# of Shares"]', payload.Stock_Details.Number_Of_Shares);
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const registeredAgentFields = [
                { label: 'Full Name', value: fullName, sectionText: 'Registered agent and street address of the registered office in Iowa' },
                { label: 'Address Line  1', value: payload.Registered_Agent.Address.Street_Address, sectionText: 'Registered agent and street address of the registered office in Iowa' },
                { label: 'Address Line  2', value: payload.Registered_Agent.Address['Address_Line_2'] ||"", sectionText: 'Registered agent and street address of the registered office in Iowa' },
                { label: 'City', value: payload.Registered_Agent.Address.City, sectionText: 'Registered agent and street address of the registered office in Iowa' },
                // { label: 'State', value: payload.Registered_Agent.Address.State, sectionText: 'Registered agent and street address of the registered office in Iowa' },
                { label: 'Zip', value: String(payload.Registered_Agent.Address.Zip_Code), sectionText: 'Registered agent and street address of the registered office in Iowa' },
            ];
            await this.addInputbyselector(page, registeredAgentFields);

            const registeredAgentField = [
                { label: 'Address Line  1', value: payload.Registered_Agent.Mailing_Information.Street_Address, sectionText: 'The mailing address of its registered agent in Iowa' },
                { label: 'Address Line  2', value: payload.Registered_Agent.Mailing_Information.Street_Address ||"", sectionText: 'The mailing address of its registered agent in Iowa' },
                { label: 'City', value: payload.Registered_Agent.Mailing_Information.City, sectionText: 'The mailing address of its registered agent in Iowa' },
                // { label: 'State', value: payload.Registered_Agent.Address.State, sectionText: 'The mailing address of its registered agent in Iowa' },
                
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
                    sectionText: 'The mailing address of its registered agent in Iowa' 
                },
                { label: 'Zip', value: String(payload.Registered_Agent.Mailing_Information.Zip_Code), sectionText: 'The mailing address of its registered agent in Iowa' },
            ];
            await this.addInputbyselector(page, registeredAgentField);

            const incorporatorFields = [
                { label: 'Full Name', value: payload.Incorporator_Information.Incorporator_Details.keyPersonnelName, sectionText: 'Incorporator' },
                { label: 'Address Line  1', value: payload.Incorporator_Information.Address.Street_Address, sectionText: 'Incorporator' },
                { label: 'Address Line  2', value: payload.Incorporator_Information.Address['Address_Line_2'] ||"", sectionText: 'Incorporator' },
                { label: 'City', value: payload.Incorporator_Information.Address.City, sectionText: 'Incorporator' },
                // { label: 'State', value:payload.Incorporator_Information.Address.State, sectionText: 'Incorporator' },
                
                { 
                    label: 'State', 
                    value: (() => {
                        if (payload.Incorporator_Information.Address.State === 'IA') {
                            return 'IOWA';
                        } else if (payload.Incorporator_Information.Address.State === 'ID') {
                            return 'IDAHO';
                        } else {
                            return payload.Incorporator_Information.Address.State; // Default to the provided state value
                        }
                    })(), 
                    sectionText: 'Incorporator' 
                },
                { label: 'Zip', value: String(payload.Incorporator_Information.Address.Zip_Code), sectionText: 'Incorporator' },
            ];
            await this.addInputbyselector(page, incorporatorFields);
            
            await page.waitForSelector('input[aria-label^="I certify under penalty of perjury"]', { visible: true, timeout:0 });
            // Click the checkbox
            await page.click('input[aria-label^="I certify under penalty of perjury"]');
            await page.waitForSelector('input[placeholder="Full Legal Name"]', { visible: true, timeout:0 });
            await page.type('input[placeholder="Full Legal Name"]',payload.Incorporator_Information.Incorporator_Details.keyPersonnelName, { delay: 100 });
            await page.waitForSelector('button.btn.btn-lg.btn-primary.centered', { visible: true, timeout:0 });
            // Click the button
            await page.click('button.btn.btn-lg.btn-primary.centered');
            const res = "form filled successfully";
            return res

        } catch (error) {
            logger.error('Error in Iowa For CORP form handler:', error.stack);
            throw new Error(`Iowa For CORP form submission failed: ${error.message}`);
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

module.exports = IowaForCORP;


