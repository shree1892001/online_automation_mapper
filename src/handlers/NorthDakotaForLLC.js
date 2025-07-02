const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { timeout } = require('puppeteer');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class NorthDakotaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async NorthDakotaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);

            
            await page.waitForSelector('.btn.btn-default.login-link',{visible:true,timeout:100000});

            await page.click('.btn.btn-default.login-link');
            const inputFields = [
                { label: 'username', value: data.State.filingWebsiteUsername },
                { label: 'password', value: data.State.filingWebsitePassword }
            ];

            await this.addInput(page, inputFields);
            await page.waitForSelector('button.btn-raised.btn-light-primary.submit',{visible:true,timeout:10000});

            await page.click('button.btn-raised.btn-light-primary.submit');  

            await this.waitForTimeout(3000)

            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const nextStepButton = buttons.find(btn => btn.textContent.trim() === 'Next Step');
                if (nextStepButton) {
                    nextStepButton.click();
                }
            });    
            await this.waitForTimeout(2000)
            
            
            await page.waitForSelector('.radio-label');

            await page.click('.radio-label');

            await page.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');

            await page.click('button.btn.btn-raised.btn-primary.next.toolbar-button');


    
    const labelText = 'Limited liability company';

    // Find the associated radio button by its label text
    await page.evaluate((labelText) => {
        const labels = Array.from(document.querySelectorAll('label.field-label.radio-label'));
        const targetLabel = labels.find(label => label.textContent.trim() === labelText);
        if (targetLabel) {
            const radioButtonId = targetLabel.getAttribute('for');
            const radioButton = document.getElementById(radioButtonId);
            if (radioButton) {
                radioButton.click();
            }
        }
    }, labelText);

    const optionLabelText = 'Nonprofit limited liability company';

    await page.evaluate((optionLabelText) => {
        const labels = Array.from(document.querySelectorAll('label.field-label.radio-label'));
        const targetLabel = labels.find(label => label.textContent.trim() === optionLabelText);
        if (targetLabel) {
            const radioButtonId = targetLabel.getAttribute('for');
            const radioButton = document.getElementById(radioButtonId);
            if (radioButton) {
                radioButton.click();
            }
        }
    }, optionLabelText);

    await page.waitForSelector('.btn.btn-raised.btn-primary.next.toolbar-button');
  await page.click('.btn.btn-raised.btn-primary.next.toolbar-button'); 



  const linkText = 'Nonprofit Limited Liability Company Articles of Organization';

    // Using page.evaluate to find and click the link
    // await page.evaluate((linkText) => {
    //     const link = Array.from(document.querySelectorAll('a'))
    //         .find(a => a.textContent.trim() === linkText);
    //     if (link) {
    //         link.click();
    //     } else {
    //         console.error('Link not found:', linkText);
    //     }
    // }, linkText); 
    const newPagePromise = new Promise(resolve => {
        page.once('popup', resolve); // Listen for popup events
    });
await page.evaluate((linkText) => {
    const link = Array.from(document.querySelectorAll('a'))
        .find(a => a.textContent.trim() === linkText);
    if (link) {
        link.click();
    } else {
        console.error('Link not found:', linkText);
    }
}, linkText);
const newPagePromise1 = new Promise(resolve => {
    page.once('popup', resolve); // Listen for popup events
});
const newPage = await newPagePromise1;
            
// Wait for the new page to load

    

    await newPage.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');
    
    await newPage.click('button.btn.btn-raised.btn-primary.next.toolbar-button');
    await newPage.waitForSelector('label[for="reservedYN1"]',{visible:true,timeout:12000}); 
    await newPage.click('label[for="reservedYN1"]');

             const input_company_name = [
            { label: 'field-field1-undefined', value: payload.Name.Legal_Name },
            { label: 'field-field2-undefined', value: payload.Name.Legal_Name },
            
            ];
            await this.addInput(newPage, input_company_name);

            const errorSelector = 'div.field > p.field-error';
            try {
                // Wait for the error message within the specific context
                await page.waitForSelector(errorSelector, { visible: true, timeout: 5000 });
                const errorMessage = await page.$eval(errorSelector, (el) => el.textContent.trim());
                
                if (errorMessage === "Sorry, this name is already taken. Please provide a different name to continue.") {
                    // Function to clear the input field by pressing backspace until empty
                    async function clearFieldWithBackspace(page, selector) {
                        await page.focus(selector); // Focus on the input field
                        const inputValue = await page.$eval(selector, el => el.value); // Get the current value of the field
                        for (let i = 0; i < inputValue.length; i++) {
                        await page.keyboard.press('Backspace'); // Press backspace for each character
                        }
                    }
                    await clearFieldWithBackspace(page, 'input#field-field1-undefined');
                    await page.type('input#field-field1-undefined', payload.Name.Alternate_Legal_Name); // Type the new name
                    await clearFieldWithBackspace(page, 'input#field-field2-undefined');
                    await page.type('input#field-field2-undefined', payload.Name.Alternate_Legal_Name); // Type the new name
                } 
            } catch (err) {
               
            }





            // Wait for the label with specific text to be visible
await newPage.waitForSelector('label.radio-label', { visible: true, timeout: 12000 });

// Get all label elements and filter for the specific text
const labels = await newPage.$$('label.radio-label');

for (const label of labels) {
    const text = await label.evaluate(el => el.textContent);
    if (text.includes("It is not known if consent to use the name is needed from a business registered in North Dakota.")) {
        await label.click();
        console.log("Successfully clicked the label based on text content.");
        break; // Exit the loop once the correct label is clicked
    }
}
   // await this.selectRadioButtonByLabel(page, 'Perpetual / Ongoing');

            // Select the country
            // await newPage.evaluate((jsonData) => {
            //   const select = document.querySelector('select[name="COUNTRY"]');
            //   const option = Array.from(select.options).find(option => option.text === payload.Principal_Address.PA_Country);
            //   if (option) {
            //     select.value = option.value;
            //     select.dispatchEvent(new Event('change', { bubbles: true }));
            //   } else {
            //     throw new Error(`Country  not found in the dropdown`);
            //   }
            // }, jsonData);

            await this.randomSleep(5000,8000);
            await newPage.waitForSelector('input[aria-label="Principal executive office address: Address Line 1"]');

            await newPage.type('input[aria-label="Principal executive office address: Address Line 1"]', payload.Principal_Address.Street_Address);
        

            await newPage.type('#field-addr-city-HJn2FKR8b', payload.Principal_Address.City);
            await newPage.type('#field-addr-zip-HJn2FKR8b', payload.Principal_Address.Zip_Code.toString());
            

            // { label: 'initialPrincipalOffice\\.state', value: payload.Principal_Address.State },
            //     { label: 'ZIP Code*', value: payload.Principal_Address.PA_Postal_Code },

        let state = payload.Principal_Address.State;

        if (state === "North Dakota") {
            state = "ND"; 
            payload.Principal_Address.State = state;
        }
            // await newPage.evaluate((jsonData) => {
            //     // const dropdown = document.querySelector('select[name="STATE"]');
            //     const dropdown = document.querySelector('select[id="field-addr-state-HJn2FKR8b"]');
            //     const option = Array.from(dropdown.options).find(opt => opt.text === payload.Principal_Address.State);
        
            //     if (option) {
            //         dropdown.value = option.value;
        
            //         // Dispatch a 'change' event to trigger any event listeners
            //         const event = new Event('change', { bubbles: true });
            //         dropdown.dispatchEvent(event);
            //     }
            // },jsonData);

            await newPage.evaluate((state) => {
                // Find the dropdown element
                const dropdown = document.querySelector('select[id="field-addr-state-HJn2FKR8b"]');
                if (!dropdown) {
                    throw new Error("State dropdown not found");
                }
            
                // Find the matching option
                const option = Array.from(dropdown.options).find(opt => opt.text.trim() === state.trim());
                if (!option) {
                    throw new Error(`State option not found for: ${state}`);
                }
            
                // Set the value of the dropdown
                dropdown.value = option.value;
            
                // Dispatch a 'change' event to notify any event listeners
                dropdown.dispatchEvent(new Event('change', { bubbles: true }));
            }, payload.Principal_Address.State);
            
            


          
            // await newPage.evaluate((jsonData) => {
            //     const select = document.querySelector('select[name="COUNTRY"]');
            //     const option = Array.from(select.options).find(option => option.text === payload.Principal_Address.PA_Country);
            //     if (option) {
            //       select.value = option.value;
            //       select.dispatchEvent(new Event('change', { bubbles: true }));
            //     } else {
            //       throw new Error(`Country  not found in the dropdown`);
            //     }
            //   }, jsonData);
  
              await this.randomSleep(5000,8000);
              await newPage.waitForSelector('input[aria-label="Mailing address: Address Line 1"]');
  
              await newPage.type('input[aria-label="Mailing address: Address Line 1"]', payload.Registered_Agent.Mailing_Information.Street_Address);
            //   await newPage.type('input[aria-label="Mailing address: Address Line 2"]', payload.Registered_Agent.Mailing_Information['Address_Line_2']  || " ");

              await newPage.type('input[aria-label="Mailing address: City"]', payload.Registered_Agent.Mailing_Information.City);
              await newPage.type('input[aria-label="Mailing address: ZIP code"]', payload.Registered_Agent.Mailing_Information.Zip_Code.toString());
  
  
            
            //   await newPage.evaluate((jsonData) => {
            //       const dropdown = document.querySelector('#field-addr-state-S1ufh19dZ');
            //       const option = Array.from(dropdown.options).find(opt => opt.text === payload.Principal_Address.State);
          
            //       if (option) {
            //           dropdown.value = option.value;
          
            //           // Dispatch a 'change' event to trigger any event listeners
            //           const event = new Event('change', { bubbles: true });
            //           dropdown.dispatchEvent(event);
            //       }
            //   },jsonData);

            await newPage.evaluate((state) => {
                // Find the dropdown element
                const dropdown = document.querySelector('select[id="field-addr-state-S1ufh19dZ"]');
                if (!dropdown) {
                    throw new Error("State dropdown not found");
                }
            
                // Find the matching option
                const option = Array.from(dropdown.options).find(opt => opt.text.trim() === state.trim());
                if (!option) {
                    throw new Error(`State option not found for: ${state}`);
                }
            
                // Set the value of the dropdown
                dropdown.value = option.value;
            
                // Dispatch a 'change' event to notify any event listeners
                dropdown.dispatchEvent(new Event('change', { bubbles: true }));
            }, payload.Registered_Agent.Mailing_Information.State);

            


              await newPage.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');
    
              await newPage.click('button.btn.btn-raised.btn-primary.next.toolbar-button');

              await newPage.waitForSelector('label[for="TYPE_ID1"]');
              await newPage.click('label[for="TYPE_ID1"]'); 


              await newPage.waitForSelector('button.btn.btn-medium-neutral.add');

  await newPage.click('button.btn.btn-medium-neutral.add');


  await newPage.waitForSelector('input[name="FIRST_NAME"]', { visible: true, timeout: 30000 });

  
            
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [first, last] = await this.ra_split(fullName);
            
            await newPage.type('input[name="FIRST_NAME"]', first);
            // await page.type('input[name=??"MIDDLE_NAME"]', data.middleName || '');
            await newPage.type('input[name="LAST_NAME"]', last);
        
            // Fill in the physical address
            await newPage.type('input[name="ADDR1"]', payload.Registered_Agent.Address.Street_Address);
            await newPage.type('input[name="ADDR2"]', payload.Registered_Agent.Address['Address_Line_2']  || " ");

            // await newPage.type('input[name="ADDR2"]', data.address2 || '');
            await newPage.type('input[name="CITY"]', payload.Registered_Agent.Address.City);
            await newPage.type('input[name="POSTAL_CODE"]', payload.Registered_Agent.Address.Zip_Code.toString());

            await newPage.waitForSelector('#field-address1-ry_-3WWvb_MAIL');
            await newPage.type('#field-address1-ry_-3WWvb_MAIL',payload.Registered_Agent.Mailing_Information.Street_Address );

            await newPage.waitForSelector('#field-address2-ry_-3WWvb_MAIL');
            await newPage.type('#field-address2-ry_-3WWvb_MAIL',payload.Registered_Agent.Mailing_Information['Address_Line_2']  || " ");
          
            
          
            
          
            await newPage.waitForSelector('#field-addr-city-ry_-3WWvb_MAIL');
            await newPage.type('#field-addr-city-ry_-3WWvb_MAIL', payload.Registered_Agent.Mailing_Information.City);
          
            await newPage.waitForSelector('#field-addr-zip-ry_-3WWvb_MAIL');
            await newPage.type('#field-addr-zip-ry_-3WWvb_MAIL', payload.Registered_Agent.Mailing_Information.Zip_Code.toString());



            await this.randomSleep(1000,3000);

            const submitButton = await newPage.waitForSelector('.controls .btn-primary', {
                visible: true,
                timeout: 5000
            });
        
            // Click the submit button and wait for navigation
            await Promise.all([
                this.randomSleep(10000,20000),
                submitButton.click()
            ]);
            


            await this.waitForTimeout(3000)
            await newPage.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const nextStepButton = buttons.find(btn => btn.textContent.trim() === 'Next Step');
                if (nextStepButton) {
                    nextStepButton.click();
                }
            });
        
            // // Click the submit button and wait for navigation
            // await Promise.all([
                
            //     nextButton.click()
            // ]);           
            
             await newPage.type('#field-SJ64ITC5W',payload.Purpose.Purpose_Details.toString());


            await newPage.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');
    
            await newPage.click('button.btn.btn-raised.btn-primary.next.toolbar-button');

            await this.clickButton(newPage,'button.form-button.add-row'); 




                    let fullName1=payload.Organizer_Information.keyPersonnelName.split(" "); 

           
                await this.fillInputByName(newPage,"FIRST_NAME",fullName1[0]);
                await this.fillInputByName(newPage,"LAST_NAME",fullName1[1]);
                await this.fillInputByName(newPage,"ADDR1",payload.Organizer_Information.Address.Street_Address);
                await this.fillInputByName(newPage,"ADDR2",payload.Organizer_Information.Address['Address_Line_2']  || " ");

                await this.fillInputByName(newPage,"CITY",payload.Organizer_Information.Address.City);
            


                await this.fillInputByName(newPage,"POSTAL_CODE", payload.Organizer_Information.Address.Zip_Code.toString());
                await this.clickDropdown(newPage,"#field-addr-state-SJF64fm9m","ND");
                await this.clickDropdown(newPage,"#field-addr-country-SJF64fm9m","United States");

                const submitButton1 = await newPage.waitForSelector('.controls .btn-primary', {
                    visible: true,
                    timeout: 5000
                });
            
                // Click the submit button and wait for navigation
                await Promise.all([
                    this.randomSleep(1000,2000),
                    submitButton1.click()
                ]);

            // await page.evaluate((jsonData) => {
            //         const dropdown = document.querySelector('[id="field-addr-country-SJF64fm9m"]');
            //         const option = Array.from(dropdown.options).find(opt => opt.text === payload.Principal_Address.PA_Country.toUpperCase());
            
            //         if (option) {
            //             dropdown.value = option.value;
            
            //             // Dispatch a 'change' event to trigger any event listeners
            //             const event = new Event('change', { bubbles: true });
            //             dropdown.dispatchEvent(event);
            //         }
            //     },jsonData);


                // const submitButton1 = await newPage.waitForSelector('.controls .btn.btn-raised.btn-primary', {
                //     visible: true,
                //     timeout: 5000
                // });
            
                // // Click the submit button and wait for navigation
                // await Promise.all([
                //     submitButton1.click()
                // ]);
                await newPage.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');
    
                await newPage.click('button.btn.btn-raised.btn-primary.next.toolbar-button');

                await newPage.evaluate(() => {
                    const labelText = "One organizer will sign.";
                    const labels = Array.from(document.querySelectorAll('.option-wrapper label'));
                    const targetLabel = labels.find(label => label.textContent.trim() === labelText);
                    
                    if (targetLabel) {
                      const radioButton = targetLabel.previousElementSibling;
                      if (radioButton && radioButton.type === 'radio') {
                        radioButton.click();
                        return true;
                      }
                    }
                    return false;
                  });
                  
               

                  await newPage.waitForSelector('input[placeholder="(Enter the full name of organizer)"]');

                  await newPage.type('input[placeholder="(Enter the full name of organizer)"]', payload.Organizer_Information.keyPersonnelName);
                //   btn btn-primary btn-raised picker-button text-button undefined

                await this.clickButton(newPage,'.btn.btn-primary.btn-raised');

                await newPage.waitForSelector('input[name="SIGNATURE_AGREE_YN"]');

                // Use evaluate() to set the checkbox to checked
                await newPage.evaluate(() => {
                  const checkbox = document.querySelector('input[name="SIGNATURE_AGREE_YN"]');
                  if (!checkbox.checked) {
                    checkbox.click(); // Click to check it
                  }
                });
              

                await this.waitForTimeout(4000)
                await newPage.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');
    
                await newPage.click('button.btn.btn-raised.btn-primary.next.toolbar-button');


               await this.randomSleep(1000000,1200000); 
               const res = "form filled successfully";
               return res

            
        } catch (error) {
            logger.error('Error in North Dakota For LLC form handler:', error.stack);
            throw new Error(`North Dakota For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = NorthDakotaForLLC;











































































































































