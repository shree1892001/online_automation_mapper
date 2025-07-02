const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');

class MinnesotaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }         
    async MinnesotaForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to Minnesota form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            console.log(payload)
            
            await this.navigateToPage(page, url);
            await this.clickOnLinkByText(page, 'Sign In');

            await page.waitForNavigation();
            await page.type('input[placeholder="Email Address"]', data.State.filingWebsiteUsername);
            await page.type('input[placeholder="Password"]', data.State.filingWebsitePassword);

            await page.click('#loginBtn');
            
            await this.clickOnLinkByText(page, 'New Business, Amendment, Annual Renewal or Reinstatement');

            await this.clickOnLinkByText(page, 'Business Corporation (Domestic)');

            await page.waitForNavigation();
            await page.click('.btn.btn-primary.pull-right');

            await page.type('input[placeholder="Proposed Business Name"]', payload.Name.Legal_Name);

            await this.clickDropdown(page, '#BusinessNameDesignation', 'Corporation');
            await page.click('.btn.btn-primary');

            await this.clickOnLinkByText(page, 'File Business Corporation (Domestic)');

        
            const fullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            console.log(fullName)
            const [firstName, lastName] = fullName.split(' ');
            await this.fillInputByName(page, 'FilingPartyCollections[0].FilingPartyItemCollection[0].FilingParty.Name.First', firstName);
            await this.fillInputByName(page, 'FilingPartyCollections[0].FilingPartyItemCollection[0].FilingParty.Name.Last', lastName);

            await page.type('input[placeholder="Address 1"]', payload.Incorporator_Information.Address.Street_Address);
            await page.type('input[placeholder="Address 2"]', payload.Incorporator_Information.Address['Address_Line_2']  || " ");
            await page.type('input[placeholder="City"]', payload.Incorporator_Information.Address.City);
            await page.type('input[placeholder="Zip Code"]', String(payload.Incorporator_Information.Address.Zip_Code));


            
            await new Promise(resolve => setTimeout(resolve, 2000))

            await page.click('[data-maxaddableparties]');

            // Selector for the button (you can use its text or class name)
            const buttonSelector = 'a.btn[onclick*="changeAddressAfterValidation"]'; 
            await page.waitForSelector(buttonSelector);
            await page.click(buttonSelector);

            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Selector for the "Next" button
            const nextButtonSelector = 'a.nextSection.btn.btn-primary.pull-right[data-action="next"]';
            await page.waitForSelector(nextButtonSelector);
            await page.click(nextButtonSelector);

            // Registered agent

            // await page.waitForSelector(addRegisteredAgentSelector);

            // // Click the "Add Registered Agent" button
            // await page.click(addRegisteredAgentSelector);
            
            // // Selector for the "Add Registered Agent" button
            // await this.click('.btn.AddCollectionItem');


            await this.randomSleep(1000,7000)
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
            

            // await page.waitForSelector(addRegisteredAgentSelector);

            // // Click the "Add Registered Agent" button
            // await page.click(addRegisteredAgentSelector);
            
             //reg Agent
            const RegName = payload.Registered_Agent.keyPersonnelName;
            const [firstN, lastN] = await this.ra_split(RegName);
            await this.fillInputByName(page, 'FilingPartyCollections[1].FilingPartyItemCollection[1].FilingParty.Name.First', firstN);
            await this.fillInputByName(page, 'FilingPartyCollections[1].FilingPartyItemCollection[1].FilingParty.Name.Last', lastN);
            await this.clickOnLinkByText(page, 'Save Registered Agent');

            const clickResults = await page.evaluate(() => {
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
              console.log(clickResults);


            //   Address Line 1
              const inputSelector = '#Parties_0__FilingParty_Address_Address1';
              await page.waitForSelector(inputSelector);
          
              // Fill the input field
              await page.type(inputSelector,payload.Registered_Agent.Address.Street_Address);


              const inputSelector1 = '#Parties_0__FilingParty_Address_Address2';
              await page.waitForSelector(inputSelector1);
          
              // Fill the input field
              await page.type(inputSelector,payload.Registered_Agent.Address['Address_Line_2']  || " ");

            //   City 

              const inputSelectors = '#Parties_0__FilingParty_Address_CityName';
    
              // Wait for the input selector to be available
              await page.waitForSelector(inputSelectors);
              
              // Fill the input field with data
              await page.type(inputSelectors, payload.Registered_Agent.Address.City);


            //   Zip 
              const inputSelectorss = '#Parties_0__FilingParty_Address_PostalCode';
    
              // Wait for the input selector to be available
              await page.waitForSelector(inputSelectorss);
              
              // Fill the input field with data
              await page.type(inputSelectorss, String(payload.Registered_Agent.Address.Zip_Code));
              await page.evaluate(() => {
                          document.querySelector('[data-action="next"]').click();
                      });



              const clickResultss = await page.evaluate(() => {
                // Find the "Next" button by its tabindex attribute
                const nextButton = document.querySelector('a[tabindex="11"].nextSection.btn.btn-primary.pull-right');
                
                if (nextButton) {
                    nextButton.click(); // Click the button
                    
                    return { 
                        success: true, 
                        message: 'Next button clicked successfully using tabindex',
                        buttonText: nextButton.innerText.trim(),
                        buttonClasses: nextButton.className,
                        tabIndex: nextButton.getAttribute('tabindex'),
                        href: nextButton.getAttribute('href') || 'No href attribute'
                    };
                }
                
                // If button not found
                return { 
                    success: false, 
                    message: 'Next button with tabindex="11" not found'
                };
            });
            
            // Log the result of the click
            console.log(clickResultss);
            
            await page.waitForSelector(buttonSelector);
            await page.click(buttonSelector);





              await new Promise(resolve => setTimeout(resolve, 15000))

              await page.evaluate(() => {
                document.querySelector('[data-action="next"]').click();
            });

              
            // mailing add
            // Address Line 1
            // const inputSelectorr = '#Parties_1__FilingParty_Address_Address1';

            // // Wait for the input field to be present in the DOM
            // await page.waitForSelector(inputSelectorr);

            // // Fill the input field with the value from your data
            // await page.type(inputSelectorr, payload.Registered_Agent.Mailing_Information.Street_Address);

            // console.log("Address Line 1 filled successfully.")

            
            // // City
            // // Selector for the City input field
            // const cityInputSelector = '#Parties_1__FilingParty_Address_CityName';

            // // Wait for the City input field to be present in the DOM
            // await page.waitForSelector(cityInputSelector);

            // // Fill the City input field with the value from your data
            // await page.type(cityInputSelector, payload.Registered_Agent.Mailing_Information.City);

            // // Log the action for confirmation
            // console.log("City Name filled successfully.");

            // // Postal Code

            // // Selector for the Zip Code input field
            // const zipInputSelector = '#Parties_1__FilingParty_Address_PostalCode';

            // // Wait for the Zip Code input field to be present in the DOM
            // await page.waitForSelector(zipInputSelector);

            // // Fill the Zip Code input field with the value from your data
            // await page.type(zipInputSelector, payload.Registered_Agent.Mailing_Information.Zip_Code);

            // // Log the action for confirmation
            // console.log("Zip Code filled successfully.");


            const sharesInputSelector = '#NumberOfShares_NumberOfShares';

            // Wait for the Number of Shares input field to be present in the DOM
            await page.waitForSelector(sharesInputSelector);

            // Fill the Number of Shares input field with the value from your data
            await page.type(sharesInputSelector, payload.Stock_Details.Number_Of_Shares);

            // Log the action for confirmation
            console.log("Number of Shares filled successfully.");







            await page.type('input[placeholder="Parties[1].FilingParty.Address.Address1"]', payload.Principal_Address.Street_Address);
            await page.type('input[placeholder="Address 2"]', payload.Name.Principal_Address.PA_Address_Line_2  || " ");
            await page.type('input[placeholder="Parties[1].FilingParty.Address.CityName"]', payload.Principal_Address.City);
            await page.type('input[placeholder="Parties[1].FilingParty.Address.RegionCode"]', payload.Principal_Address.State);
            await page.type('input[placeholder="Parties[1].FilingParty.Address.PostalCode"]', String(payload.Principal_Address.Zip_Code));

            // Selector for the "Next" button
            const neButtonSelector = 'a.nextSection.btn.btn-primary.pull-right[data-action="next"]';
            await page.waitForSelector(neButtonSelector);
            await page.click(neButtonSelector);
            const res = "form filled successfully";
            return res

            // //No of Shares
            // await page.type('input[placeholder="Number of Shares"]', payload.Name.Stock_Details.SI_Number_Of_Shares);

            //  // Selector for the "Next" button
            //  const nButtonSelector = 'a.nextSection.btn.btn-primary.pull-right[data-action="next"]';
            //  await page.waitForSelector(nButtonSelector);
            //  await page.click(nButtonSelector);


        } catch (error) {
            logger.error(`Failed to navigate to the form page: ${error.message}`);
        }
    }
}
  
module.exports = MinnesotaForCORP;
