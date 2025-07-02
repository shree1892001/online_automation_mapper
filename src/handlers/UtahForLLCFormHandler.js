const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const axios = require('axios');

class UtahForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async UtahForLLC(page, jsonData,payload){
        logger.info('Navigating to Vermont form submission page...');
        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;

        const queryParams = '?goto=https:%2F%2Flogin.dts.utah.gov:443%2Fsso%2Foauth2%2Fauthorize%3Fclient_id%3Dtautologicalness-nonterm-275011%26redirect_uri%3Dhttps:%2F%2Fbusinessregistration.utah.gov%2FAccount%2FBackFromOpenIdConnect%26scope%3Dopenid%2520profile%2520email%2520phone%2520address%26response_type%3Dcode%26state%3DOnline&realm=%2F';

const encodedUrl = url + queryParams;
console.log(encodedUrl);
         await this.navigateToPage1(page, encodedUrl);
        // await page.waitForNavigation({ waitUntil: 'networkidle0' });
        // await this.randomSleep(10000,3000); 

        await this.fillInputByIdSingle(page,"#input_username",data.State.filingWebsiteUsername)
       

        await this.clickButton(page,"#button_login");

        await this.fillInputByIdSingle(page,"#pw_input_1",data.State.filingWebsitePassword)
        await page.click(".submit-btn ")

        await page.waitForSelector('.selection-list-item-cover', { visible: true, timeout: 60000 });
        await page.click('.selection-list-item-cover');

        await this.randomSleep(30000,50000);
       
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

           await page.waitForNavigation({waitUntil:'networkidle0'});

      //   await page.waitForSelector('#Formations\\&Registrations', { visible: true });
      //  await page.click('#Formations\\&Registrations');
      
  await this.clickButton(page,"#reload-button");


  await this.randomSleep(20000,30000);

  await page.waitForSelector('#Formations\\&Registrations',  { visible: true}); 
  await page.click('#Formations\\&Registrations');      

    // Optional: Wait for the content to collapse or expand after clicking (adjust selector as needed)
    // await page.waitForSelector('#340', { visible: true, timeout: 5000 });  

  await this.randomSleep(10000,3000);
    // await page.waitForNavigation({waitUntil:'networkidle0'}); 
    
    
  

 
  // // Verify the expanded state
  // const isExpanded = await page.$eval(
  //   '.title-nav#Formations\\&Registrations',
  //   el => el.getAttribute('aria-expanded') === 'true'
  // );

                 await page.waitForSelector('#DomesticFormations')  // Increase timeout to 60 seconds
                 await page.click('#DomesticFormations');
                // await this.clickButton(page,"#reload-button");

                // await page.waitForSelector('option[value="7"]', { visible: true, timeout: 60000 }); // Wait up to 60 seconds
                // await page.select('#CreateBusiness_Index_ddlEntityType', '7');
              await page.waitForSelector('#CreateBusiness_Index_ddlEntityType', { visible: true, timeout: 60000 });

              // Scroll the dropdown into view
              await page.evaluate(() => {
                const dropdown = document.querySelector('#CreateBusiness_Index_ddlEntityType');
                dropdown.scrollIntoView();
              });

              // Now select the value "7"
              await page.select('#CreateBusiness_Index_ddlEntityType', '7');

                
             

                
                // Click the button
                  
                await page.waitForSelector('#btnSubmit, #btnNext');

    await page.evaluate(() => {
        const btn = document.querySelector('#btnSubmit, #btnNext');
        if (btn) {
            btn.click();
        }
    });

               
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

               // await page.waitForSelector('#btnNext');
               // await page.click('#btnNext');

              //  await page.waitForSelector('#chkNameConsentandReleaseForm', { visible: true });
              //  await page.click('#chkNameConsentandReleaseForm');


              await page.waitForSelector('#btnSubmit, #btnNext');

    await page.evaluate(() => {
        const btn = document.querySelector('#btnSubmit, #btnNext');
        if (btn) {
            btn.click();
        }
    });
    await page.evaluate(() => {
      const btn = document.querySelector('#btnSubmit, #btnNext');
      if (btn) {
          btn.click();
      }
  });
    await page.evaluate(() => {
      const btn = document.querySelector('#btnSubmit, #btnNext');
      if (btn) {
          btn.click();
      }
  });

               await this.fillInputByName(page, 'BusinessAddress_AddressLine1TextBox', payload.Principal_Address.Street_Address);
               await this.fillInputByName(page, 'BusinessAddress_AddressLine2TextBox', payload.Principal_Address['Address_Line_2']  || " ");
               await this.fillInputByName(page, 'BusinessAddress_Zip5TextBox', String(payload.Principal_Address.Zip_Code));
               await this.fillInputByName(page, 'BusinessAddress_CityTextBox', payload.Principal_Address.City);

               await this.randomSleep(10000,20000);
             
               await this.fillInputByName(page, 'MailingAddress_AddressLine1TextBox', payload.Registered_Agent.Mailing_Information.Street_Address);
               await this.fillInputByName(page, 'MailingAddress_AddressLine2TextBox', payload.Registered_Agent.Mailing_Information['Address_Line_2']  || " ");
               await this.fillInputByName(page, 'MailingAddress_Zip5TextBox',String( payload.Registered_Agent.Mailing_Information.Zip_Code));
               await page.waitForSelector('#Shared_AddressFields_CityDropDownMailing', { visible: true, timeout: 60000 });

               
               await page.click('#Shared_AddressFields_CityDropDownMailing');
              
               await page.select('#Shared_AddressFields_CityDropDownMailing', "Parker Xroads");

            
               await page.waitForSelector('#btnNext');
               await page.click('#btnNext');

               await page.waitForSelector('#createAgent');
               await page.click('#createAgent');

               const raFullName = payload.Registered_Agent.keyPersonnelName;
               const [firstName, lastName] = raFullName.split(' ');
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

               await page.waitForSelector('#btnNext');
               await page.click('#btnNext');


               await page.waitForSelector('#principalInfo_TitleId');
               await page.select('#principalInfo_TitleId', '21');


               const OrgfullName = payload.Organizer_Information.keyPersonnelName;
               const [OrgfirstName, OrglastName] = OrgfullName.split(' ');
               await this.fillInputByName(page, 'principalInfo_NameFields_FirstName', OrgfirstName);
               await this.fillInputByName(page, 'principalInfo.NameFields.LastName', OrglastName);
               await this.fillInputByName(page, 'principalInfo_PrincipalAddress_AddressLine1TextBox',   payload.Organizer_Information.Address.Street_Address);
               await this.fillInputByName(page, 'principalInfo_PrincipalAddress_AddressLine2TextBox',   payload.Organizer_Information.Address['Address_Line_2'] ||"");
               await this.fillInputByName(page, 'principalInfo_PrincipalAddress_Zip5TextBox', String( payload.Organizer_Information.Address.Zip_Code));
               await this.fillInputByName(page, 'principalInfo_PrincipalAddress_CityTextBox', payload.Organizer_Information.Address.City);

               await page.waitForSelector('#btnNext');
               await page.click('#btnNext');


               await page.waitForSelector('img[src="/Themes/Default/images/upload.png"]', { visible: true });

              // Find the file input element (assuming the image triggers it)
              const fileInputSelector = 'input[type="file"]';

              // Wait for the file input element to appear on the page
              await page.waitForSelector(fileInputSelector, { visible: true });

              // Upload the file
              const filePath = path.resolve(__dirname, "C:/Users/Redberyl/Downloads/git-cheat-sheet-education.pdf");  // Replace with your actual file path
              await page.uploadFile(fileInputSelector, filePath);


              // Wait for the button to be visible
              await page.waitForSelector('button[type="button"]', { visible: true });

              // Click the button with the text 'OK'
              await page.click('button[type="button"]:text("OK")');

              await page.waitForSelector('#btnNext');
              await page.click('#btnNext');


              await page.waitForSelector('#Authorizechkdeclaration', { visible: true });
              await page.click('#Authorizechkdeclaration');

              await page.waitForSelector('#chkAdditionalAttenstation3', { visible: true });
              await page.click('#chkAdditionalAttenstation3');

        await this.fillInputByName(page, 'principalInfo_NameFields_FirstName',  payload.Organizer_Information.keyPersonnelName);

        await page.waitForSelector('#DocumentProcessSteps_PartialViews_AdditionalSignatures_button', { visible: true });
        await page.click('#DocumentProcessSteps_PartialViews_AdditionalSignatures_button');

        await page.waitForSelector('#btnNext');
        await page.click('#btnNext');




               



                  

              

              
                
        


  // This matches the "Next" button by its text content

//   await page.waitForSelector('body > app-root > app-content-layout > mat-sidenav-container > mat-sidenav > div > app-nav-list > mat-nav-list > app-nav-list-item:nth-child(2) > mat-list-item > span > span');

//   // Click on the element
//   await page.click('body > app-root > app-content-layout > mat-sidenav-container > mat-sidenav > div > app-nav-list > mat-nav-list > app-nav-list-item:nth-child(2) > mat-list-item > span > span');

//   await page.goto('https://your-website-url.com');  // Replace with your actual URL

//   // Wait for the <span> with the text "Business" and click it
//   await page.click('span.mdc-list-item__content >> text="Business"');
        
// //         await this.fillInputByName(page, 'txtUsername', data.State.filingWebsiteUsername);
//         await this.fillInputByName(page, 'txtPassword', data.State.filingWebsitePassword);
//         await page.click('#btnSave');

//         await page.click('a[href="javascript:;"] img[src="/Themes/Online/vt/images/icon_nav2.png"]');
//         await page.click('a[href="/online/BusinessFormation/IndexRedirect"]');
//         await page.click('#rdbDomestic');

//         // Dropdown
//         await page.select('#typestock', 'LLC-1')
//         await page.select('#domesticLLC', 'DLLC');

//         await this.fillInputByName(page, 'BusinessName', payload.Name.Legal_Name);

//         await this.fillInputByName(page, 'NameChioce1', payload.Name.Alternate_Legal_Name);

//         // NAICS Code
//         await page.select('#ddlBusinessPurpose', '52-Finance and Insurance');

//         await new Promise(resolve => setTimeout(resolve, 3000))

//         await page.select('#ddlNAICSSubCode', '522110');

//         // Designated Office address

//         await this.fillInputByName(page, 'PrincipalOfficeAddress.StreetAddress1', payload.Principal_Address.Street_Address);
//         await this.fillInputByName(page, 'PrincipalOfficeAddress.StreetAddress2', payload.Principal_Address['Address_Line_2']  || " ");

//         await this.fillInputByName(page, 'PrincipalOfficeAddress.City', payload.Principal_Address.City);
//         await this.fillInputByName(page, 'PrincipalOfficeAddress.Zip', payload.Principal_Address.Zip_Code);
        
        

//         // Mailing address
//         await page.click('#isSameAsPrincipalAddr');

//         await page.click('#btnContinue'); 


//         // Business Email
//         await this.fillInputByName(page, 'BusinessEmail', payload.Registered_Agent.Name.Email);

//         await page.click('#btnCreateAgent'); 

//         await this.fillInputByName(page, 'txtagentName', payload.Registered_Agent.keyPersonnelName);

//         await page.select('#ddlagentType', 'I'); 

//         await new Promise(resolve => setTimeout(resolve, 3000))

//         await this.fillInputByName(page, 'txtbusinessAddressStreet1', payload.Registered_Agent.Address.Street_Address);
//         await this.fillInputByName(page, 'txtbusinessAddressStreet2', payload.Registered_Agent.Address.Address_Line_2  || " ");

//         await this.fillInputByName(page, 'txtbusinessAddressCity', payload.Registered_Agent.Address.City);
//         await this.fillInputByName(page, 'txtbusinessAddressZip5', payload.Registered_Agent.RA_Address.RA_Zip_Code);
        
//         await page.click('#chkSameAsPrinc');
//         await page.click('#btnAssignAgent');

//         await new Promise(resolve => setTimeout(resolve, 3000))

//         await this.fillInputByName(page, 'ChangedAgentEmail', payload.Registered_Agent.Name.Email);

//         await this.fillInputByName(page, 'AuthorizerSignature', payload.Registered_Agent.keyPersonnelName);
//         await this.fillInputByName(page, 'AuthorizerTitle', payload.Organizer_Information.keyPersonnelName);

//         await page.click('#btnAuthContinue');
        
        
//             // Additional form handling code here
      } catch (error) {
            logger.error(`Failed to navigate to the form page: ${error.message}`);
       }
   }

  
module.exports =UtahForLLC;
