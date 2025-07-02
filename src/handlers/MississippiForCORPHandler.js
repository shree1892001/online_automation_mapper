const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class MississippiForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async MississippiForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            const inputFields = [
                { label: 'ctl00_ContentPlaceHolder1_PortalPageControl1_ctl16_userNameTextBox', value: data.State.filingWebsiteUsername },
                { label: 'ctl00_ContentPlaceHolder1_PortalPageControl1_ctl16_passwordTextBox', value: data.State.filingWebsitePassword }
            ];
            await this.addInput(page,inputFields);
            await this.clickButton(page,'#ctl00_ContentPlaceHolder1_PortalPageControl1_ctl16_loginButton');
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_PortalPageControl1_ctl24_ActionPageControl1_actionsRepeater_ctl00_actionLink', { visible: true });
            await page.click('#ctl00_ContentPlaceHolder1_PortalPageControl1_ctl24_ActionPageControl1_actionsRepeater_ctl00_actionLink');
            await this.waitForTimeout(10000)
            await page.waitForSelector('#FormationBusinessDropdownDiv', { visible: true }, { timeout: 60000 });
            // Click the div element
            await page.click('#FormationBusinessDropdownDiv');

            const optionText = 'Profit Corporation'; // Replace with the actual text of the option
          
            await page.evaluate((optionText) => {
              const options = [...document.querySelectorAll('#BusinessType_listbox li')]; // Get list of all options
              console.log('Options Found:', options); // Logging for debugging
              
              // Find option containing the text
              const option = options.find(el => el.innerText.includes(optionText)); 
              
              if (option) {
                option.click();  // Click the found option
              } else {
                console.error('Option not found');
              }
            }, optionText);
          
            // Optional: Verify that the correct option is selected
            const selectedValue = await page.evaluate(() => document.querySelector('#BusinessType').value);
            console.log('Selected Value:', selectedValue);
          
            
            const businessNameInput = [
              { label: 'FormationBusinessNameText', value: payload.Name.Legal_Name}
              ];
              await this.addInput(page, businessNameInput);
          //   await this.tryAlternate(
          //     page, 
          //     "#FormationBusinessNameText",  // selector2
          //     "#submitButton",  // selector1
          //     //"#MainContent_btnCheckName",  // nextbtnSelec
          //     payload.Name.CD_Alternate_CORP_Name
            
          // );





          // const nameInvalid = await page.evaluate(() => {
          //   const errorMessage = document.querySelector('#BusinessNameUnavailable');
          //   return errorMessage !== null;  // Returns true if any error message is present
          // });
    
          // if (nameInvalid) {
          //   await page.evaluate(()=>{
          //   const textarea = document.querySelector("#FormationBusinessNameText");
          //       if (textarea) {
          //           textarea.value = '';
          //       }
          //         });
          //   await page.waitForSelector('#BusinessNameUnavailable', { timeout: 10000 });
          //   await this.fillInputByName(page,"BusinessName",payload.Name.Alternate_Legal_Name)
    
            
          // }else{
          //   await this.fillInputByName(page,"BusinessName",payload.Name.Legal_Name)


          // }
    
        // logger.info('Filled all input fields successfully.');
        // await page.waitForSelector('#submitButton', { visible: true, timeout: 5000 });
        // await this.clickButton(page, '#submitButton'); 

            const registerAgentFields = [
                {label:'BusinessEmail',value: payload.Incorporator_Information.Email_Address },
                
            ];
            await this.addInput(page,registerAgentFields);
            await page.waitForSelector('a.k-button.k-button-icontext.k-grid-add');
            // Click the button with the class "k-button k-button-icontext k-grid-add"
            await page.click('a.k-button.k-button-icontext.k-grid-add');

            await this.waitForTimeout(3000)

            await page.waitForSelector('.k-list-container ul li'); // Wait for the list container and list items

            // Select the option "common" from the dropdown list
            await page.evaluate(() => {
              // Grab all the list items inside the dropdown
              let options = [...document.querySelectorAll('.k-list-container ul li')];
              // Find the option with the text "common"
              let commonOption = options.find(option => option.textContent.trim() === 'Common');

              // If the option is found, click on it
              if (commonOption) {
                commonOption.click();
              }
          });
         
           await this.fillInputByName(page, 'NumberShares', payload.Stock_Details.Number_Of_Shares); 
           await page.waitForSelector('a.k-button.k-primary.k-grid-update');
           await page.click('a.k-button.k-primary.k-grid-update');
           await new Promise(resolve => setTimeout(resolve, 5000))
            await this.fillInputByName(page, 'NAICSEntry0.NAICSCode', payload.Naics_Code.CD_NAICS_Code); 
            const rafullname = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;;
            const [firstName, lastName] = await this.ra_split(rafullname);
            await this.fillInputByName(page, 'RegisteredAgent.NameFirstName', firstName);
            await this.waitForTimeout(3000)
            await this.fillInputByName(page, 'RegisteredAgent.NameLastName', lastName);
            logger.info('FoRm submission complete fot Michigan LLC')  
                
                const registerfields =[{label:'RegisteredAgent_AddressAddressLine1', value: payload.Registered_Agent.Address.Street_Address},
                  {label:'RegisteredAgent_AddressAddressLine2', value: payload.Registered_Agent.Address['Address_Line_2']  || " "},
                                        {label: 'RegisteredAgent_AddressCity', value: payload.Registered_Agent.Address.City},
                                        {label: 'RegisteredAgent_AddressPostalCode', value: String( payload.Registered_Agent.Address.Zip_Code)},
                                        {label: 'RegisteredAgent_EmailAddress', value: payload.Registered_Agent.EmailId}
                ];
                await this.addInput(page,registerfields);
                try {
                  await page.waitForSelector('a[href="/forms_Prod/BusinessServices/OfficerModel/Read?SignatureNamesViewModel-mode=insert"]', {
                    visible: true,
                    timeout: 5000
                  });
                  
                  await page.click('a[href="/forms_Prod/BusinessServices/OfficerModel/Read?SignatureNamesViewModel-mode=insert"]');
                  console.log('Clicked using href selector');
                } catch (error) {
                  console.log('First attempt failed, trying alternative methods...');
                }              
                  // Select 'Incorporator' from the dropdown using the proper selector
                  // await page.locator('span[class="k-i-arrow-60-down"]').click();

    //               await this.clickDropdown(page, 'select[id="PartyTypeTitle_listbox"]', 'Organizer');

    // // Wait for the dropdown span to be available
    // await page.waitForSelector('span.k-input');

    // // Click the dropdown to open it
    // await page.click('span.k-select');

    // // Wait for the dropdown options to appear (adjust this selector based on your actual HTML structure)
    // await page.waitForSelector('.k-list-container'); // This is usually the container for the dropdown options

    // Select the "Member" option (assuming it's inside a list item or similar element)
    // await page.evaluate(() => {
    //     const options = [...document.querySelectorAll('.k-list-container li')]; // Adjust selector if needed
    //     const memberOption = options.find(option => option.textContent.includes('Member'));
    //     if (memberOption) {
    //         memberOption.click(); // Select "Member"
    //     }
    // });
                  await page.waitForSelector('.k-widget.k-dropdown.busta'); // Wait for the dropdown element
                  await page.click('.k-widget.k-dropdown.busta'); // Click the dropdown to open it

                  // Step 2: Wait for the dropdown options to be visible
                  await page.waitForSelector('.k-list-container'); // Adjust the selector if the list container has a different class

                  // Step 3: Select the "Member" option
                  await page.evaluate(() => {
                      // Find the "Member" option in the dropdown
                      const options = [...document.querySelectorAll('.k-list-container li')]; // Replace '.k-list-container li' with the actual selector for the dropdown options
                      const memberOption = options.find(option => option.textContent.includes('Incorporator'));
                      if (memberOption) {
                          memberOption.click(); // Click the "Member" option
                      }
                  });

                  await page.waitForSelector('input[name="NameFirstName"]');
                  const OrgfullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
                  const [OrgfirstName, OrglastName] = await this.ra_split(OrgfullName);
                  await this.fillInputByName(page, 'NameFirstName', OrgfirstName);
                  await this.fillInputByName(page, 'NameLastName', OrglastName);
        
                  await this.fillInputByName(page, 'AddressAddressLine1',payload.Incorporator_Information.Address.Street_Address);
                  await this.fillInputByName(page, 'AddressAddressLine2',payload.Incorporator_Information.Address['Address_Line_2']  || " ");

                  await this.fillInputByName(page,'AddressCity', payload.Incorporator_Information.Address.City );
                  await this.waitForTimeout(3000)

                  // Step 1: Wait for the dropdown with aria-labelledby attribute and click it
                  await page.waitForSelector('[aria-labelledby="AddressState_label"]');
                  await page.click('[aria-labelledby="AddressState_label"]'); // Click the dropdown to open it

                  await page.waitForSelector('.k-list-container ul li', { timeout: 5000 }); // Wait for the dropdown options

                // Step 3: Select the desired option (e.g., "Mississippi")
                await page.evaluate(() => {
                    const options = document.querySelectorAll('.k-list-container ul li');
                    options.forEach(option => {
                        if (option.textContent.includes('Mississippi')) {
                            option.click(); // Select "Mississippi" from the list
                        }
                    });
                });
                
                  await this.fillInputByName(page,'AddressPostalCode',String( payload.Incorporator_Information.Address.Zip_Code));
                  
                  await page.waitForSelector('a.k-grid-update', { visible: true });
                 // Click the "Update" button
                await page.click('a.k-grid-update');
                
                await page.waitForSelector('#submitButton', { timeout: 5000, visible: true }); // Wait for up to 5 seconds for the button to appear

               // Step 2: Click the button
              await page.click('#submitButton');
              const res = "form filled successfully";
              return res





//               
  
    } catch (error) {
        logger.error('Error in Mississippi For CORP form handler:', error.stack);
        throw new Error(`Mississippi For CORP form submission failed: ${error.message}`);
    }
}
}
module.exports = MississippiForCORP;
    



