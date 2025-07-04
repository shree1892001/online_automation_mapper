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

            await this.clickDropdown(page, stateMapping[65].online_field_mapping, stateMapping[65].json_key);
            const name1=await this.getValueFromPayload(payload, stateMapping[1].json_key);
            const [name ,designator] = await this.extractnamedesignator(name1); 
            console.log(name,designator);
            const businessNameFields = [
                { label: 'BusinessName', value: name}
            ];
            await this.addInput(page, businessNameFields);
            await page.keyboard.press('Enter');
            const name2=await this.getValueFromPayload(payload, stateMapping[2].json_key);
            const [name3, designator1] = await this.extractnamedesignator(name2); 


            //alternate legal name 
            const isNameREplaced=await this.tryAlternate(
                page, 
                stateMapping[1].online_field_mapping,  // selector2 - BusinessName
                stateMapping[61].online_field_mapping,  // selector1 - #BusinessNameDesignator
                stateMapping[10].online_field_mapping,  // nextbtnSelec - input.btn.btn-success[value='Continue']
                name3
              
            );

            await this.randomSleep()
            await this.clickDropdown(page, stateMapping[61].online_field_mapping, designator);
            await page.keyboard.press('Enter');
            await this.clickButton(page, stateMapping[9].online_field_mapping); // Click the submit button
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector(stateMapping[54].online_field_mapping);
            await page.click(stateMapping[54].online_field_mapping);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector(stateMapping[54].online_field_mapping);
            await page.click(stateMapping[54].online_field_mapping);
            // Try multiple continue button selectors with better error handling
            try {
                await this.clickButton(page, stateMapping[0].online_field_mapping, true, { timeout: 10000, visible: true }); // Click the continue button
            } catch (error) {
                logger.warn(`Failed to click continue button with selector ${stateMapping[0].online_field_mapping}, trying alternative selectors...`);
                // Try alternative continue button selectors
                const alternativeSelectors = [
                    'input[name="continuebtn"]',
                    'button:contains("Continue")',
                    'input[value="Continue"]',
                    'button.btn-success',
                    '.btn-primary'
                ];
                
                let clicked = false;
                for (const selector of alternativeSelectors) {
                    try {
                        await this.clickButton(page, selector, true, { timeout: 5000, visible: true });
                        logger.info(`Successfully clicked continue button with alternative selector: ${selector}`);
                        clicked = true;
                        break;
                    } catch (altError) {
                        logger.warn(`Alternative selector ${selector} also failed: ${altError.message}`);
                    }
                }
                
                if (!clicked) {
                    throw new Error(`All continue button selectors failed. Last error: ${error.message}`);
                }
            }
            await this.clickButton(page, stateMapping[55].online_field_mapping); // Click the Registered Agent link
            
            // Helper function to safely get value from payload
            const getSafeValue = async (payload, jsonKey, defaultValue = "") => {
                const value = await this.getValueFromPayload(payload, jsonKey);
                return value !== null && value !== undefined ? String(value) : defaultValue;
            };

            await this.fillInputByName(page, stateMapping[3].online_field_mapping, await getSafeValue(payload, stateMapping[3].json_key));
            await this.fillInputByName(page, stateMapping[4].online_field_mapping, await getSafeValue(payload, stateMapping[4].json_key));
            await this.fillInputByName(page, stateMapping[5].online_field_mapping, await getSafeValue(payload, stateMapping[5].json_key, " "));
            await this.fillInputByName(page, stateMapping[6].online_field_mapping, await getSafeValue(payload, stateMapping[6].json_key));
            await this.fillInputByName(page, stateMapping[7].online_field_mapping, await getSafeValue(payload, stateMapping[7].json_key));

            await this.selectCheckboxByLabel(page, stateMapping[8].online_field_mapping);
            await this.clickButton(page, stateMapping[9].online_field_mapping); // Submit
            // Try multiple continue button selectors with better error handling
            try {
                await this.clickButton(page, stateMapping[0].online_field_mapping, true, { timeout: 10000, visible: true });
            } catch (error) {
                logger.warn(`Failed to click continue button with selector ${stateMapping[0].online_field_mapping}, trying alternative selectors...`);
                const alternativeSelectors = [
                    'input[name="continuebtn"]',
                    'button:contains("Continue")',
                    'input[value="Continue"]',
                    'button.btn-success',
                    '.btn-primary'
                ];
                
                let clicked = false;
                for (const selector of alternativeSelectors) {
                    try {
                        await this.clickButton(page, selector, true, { timeout: 5000, visible: true });
                        logger.info(`Successfully clicked continue button with alternative selector: ${selector}`);
                        clicked = true;
                        break;
                    } catch (altError) {
                        logger.warn(`Alternative selector ${selector} also failed: ${altError.message}`);
                    }
                }
                
                if (!clicked) {
                    throw new Error(`All continue button selectors failed. Last error: ${error.message}`);
                }
            }
            await this.clickButton(page, stateMapping[10].online_field_mapping);
            await new Promise(resolve => setTimeout(resolve, 5000))
            await page.waitForSelector(stateMapping[13].online_field_mapping, { visible: true, timeout: 60000 });
            await page.click(stateMapping[13].online_field_mapping);

            console.log("Check ",await getSafeValue(payload, stateMapping[50].json_key))
            await this.fillInputByName(page, stateMapping[51].online_field_mapping, await getSafeValue(payload, stateMapping[51].json_key));
            await this.clickDropdown(page, stateMapping[50].online_field_mapping, stateMapping[50].json_key);
            await this.clickButton(page, stateMapping[14].online_field_mapping); // Save
            await this.randomSleep()
            await page.reload()
            await page.waitForSelector(stateMapping[15].online_field_mapping, { visible: true, timeout: 3000 });
            await page.click(stateMapping[15].online_field_mapping);
            // Try multiple continue button selectors with better error handling
            try {
                await this.clickButton(page, stateMapping[0].online_field_mapping, true, { timeout: 10000, visible: true });
            } catch (error) {
                logger.warn(`Failed to click final continue button with selector ${stateMapping[0].online_field_mapping}, trying alternative selectors...`);
                const alternativeSelectors = [
                    'input[name="continuebtn"]',
                    'button:contains("Continue")',
                    'input[value="Continue"]',
                    'button.btn-success',
                    '.btn-primary'
                ];
                
                let clicked = false;
                for (const selector of alternativeSelectors) {
                    try {
                        await this.clickButton(page, selector, true, { timeout: 5000, visible: true });
                        logger.info(`Successfully clicked final continue button with alternative selector: ${selector}`);
                        clicked = true;
                        break;
                    } catch (altError) {
                        logger.warn(`Alternative selector ${selector} also failed: ${altError.message}`);
                    }
                }
                
                if (!clicked) {
                    throw new Error(`All final continue button selectors failed. Last error: ${error.message}`);
                }
            }
            const res = "form filled successfully";
            return res

        
        } catch (error) {
            logger.error('Error in NewJersy For LLC form handler:', error.stack);
            throw new Error(`NewJersy For LLC form submission failed: ${error.message}`);
        }
    }
}
module.exports = NewJersyForLLC;

