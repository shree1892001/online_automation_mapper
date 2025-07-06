const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class WashingtonForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async WashingtonForCORP(page, jsonData,payload){
          console.log(payload)
          logger.info('Navigating to Washington form submission page...');
          const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
          await this.navigateToPage(page, url);


          await this.fillInputByName(page, 'Username', data.State.filingWebsiteUsername);
          await this.fillInputByName(page, 'Password', data.State.filingWebsitePassword);
          await page.click('button.btn.btn-default.btn-lg.button_bg');

          await page.waitForSelector('span.txt', { visible: true });
          await page.evaluate(() => {
              const elements = Array.from(document.querySelectorAll('span.txt'));
              const targetElement = elements.find(el => el.textContent.trim() === 'Create or Register a Business');
              if (targetElement) {
                  targetElement.click();
              }
          });

          await new Promise(resolve => setTimeout(resolve, 4000))
          await page.waitForSelector('#rdoDomestic');
          await page.click('#rdoDomestic');

          await new Promise(resolve => setTimeout(resolve, 5000))
          await this.clickDropdown(page, '#BusinessEntityType', 'WA PROFIT CORPORATION');

          // Wait for the button with the class 'btn btn-success btn-md' and click it
          await page.waitForSelector('input.btn.btn-success.btn-md', { visible: true });
          await page.click('input.btn.btn-success.btn-md');
         
          // await this.addInput(page, entity);
          await this.waitForTimeout(7000)
          await this.fillInputByName(page,'txtBusiessName',payload.Name.Legal_Name)
          await page.waitForSelector('input.btn.btn-md.btn-brown', { visible: true });
          await page.click('input.btn.btn-md.btn-brown');

          await new Promise(resolve => setTimeout(resolve, 6000))
          const errorSelector = '.error-messages.ng-binding.ng-scope';
          // if (await this.isErrorPresent(page, errorSelector)) {
          //     console.log('Error detected. Taking corrective action.');
          //     await this.clearFieldWithDelete(page,'#id-txtBusiessName')
          //     await this.fillInputByName(page,'txtBusiessName',payload.Name.Alternate_Legal_Name)
          //     await page.waitForSelector('input.btn.btn-md.btn-brown', { visible: true });
          //     await page.click('input.btn.btn-md.btn-brown');
          // } else {
          //     console.log('No error detected. Proceeding normally.');
          // }
        //   Registerd agent

            // Split the full name into first and last name
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [first, last] = await this.ra_split(fullName); 

            // Selector for the first name input field
            const firstnameSelector = 'input[data-ng-model="agent.FirstName"]';
            await page.waitForSelector(firstnameSelector);
            await page.type(firstnameSelector, first || ''); 

            // Selector for the last name input field
            const lastnameSelector = 'input[data-ng-model="agent.LastName"]';
            await page.waitForSelector(lastnameSelector);
            await page.type(lastnameSelector, last || ''); 

        //   // Selector for the fisrt last name input field
        //   const firstname = 'input[data-ng-model="agent.FirstName"]'; 
        //   const first = payload.Registered_Agent.Name.RA_Name; 
        //   await page.waitForSelector(firstname);
        //   await page.type(firstname, first);

        //   const lastname = 'input[data-ng-model="agent.LastName"]'; 
        //   const last = payload.Registered_Agent.Name.RA_Name; 
        //   await page.waitForSelector(lastname);
        //   await page.type(lastname, last);

          await page.waitForSelector('input.btn.btn-success.btn-md', { visible: true });
          await page.click('input.btn.btn-success.btn-md');
          
          // Wait for the button with 'value="Add New Agent"' to be visible
          await page.waitForSelector('input[value="Add New Agent"]', { visible: true });
          await page.evaluate(() => {
              document.querySelector('input[value="Add New Agent"]').click();
          });

          const emailInputSelector = 'input[name="EmailID"]'; 
          const emailValue = payload.Registered_Agent.EmailId; 
          await page.waitForSelector(emailInputSelector);
          await page.type(emailInputSelector, emailValue); 

          // Selector for the ConfirmEmailAddress input field
          const emailConfirmInputSelector = 'input[name="ConfirmEmailAddress"]'; 
          const emailConfirmValue = payload.Registered_Agent.EmailId; 
          await page.waitForSelector(emailConfirmInputSelector);
          await page.type(emailConfirmInputSelector, emailConfirmValue);


          // Selector for the StreetAddress1 input field
          const streetAddressInputSelector = 'input[name="StreetAddress1"]';
          const streetAddressValue = payload.Registered_Agent.Address.Street_Address; 
          await page.waitForSelector(streetAddressInputSelector);
          await page.type(streetAddressInputSelector, streetAddressValue);


          // // Selector for the StreetAddress2 input field
          const streetAddress2InputSelector = 'input[name="StreetAddress2"]';
          const streetAddress2Value = payload.Registered_Agent.Address.RA_Address_Line2 || " "; 
          await page.waitForSelector(streetAddress2InputSelector);
          await page.type(streetAddress2InputSelector, streetAddress2Value);


          // Selector for the Zip input field
          const zipInputSelector = 'input[name="Zip5"]';
          const zipValue = payload.Registered_Agent.Address.Zip_Code; 
          await page.waitForSelector(zipInputSelector);
          await page.type(zipInputSelector, zipValue);

          // // Checkbox
          // await new Promise(resolve => setTimeout(resolve, 6000))
          // await page.click('input[ng-model="agent.IsACP"]');



          await page.waitForSelector('input[name="ShareValues"]');
          await page.type('input[name="ShareValues"]', payload.Stock_Details.Number_Of_Shares); 

          await page.waitForSelector('input[name="IsCorporateSharesCommonStock"]');
          await new Promise(resolve => setTimeout(resolve, 4000));
          await page.click('input[name="IsCorporateSharesCommonStock"]');

          await this.waitForTimeout(5000)

        //   Incorporator Information
        //   First Name

             await page.evaluate((payload) => {
            // Get the full name from the JSON
            const fullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
          
            // Regular expression to capture the first and last names
            const nameMatch = fullName.match(/^(\S+)\s+(.+)$/);
          
            let firstName = '';
            let lastName = '';
            if (nameMatch) {
              firstName = nameMatch[1]; 
              lastName = nameMatch[2]; 
            } else {
              firstName = fullName;
            }
            const firstNameInput = document.querySelector('input[data-ng-model="principal.FirstName"]');
            if (firstNameInput) {
              firstNameInput.value = firstName;
              firstNameInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            const lastNameInput = document.querySelector('input[data-ng-model="principal.LastName"]');
            if (lastNameInput) {
              lastNameInput.value = lastName;
              lastNameInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
          
          }, payload);



        // await page.evaluate(() => {
        //     const input = document.querySelector('input[data-ng-model="principal.FirstName"]');
        //     if (input) {
        //       input.value = payload.Registered_Agent.Name.RA_Name;
        //       input.dispatchEvent(new Event('input', { bubbles: true }));
        //     }
        //   });

          

        //   await page.evaluate(() => {
        //     const input = document.querySelector('input[data-ng-model="principal.LastName"]');
        //     if (input) {
        //       input.value = payload.Registered_Agent.Name.RA_Name;
        //       input.dispatchEvent(new Event('input', { bubbles: true }));
        //     }
        //   });

          
            const principalOfficeHeaderSelector = '.div_pdf_header_font.div_header.ng-binding';
            await page.waitForSelector(principalOfficeHeaderSelector);
            const streetAddress1Selector = `${principalOfficeHeaderSelector} ~ div input[name="StreetAddress1"]`;
            const streetAddress1Value1 = payload.Incorporator_Information.Address.Street_Address; 
            // Wait for and type into the StreetAddress1 input field
            await page.waitForSelector(streetAddress1Selector);
            await page.type(streetAddress1Selector, streetAddress1Value1);

            const streetAddress2Selector = `${principalOfficeHeaderSelector} ~ div input[name="StreetAddress2"]`;
            const streetAddress2Value2 = payload.Incorporator_Information.Address['Address_Line_2'] || " "; 
            // Wait for and type into the StreetAddress1 input field
            await page.waitForSelector(streetAddress2Selector);
            await page.type(streetAddress2Selector, streetAddress2Value2);


            const principalOfficeHeaderSelector2 = '.div_pdf_header_font.div_header.ng-binding';
            await page.waitForSelector(principalOfficeHeaderSelector2);
            const streetAddress1Selector2 = `${principalOfficeHeaderSelector} ~ div input[name="Zip5"]`;
            const streetAddress1Value12 = String(payload.Incorporator_Information.Address.Zip_Code); 
            // Wait for and type into the StreetAddress1 input field
            await page.waitForSelector(streetAddress1Selector2);
            await page.type(streetAddress1Selector2, streetAddress1Value12);



        // //   Checkbox
        //   // Wait for the checkbox to be available

        //   await page.waitForSelector('#Executor_isUserPricipal');
        //   await new Promise(resolve => setTimeout(resolve, 6000));
        //   await page.click('#Executor_isUserPricipal');
        //   // await page.waitForSelector('.loader', { visible: true });
        //   // await page.waitForSelector('.loader', { hidden: true });
          
            // button
            // Wait for the button to be available
            await page.waitForSelector('input[name="btnAddIncorporator"]');
            await new Promise(resolve => setTimeout(resolve, 6000));
            await page.click('input[name="btnAddIncorporator"]');
            // await page.waitForSelector('.loader', { visible: true });



        // await new Promise(resolve => setTimeout(resolve, 6000));
        // await page.waitForSelector('input.form-control.input-medium.margin10.ng-valid-maxlength.ng-invalid.ng-invalid-required.ng-dirty.ng-valid-parse.ng-touched');
        // await page.evaluate(() => {
        //     const input = document.querySelector('input.form-control.input-medium.margin10.ng-valid-maxlength.ng-invalid.ng-invalid-required.ng-dirty.ng-valid-parse.ng-touched');
        //     input.value = 'Hardcoder'; 
        // });
        // await page.type('input.form-control.input-medium.margin10.ng-valid-maxlength.ng-invalid.ng-invalid-required.ng-dirty.ng-valid-parse.ng-touched', 'John'); // Replace 'John' with the desired value



        //   Principal Office

            await new Promise(resolve => setTimeout(resolve, 6000))

            // // Selector for the Phone input field
            // const phoneInputSelector = 'input[name="txtPhone"]';
            // const phoneValue = payload.Registered_Agent.Name.Contact_No; // Ensure this is the correct value in your JSON
            // await page.waitForSelector(phoneInputSelector);
            // await page.type(phoneInputSelector, phoneValue);


            const emailInputSelecto = 'input[data-ng-model="principalData.EmailAddress"]';
            // Extract the email value from your JSON data
            const emailValuE1 = payload.Registered_Agent.EmailId; 

            // Wait for the Email input field to be available in the DOM
            await page.waitForSelector(emailInputSelecto, { visible: true, timeout: 6000 }); 

            // Type the email value into the Email input field
            await page.type(emailInputSelecto, emailValuE1, { delay: 100 }); 


            // Selector for the Confirm Email input field
            const confirmEmailInputSelector = 'input[name="ConfirmEmail"]';
            const confirmEmailValue = payload.Registered_Agent.EmailId; 
            await page.waitForSelector(confirmEmailInputSelector);
            await page.type(confirmEmailInputSelector, confirmEmailValue);


            // Wait for the input to be available
            await page.waitForSelector('input[name="StreetAddress1"]');
            // await page.click('input[name="StreetAddress1"]', { clickCount: 3 }); // Triple-click to select the whole input
            // await page.keyboard.press('Backspace'); 

            // Type the address into the field with a delay to simulate typing
            await page.type('input[name="StreetAddress1"]', payload.Principal_Address.Street_Address, { delay: 100 }); // Simulate typing

            // Optionally, trigger 'input' event to notify AngularJS
            await page.evaluate(() => {
            const addressInput = document.querySelector('input[name="StreetAddress1"]');
            addressInput.dispatchEvent(new Event('input', { bubbles: true }));
            });
            
            await page.type('input[name="StreetAddress2"]', payload.Principal_Address['Address_Line_2'] || " ", { delay: 100 }); // Simulate typing

            // Optionally, trigger 'input' event to notify AngularJS
            await page.evaluate(() => {
            const addressInput = document.querySelector('input[name="StreetAddress2"]');
            addressInput.dispatchEvent(new Event('input', { bubbles: true }));
            });



            // Wait for the input to be available
            await page.waitForSelector('input[name="Zip5"]');
            await page.focus('input[name="Zip5"]');
            await page.type('input[name="Zip5"]', String(payload.Principal_Address.Zip_Code), { delay: 100 }); 
            await page.evaluate(() => {
            const zipInput = document.querySelector('input[name="Zip5"]');
            zipInput.dispatchEvent(new Event('input', { bubbles: true }));
            });

            // await new Promise(resolve => setTimeout(resolve, 6000))
            // await page.click('input[ng-model="principalData.IsACP"]');


            
          // Governer Information

          await page.waitForSelector('#GoverningPerson_isUserPricipal');
          await new Promise(resolve => setTimeout(resolve, 10000));
          await page.click('#GoverningPerson_isUserPricipal');


          // Add Button Governer
          await page.waitForSelector('input[value="Add Governor"]');
          await new Promise(resolve => setTimeout(resolve, 4000));
          await page.click('input[value="Add Governor"]');
          // await page.waitForSelector('.loader', { visible: true }); 


          // Nature of Business
          // Other
          await page.waitForSelector('#rdoOtherNAICS');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.evaluate(() => {
            const checkbox = document.querySelector('#rdoOtherNAICS');
            if (checkbox) {
              checkbox.click();  // Click the checkbox
            }
          });

          // Other input fields
          await page.waitForSelector('#txtOtherNOBDesc');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.type('#txtOtherNOBDesc', 'HardCoaded Field');
          await page.evaluate(() => {
            const textarea = document.querySelector('#txtOtherNOBDesc');
            if (textarea) {
              textarea.dispatchEvent(new Event('blur', { bubbles: true }));  // Trigger blur event if required
            }
          });

          // Authorized Person
          await page.waitForSelector('input[name="chkAuthorized"]');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.click('input[name="chkAuthorized"]');


          // Checkbox
          await page.waitForSelector('input[name="isaccepted1"]');
          await new Promise(resolve => setTimeout(resolve, 3000));
          await page.click('input[name="isaccepted1"]');

          //  Continue 
          await page.waitForSelector('input[value="Continue"]');
          await new Promise(resolve => setTimeout(resolve, 5000));
          await page.click('input[value="Continue"]');
          

      } catch (error) {
          // Log full error stack for debugging
          logger.error('Error in Washington LLC form handler:', error.stack);
          throw new Error(`Washington LLC form submission failed: ${error.message}`);
        }
      }
      async function fillInputByXPath(page, xpath, value) {
        await page.waitForXPath(xpath); 
        await page.type(xpath, value);  
    }
    

module.exports = WashingtonForCORP;
