const logger = require('../utils/logger');
const BaseFormHandler = require('./BaseFormHandler');
const { fetchByState } = require('../utils/getByState');

class NewJersyForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async NewJersyForCORP(page,jsonData,payload) {
        try {
            // jsonData.State.id
            

            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];


             const stateMapping = await fetchByState(data.State.id);
             
             // Add defensive check for stateMapping
             if (!stateMapping || !Array.isArray(stateMapping) || stateMapping.length === 0) {
                 throw new Error('No state mapping found for the given state ID: ' + data.State.id);
             }
             
             console.log("StateMapping", stateMapping)
             data.orderType == stateMapping[0].order_type && data.orderFullDesc == stateMapping[0].entity_type  

            
   
               for(let i=0;i<stateMapping.length;i++){

                  console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);                }

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            
            await this.clickDropdown(page, stateMapping[20].online_field_mapping, stateMapping[20].json_key);
            
           
            
            // // Get the json_key path from database
            const jsonKeyPath = stateMapping[22].json_key; 
            console.log("JSon Key path :=",jsonKeyPath)// "payload.Name.Legal_Name"
            const fieldSelector = stateMapping[22].online_field_mapping; // "BusinessName"

            // Extract the actual value from payload using the path
            const businessName = await this.getValueFromPayload(payload, jsonKeyPath);

            
            
            // logger.info(`Filled business name using mapping: ${businessNameMapping}`);
//alternate legal name 
            const name2=businessName;
            const [name3, designator1] = await this.extractnamedesignator(name2); 
            await this.fillInputByName(page, fieldSelector, name3);
            const isNameREplaced=await this.tryAlternate(
                page, 
                stateMapping[42].online_field_mapping,  // selector2
                stateMapping[48].online_field_mapping,  // selector1
                stateMapping[20].online_field_mapping,  // nextbtnSelec
                name3
              
            );
          await this.clickButton(page, stateMapping[10].online_field_mapping);
                  console.log("The designator at 37",stateMapping[24].online_field_mapping)
            await this.clickDropdown(page, stateMapping[24].online_field_mapping,designator1);
            await this.clickButton(page, stateMapping[10].online_field_mapping);
            // await this.randomSleep(20000,30000);
            await new Promise(resolve => setTimeout(resolve, 2000))

            
            const totalSharesValue = await this.getValueFromPayload(payload, stateMapping[62].json_key);
            console.log("TotalSharesValue :=" ,totalSharesValue);
            if (totalSharesValue) {
                await this.fillInputByName(page, stateMapping[62].online_field_mapping, totalSharesValue.toString());
            }

            await new Promise(resolve => setTimeout(resolve, 2000))
            await page.waitForSelector(stateMapping[10].online_field_mapping);
            await page.click(stateMapping[10].online_field_mapping);
            await new Promise(resolve => setTimeout(resolve, 5000))
            await page.waitForSelector(stateMapping[63].online_field_mapping);
            await page.click(stateMapping[63].online_field_mapping);
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.clickButton(page, stateMapping[10].online_field_mapping); 
            await this.clickButton(page, stateMapping[64].online_field_mapping); // Click the Registered Agent link
            await this.fillInputByName(page,stateMapping[45].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[45].json_key));
            await this.fillInputByName(page, stateMapping[46].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[46].json_key));
            await this.fillInputByName(page, stateMapping[47].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[47].json_key)  || " ");

            await this.fillInputByName(page, stateMapping[48].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[48].json_key));
            await this.fillInputByName(page, stateMapping[49].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[49].json_key));

            await this.selectCheckboxByLabel(page, stateMapping[9].online_field_mapping);
            await this.clickButton(page, stateMapping[10].online_field_mapping); // Submit
            await new Promise(resolve => setTimeout(resolve, 10000))
            await page.waitForSelector(stateMapping[65].online_field_mapping);
            await page.click(stateMapping[65].online_field_mapping);
            await this.fillInputByName(page, stateMapping[56].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[56].json_key));
            await this.fillInputByName(page, stateMapping[50].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[50].json_key));
            await this.fillInputByName(page, stateMapping[51].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[51].json_key)  || " ");

            await this.fillInputByName(page, stateMapping[52].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[52].json_key));


           
            if(await this.getValueFromPayload(payload,stateMapping[68].json_key==="NJ")){
                console.log(await this.getValueFromPayload(payload,stateMapping[68].json_key));
                await this.clickDropdown(page, stateMapping[68].online_field_mapping, "New Jersey");
 
            }
            else{
 
                await this.clickDropdown(page, stateMapping[68].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[68].json_key));
            }
            
            await this.fillInputByName(page, stateMapping[53].online_field_mapping, String(await this.getValueFromPayload(payload,stateMapping[53].json_key)));
            await page.evaluate(() => {
                document.body.style.zoom = '90%';
            });
            await this.clickButton(page, stateMapping[66].online_field_mapping);
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.clickButton(page, stateMapping[0].online_field_mapping);
            await new Promise(resolve => setTimeout(resolve, 10000))
            // await page.waitForSelector('.btn.btn-success[title="Add New Incorporators"]', { visible: true });
            await page.evaluate(() => {
                const button = document.getElementById('add-member-btn');
                if (button) {
                    button.click();
                }
            }); 
            await page.waitForSelector(stateMapping[65].online_field_mapping);
            await page.click(stateMapping[65].online_field_mapping);   
            

            console.log("Check :=",stateMapping[57].online_field_mapping," ",stateMapping[57].json_key)
            await this.fillInputByName(page,stateMapping[57].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[57].json_key));
            await this.fillInputByName(page, stateMapping[59].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[59].json_key));

            await this.fillInputByName(page, stateMapping[67].online_field_mapping, await this.getValueFromPayload(payload,stateMapping[67].json_key));
            if(await this.getValueFromPayload(payload,stateMapping[60].json_key)==="NJ"){
                console.log(await this.getValueFromPayload(payload,stateMapping[60].json_key));
                await this.clickDropdown(page, stateMapping[60].online_field_mapping, "New Jersey");
 
            }
            else{
 
                await this.clickDropdown(page, stateMapping[60].online_field_mapping,await this.getValueFromPayload(payload,stateMapping[60].json_key));
            }
            await this.fillInputByName(page,stateMapping[69].online_field_mapping, String(await this.getValueFromPayload(payload,stateMapping[69].json_key)));
 
            await page.evaluate(() => {
                document.body.style.zoom = '90%';
            });
            await this.clickButton(page, stateMapping[66].online_field_mapping);
            await page.evaluate(() => {
                document.body.style.zoom = '100%';
            });
            await new Promise(resolve => setTimeout(resolve, 5000))
            await this.clickButton(page, stateMapping[0].online_field_mapping)
            await this.clickButton(page, stateMapping[11].online_field_mapping);
            const labelSelector = stateMapping[55].online_field_mapping;
            await page.waitForSelector(labelSelector, { visible: true, timeout: 30000 });
            await page.reload()
            await page.click(labelSelector);
            console.log(`Clicked the label for checkbox: ${labelSelector}`);
            await page.evaluate((selector) => {
                const checkbox = document.querySelector(selector);
                return checkbox ? checkbox.checked : null;
            }, stateMapping[56].online_field_mapping);
            // console.log(stateMapping[0].online_field_mapping); 
            await this.clickButton(page, stateMapping[61].online_field_mapping);
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in NewJersy For CORP form handler:', error.stack);
            throw new Error(`NewJersy For CORP form submission failed: ${error.message}`);
        }
    }

   
}
module.exports = NewJersyForCORP;
