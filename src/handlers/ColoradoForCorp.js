const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { json } = require('express');
const { timeout } = require('puppeteer');

class ColoradoForCorp extends BaseFormHandler {
    constructor() {
        super();
    }
    async ColoradoForCorp(page,jsonData,payload) {
        try {
            logger.info('Navigating to colorado form submission page...');

            console.log("Payload :",payload)
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            console.log("**************")
            await page.evaluate(() => {
              const link = document.querySelector('a[href="#Profit"]');
              if (link) {
                link.click();
              } else {
                console.error('Link not found');
              }
            });           
            await page.waitForSelector('td > a[href="helpFiles/ProfitCorpintro.html"]', { visible: true, timeout: 60000 });
            await page.click('td > a[href="helpFiles/ProfitCorpintro.html"]');
            await this.clickButton(page, '.w3-btn-next');
            const inputFields = [
                { label: 'name', value: payload.Name.Legal_Name }
            ];
            await this.addInput(page, inputFields);
            await this.clickButton(page, '.w3-btn-next');
            const principleaddress = [
                { label: 'streetAddress-address1', value: payload.Principal_Address.Street_Address },
                { label: 'streetAddress-address2', value: payload.Principal_Address['Address_Line_2'] },

                { label: 'streetAddress-city', value: payload.Principal_Address.City },
                { label: 'streetAddress-zip', value: payload.Principal_Address.Zip_Code.toString() }
            ];
            await this.addInput(page, principleaddress);
            await this.clickDropdown(page,"#streetAddress-state",payload.Principal_Address.State);
            await this.clickDropdown(page,"#streetAddress-country","United States");
            
            const principle1address = [
              { label: 'mailingAddress-address1', value: payload.Registered_Agent.Mailing_Information.Street_Address},
              { label: 'mailingAddress-address2', value: payload.Registered_Agent.Mailing_Information['Address_Line_2'] || " "},

              { label: 'mailingAddress-city', value: payload.Registered_Agent.Mailing_Information.City },
              { label: 'mailingAddress-zip', value: payload.Registered_Agent.Mailing_Information.Zip_Code.toString() }
          ];
          await this.addInput(page, principle1address);
          await this.clickDropdown(page,"#mailingAddress-state",payload.Registered_Agent.Mailing_Information.State);
          await this.clickDropdown(page,"#mailingAddress-country","United States");
          


            await this.clickButton(page, '.w3-btn-next');
            await page.waitForSelector('input[type="radio"][name="nameTyp"]');

                // Check the checkbox
                await page.evaluate(() => {
                  const checkbox = document.querySelector('input[type="radio"][name="nameTyp"]');
                  if (!checkbox.checked) {
                    checkbox.click();
                  }
                });
               let Name=payload.Registered_Agent.keyPersonnelName.split(" ");
               console.log("Name",Name); 
                await this.fillInputByName(page,"individualName-firstName",Name[0]);
                console.log(Name[0]);
                await this.fillInputByName(page,"individualName-lastName",Name[1]);


                const registered_agent_fields = [
                    { label: 'streetAddress-address1', value: payload.Registered_Agent.Address.Street_Address },
                    { label: 'streetAddress-address2', value: payload.Registered_Agent.Address['Address_Line_2'] || " " },

                    { label: 'streetAddress-city', value: payload.Registered_Agent.Address.City },
                    { label: 'streetAddress-zip', value: payload.Registered_Agent.Address.Zip_Code.toString() }
                ];
                await this.addInput(page, registered_agent_fields);
                // if(payload.Registered_Agent.RA_Address ===payload.Registered_Agent.MA_Address){

                   
                //         await page.waitForSelector('input[type="checkbox"][name="isSameAsStreetAddressChecked"]');
        
                //         // Check the checkbox
                //         await page.evaluate(() => {
                //           const checkbox = document.querySelector('input[type="checkbox"][name="isSameAsStreetAddressChecked"]');
                //           if (!checkbox.checked) {
                //             checkbox.click();
                //           }
                //         });
                // }else{
                    const registered_agent_fields1 = [
                        { label: 'mailingAddress-address1', value: payload.Registered_Agent.Mailing_Information.Street_Address },
                        { label: 'mailingAddress-address2', value: payload.Registered_Agent.Mailing_Information['Address_Line_2'] || " " },

                        { label: 'mailingAddress-city', value: payload.Registered_Agent.Mailing_Information.City },
                        { label: 'mailingAddress-zip', value: payload.Registered_Agent.Mailing_Information.Zip_Code.toString() }
                    ];
                    await this.addInput(page, registered_agent_fields1);


                // }
                await page.waitForSelector('input[type="radio"][name="agentConsentRadio"]');

                // Check the checkbox
                await page.evaluate(() => {
                  const checkbox = document.querySelector('input[type="radio"][name="agentConsentRadio"]');
                  if (!checkbox.checked) {
                    checkbox.click();
                  }
                });

               
                await this.clickButton(page, '.w3-btn-next');

                    await page.waitForSelector(".w3-modal", { visible: true, timeout: 12000 });
                
                    await page.click(".w3-modal button.w3-btn-next"); 
                
                    console.log("Modal detected and button clicked.");
               

               await page.waitForSelector("#saveNextId",{visible:true,timeout:12000});

                await page.click("#saveNextId");

             

               


                await page.waitForSelector('input[type="radio"][name="personTyp"]');

                // Check the checkbox
                await page.evaluate(() => {
                  const checkbox = document.querySelector('input[type="radio"][name="personTyp"]');
                  if (!checkbox.checked) {
                    checkbox.click();
                  }
                });
                let og_name= payload.Incorporator_Information.Incorporator_Details.keyPersonnelName.split(" "); 
                await this.fillInputByName(page,"name-firstName",og_name[0]); 
                await this.fillInputByName(page,"name-lastName",og_name[1]);

                const organizeraddress = [
                  { label: 'address-address1', value: payload.Incorporator_Information.Address.Street_Address },
                  { label: 'address-address2', value: payload.Incorporator_Information.Address['Address_Line_2'] },

                  { label: 'address-city', value: payload.Incorporator_Information.Address.City },
                  { label: 'address-zip', value: payload.Incorporator_Information.Address.Zip_Code.toString() }
              ];
              await this.addInput(page, organizeraddress);
              await this.clickDropdown(page,"#address-state",payload.Incorporator_Information.Address.State);

              await page.waitForSelector("#saveNextId",{visible:true,timeout:12000});

                await page.click("#saveNextId");

                try {
                  await page.waitForSelector(".w3-modal", { visible: true, timeout: 12000 });
              
                  await page.waitForSelector('input[type="radio"][name="personTyp"]');

                // Check the checkbox
                await page.evaluate(() => {
                  const checkbox = document.querySelector('input[type="radio"][name="streetAddressSelectionTypeRadio"]');
                  if (!checkbox.checked) {
                    checkbox.click();
                  }
                });
                await page.waitForSelector(".w3-modal button.w3-btn-next"); 
                await page.click(".w3-modal button.w3-btn-next"); 
              
                  console.log("Modal detected and button clicked.");
              } catch (error) {
                  console.log("Modal did not appear, continuing with the flow.");
              }
              
             
              await page.click(".w3-btn-next"); // Replace with your next action
              
              // await page.click(".w3-btn-next"); // Replace with your next action
              // await page.click(".w3-btn-next");
              console.log("Shares Page");

              await page.waitForSelector('input[name="isCommonSharesChecked"]');
  
  const isChecked = await page.$eval('input[name="isCommonSharesChecked"]', el => el.checked);
  if (!isChecked) {
    await page.click('input[name="isCommonSharesChecked"]');
  }

              await this.fillInputByName(page,"numberOfShares",payload.Stock_Details.Number_Of_Shares.toString());

              // Check the checkbox
              await page.click(".w3-btn-next");

                            await page.click(".w3-btn-next");


              


              await page.waitForSelector('input[type="radio"][name="dedSelectRadio"]');
               
              await page.evaluate(() => {
                const checkbox = document.querySelector('input[type="radio"][name="dedSelectRadio"]');
                if (!checkbox.checked) {
                  checkbox.click();
                }
              });

              
              await page.click(".w3-btn-next");


              await page.waitForSelector('input[type="checkbox"][name="perjuryNoticeAffirmed"]');
              await page.evaluate(() => {
                const checkbox = document.querySelector('input[type="checkbox"][name="perjuryNoticeAffirmed"]');
                if (!checkbox.checked) {
                  checkbox.click();
                }
              });
              await page.waitForSelector('input[type="checkbox"][name="sameAsFormer"]');
               
              await page.evaluate(() => {
                const checkbox = document.querySelector('input[type="checkbox"][name="sameAsFormer"]');
                if (!checkbox.checked) {
                  checkbox.click();
                }
              });

                            await page.click(".w3-btn-next");

              
             await page.waitForSelector('input[name="emailNotificationRadio"][value="N"]');
              await page.click('input[name="emailNotificationRadio"][value="N"]');


              await page.waitForSelector('input[name="textNotificationRadio"][value="N"]');
              await page.click('input[name="textNotificationRadio"][value="N"]');

              await page.click(".w3-btn-next");
              const res = "form filled successfully";
              return res
   
        } catch (error) {
            logger.error('Error in Colorado For corp form handler:', error.stack);
            throw new Error(`Colorado For corp form submission failed: ${error.message}`);
        }
    }
}

module.exports = ColoradoForCorp;


