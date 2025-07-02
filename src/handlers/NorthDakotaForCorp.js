
const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { timeout } = require('puppeteer');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class NorthDakotaForCorp extends BaseFormHandler {
    constructor() {
        super();
    }
    async NorthDakotaForCorp(page, jsonData, payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            await page.waitForSelector('.btn.btn-default.login-link');

            await page.click('.btn.btn-default.login-link');
            const inputFields = [
                { label: 'username', value: data.State.filingWebsiteUsername },
                { label: 'password', value: data.State.filingWebsitePassword }
            ];

            await this.addInput(page, inputFields);
            await page.waitForSelector('button.btn-raised.btn-light-primary.submit');

            await page.click('button.btn-raised.btn-light-primary.submit');


            await this.waitForTimeout(3000)

            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const nextStepButton = buttons.find(btn => btn.textContent.trim() === 'Next Step');
                if (nextStepButton) {
                    nextStepButton.click();
                }
            });



            await page.waitForSelector('.radio-label');

            await page.click('.radio-label');

            await page.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');

            await page.click('button.btn.btn-raised.btn-primary.next.toolbar-button');



            const labelText = 'Corporation';

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

            const optionLabelText = 'Business corporation';

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



            const linkText = 'Business Corporation Articles of Incorporation';

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
            await newPage.waitForSelector('label[for="reservedYN1"]', { visible: true, timeout: 12000 });
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
            // let country = payload.Principal_Address.PA_Country;

            // if (country === "USA") {
            //     country = "United States"; 
            //     payload.Principal_Address.PA_Country = country;
            // }



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
            await newPage.evaluate((jsonData) => {
                const select = document.querySelector('select[name="COUNTRY"]');
                const option = Array.from(select.options).find(option => option.text === "United States");
                if (option) {
                    select.value = option.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    throw new Error(`Country  not found in the dropdown`);
                }
            }, jsonData);

            await this.randomSleep(5000, 8000);
            await newPage.waitForSelector('input[aria-label="Principal executive office address: Address Line 1"]');

            await newPage.type('input[aria-label="Principal executive office address: Address Line 1"]', payload.Principal_Address.Street_Address);
            await newPage.type('input[aria-label="Principal executive office address: STE/APT/FL"]', payload.Principal_Address['Address_Line_2'] || " ");


            await this.fillInputByName(newPage, "CITY", payload.Principal_Address.City);
            await this.fillInputByName(newPage, "POSTAL_CODE", payload.Principal_Address.Zip_Code.toString()
            );
            let state = payload.Principal_Address.State;

            if (state === "North-Dakota") {
                state = "ND";
                payload.Principal_Address.State = state;
            }


            // { label: 'initialPrincipalOffice\\.state', value: payload.Principal_Address.State },
            //     { label: 'ZIP Code*', value: payload.Principal_Address.PA_Postal_Code },
            await this.clickDropdown(newPage, "#field-addr-state-HyRmVxJsW", payload.Principal_Address.State);



            await newPage.evaluate((jsonData) => {
                const select = document.querySelector('select[name="COUNTRY"]');
                const option = Array.from(select.options).find(option => option.text === "United States");
                if (option) {
                    select.value = option.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    throw new Error(`Country  not found in the dropdown`);
                }
            }, jsonData);

            await this.randomSleep(5000, 8000);
            await newPage.waitForSelector('input[aria-label="Mailing address: Address Line 1"]');

            await newPage.type('input[aria-label="Mailing address: Address Line 1"]', payload.Registered_Agent.Mailing_Information.Street_Address);


            await newPage.type('input[aria-label="Mailing address: City"]', payload.Registered_Agent.Mailing_Information.City);
            await newPage.type('input[aria-label="Mailing address: ZIP code"]', payload.Registered_Agent.Mailing_Information.Zip_Code.toString());


            await this.clickDropdown(newPage, "#field-addr-state-rJPeEgkib", "ND");

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
            await newPage.type('input[name="ADDR2"]', payload.Registered_Agent.Address['Address_Line_2'] || " ");

            // await newPage.type('input[name="ADDR2"]', data.address2 || '');
            await newPage.type('input[name="CITY"]', payload.Registered_Agent.Address.City);
            await newPage.type('input[name="POSTAL_CODE"]', payload.Registered_Agent.Address.Zip_Code.toString());

            await newPage.waitForSelector('#field-address1-r1v8uILPZ_MAIL');
            await newPage.type('#field-address1-r1v8uILPZ_MAIL', payload.Registered_Agent.Mailing_Information.Street_Address);

            await newPage.waitForSelector('#field-address2-r1v8uILPZ_MAIL');
            await newPage.type('#field-address2-r1v8uILPZ_MAIL', payload.Registered_Agent.Mailing_Information['Address_Line_2'] || " ");

            await newPage.waitForSelector('#field-addr-city-r1v8uILPZ_MAIL');
            await newPage.type('#field-addr-city-r1v8uILPZ_MAIL', payload.Registered_Agent.Mailing_Information.City);

            await newPage.waitForSelector('#field-addr-zip-r1v8uILPZ_MAIL');
            await newPage.type('#field-addr-zip-r1v8uILPZ_MAIL', payload.Registered_Agent.Mailing_Information.Zip_Code.toString());



            await this.randomSleep(1000, 3000);

            const submitButton = await newPage.waitForSelector('.controls .btn-primary', {
                visible: true,
                timeout: 5000
            });

            // Click the submit button and wait for navigation
            await Promise.all([
                this.randomSleep(10000, 20000),
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


            //  await newPage.type('textarea[name="PURPOSE"]', payload.Purpose.Purpose_Details);

            //  await this.fillInputByName(newPage,"PURPOSE",payload.Purpose.Purpose_Details);

            await newPage.waitForSelector('textarea[name="PURPOSE"]', { visible: true }); // Wait for the textarea
            await newPage.type('textarea[name="PURPOSE"]', payload.Purpose.Purpose_Details, { delay: 50 }); // Type with a slight delay


            await newPage.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');

            await newPage.click('button.btn.btn-raised.btn-primary.next.toolbar-button');

            await this.fillInputByName(newPage, "COMMON_SHARES", payload.Stock_Details.Shares_Par_Value.toString());

            await this.clickButton(newPage, 'button.form-button.add-row');
            await this.fillInputByName(newPage, "NO_OF_SHARES", payload.Stock_Details.Number_Of_Shares.toString());
            await this.fillInputByName(newPage, "PAR_VALUE", payload.Stock_Details.Shares_Par_Value.toString());
            const submitButton2 = await newPage.waitForSelector('.controls .btn-primary', {
                visible: true,
                timeout: 5000
            });

            // Click the submit button and wait for navigation
            await Promise.all([
                this.randomSleep(10000, 20000),
                submitButton2.click()
            ]);


            await newPage.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');

            await newPage.click('button.btn.btn-raised.btn-primary.next.toolbar-button');





            let fullName1 = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName.split(" ");
            await this.clickButton(newPage, 'button.form-button.add-row');


            await this.fillInputByName(newPage, "FIRST_NAME", fullName1[0]);
            await this.fillInputByName(newPage, "LAST_NAME", fullName1[1]);
            await this.fillInputByName(newPage, "ADDR1", payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(newPage, "ADDR2", payload.Incorporator_Information.Address['Address_Line_2'] || " ");

            await this.fillInputByName(newPage, "CITY", payload.Incorporator_Information.Address.City);



            await this.fillInputByName(newPage, "POSTAL_CODE", payload.Incorporator_Information.Address.Zip_Code.toString());
            await this.clickDropdown(newPage, "#field-addr-state-rkK7ieJsZ", payload.Incorporator_Information.Address.State);

            const submitButton1 = await newPage.waitForSelector('.controls .btn-primary', {
                visible: true,
                timeout: 5000
            });

            // Click the submit button and wait for navigation
            await Promise.all([
                this.randomSleep(10000, 20000),
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


            const labelSelector = 'label.checkbox-box[for="field-SyS3-tj3f"]';

            try {
                // Wait for the label to be visible
                await newPage.waitForSelector(labelSelector, { visible: true });

                // Click the label directly
                await newPage.click(labelSelector);

                console.log('Checkbox clicked successfully!');
            } catch (error) {
                console.error(`Failed to click the checkbox: ${error.message}`);
            }

            // await this.fillInputByPlaceholder(page, '(Enter full name of incorporator)', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName)

          

            // try {
            //     // Wait for the input field to be visible
            //     await page.waitForSelector(signatureInputSelector, { visible: true });

            //     // Input the Incorporator's name into the field
            //     await page.type(signatureInputSelector, payload.Incorporator_Information.Incorporator_Details.keyPersonnelName, { delay: 100 });

            //     console.log('Text successfully input into the signature field!');
            // } catch (error) {
            //     console.error(`Failed to input text into the signature field: ${error.message}`);
            // }
           


            // await this.clickButton(newPage, '.btn.btn-primary.btn-raised');

            // await newPage.waitForSelector('input[name="SIGNATURE_AGREE_YN"]');

            // Use evaluate() to set the checkbox to checked




           // await newPage.waitForSelector('button.btn.btn-raised.btn-primary.next.toolbar-button');

          // await newPage.click('button.btn.btn-raised.btn-primary.next.toolbar-button');


            await this.randomSleep(1000000, 1200000);
            const res = "form filled successfully";
            return res


        } catch (error) {
            logger.error('Error in North Dakota For CORP form handler:', error.stack);
            throw new Error(`North Dakota For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = NorthDakotaForCorp;











































































































































