const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
const { timeout } = require('puppeteer');

class IllinoisForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async IllinoisForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            for(let i=0;i<stateMapping.length;i++){
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                    console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
                }
            }

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            //select LLC
            await this.clickOnLinkByText(page, 'Organize a Limited Liability Company');
            await this.selectRadioButtonById(page, 'llcNo');
            await this.clickButton(page, 'input[type="submit"].formbutton');
            await page.click('input[type="radio"][name="provisions"][value="y"]');
            await this.clickButton(page, 'input[type="submit"].formbutton');
            //add llc name
            await this.fillInputByName(page, 'llcName', payload.Name.Legal_Name);
            // await page.waitForSelector('input[name="agree"]', { visible: true , timeout:3000});
            // await page.click('input[name="agree"]');
             await this.clickButton(page, 'input[type="submit"].formbutton');
             await page.waitForSelector('input[name="agree"]', { visible: true });
             await page.click('input[name="agree"]');

          await this.randomSleep(1000,3000); 

        //     await page.waitForSelector('input[type="submit"]');
        //    await this.clickButton(page, 'input[type="submit"]');
        
        // Click the final submit button and ensure navigation
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }), // Ensure next page loads
            await page.click('input.formbutton[name="submitform"]'),
        ]);
    
    //add principle address
            await this.fillInputByName(page, 'llcStreet', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'llcCity', payload.Principal_Address.City);
            await this.fillInputByName(page, 'llcZipCode', payload.Principal_Address.Zip_Code.toString());
            await this.clickDropdown(page, 'select[name="llcState"]', 'ALABAMA');
            await this.clickButton(page, 'input[type="submit"].formbutton');
            //add register agent
            await this.fillInputByName(page, 'agent', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(page, 'address', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'city', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'zip', payload.Registered_Agent.Address.Zip_Code.toString());
            await this.clickButton(page, 'input[type="submit"].formbutton');
            await this.clickButton(page, 'input[name="contwithout"]');
            await this.clickButton(page, 'input[name="noUsps"]');
            await this.clickButton(page, 'input[name="submit"]');

            // fill input members 
            await this.fillInputByName(page, 'members[0].name', payload.Organizer_Information.keyPersonnelName);
            await this.fillInputByName(page, 'members[0].address', payload.Organizer_Information.Address.Street_Address);
            await this.fillInputByName(page, 'members[0].city', payload.Organizer_Information.Address.City);
            await this.fillInputByName(page, 'members[0].state', payload.organizer_information.Address.state);
            await this.fillInputByName(page, 'members[0].zipCode', payload.Organizer_Information.Address.Zip_Code.toString());
            await this.clickButton(page, 'input[type="submit"].formbutton');
            // fill input organizer address
            await this.fillInputByName(page, 'name', payload.Member_Or_Manager_Details[0].Mom_Name);
            await this.fillInputByName(page, 'street', payload.Member_Or_Manager_Details[0].Address.Street_Address);
            await this.fillInputByName(page, 'city', payload.Member_Or_Manager_Details[0].Address.City);
            await this.fillInputByName(page, 'zipCode', payload.Member_Or_Manager_Details[0].Address.Zip_Code.toString());
            await this.clickDropdown(page, 'select[name="state"]', payload.Member_Or_Manager_Details[0].Address.MM_State);
            await this.clickButton(page, 'input[type="submit"].formbutton');
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in Illinois for llc form handler:', error.stack);
            throw new Error(`Illinois for llc form submission failed: ${error.message}`);
        }
    }
}

module.exports = IllinoisForLLC;


