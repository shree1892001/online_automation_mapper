// const BaseFormHandler = require('./BaseFormHandler');
// const logger = require('../utils/logger');

// class NewJersyForLLC extends BaseFormHandler {
//     constructor() {
//         super();
//     }
//     async NewJersyForLLC(page,jsonData,payload) {
//         try {
//             logger.info('Navigating to New York form submission page...');
//             const url = jsonData.data.State.stateUrl;
//             await this.navigateToPage(page, url);
//             await this.clickDropdown(page, '#BusinessType', 'NJ Domestic Limited Liability Company (LLC)');
//             const name1=payload.Name.CD_LLC_Name;
//             const [name ,designator] = await this.extractnamedesignator(name1); 
//             console.log(name,designator);
//             const businessNameFields = [
//                 { label: 'BusinessName', value: name}
//             ];
//             await this.addInput(page, businessNameFields);
//             await page.keyboard.press('Enter');
//             const name2=payload.Name.CD_Alternate_LLC_Name;
//             const [name3, designator1] = await this.extractnamedesignator(name2); 


//             //alternate legal name 
//             const isNameREplaced=await this.tryAlternate(
//                 page, 
//                 "#BusinessName",  // selector2
//                 "#BusinessNameDesignator",  // selector1
//                 "input.btn.btn-success[value='Continue']",  // nextbtnSelec
//                 name3
              
//             );

//             await this.randomSleep()
//             await this.clickDropdown(page, '#BusinessNameDesignator', designator);
//             await page.keyboard.press('Enter');
//             await this.clickButton(page, '.btn.btn-success'); // Click the submit button
//             await new Promise(resolve => setTimeout(resolve, 3000))
//             await page.waitForSelector('#btnSubmit');
//             await page.click('#btnSubmit');
//             await new Promise(resolve => setTimeout(resolve, 3000))
//             await page.waitForSelector('#btnSubmit');
//             await page.click('#btnSubmit');
//             await this.clickButton(page, 'input[name="continuebtn"]'); // Click the continue button
//             await this.clickButton(page, '#ra-num-link a'); // Click the Registered Agent link
//             await this.fillInputByName(page, 'RegisteredAgentName', payload.Registered_Agent.RA_Name);
//             await this.fillInputByName(page, 'OfficeAddress1', payload.Registered_Agent.Address.RA_Address_Line_1);
//             await this.fillInputByName(page, 'OfficeAddress2', payload.Registered_Agent.Address.RA_Address_Line_2  || " ");

//             await this.fillInputByName(page, 'OfficeCity', payload.Registered_Agent.Address.RA_City);
//             await this.fillInputByName(page, 'OfficeZip', String(payload.Registered_Agent.Address.RA_Zip_Code));
//             await this.selectCheckboxByLabel(page, 'I attest that the Registered Agent information entered is correct for this business');
//             await this.clickButton(page, '.btn.btn-success'); // Submit
//             await this.clickButton(page, '#continue-btn');
//             await this.clickButton(page, 'input.btn.btn-success[value="Continue"]');
//             await new Promise(resolve => setTimeout(resolve, 5000))
//             await page.waitForSelector('a.btn.btn-success#add-signer-btn', { visible: true, timeout: 60000 });
//             await page.click('a.btn.btn-success#add-signer-btn');
//             await this.fillInputByName(page, 'Name', payload.Organizer_Information.Organizer_Details.Org_Name);
//             await this.clickDropdown(page, '#Title','Authorized Representative');
//             await this.clickButton(page, '#modal-save-btn'); // Save
//             await this.randomSleep()
//             await page.reload()
//             await page.waitForSelector('label[for="sign-ckbx-0"]', { visible: true, timeout: 3000 });
//             await page.click('label[for="sign-ckbx-0"]');
//             await this.clickButton(page, '#continue-btn');
//             const res = "form filled successfully";
//             return res
//         } catch (error) {
//             logger.error('Error in NewJersy For LLC form handler:', error.stack);
//             throw new Error(`NewJersy For LLC form submission failed: ${error.message}`);
//         }
//     }
// }
// module.exports = NewJersyForLLC;


const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class NewJersyForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async NewJersyForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            const stateMapping = await fetchByState(data.State.id);
            // console.log(stateMapping); 
            
               for(let i=0;i<stateMapping.length;i++){
             
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){

                  console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);                }

                }
            await this.navigateToPage(page, url);

            await this.clickDropdown(page, stateMapping[19].online_field_mapping, stateMapping[19].json_key);
            const name1=await this.getValueFromPayload(payload, stateMapping[22].json_key);
            const [name ,designator] = await this.extractnamedesignator(name1); 
            console.log(name,designator);
            const businessNameFields = [
                { label: 'BusinessName', value: name}
            ];
            await this.addInput(page, businessNameFields);
            await page.keyboard.press('Enter');
            const name2=await this.getValueFromPayload(payload, stateMapping[23].json_key);;
            const [name3, designator1] = await this.extractnamedesignator(name2); 


            //alternate legal name 
            const isNameREplaced=await this.tryAlternate(
                page, 
                stateMapping[42].online_field_mapping,  // selector2
                stateMapping[44].online_field_mapping,  // selector1
                stateMapping[20].online_field_mapping,  // nextbtnSelec
                name3
              
            );

            await this.randomSleep()
            await this.clickDropdown(page, stateMapping[44].online_field_mapping, designator);
            await page.keyboard.press('Enter');
            await this.clickButton(page, stateMapping[10].online_field_mapping); // Click the submit button
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector(stateMapping[63].online_field_mapping);
            await page.click(stateMapping[63].online_field_mapping);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector(stateMapping[63].online_field_mapping);
            await page.click(stateMapping[63].online_field_mapping);
            await this.clickButton(page, (stateMapping[0].online_field_mapping)); // Click the continue button
            await this.clickButton(page, (stateMapping[64].online_field_mapping)); // Click the Registered Agent link
            await this.fillInputByName(page,stateMapping[45].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[45].json_key));
            await this.fillInputByName(page, stateMapping[46].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[46].json_key));
            await this.fillInputByName(page, stateMapping[47].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[47].json_key)  || " ");

            await this.fillInputByName(page, stateMapping[48].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[48].json_key));
            await this.fillInputByName(page, stateMapping[49].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[49].json_key));

            await this.selectCheckboxByLabel(page, stateMapping[9].online_field_mapping);
            await this.clickButton(page, stateMapping[10].online_field_mapping); // Submit
 this.clickButton(page, stateMapping[0].online_field_mapping);
            await this.clickButton(page, stateMapping[11].online_field_mapping);
            await new Promise(resolve => setTimeout(resolve, 5000))
            await page.waitForSelector(stateMapping[14].online_field_mapping, { visible: true, timeout: 60000 });
            await page.click(stateMapping[14].online_field_mapping);
            await this.fillInputByName(page, stateMapping[15].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[15].json_key));
            await this.clickDropdown(page, stateMapping[16].online_field_mapping,stateMapping[16].json_key);
            await this.clickButton(page, stateMapping[17].online_field_mapping); // Save
            await this.randomSleep()
            await page.reload()
            await page.waitForSelector(stateMapping[18].online_field_mapping, { visible: true, timeout: 3000 });
            await page.click(stateMapping[18].online_field_mapping);
            await this.clickButton(page, stateMapping[0].online_field_mapping)
            const res = "form filled successfully";
            return res

        
        } catch (error) {
            logger.error('Error in NewJersy For LLC form handler:', error.stack);
            throw new Error(`NewJersy For LLC form submission failed: ${error.message}`);
        }
    }
}
module.exports = NewJersyForLLC;

