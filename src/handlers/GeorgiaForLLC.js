const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
const { timeout } = require('puppeteer');
const { json } = require('express');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class GeorgiaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async GeorgiaForLLC(page, jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            for(let i=0;i<stateMapping.length;i++){
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                    console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
                }
            }

            const url = data.State.stateUrl;            

            await this.navigateToPage(page, url);
//                 await page.waitForSelector('label input[type="checkbox"]', { visible: true });

//   // Click the checkbox
        //  await page.click('label input[type="checkbox"]');

         await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 });

        //   await this.waitForTimeout(300000);
        await this.randomSleep(60000 ,90000);

            await page.waitForSelector('.jumbo-btns',{visible:true,timeout:0}); 
            await page.click('.jumbo-btns');
              



            await page.waitForSelector('.ui-dialog-buttonset .ui-button-text', { visible: true });
            await page.click('.ui-dialog-buttonset .ui-button');
          
           
            // Click the login button
            // const inputFields = [
            //     { label: 'txtUserId', value: data.State.filingWebsiteUsername },
            //     { label: 'txtPassword', value: data.State.filingWebsitePassword }
            // ];

            const inputFields=[
                {label:'txtUserId',value:data.State.filingWebsiteUsername},
                {label:'txtPassword',value:data.State.filingWebsitePassword}



            ]







            await this.addInput(page, inputFields);
            await page.waitForSelector('#btnLogin'); // Wait for the button with ID "login_button"

            // Click the login button
            await page.click('#btnLogin');          
                       await page.waitForSelector('.nav_bg');

            await page.waitForSelector('.nav_bg');

            // Find the div that contains the 'Create or Register a Business' text and click it
            const divSelector = await page.evaluate(() => {
              const divs = Array.from(document.querySelectorAll('.nav_bg'));
              const targetDiv = divs.find(div => div.innerText.includes('Create or Register a Business'));
              if (targetDiv) {
                targetDiv.click();
                return true;
              }
              return false;
            });
            await page.waitForSelector('input[name="IsDomesticOrForeign"][value="D"]');
            await page.click('input[name="IsDomesticOrForeign"][value="D"]');
           await this.clickDropdown(page,"#ddlDomestic","Domestic Limited Liability Company"); 
           await this.randomSleep(1000,2000);  
           const bussuinessName=[
            {label:'txtBusinessName',value:payload.Name.Legal_Name},



        ]
       await this.addInput(page,bussuinessName); 
       await this.clickDropdown(page,"#ddlNaicsCode",payload.Naics_Code.NC_NAICS_Code); 
       await this.randomSleep(10000,20000);
       await this.clickDropdown(page,"#ddlNAICSSubCode",payload.Naics_Code.Naics_Code);
       let zip = "PrincipalOfficeAddress_Zip5";
       let zip5 = "PrincipalOfficeAddress_PostalCode";
       
       const principleaddress = [
           { label: 'PrincipalOfficeAddress_StreetAddress1', value: payload.Principal_Address.Street_Address },
                      { label: 'PrincipalOfficeAddress_StreetAddress2', value: payload.Principal_Address['Address_Line_2']||" " },

           { label: 'PrincipalOfficeAddress_City', value: payload.Principal_Address.City },
           // Conditionally set the postal code based on the label
           { 
               label: zip === "PrincipalOfficeAddress_Zip5" ? 'PrincipalOfficeAddress_Zip5' : 'PrincipalOfficeAddress_PostalCode', 
               value: payload.Principal_Address.Zip_Code.toString() 
           }
       ];

            await this.addInput(page, principleaddress);
            await this.clickDropdown(page,"#PrincipalOfficeAddress_State",payload.Principal_Address.State);
            // await this.clickDropdown(page,"#PrincipalOfficeAddress_Country",jsonData.data.Payload.Principal_Address.PA_Country
            
        await this.randomSleep(1000,3000);
        await page.evaluate(() => {
            document.getElementById('btncontinue').click();
        });

            // Click the button

            await this.fillInputByName(page,"txtPrimaryEmail",payload.Registered_Agent.EmailId);
            await this.fillInputByName(page,"txtConfirmEmailAddress",payload.Registered_Agent.EmailId);
            await page.evaluate(() => {
                document.getElementById('btnCreateAgent').click();
            });
            const raFullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(raFullName);

           const registeredAgent = [
            { label: 'txtFirstName', value:firstName },
            { label: 'txtLastName', value:lastName },
            { label: 'txtEmailAddress', value:payload.Registered_Agent.EmailId},

            // Conditionally set the postal code based on the label
           
        ];
        await this.addInput(page,registeredAgent); 
        await this.fillInputByName(page,"PrincipalAddress.StreetAddress1",payload.Registered_Agent.Address.Street_Address);
        await this.fillInputByName(page,"PrincipalAddress.StreetAddress2",payload.Registered_Agent.Address.Address_Line_2||" ");

        await this.fillInputByName(page,"PrincipalAddress.City",payload.Registered_Agent.Address.City); 

        await this.clickDropdown(page,"#PrincipalAddress_County",jsonData.data.County.countyName);

        
        await this.fillInputByName(page,"PrincipalAddress.Zip5",payload.Registered_Agent.Address.Zip_Code.toString()); 
        await page.evaluate(() => {
          // Find the button and call the createAgent function directly
          const button = document.querySelector('input.button[value="Create Registered Agent"]');
          if (button) {
              createAgent();
          }
      });

      await this.randomSleep(10000,30000);
  
      const organizer=payload.Organizer_Information.keyPersonnelName
      const [firstName1,lastName1] =await this.ra_split(organizer); 

      await page.waitForSelector('input[name="Organizer_txtFirstName"]',{visible:true,timeout:0});
      await this.randomSleep(10000,40000);

      await this.fillInputByName(page,"Organizer_txtFirstName",firstName1);
      await this.fillInputByName(page,"Organizer_txtLastName",lastName1);     
     await this.fillInputByName(page,"IncorporatorAddress.StreetAddress1",payload.Organizer_Information.Address.Street_Address); 
          await this.fillInputByName(page,"IncorporatorAddress.StreetAddress2",payload.Organizer_Information.Address.Address_Line_2||" "); 

      await this.fillInputByName(page,"IncorporatorAddress.City",payload.Organizer_Information.Address.City); 
      await this.fillInputByName(page,"IncorporatorAddress.Zip5",payload.Organizer_Information.Address.Zip_Code.toString());
      
      await this.randomSleep(1000,3000);
      await page.evaluate(() => {
          document.getElementById('btnPrincipalAdd').click();
      });
      await this.randomSleep(1000,3000);

      await page.evaluate(() => {
        document.getElementById('ChkSignature').click();
    });

    await this.randomSleep(1000,3000);
    
    await this.fillInputByName(page,"txtAuthorizer_Signature",payload.Organizer_Information.keyPersonnelName);
   
   
    await this.randomSleep(1000,3000);
        await page.evaluate(() => {
            document.getElementById('btnContinue').click();
        });

        await this.randomSleep(1000,3000);
        await page.evaluate(() => {
            document.getElementById('btnCreateBusiness').click();
        });

       







      



 
        


            // await page.click('#btncontinue');
          
         
            
            
        } catch (error) {
            logger.error('Error in Georgia LLC form handler:', error.stack);
            throw new Error(`Georgia LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = GeorgiaForLLC;


