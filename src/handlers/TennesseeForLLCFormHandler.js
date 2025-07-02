const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');

class TennesseeForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async TennesseeForLLC(page, jsonData,payload){
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
            const options = Array.from(document.querySelectorAll('li')); // Adjust if needed
            const targetOption = options.find(option => option.innerText.trim() === 'Limited Liability Company');
            if (targetOption) {
                targetOption.click();
            }
        });

        //Nocheckbox 
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

        //EntityName
        await page.waitForSelector('input[data-val-label-text="Name+of+the+Limited+Liability+Company"]', { visible: true });
        await page.type('input[data-val-label-text="Name+of+the+Limited+Liability+Company"]', payload.Name.Legal_Name);


        //Fiscal Year Ending Month
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

        // County
        await page.waitForSelector('span[aria-controls^="PrincipalOfficeCounty_"]', { visible: true });
        await page.click('span[aria-controls^="PrincipalOfficeCounty_"]');
        await page.waitForSelector('ul[aria-hidden="false"] li', { visible: true });

        await page.evaluate((countyName) => {
            const options = Array.from(document.querySelectorAll('ul[aria-hidden="false"] li'));
            const targetOption = options.find(option => option.innerText.trim() === countyName);
            if (targetOption) {
                targetOption.click();
            }
        }, jsonData.data.County.countyName); 
        


            // // Select an option by its text
            // await page.evaluate(() => {
            //     const options = Array.from(document.querySelectorAll('ul[aria-hidden="false"] li'));
            //     const targetOption = options.find(option => option.innerText.trim() === jsonData.data.County.countyName); // Replace with actual text
            //     if (targetOption) {
            //         targetOption.click();
            //     }
            // });

            // Checkbox
            await page.waitForSelector('input[id^="BypassSwitch_"]', { visible: true });
            await page.evaluate(() => {
                document.querySelectorAll('input[id^="BypassSwitch_"]').forEach(checkbox => {
                    if (!checkbox.checked) {
                        checkbox.scrollIntoView();
                        checkbox.click();
                        checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Trigger JS event listeners
                    }
                });
            });

            //Mailing address checkbox same as principal address
            await page.waitForSelector('input[id^="IsMailingSameAsStreetAddress_"]', { visible: true });
            await page.evaluate(() => {
                const checkbox = document.querySelector('input[id^="IsMailingSameAsStreetAddress_"]');
                if (checkbox && !checkbox.checked) {
                    checkbox.click();
                    checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
                }
            });
        
            console.log('Checkbox clicked');
        



        // Mailing address
        // await page.waitForSelector('input[name^="MailingAddressLine1"]', { visible: true });
        // await page.type('input[name^="MailingAddressLine1"]', payload.Principal_Address.Street_Address);

        // await page.waitForSelector('input[name^="MailingCity"]', { visible: true });
        // await page.type('input[name^="MailingCity"]',  payload.Principal_Address.City);

        // // Wait for the specific dropdown related to "State"
        // await page.waitForSelector('span[aria-controls^="MailingStateCode_"]', { visible: true });

        // // Click the correct dropdown to open it
        // await page.click('span[aria-controls^="MailingStateCode_"]');

        // // Wait for the dropdown options to appear
        // await page.waitForSelector('ul[aria-hidden="false"] li', { visible: true });

        // // Use `payload.Registered_Agent.Address.RA_State` dynamically
        // await new Promise(resolve => setTimeout(resolve, 3000));
        // await page.evaluate((stateName) => {
        //     const options = Array.from(document.querySelectorAll('ul[aria-hidden="false"] li'));
        //     const targetOption = options.find(option => option.innerText.trim() === stateName);
        //     if (targetOption) {
        //         targetOption.click();
        //     }
        // },  payload.Principal_Address.State); 


        // await page.waitForSelector('input[name^="MailingPostalCode"]', { visible: true });
        // await page.type('input[name^="MailingPostalCode"]',  payload.Principal_Address.Zip_Code);

        // // Wait for the specific dropdown related to "County"
        // await page.waitForSelector('span[aria-controls^="MailingCounty_"]', { visible: true });

        // // Click the correct dropdown to open it
        // await page.click('span[aria-controls^="MailingCounty_"]');

        // // Wait for the dropdown options to appear
        // await page.waitForSelector('ul[aria-hidden="false"] li', { visible: true });

        // // Use `payload.Registered_Agent.Address.RA_County` dynamically
        // await page.evaluate((countyName) => {
        //     const options = Array.from(document.querySelectorAll('ul[aria-hidden="false"] li'));
        //     const targetOption = options.find(option => option.innerText.trim() === countyName);
        //     if (targetOption) {
        //         targetOption.click();
        //     }
        // }, jsonData.data.County.countyName); // Pass county name dynamically



        await page.waitForSelector('input[name^="BusinessEmail"]', { visible: true });
        await page.type('input[name^="BusinessEmail"]', payload.Registered_Agent.EmailId);

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
        }, payload.Naics_Code.NC_NAICS_Code); 

        console.log(`Input field filled with value: ${payload.Naics_Code.NC_NAICS_Code}`);

        await page.waitForSelector('#searchButton', { visible: true });
        await page.click('#searchButton');
        await page.waitForSelector('.k-checkbox', { visible: true });

        await new Promise(resolve => setTimeout(resolve, 6000));
        await page.waitForSelector('button[name^="AddItem"]', { visible: true });
        await page.click('button[name^="AddItem"]');

        // MemberOrManager
        await page.waitForSelector('input[name="ManagedType"][value="Member Managed"]', { visible: true });

        await page.evaluate(() => {
            const radio = document.querySelector('input[name="ManagedType"][value="Member Managed"]');
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true })); 
            }
        });

        // No
        await new Promise(resolve => setTimeout(resolve, 6000));

        // const membersCount = payload.Member_Or_Manager_Details.length; 

        // console.log(membersCount);

        // if(membersCount>=6){

        //     await page.waitForSelector('input[name="HasMoreMembers"]', { visible: true });

        //     await page.evaluate(() => {
        //         const radio = document.querySelector('input[name="HasMoreMembers"]');
        //         if (radio) {
        //             radio.checked = true;
        //             radio.dispatchEvent(new Event('change', { bubbles: true })); // Triggers onchange event
        //         }
        //     });

        // }
        // else{

        //     await page.waitForSelector('input[id^="HasMoreMembers_"][id$="_YesNoCheckBoxNo"]', { visible: true });

        //     // Click the checkbox
        //     await page.evaluate(() => {
        //         const checkbox = document.querySelector('input[id^="HasMoreMembers_"][id$="_YesNoCheckBoxNo"]');
        //         if (checkbox && !checkbox.checked) {
        //             checkbox.click();
        //             checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Trigger JS event listeners
        //         }
        //     });        }
        //     await page.evaluate((value) => {
        //         const inputField = document.querySelector('input.form-control.k-input-inner');
        //         if (inputField) {
        //             inputField.value = value;
        //             inputField.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
        //             inputField.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
        //         }
        //     }, []
        // ); 
        //     //  payload.Entity_Formation.Member_Or_Manager_Details[0].length
            // Use `.length` instead of `.count()`
            
            // Store the value in a variable for logging
            // const countOfMemberMan = payload.Entity_Formation.Member_Or_Manager_Details;
            // console.log(`Test: ${countOfMemberMan}`);
            

            // Yes button

        await page.waitForSelector('input[name="HasMoreMembers"].yesCheckBox', { visible: true });

        await page.evaluate(() => {
            document.querySelectorAll('input[name="HasMoreMembers"].yesCheckBox').forEach(checkbox => {
                if (
                    checkbox.getAttribute('data-val-label-text')?.trim() === 'Do you have six or fewer members at the date of this filing?' &&
                    !checkbox.checked
                ) {
                    checkbox.scrollIntoView(); // Ensure it's visible before clicking
                    checkbox.click();
                    checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Trigger JS event listeners
                }
            });
        });
        
        await page.waitForSelector('input[id^="ObligatedMemberEntity_"][id$="_YesNoCheckBoxNo"]', { visible: true });

        await page.evaluate(() => {
            document.querySelectorAll('input[id^="ObligatedMemberEntity_"][id$="_YesNoCheckBoxNo"]').forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.scrollIntoView();
                    checkbox.click();
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });

  
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

        await page.waitForSelector('span[aria-controls^="IndividualorOrganization_"]', { visible: true });
        await page.click('span[aria-controls^="IndividualorOrganization_"]');
        await page.waitForSelector('ul[aria-hidden="false"] li', { visible: true });
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


        // Wait for the "Add Items" button to be visible
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

        // Organizer Information

        async function fillNameFields(page, fullName) {
          const [firstName, lastName] = fullName.split(' ');
      
          await page.waitForSelector('input[name^="SignatureFirstName"]', { visible: true });
          await page.type('input[name^="SignatureFirstName"]', firstName || '');
      
          await page.waitForSelector('input[name^="SignatureLastName"]', { visible: true });
          await page.type('input[name^="SignatureLastName"]', lastName || '');
      }
      await fillNameFields(page, payload.Organizer_Information.keyPersonnelName);

      await page.waitForSelector('button[name^="Next"]', { visible: true });
      await page.click('button[name^="Next"]');

    } catch (error) {
      logger.error('Error in Tenneessee For LLC form handler:', error.stack);
      throw new Error(`Tenneessee For LLC form submission failed: ${error.message}`);    }
}

module.exports = TennesseeForLLC;
