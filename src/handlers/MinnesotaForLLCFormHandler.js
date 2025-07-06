const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class MinnesotaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }         
    async MinnesotaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to Minnesota form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            
            await this.navigateToPage(page, url);
            await this.clickOnLinkByText(page, 'Sign In');

            await page.waitForNavigation();
            await page.type('input[placeholder="Email Address"]', data.State.filingWebsiteUsername);
            await page.type('input[placeholder="Password"]', data.State.filingWebsitePassword);

            await page.click('#loginBtn');
            
            await this.clickOnLinkByText(page, 'New Business, Amendment, Annual Renewal or Reinstatement');

            await this.clickOnLinkByText(page, 'Limited Liability Company (Domestic)');

            await page.waitForNavigation();
            await page.click('.btn.btn-primary.pull-right');

            await page.type('input[placeholder="Proposed Business Name"]', payload.Name.Legal_Name);

            await this.clickDropdown(page, '#BusinessNameDesignation', 'Limited Liability Company');
            await page.click('.btn.btn-primary');

            await this.clickOnLinkByText(page, 'File Limited Liability Company (Domestic)');

        
            // const orgname = payload.Organizer_Information.keyPersonnelName;
            // const [first, last] = orgname.split(' ');
        
            // // Fill the input fields by name
            // await page.type('FilingPartyCollections_0__FilingPartyItemCollection_0__FilingParty_Name_First', first); // Fill First Name
            // await page.type('FilingPartyCollections_0__FilingPartyItemCollection_0__FilingParty_Name_Last', last);   // Fill Last Name


            
            const fullName = payload.Organizer_Information.keyPersonnelName;
            console.log(fullName)
            const [firstName, lastName] = fullName.split(' ');
            await this.fillInputByName(page, 'FilingPartyCollections[0].FilingPartyItemCollection[0].FilingParty.Name.First', firstName);
            await this.fillInputByName(page, 'FilingPartyCollections[0].FilingPartyItemCollection[0].FilingParty.Name.Last', lastName);
        
            // const fullName = payload.Organizer_Information.keyPersonnelName;
            // const [firstName, lastName] = fullName.split(' ');
            // await this.fillInputByName(page, 'FilingPartyCollections[0].FilingPartyItemCollection[0].FilingParty.Name.First', firstName);
            // await this.fillInputByName(page, 'FilingPartyCollections[0].FilingPartyItemCollection[0].FilingParty.Name.Last', lastName);

            await page.type('input[placeholder="Address 1"]', payload.Organizer_Information.Address.Street_Address);
            await page.type('input[placeholder="Address 2"]', payload.Organizer_Information.Address['Address_Line_2']  || " ");
            await page.type('input[placeholder="City"]', payload.Organizer_Information.Address.City);
            await page.type('input[placeholder="Zip Code"]', String(payload.Organizer_Information.Address.Zip_Code));

            await page.click('[data-maxaddableparties]');

            // Selector for the button (you can use its text or class name)
            const buttonSelector = 'a.btn[onclick*="changeAddressAfterValidation"]'; 
            await page.waitForSelector(buttonSelector);
            await page.click(buttonSelector);



            // Selector for the "Next" button
            const nextButtonSelector = 'a.nextSection.btn.btn-primary.pull-right[data-action="next"]';
            await page.waitForSelector(nextButtonSelector);
            await page.click(nextButtonSelector);            
            // Click the button
            await this.clickButtonByText(page, 'Add Registered Agent');
            //reg Agent
            const RegName = payload.Registered_Agent.keyPersonnelName;
            const [firstN, lastN] = await this.ra_split(RegName);
            await page.waitForSelector('div#sect_1');

            await this.fillInputByName(page, 'FilingPartyCollections[1].FilingPartyItemCollection[1].FilingParty.Name.First', firstN);
            await this.fillInputByName(page, 'FilingPartyCollections[1].FilingPartyItemCollection[1].FilingParty.Name.Last', lastN);
            await this.clickButtonByText(page, 'Save Registered Agent');

            // Now click the "Next" button in the "Add Registered Agents" section
            await page.waitForSelector('div#sect_1 a[data-action="next"]');
            await page.click('div#sect_1 a[data-action="next"]');

            // Confirm that the "Next" button was clicked
            console.log("Next button clicked successfully after adding Registered Agent.");
          
            

                        // Fill Address Line 1
            await page.$eval('input[name="Parties[0].FilingParty.Address.Address1"]', (el, value) => el.value = value, payload.Registered_Agent.Address.Street_Address);

            // Fill Address Line 2
            await page.$eval('input[name="Parties[0].FilingParty.Address.Address2"]', (el, value) => el.value = value, payload.Registered_Agent.Address['Address_Line_2']  || " ");

            // Fill City Name
            await page.$eval('input[name="Parties[0].FilingParty.Address.CityName"]', (el, value) => el.value = value, payload.Registered_Agent.Address.City);

            // Fill Postal Code
            await page.$eval('input[name="Parties[0].FilingParty.Address.PostalCode"]', (el, value) => el.value = value, payload.Registered_Agent.Address.Zip_Code);

            // Log confirmation
            console.log("Address fields filled successfully.");

            const clickResult = await page.evaluate(() => {
                // Find all divs with the savedState and active classes
                const savedStateDivs = document.querySelectorAll('div.savedState.active[data-btngroup="saved"]');
                
                // Iterate through the divs to find the correct "Add Registered Agent" button
                for (const div of savedStateDivs) {
                  const button = div.querySelector('a.AddCollectionItem[data-trigger="add-party"]');
                  
                  if (button && button.innerText.trim() === 'Add Registered Agent') {
                    button.click();
                    
                    return { 
                      success: true, 
                      message: 'Registered Agent button clicked successfully',
                      buttonText: button.innerText.trim(),
                      parentDivFound: true
                    };
                  }
                }
                
                // If no matching button found
                return { 
                  success: false, 
                  message: 'Add Registered Agent button not found',
                  parentDivFound: false
                };
              });
          
              // Log the result of the click
              console.log(clickResult);
              const clickResults = await page.evaluate(() => {
                // Find the Next button with specific data-action, class, and tabindex
                const nextButton = document.querySelector('a[data-action="next"].nextSection.btn.btn-primary[tabindex="11"]');
                
                if (nextButton) {
                  nextButton.click();
                  
                  return { 
                    success: true, 
                    message: 'Next section button clicked successfully',
                    buttonText: nextButton.innerText.trim(),
                    buttonClasses: nextButton.className,
                    tabIndex: nextButton.getAttribute('tabindex')
                  };
                }
                
                // If button not found
                return { 
                  success: false, 
                  message: 'Next section button with tabindex 8 not found'
                };
              });
          
              // Log the result of the click
              console.log(clickResults);


                        // Wait for the button to be available in the DOM
            await page.waitForSelector('a.btn[onclick^="changeAddressAfterValidation"]');

            // Click the button
            await page.click('a.btn[onclick^="changeAddressAfterValidation"]');

            // Log confirmation
            console.log("Button with 'Use as Entered' clicked successfully.");

            const clickResultsss = await page.evaluate(() => {
                // Find the Next button with specific data-action, class, and tabindex
                const nextButton = document.querySelector('a[data-action="next"].nextSection.btn.btn-primary[tabindex="8"]');
                
                if (nextButton) {
                  nextButton.click();
                  
                  return { 
                    success: true, 
                    message: 'Next section button clicked successfully',
                    buttonText: nextButton.innerText.trim(),
                    buttonClasses: nextButton.className,
                    tabIndex: nextButton.getAttribute('tabindex')
                  };
                }
                
                // If button not found
                return { 
                  success: false, 
                  message: 'Next section button with tabindex 8 not found'
                };
              });
          
              // Log the result of the click
              console.log(clickResultsss);
              const res = "form filled successfully";
              return res
              

              


              


           

        } catch (error) {
            logger.error(`Failed to navigate to the form page: ${error.message}`);
        }
    }
    async clickButtonByText(page, buttonText) {
        try {
            // Use page.evaluate to find and click the button based on its text content
            await page.evaluate((buttonText) => {
                const buttons = Array.from(document.querySelectorAll('a.btn'));
                const targetButton = buttons.find(button => button.textContent.trim() === buttonText);
    
                if (targetButton) {
                    targetButton.click();
                    console.log(`Clicked button with text: ${buttonText}`);
                } else {
                    console.error(`Button with text "${buttonText}" not found.`);
                }
            }, buttonText);
        } catch (error) {
            console.error(`Error clicking button with text "${buttonText}":`, error);
        }
    }
        
    
    
}
  
module.exports = MinnesotaForLLC;
