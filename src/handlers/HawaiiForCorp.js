const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class  HawaiiForCorp extends BaseFormHandler {
    constructor() {
        super();
    }
    async HawaiiForCorp(page,jsonData,payload) {
        try {
            logger.info('Navigating to Hawaii form submission page...');
const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            await page.waitForSelector('a[title="eHawaii.gov account services"]');

            // Click the login button
            await page.click('a[title="eHawaii.gov account services"]');
            const inputFields = [
                { label: 'username', value: data.State.filingWebsiteUsername },
                { label: 'password', value: data.State.filingWebsitePassword }
            ];

            await this.addInput(page, inputFields);
            await page.waitForSelector('#login_button'); // Wait for the button with ID "login_button"

            // Click the login button
            await page.click('#login_button');          
            
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 });
            
            await page.waitForSelector('a.btn.btn-lg.btn-secondary'); // Wait for the "Get started" button to appear

            await page.click('a.btn.btn-lg.btn-secondary'); 
            await page.waitForSelector('#startBusiness_1'); // Wait for the radio button with id "startBusiness_1"

            // Click the first radio button
            await page.click('#startBusiness_1'); 
            await page.waitForSelector('#basedInHawaii_true'); // Wait for the radio button with id "basedInHawaii_true"

            // Click the first radio button (Yes, it is based in Hawaii)
            await page.click('#basedInHawaii_true'); 

            
                await page.evaluate(() => {
                    const dropdown = document.querySelector('#businessStructure');
                    const option = Array.from(dropdown.options).find(opt => opt.text === "Corporation");
            
                    if (option) {
                        dropdown.value = option.value;
            
                        // Dispatch a 'change' event to trigger any event listeners
                        const event = new Event('change', { bubbles: true });
                        dropdown.dispatchEvent(event);
                    }
                });

               await page.click("#profitFlag_false");             

            await this.clickButton(page,'#continue')


         
            const input_company_name = [
            { label: 'entityName', value: payload.Name.Legal_Name },
            
            ];
            await this.addInput(page, input_company_name)
            await page.evaluate((payload) => {
                const dropdown = document.querySelector('#initialPrincipalOffice\\.country');
                const option = Array.from(dropdown.options).find(opt => opt.text === "United States of America");
        
                if (option) {
                    dropdown.value = option.value;
        
                    // Dispatch a 'change' event to trigger any event listeners
                    const event = new Event('change', { bubbles: true });
                    dropdown.dispatchEvent(event);
                }
            },payload);
             let Principal_Address_fields = [
                { label: 'initialPrincipalOffice\\.street1', value: payload.Principal_Address.Street_Address },
                { label: 'initialPrincipalOffice\\.street2', value: payload.Principal_Address['Address_Line_2'] || " " },
                { label: 'initialPrincipalOffice\\.city', value: payload.Principal_Address.City },
                // { label: 'initialPrincipalOffice\\.state', value: payload.Principal_Address.State },
                // { label: 'ZIP Code*', value: payload.Principal_Address.PA_Postal_Code },
                ];

            await this.addInput(page, Principal_Address_fields);
            await this.clickDropdown(page,"#initialPrincipalOffice\\.state",payload.Principal_Address.State)
            let Principal_Address_fields1= [
                
                // { label: 'initialPrincipalOffice\\.state', value: payload.Principal_Address.State },
                { label: 'initialPrincipalOffice\\.zip', value: payload.Principal_Address.Zip_Code.toString() },
                ];
                await this.addInput(page, Principal_Address_fields1);

             await this.selectRadioButtonByLabel(page,'Individual')
            const fullName = payload.Registered_Agent.keyPersonnelName;
            
            const register_agent_fields = [
                { label: 'registeredAgent\\.nameOfAgent', value: fullName},
                {label:'registeredAgent\\.registeredOffice\\.street1',value: payload.Registered_Agent.Address.Street_Address },
                {label:'registeredAgent\\.registeredOffice\\.street2',value: payload.Registered_Agent.Address['Address_Line_2']|| " " },
            { label: 'registeredAgent\\.registeredOffice\\.city', value: payload.Registered_Agent.Address.City },
            // {label:'registeredAgent\\.registeredOffice\\.zip',value: payload.Registered_Agent.Address.RA_Postal_Code }
               
                ];
            await this.addInput(page, register_agent_fields)
            await page.evaluate((payload) => {
                const dropdown = document.querySelector('#registeredAgent\\.registeredOffice\\.state');
                const option = Array.from(dropdown.options).find(opt => opt.text === payload.Registered_Agent.Address.RA_State);
        
                if (option) {
                    dropdown.value = option.value;
        
                    // Dispatch a 'change' event to trigger any event listeners
                    const event = new Event('change', { bubbles: true });
                    dropdown.dispatchEvent(event);
                }
            },payload);
            const registered_agent_fields1= [
                
                // { label: 'initialPrincipalOffice\\.state', value: payload.Principal_Address.State },
                { label: 'registeredAgent\\.registeredOffice\\.zip', value: payload.Registered_Agent.Address.Zip_Code.toString()},
                ];
                await this.addInput(page, registered_agent_fields1);


                
            
                await page.evaluate((payload) => {
                    const dropdown = document.querySelector('[id="incorporators[0].address.country"]');
                    const option = Array.from(dropdown.options).find(opt => opt.text ==="United States of America");
            
                    if (option) {
                        dropdown.value = option.value;
            
                        // Dispatch a 'change' event to trigger any event listeners
                        const event = new Event('change', { bubbles: true });
                        dropdown.dispatchEvent(event);
                    }
                },payload);
                await page.evaluate((payload) => {
                    const nameField = document.querySelector('[id="incorporators[0].name"]');
                    if (nameField) {
                        nameField.value = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
                        
                        const nameEvent = new Event('input', { bubbles: true });
                        nameField.dispatchEvent(new Event('blur'));
                        nameField.dispatchEvent(new Event('keyup'));
                        nameField.dispatchEvent(nameEvent);
                    }
                
                    const streetField = document.querySelector('[id="incorporators[0].address.street1"]');
                    if (streetField) {
                        streetField.value = payload.Incorporator_Information.Address.Street_Address;
                        
                        const streetEvent = new Event('input', { bubbles: true });
                        streetField.dispatchEvent(streetEvent);
                    }

                    
                    const street1Field = document.querySelector('[id="incorporators[0].address.street2"]');
                    if (street1Field) {
                        street1Field.value = payload.Incorporator_Information.Address['Address_Line_2'];
                        
                        const street1Event = new Event('input', { bubbles: true });
                        street1Field.dispatchEvent(street1Event);
                    }
                
                    const cityField = document.querySelector('[id="incorporators[0].address.city"]');
                    if (cityField) {
                        cityField.value = payload.Incorporator_Information.Address.City;
                        
                        // Dispatch an input event to trigger any listeners
                        const cityEvent = new Event('input', { bubbles: true });
                        cityField.dispatchEvent(cityEvent);
                    }
                
                    // Update the country field (from the previous example)
                    const dropdown = document.querySelector('[id="incorporators[0].address.state"]');
                    const option = Array.from(dropdown.options).find(opt => opt.text ===payload.Incorporator_Information.Address.State.toUpperCase());
                    
                    if (option) {
                        dropdown.value = option.value;
                
                        // Dispatch a 'change' event to trigger any event listeners
                        const event = new Event('change', { bubbles: true });
                        dropdown.dispatchEvent(event);
                    }
                
                }, payload);
                await this.clickDropdown(page,"#incorporators\\[0\\]\\.address\\.state",payload.Incorporator_Information.Address.State)
                await page.evaluate((payload) => {
                    const dropdown = document.querySelector('[id="incorporators[0].address.zip"]');
                    if(dropdown){
                        dropdown.value=payload.Incorporator_Information.Address.Zip_Code.toString();
                    }   
                },payload);
                
                        
                  await page.click("#hasMembers_true");
               const sign_field = [
                { label: 'signature\\.name', value: payload.Incorporator_Information.Incorporator_Details.keyPersonnelName },
                {label : 'signature\\.signature' ,value: payload.Incorporator_Information.Incorporator_Details.keyPersonnelName} 

               ]; 

               await this.addInput(page,sign_field); 
               await page.waitForSelector("#treviewSubmit",{visible:true,timeout:0}); 
               await page.click("#treviewSubmit"); 
               const res = "form filled successfully";
               return res
   
        } catch (error) {
            logger.error('Error in Hawaii LLC form handler:', error.stack);
            throw new Error(`Hawaii LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = HawaiiForCorp;


