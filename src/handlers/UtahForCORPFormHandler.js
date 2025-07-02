const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const axios = require('axios');

class UtahForCorp extends BaseFormHandler {
    constructor() {
        super();
    }

    async UtahForCorp(page, jsonData,payload){
        logger.info('Navigating to Utah form submission page...');
        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;

        const queryParams = '?goto=https:%2F%2Flogin.dts.utah.gov:443%2Fsso%2Foauth2%2Fauthorize%3Fclient_id%3Dtautologicalness-nonterm-275011%26redirect_uri%3Dhttps:%2F%2Fbusinessregistration.utah.gov%2FAccount%2FBackFromOpenIdConnect%26scope%3Dopenid%2520profile%2520email%2520phone%2520address%26response_type%3Dcode%26state%3DOnline&realm=%2F';

const encodedUrl = url + queryParams;
console.log(encodedUrl);
         await this.navigateToPage1(page, encodedUrl);

        await this.randomSleep(30000,4000); 
        // await page.waitForNavigation({'waitUntil':'networkidle0', timeout:1000}); 
            
        await this.fillInputByIdSingle(page,"#input_username",data.State.filingWebsiteUsername)
       

        await this.clickButton(page,"#button_login");

        await this.fillInputByIdSingle(page,"#pw_input_1",data.State.filingWebsitePassword)
        await page.click(".submit-btn ")

        await this.randomSleep(3000,5000);
       
        await page.evaluate(() => {
            // Select all the paragraphs inside the "selection-list-item-content" class
            const items = document.querySelectorAll('.selection-list-item-content p');
            
            items.forEach(item => {
              if (item.textContent.startsWith("Email code to")) {
                // Find the parent element of the matching item and trigger a click event
                const parentItem = item.closest('.selection-list-item');
                parentItem.click();
              }
            });
          });

        const response = await axios.post('http://localhost:9501/get-email', {
                                subject: 'UtahID One Time Password' 
                              }); 
        console.log(response)
        console.log(response.data)
        console.log("otp is",response.data);

        await page.waitForSelector('#code', { timeout: 60000 });
        await this.fillInputByIdSingle(page,"#code",response.data); 

        await page.waitForSelector('#button_login');
        await page.click('#button_login');
 await this.randomSleep(10000,30000);
      await this.clickButton(page,"#reload-button");
      await this.randomSleep(20000,30000);

                await page.waitForSelector('#Formations\\&Registrations',  { visible: true}); 
                await page.click('#Formations\\&Registrations');        
                
                await page.waitForSelector('#DomesticFormations')  // Increase timeout to 60 seconds
                await page.click('#DomesticFormations');

                await page.waitForSelector('#CreateBusiness_Index_ddlEntityType')
                await page.select('#CreateBusiness_Index_ddlEntityType', '10104');
                await page.waitForSelector('#btnSubmit, #btnNext');

    await page.evaluate(() => {
        const btn = document.querySelector('#btnSubmit, #btnNext');
        if (btn) {
            btn.click();
        }
    });
                
                await this.randomSleep(20000,30000);


                await page.waitForSelector('#btnSubmit, #btnNext');

                await page.evaluate(() => {
                    const btn = document.querySelector('#btnSubmit, #btnNext');
                    if (btn) {
                        btn.click();
                    }
                });

                await this.fillInputByName(page, 'EntityName', payload.Name.Legal_Name);


                await page.waitForSelector('#DocumentProcessingSteps_SharedSteps_NameAvailabilitySearch_btnSearch');
                await page.click('#DocumentProcessingSteps_SharedSteps_NameAvailabilitySearch_btnSearch');

                await this.clickButton(page,"#btnSubmit")
                await page.waitForSelector('#chkNameConsentandReleaseForm');
                await page.click('#chkNameConsentandReleaseForm');

                await this.clickButton(page,"#btnSubmit")
                await this.fillInputByName(page, 'BusinessAddress_AddressLine1TextBox', payload.Principal_Address.Street_Address);
                await this.fillInputByName(page, 'BusinessAddress_AddressLine2TextBox', payload.Principal_Address['Address_Line_2']  || " ");
                await this.fillInputByName(page, 'BusinessAddress_Zip5TextBox', String(payload.Principal_Address.Zip_Code));
                await this.fillInputByName(page, 'BusinessAddress_CityTextBox', payload.Principal_Address.City);
              
                await this.fillInputByName(page, 'MailingAddress_AddressLine1TextBox', payload.Registered_Agent.Mailing_Information.Street_Address);
                await this.fillInputByName(page, 'MailingAddress_AddressLine2TextBox', payload.Registered_Agent.Mailing_Information['Address_Line_2']  || " ");
                await this.fillInputByName(page, 'MailingAddress_Zip5TextBox',String( payload.Registered_Agent.Mailing_Information.Zip_Code));
                await this.fillInputByName(page, 'MailingAddress_CityTextBox', payload.Registered_Agent.Mailing_Information.City );

                await page.waitForSelector('#btnSubmit, #btnNext');

                await page.evaluate(() => {
                    const btn = document.querySelector('#btnSubmit, #btnNext');
                    if (btn) {
                        btn.click();
                    }
                });


            
                await page.waitForSelector('#createAgent');
                await page.click('#createAgent');
 
                const raFullName = payload.Registered_Agent.keyPersonnelName;
                const [firstName, lastName] = await this.ra_split(raFullName); 
                await this.fillInputByName(page, 'createAgentinfo.NameFields.FirstName', firstName);
                await this.fillInputByName(page, 'createAgentinfo.NameFields.LastName',lastName);
                // Mailing Address
                await this.fillInputByName(page, 'createAgentinfo_PrincipalAddress_AddressLine1TextBox',payload.Registered_Agent.Address.Street_Address);
                await this.fillInputByName(page, 'createAgentinfo_PrincipalAddress_AddressLine2TextBox',payload.Registered_Agent.Address['Address_Line_2']|| " ");
                await this.fillInputByName(page, 'createAgentinfo_PrincipalAddress_Zip5TextBox', String(payload.Registered_Agent.Address.Zip_Code));
                await this.fillInputByName(page, 'createAgentinfo_PrincipalAddress_CityTextBox', payload.Registered_Agent.Address.City);
 
                await page.waitForSelector('#btnCreateAgent');
                await page.click('#btnCreateAgent');
 
                await page.waitForSelector('#btnSelectRegisterAgent');
                await page.click('#btnSelectRegisterAgent');

                await page.waitForSelector('#btnSubmit, #btnNext');

                await page.evaluate(() => {
                    const btn = document.querySelector('#btnSubmit, #btnNext');
                    if (btn) {
                        btn.click();
                    }
                });

                await page.waitForSelector('#principalInfo_TitleId');
                await page.select('#principalInfo_TitleId', '20'); 

                const OrgfullName =payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
                const [OrgfirstName, OrglastName] = await this.ra_split(OrgfullName);
                await this.fillInputByName(page, 'principalInfo_NameFields_FirstName', OrgfirstName);
                await this.fillInputByName(page, 'principalInfo.NameFields.LastName', OrglastName);
                await this.fillInputByName(page, 'principalInfo_PrincipalAddress_AddressLine1TextBox',   payload.Incorporator_Information.Address.Street_Address);
                await this.fillInputByName(page, 'principalInfo_PrincipalAddress_AddressLine2TextBox',  payload.Incorporator_Information.Address['Address_Line_2'] ||"");
                await this.fillInputByName(page, 'principalInfo_PrincipalAddress_Zip5TextBox', String( payload.Incorporator_Information.Address.Zip_Code));
                await this.fillInputByName(page, 'principalInfo_PrincipalAddress_CityTextBox', payload.Incorporator_Information.Address.City);
 
                await page.waitForSelector('#btnSubmit, #btnNext');

    await page.evaluate(() => {
        const btn = document.querySelector('#btnSubmit, #btnNext');
        if (btn) {
            btn.click();
        }
    });
                await this.randomSleep(20000,40000);
                await this.fillInputByName(page,"Shared_SharesList_TypeOfShare","Common");
                await this.fillInputByName(page,"Shared_SharesList_NumberOfShares",payload.Stock_Details.Number_Of_Shares);
              await this.randomSleep(2000,4000); 
              await this.clickButton(page,"btnAddShare"); 


              await this.randomSleep(2000,4000);
              await page.waitForSelector('#btnSubmit, #btnNext');

    await page.evaluate(() => {
        const btn = document.querySelector('#btnSubmit, #btnNext');
        if (btn) {
            btn.click();
        }
    });

                const fileInput = await page.waitForSelector('img[src*="upload.png"]');
const uploadButton = await fileInput.evaluate(el => el.parentElement);
const [fileChooser] = await Promise.all([
 page.waitForFileChooser(),
 uploadButton.click()
]);
await fileChooser.accept(['path/to/your/file.jpg']);
await this.randomSleep(3000,4000); 




await page.waitForSelector('.ui-dialog-buttonset button');
await page.click('.ui-dialog-buttonset button');

await page.waitForSelector('#btnSubmit, #btnNext');

    await page.evaluate(() => {
        const btn = document.querySelector('#btnSubmit, #btnNext');
        if (btn) {
            btn.click();
        }
    });


await this.randomSleep(40000,60000); 
await page.evaluate(() => document.getElementById('Authorizechkdeclaration').click());
await page.evaluate(() => document.getElementById('chkAdditionalAttenstation17').click());
await this.randomSleep(40000,60000); 

await this.fillInputByName(page,"DocumentProcessingSteps_PartialViews_Electronic_txt",payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
await page.waitForSelector('#DocumentProcessSteps_PartialViews_AdditionalSignatures_button');
await page.click('#DocumentProcessSteps_PartialViews_AdditionalSignatures_button');
await this.randomSleep(40000,60000); 
await page.waitForSelector('#btnSubmit, #btnNext');

    await page.evaluate(() => {
        const btn = document.querySelector('#btnSubmit, #btnNext');
        if (btn) {
            btn.click();
        }
    });





















               
            } catch (error) {
                logger.error(`Failed to navigate to the form page: ${error.message}`);
           }
       }
    
      
    module.exports =UtahForCorp;