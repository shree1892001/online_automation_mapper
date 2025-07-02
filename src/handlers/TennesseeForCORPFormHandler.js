const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class TennesseeForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async TennesseeForCORP(page, jsonData,payload){
      logger.info('Navigating to Vermont form submission page...');
      const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
      await this.navigateToPage(page, url);

      await this.fillInputByName(page, 'UserName', data.State.filingWebsiteUsername);
      await this.fillInputByName(page, 'Password', data.State.filingWebsitePassword);

      
      await page.click('#loginButton');

      await page.waitForSelector('input[name="Business Filings"]', { visible: true });
      await page.evaluate(() => {
          const button = document.querySelector('input[name="Business Filings"]');
          if (button) {
              button.click();
          }
      });

      await page.waitForSelector('input[name="Start a Business in Tennessee"]', { visible: true });
      await page.evaluate(() => {
          const button = document.querySelector('input[name="Start a Business in Tennessee"]');
          if (button) {
              button.click();
          }
      });

      // Dropdown entity formation
      await page.waitForSelector('span.k-input-value-text', { visible: true });
      await page.click('span.k-input-value-text');
      await page.waitForSelector('li', { visible: true });

      await page.evaluate(() => {
          const options = Array.from(document.querySelectorAll('li')); 
          const targetOption = options.find(option => option.innerText.trim() === 'For-Profit Corporation');
          if (targetOption) {
              targetOption.click();
          }
      });


      await page.waitForSelector('.noCheckBox', { visible: true });

      await page.evaluate(() => {
          const checkboxes = document.querySelectorAll('.noCheckBox'); 
          checkboxes.forEach(checkbox => {
              if (checkbox.getAttribute('data-val-text') === 'No' && !checkbox.checked) {
                  checkbox.click();
              }
          });
      });
      
      await page.waitForSelector('.k-button-solid-primary', { visible: true });
      await page.click('.k-button-solid-primary');


      await page.waitForSelector('input[name^="BusinessName"]', { visible: true });
      await page.type('input[name^="BusinessName"]', payload.Name.Legal_Name);


      // Fiscal Year Ending Month
      await page.waitForSelector('span[aria-controls^="FiscalYearEnd_"]', { visible: true });
      await page.click('span[aria-controls^="FiscalYearEnd_"]');
      await page.waitForSelector('ul[aria-hidden="false"] li', { visible: true });

      await page.evaluate((fiscalMonth) => {
          const options = Array.from(document.querySelectorAll('ul[aria-hidden="false"] li'));
          const targetOption = options.find(option => option.innerText.trim() === fiscalMonth);
          if (targetOption) {
              targetOption.click();
          }
      }, payload.Fiscal_Year_Ending_Month.FY_Fiscal_Year_Ending_Month); 


      // Principal Address
      await page.waitForSelector('input[name^="PrincipalOfficeAddressLine1"]', { visible: true });
      await page.type('input[name^="PrincipalOfficeAddressLine1"]', payload.Principal_Address.Street_Address);

      await page.waitForSelector('input[name^="PrincipalOfficeCity"]', { visible: true });
      await page.type('input[name^="PrincipalOfficeCity"]', payload.Principal_Address.City);
      
      await page.waitForSelector('input[name^="PrincipalOfficePostalCode"]', { visible: true });
      await page.type('input[name^="PrincipalOfficePostalCode"]', payload.Principal_Address.Zip_Code);

        // Click the dropdown button to open the options
        await page.waitForSelector('span.k-dropdownlist', { visible: true });
        await page.click('span.k-dropdownlist'); 
        await page.waitForSelector('ul[aria-hidden="false"] li', { visible: true });
        await page.evaluate((countyName) => {
            const options = Array.from(document.querySelectorAll('ul[aria-hidden="false"] li'));
            const targetOption = options.find(option => option.innerText.trim() === countyName);
            if (targetOption) {
                targetOption.click();
            }
        }, jsonData.data.County.countyName);

        console.log(`County selected: ${jsonData.data.County.countyName}`);


    // Mailing address same as principal address  
    await page.waitForSelector('input[id^="IsMailingSameAsStreetAddress_"]', { visible: true });
    await page.evaluate(() => {
        const checkbox = document.querySelector('input[id^="IsMailingSameAsStreetAddress_"]');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
            checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
        }
    });

    console.log('Checkbox clicked');

                    //   // Mailing address

                    //   await page.waitForSelector('input[name^="MailingAddressLine1"]', { visible: true });
                    //   await page.type('input[name^="MailingAddressLine1"]', payload.Registered_Agent.Address.Street_Address);

                    //   await page.waitForSelector('input[name^="MailingCity"]', { visible: true });
                    //   await page.type('input[name^="MailingCity"]', payload.Registered_Agent.Address.City);

                    //   await page.waitForSelector('input[name^="MailingPostalCode"]', { visible: true });
                    //   await page.type('input[name^="MailingPostalCode"]', payload.Registered_Agent.Address.Zip_Code);


                    //   await page.waitForSelector('input[name^="BusinessEmail"]', { visible: true });
                    //   await page.type('input[name^="BusinessEmail"]', payload.Registered_Agent.EmailId);


    //Contact email address
    await page.waitForSelector('input[name^="BusinessEmail"]', { visible: true });
    await page.type('input[name^="BusinessEmail"]', payload.Registered_Agent.EmailId);


      // Stock Information
      await page.waitForSelector('input[placeholder*="Number of shares"]', { visible: true });
      await page.type('input[placeholder*="Number of shares"]', payload.Stock_Details.Number_Of_Shares);


      // NAICS Code
      await page.waitForSelector('a.k-button', { visible: true });
      await page.click('a.k-button');

      await page.waitForSelector('input[name="Description"]', { visible: true });
      await page.evaluate((value) => {
          const input = document.querySelector('input[name="Description"]');
          if (input) {
              input.value = ''; 
              input.focus(); 
              input.value = value;
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true })); // Ensure UI updates
          }
      }, payload.Naics_Code.NC_NAICS_Code); // Pass the value
      
      console.log(`Input field filled with value: ${payload.Naics_Code.NC_NAICS_Code}`);
          
            // Pass the value from payload into evaluate()
            // await page.evaluate((naicsCode) => {
            //     const input = document.querySelector('input[name="Number"]');
            //     if (input) {
            //         input.value = naicsCode;
            //         input.dispatchEvent(new Event('input', { bubbles: true })); // Ensures JS events trigger
            //     }
            // }, payload.Naics_Code.NC_NAICS_Code); // Correctly pass the value to evaluate()
            
            // console.log(`Input field filled with value: ${payload.Naics_Code.NC_NAICS_Code}`);
      


      await page.waitForSelector('#searchButton', { visible: true });
      await page.click('#searchButton');


      await new Promise(resolve => setTimeout(resolve, 6000));
      await page.waitForSelector('button[id^="AddItem_"]', { visible: true });

      await page.evaluate(() => {
          const button = document.querySelector('button[id^="AddItem_"]');
          if (button) {
              button.click();
          }
      });
      
      console.log("Button clicked");
      
      // Incorporator Information
      await page.waitForSelector('a.k-button', { visible: true });
      const buttons = await page.$$('a.k-button');
      if (buttons.length > 1) {
          await buttons[1].click();
      } else {
          console.error("Second button not found.");

      }
      const OrgfullName =payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
      console.log(payload.Incorporator_Information.Incorporator_Details.keyPersonnelName)
      await this.randomSleep(10000,30000); 
      const[fname,lname]=await this.ra_split(OrgfullName); 
      await page.waitForSelector('.k-window input[name^="FirstName_"]', { visible: true });
      await page.type('.k-window input[name^="FirstName_"]', fname, { delay: 100 });

      await page.waitForSelector('.k-window input[name^="LastName_"]', { visible: true });
      await page.type('.k-window input[name^="LastName_"]', lname, { delay: 100 });

      // Address Checkbox
      await page.waitForSelector('input[id^="UsePrincipalAddressoftheOrganization_"][id$="_YesNoCheckBoxNo"]', { visible: true });
        await page.click('input[id^="UsePrincipalAddressoftheOrganization_"][id$="_YesNoCheckBoxNo"]');

        // Address

        const address = payload.Incorporator_Information.Address.Street_Address;
        await page.waitForSelector('.k-window input[name^="AddressLine1_"]', { visible: true });
        await page.type('.k-window input[name^="AddressLine1_"]', address, { delay: 100 });

        const city = payload.Incorporator_Information.Address.City;
        await page.waitForSelector('.k-window input[name^="City_"]', { visible: true });
        await page.type('.k-window input[name^="City_"]', city, { delay: 100 });
        
        // // // State dropdown
        // const stateName = payload.Incorporator_Information.Address.State; // Get state from payload

        // // Click the dropdown button to open the options
        // await page.waitForSelector('span.k-dropdownlist[aria-controls^="StateCode_"]', { visible: true });
        // await page.click('span.k-dropdownlist[aria-controls^="StateCode_"]');

        // // Wait for dropdown options to load
        // await page.waitForTimeout(1000); // Allow UI rendering time

        // // Type the state name and press Enter (for keyboard navigation)
        // await page.keyboard.type(stateName, { delay: 100 });
        // await page.keyboard.press('Enter');

        // console.log(`State selected via keyboard: ${stateName}`);

        

        const postalCode = payload.Incorporator_Information.Address.Zip_Code; // Change this to your desired postal code
        await page.waitForSelector('.k-window input[name^="PostalCode_"]', { visible: true });
        await page.type('.k-window input[name^="PostalCode_"]', postalCode, { delay: 100 });

        //Save button 
        await new Promise(resolve => setTimeout(resolve, 6000));

        await page.waitForSelector('.k-window input.btn.btn-primary[value="Save"]', { visible: true });
        await page.click('.k-window input.btn.btn-primary[value="Save"]');

      
        // Registered Agent
        
        await new Promise(resolve => setTimeout(resolve, 6000));
        await page.waitForSelector('input[id^="OwnRegisteredAgent_"][id$="_YesNoCheckBoxNo"]', { visible: true });
        await page.evaluate(() => {
            document.querySelectorAll('input[id^="OwnRegisteredAgent_"][id$="_YesNoCheckBoxNo"]').forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.scrollIntoView(); // Ensure it's visible before clicking
                    checkbox.click();
                    checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Trigger JS event listeners
                }
            });
        });

        // Registered Agent dropdown
        await page.waitForSelector('span[aria-controls^="IndividualorOrganization_"]', { visible: true });
        await page.click('span[aria-controls^="IndividualorOrganization_"]');
        await page.waitForSelector('ul[aria-hidden="false"] li', { visible: true });
        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('ul[aria-hidden="false"] li'));
            const targetOption = options.find(option => option.innerText.trim() === 'Organization');
            if (targetOption) {
                targetOption.click();
            }
        });

        // Search button
        await page.waitForSelector('button[id^="Organization_"][id$="_addButton"]', { visible: true });
        await page.click('button[id^="Organization_"][id$="_addButton"]');

        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.waitForSelector('input#RAName', { visible: true });

        await page.type('input#RAName',payload.Registered_Agent.keyPersonnelName); 

        await page.waitForSelector('button#searchButton', { visible: true });
        await page.click('button#searchButton');

        // Add button
        await new Promise(resolve => setTimeout(resolve, 6000));
        await page.waitForSelector('button[id^="AddItem_"]', { visible: true });

        await page.click('button[id^="AddItem_"]');


        //Checkbox
        await page.waitForSelector('input[name="AttestationOne"]', { visible: true });
        await page.evaluate(() => {
            const checkbox = document.querySelector('input[name="AttestationOne"]');
            if (checkbox && !checkbox.checked) {
                checkbox.click();
            }
        });

        await page.waitForSelector('input[name="AttestationTwo"]', { visible: true });

        await page.evaluate(() => {
            const checkbox = document.querySelector('input[name="AttestationTwo"]');
            if (checkbox && !checkbox.checked) {
                checkbox.click();
            }
        });

        // Incorporator Information

        async function fillNameFields(page, fullName) {
            // Split the name into first and last parts
            const [firstName, lastName] = fullName.split(' ');
        
            // Fill the first name field
            await page.waitForSelector('input[name^="SignatureFirstName"]', { visible: true });
            await page.type('input[name^="SignatureFirstName"]', firstName || '');
        
            // Fill the last name field
            await page.waitForSelector('input[name^="SignatureLastName"]', { visible: true });
            await page.type('input[name^="SignatureLastName"]', lastName || '');
        }
        await fillNameFields(page, payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);

        await page.waitForSelector('button[name^="Next"]', { visible: true });
        await page.click('button[name^="Next"]');

  } catch (error) {
    logger.error('Error in Tenneessee For LLC form handler:', error.stack);
    throw new Error(`Tenneessee For LLC form submission failed: ${error.message}`);    }
}

module.exports = TennesseeForCORP;
