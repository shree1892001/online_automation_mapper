const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { add } = require('winston');

class IdahoForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async  IdahoForLLC(page,jsonData,payload) {
      try {
        logger.info('Navigating to Idaho form submission page...');

const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;          await this.navigateToPage(page, url);
          await this.clickButton(page, '.btn.btn-default.login-link');
          const inputFields = [
              { label: 'username', value: data.State.filingWebsiteUsername },
              { label: 'password', value: data.State.filingWebsitePassword }
          ];
          await this.addInput(page, inputFields);
          await this.clickButton(page, '.btn-raised.btn-light-primary.submit');
          
          await new Promise(resolve => setTimeout(resolve, 6000))

          await page.waitForSelector('span.title');
          await page.$$eval('span.title', spans => {
            const targetElement = spans.find(span => span.textContent.trim() === 'Certificate of Organization Limited Liability Company');
            if (targetElement) {
              targetElement.click();
            } else {
              console.error('Element not found');
            }
          });
          
          await this.clickButton(page,'button.btn.btn-primary.btn-text');
          
          // await this.clickButton(page,'field-label radio-label');
          await this.selectRadioButtonByLabel(page,'Limited Liability Company');

          const input_company_name = [
            { label: 'field-field1-undefined', value: payload.Name.Legal_Name },
            { label: 'field-field2-undefined', value: payload.Name.Legal_Name }
            
            ];
            await this.addInput(page, input_company_name);
            
            await this.clickButton(page, 'button.btn.btn-raised.btn-primary.next.toolbar-button');

          const principaladdress = [
            {label: 'field-address1-r1lfZGRIgX', value:payload.Principal_Address.Street_Address},
            {label: 'field-addr-city-r1lfZGRIgX', value:payload.Principal_Address.City},
            {label: 'field-addr-zip-r1lfZGRIgX', value:String(payload.Principal_Address.Zip_Code)}
            ];

          await this.addInput(page, principaladdress);
          await this.clickDropdown(page, '#field-addr-state-r1lfZGRIgX', payload.Principal_Address.State );
          await this.clickDropdown(page, '#field-addr-country-r1lfZGRIgX', 'United States');

          const mailingaddress =[
            {label: 'field-address1-HJzMbzRIxm', value:payload.Registered_Agent.Mailing_Information.Street_Address},
            {label: 'field-addr-city-HJzMbzRIxm', value:payload.Registered_Agent.Mailing_Information.City},
            {label: 'field-addr-zip-HJzMbzRIxm', value:String(payload.Registered_Agent.Mailing_Information.Zip_Code)},
            
          ];
          await this.addInput(page, mailingaddress);
          await this.clickDropdown(page, '#field-addr-state-HJzMbzRIxm', payload.Registered_Agent.Mailing_Information.State);
          await this.clickDropdown(page, '#field-addr-country-HJzMbzRIxm', 'United States');

          await page.click('button.btn.btn-raised.btn-primary.next.toolbar-button');

          await this.selectRadioButtonByLabel(page,'Noncommercial or Individual');

          await page.click('button.btn.btn-medium-neutral.add');

          // Registerd Agent
          const rafullname = payload.Registered_Agent.keyPersonnelName;
          const [firstName, lastName] = await this.ra_split(rafullname);
          await this.fillInputByName(page,'FIRST_NAME',firstName);
          await this.fillInputByName(page,'LAST_NAME',lastName);

          const regagent = [
            { selector: '#field-address1-SJBKrsl8M_PRIMARY', value: payload.Registered_Agent.Address.Street_Address},
            { selector: '#field-addr-city-SJBKrsl8M_PRIMARY', value: payload.Registered_Agent.Address.City},
            { selector: '#field-addr-zip-SJBKrsl8M_PRIMARY', value: String(payload.Registered_Agent.Address.Zip_Code)},
        
            { selector: '#field-address1-SJBKrsl8M_MAIL', value: payload.Registered_Agent.Mailing_Information.Street_Address},
            { selector: '#field-addr-city-SJBKrsl8M_MAIL', value:payload.Registered_Agent.Mailing_Information.City},
            { selector: '#field-addr-zip-SJBKrsl8M_MAIL', value: String(payload.Registered_Agent.Mailing_Information.Zip_Code)}
        ];
        
        await this.fillInputbyid(page, regagent);
          
        
          // Click the Save Button
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const targetButton = buttons.find(button => button.textContent.trim() === 'Save');
            if (targetButton) {
                targetButton.click();
                console.log('Clicked the Save button');
            } else {
                console.log('Save button not found');
            }
        });

        await new Promise(resolve => setTimeout(resolve, 6000))

        const labelForAttribute = 'field-SJZTVExQI';  
        await page.waitForSelector(`label[for="${labelForAttribute}"]`, { visible: true, timeout: 30000 });
        await page.click(`label[for="${labelForAttribute}"]`);


        await page.click('button.btn.btn-raised.btn-primary.next.toolbar-button');

        
      // Wait for the button to be available and visible
        await page.waitForSelector('button.btn.btn-raised.btn-primary.form-button.add-row', { visible: true });

        // Click the button using evaluate
        await page.evaluate(() => {
            document.querySelector('button.btn.btn-raised.btn-primary.form-button.add-row').click();
        });


           // governer  
           const govname = payload.Governor_Information.GI_Name;
           const [first, last] = govname.split(' ');
           await this.fillInputByName(page,'FIRST_NAME',first);
           await this.fillInputByName(page,'LAST_NAME',last);
 
           const govadd =[
            {label: 'field-address1-ByOoRiT-f',value: payload.Governor_Information.Address.GI_Address_Line_1},
            {label: 'field-addr-city-ByOoRiT-f',value: payload.Governor_Information.Address.GI_City},
            {label: 'field-addr-state-ByOoRiT-f',value: payload.Governor_Information.Address.GI_State},
            {label: 'field-addr-zip-ByOoRiT-f',value:String(payload.Governor_Information.Address.GI_Zip_Code)}
          ];
           await this.addInput(page, govadd);
           await this.clickDropdown(page, '#field-addr-state-ByOoRiT-f', 'ID');
           await this.clickDropdown(page, '#field-addr-country-ByOoRiT-f', 'United States');
 
           // Click the Save Button
           await page.evaluate(() => {
           const buttons = Array.from(document.querySelectorAll('button'));
           const targetButton = buttons.find(button => button.textContent.trim() === 'Save');
           if (targetButton) {
               targetButton.click();
               console.log('Clicked the Save button');
           } else {
               console.log('Save button not found');
           }
       });
 
         
 
           await page.click('button.btn.btn-raised.btn-primary.next.toolbar-button');
           
           const res = "form filled successfully";
           return res
           
      } catch (error) {
          // Log full error stack for debugging
          logger.error('Error in Idaho LLC form handler:', error.stack);
          throw new Error(`Idaho LLC form submission failed: ${error.message}`);
        }
      }
    }

module.exports = IdahoForLLC;
