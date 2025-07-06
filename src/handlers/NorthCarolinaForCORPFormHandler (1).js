const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class NorthCarolinaCORP extends BaseFormHandler {
    constructor() {
        super();
    }


    async  NorthCarolinaForCorp(page,jsonData,payload) {
        try {
            logger.info('Navigating to North Carolina form submission page...');
            
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll("button, a, div"));
                const signInButton = buttons.find(btn => btn.textContent.trim() === "Sign In");
                if (signInButton) {
                    signInButton.click();
                }
            });
            
            // Fill login credentials
            await page.waitForSelector('[name="Input.UserName"]', { visible: true });
            await this.fillInputByName(page, 'Input.UserName', data.State.filingWebsiteUsername);
            await this.fillInputByName(page, 'Input.Password', data.State.filingWebsitePassword);

            // Log in button
            await page.waitForSelector('button.usa-button.spinButton.defaultButton', { visible: true });
            await page.evaluate(() => {
                const loginButton = document.querySelector('button.usa-button.spinButton.defaultButton');
                if (loginButton) {
                    loginButton.click(); // Simulates a real user click
                    loginButton.dispatchEvent(new Event('click', { bubbles: true })); // Ensures event propagation
                }
            });

            // Registered a business
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            
            // Click the "Register Your New Business" link
            await page.waitForSelector('a.divButton.usa-button', { visible: true });
            await page.evaluate(() => {
                const registerButton = document.querySelector('a.divButton.usa-button');
                if (registerButton) {
                    registerButton.click();
                }
            });
            
            await page.waitForNavigation({ waitUntil: 'networkidle2' });

             // Select "No" for Filing Type Foreign
             await page.waitForSelector('#FilingType_Foreign', { visible: true });
             await page.select('#FilingType_Foreign', 'NO');
            
             // Select "Professional Corporation"
            await page.waitForSelector('#FilingType_ProfileTypeId', { visible: true });
            await page.select('#FilingType_ProfileTypeId', '26');

            // Click "Begin Creation Filing" button
            await page.waitForSelector('#next-step', { visible: true });
            await page.evaluate(() => {
                const beginButton = document.querySelector('#next-step');
                if (beginButton) {
                    beginButton.click();
                }
            });

            // Click "Start Filing" button
            await page.waitForSelector('button.usa-button.spinButton', { visible: true });
            await page.evaluate(() => {
                const startFilingButton = document.querySelector('button.usa-button.spinButton');
                if (startFilingButton) {
                    startFilingButton.click();
                }
            });

            // Click "Start Online Filing" button
            await page.waitForSelector('button.usa-button.spinButton', { visible: true });
            await page.evaluate(() => {
                const startOnlineFilingButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                    .find(btn => btn.textContent.trim() === 'Start online filing');
                if (startOnlineFilingButton) {
                    startOnlineFilingButton.click();
                }
            });

            // Fill in LLC Name
            await page.waitForSelector('[name="Name.EntityName"]', { visible: true });
            await this.fillInputByName(page, 'Name.EntityName', payload.Name.Legal_Name);

            
            // Click "Save the name" button
            await page.waitForSelector('button.usa-button.spinButton', { visible: true });
            await page.evaluate(() => {
                const saveNameButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                    .find(btn => btn.textContent.trim() === 'Save the name');
                if (saveNameButton) {
                    saveNameButton.click();
                }
            });



            //Select Board
            await new Promise(resolve => setTimeout(resolve, 10000))
            await page.waitForSelector('button.usa-button.spinButton', { visible: true });
            await page.evaluate(() => {
                const saveBoardButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                    .find(btn => btn.textContent.trim() === 'Save the board(s)');
                if (saveBoardButton) {
                    saveBoardButton.click();
                }
            });


            // Document Submit
            await new Promise(resolve => setTimeout(resolve, 30000))
             await page.waitForSelector('button.usa-button.spinButton', { visible: true });
             await page.evaluate(() => {
                 const confirmDocumentsButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                     .find(btn => btn.textContent.trim() === 'Confirm the documents');
                 if (confirmDocumentsButton) {
                     confirmDocumentsButton.click();
                 }
             });

            //  Purpose
            await page.waitForSelector('[name="TextValue"]', { visible: true });
            await page.evaluate(() => {
                const textarea = document.querySelector('[name="TextValue"]');
                if (textarea) {
                    textarea.value = 'purpose';
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            // Save button
            await page.evaluate(() => {
                const saveServicesButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                    .find(btn => btn.textContent.trim() === 'Save the service(s)');
                if (saveServicesButton) {
                    saveServicesButton.click();
                }
            });
        
            console.log('Clicked "Save the service(s)" button.');

            // Registered Agent

            await page.waitForSelector('button.usa-button.spinButton', { visible: true });
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
                page.evaluate(() => {
                    const button = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                        .find(btn => btn.textContent.trim() === 'Agent is a North Carolina resident');
                    if (button) {
                        button.click();
                    }
                })
            ]);
        
            console.log('Clicked "Agent is a North Carolina resident" button.');
        


             // Set the value using evaluate
             const fullName = payload.Registered_Agent.keyPersonnelName; // Example full name
             const [firstName, lastName] = fullName.split(' '); // Splitting the full name

             // Fill First Name
             await page.evaluate((firstName) => {
                 const inputField = document.querySelector('input[name="Name.FirstName"]');
                 if (inputField) {
                     inputField.value = firstName;
                     inputField.dispatchEvent(new Event('input', { bubbles: true }));
                     inputField.dispatchEvent(new Event('change', { bubbles: true }));
                 }
             }, firstName);
             
             // Fill Last Name
             await page.evaluate((lastName) => {
                 const inputField = document.querySelector('input[name="Name.LastName"]');
                 if (inputField) {
                     inputField.value = lastName;
                     inputField.dispatchEvent(new Event('input', { bubbles: true }));
                     inputField.dispatchEvent(new Event('change', { bubbles: true }));
                 }
             }, lastName);
             
             console.log(`Filled First Name: ${firstName}, Last Name: ${lastName}`);
             

            // Button
            await page.evaluate(() => {
                const saveAgentButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                    .find(btn => btn.textContent.trim() === 'Save the agent name');
                if (saveAgentButton) {
                    saveAgentButton.click();
                }
            });
        
            console.log('Clicked "Save the agent name" button.');

            // Email
            await page.waitForSelector('input[name="TextValue"]', { visible: true });
            // Fill the input field with a value
            await page.type('input[name="TextValue"]', payload.Registered_Agent.EmailId);
            console.log('Filled "TextValue" field with');

                // Click the "Save the email" button
                await page.evaluate(() => {
                    const saveEmailButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                        .find(btn => btn.textContent.trim() === 'Save the email');
                    if (saveEmailButton) {
                        saveEmailButton.click();
                    }
                });

                console.log('Clicked "Save the email" button.');

                //AddressLine1
                await page.waitForSelector('textarea[name="Address.Address"]', { visible: true });
                await page.type('textarea[name="Address.Address"]', payload.Registered_Agent.Address.Street_Address);
                console.log('Filled "Address.Address" field with address.');
                

                // City
                await page.waitForSelector('input[name="Address.City"]', { visible: true });
                await page.type('input[name="Address.City"]', payload.Registered_Agent.Address.City);
                console.log('Filled "Address.City" field with city.');

                // ZipCode
                await page.waitForSelector('input[name="Address.Zip"]', { visible: true });
                await page.type('input[name="Address.Zip"]', payload.Registered_Agent.Address.Zip_Code);
                console.log('Filled "Address.Zip" field with Zip Code.');

                // County
                await page.waitForSelector('#Address_CountyName', { visible: true });
                await page.select('#Address_CountyName', jsonData.data.County.countyName);

                console.log(`Selected county: ${jsonData.data.County.countyName}`);

                
                //Save Address
                await page.evaluate(() => {
                    const saveAddressButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                        .find(btn => btn.textContent.trim() === 'Save the address');
                    if (saveAddressButton) {
                        saveAddressButton.click();
                    }
                });
             


                // Mailing address
                await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                await page.evaluate(() => {
                    const noButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                        .find(btn => btn.textContent.trim() === 'No');
                    if (noButton) {
                        noButton.click();
                    }
                });

                //AddressLine1
                await page.waitForSelector('textarea[name="Address.Address"]', { visible: true });
                await page.type('textarea[name="Address.Address"]', payload.Registered_Agent.Mailing_Information.Street_Address);
                console.log('Filled "Address.Address" field with address.');
                
                // City
                await page.waitForSelector('input[name="Address.City"]', { visible: true });
                await page.type('input[name="Address.City"]', payload.Registered_Agent.Mailing_Information.City);
                console.log(`Filled "Address.City" field with "${payload.Registered_Agent.Mailing_Information.City}".`);

                // ZipCode
                await page.waitForSelector('input[name="Address.Zip"]', { visible: true });
                await page.type('input[name="Address.Zip"]', payload.Registered_Agent.Mailing_Information.Zip_Code);
                console.log(`Filled "Address.Zip" field with "${payload.Registered_Agent.Mailing_Information.Zip_Code}".`);

                    
                    // Save Button
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const saveAddressButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Save the address');
                        if (saveAddressButton) {
                            saveAddressButton.click();
                        }
                    });


                    // Checkbox
                    await new Promise(resolve => setTimeout(resolve, 5000))
                    await page.evaluate(() => {
                        const checkbox = document.querySelector('#Certify');
                        if (checkbox && !checkbox.checked) {
                            checkbox.click();
                        }
                    });
                    
                    // Save Button
                    await new Promise(resolve => setTimeout(resolve, 5000))
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const saveAddressButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Save the address');
                        if (saveAddressButton) {
                            saveAddressButton.click();
                        }
                    });

                    //Yes or No  
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const yesButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Yes');
                        if (yesButton) {
                            yesButton.click();
                        }
                    });

                    console.log('Clicked the "Yes" button.');

                

                    // PricpalOffice Conatct No
                    await page.waitForSelector('input[name="TextValue"]', { visible: true });
                    await page.type('input[name="TextValue"]', payload.Registered_Agent.ContactNo);
                    console.log('Filled the phone number field with "123-456-7890".');

                    //Save Phone Number
                    await page.evaluate(() => {
                        const savePhoneButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Save the phone number');
                        if (savePhoneButton) {
                            savePhoneButton.click();
                        }
                    });
                    console.log('Clicked "Save the phone number" button.');

                // Address Line 1
                    await page.waitForSelector('textarea[name="Address.Address"]', { visible: true });
                    await page.type('textarea[name="Address.Address"]', payload.Principal_Address.Street_Address);
                    console.log(`Filled "Address.Address" field with "${payload.Principal_Address.Street_Address}".`);

                    // City
                    await page.waitForSelector('input[name="Address.City"]', { visible: true });
                    await page.type('input[name="Address.City"]', payload.Principal_Address.City);
                    console.log(`Filled "Address.City" field with "${payload.Principal_Address.City}".`);

                    // ZipCode
                    await page.waitForSelector('input[name="Address.Zip"]', { visible: true });
                    await page.type('input[name="Address.Zip"]', payload.Principal_Address.Zip_Code);
                    console.log(`Filled "Address.Zip" field with "${payload.Principal_Address.Zip_Code}".`);

                    await page.waitForSelector('#Address_CountyName', { visible: true });

                    // Zip Code
                    await page.evaluate((countyName) => {
                        const dropdown = document.querySelector('#Address_CountyName');
                        if (dropdown) {
                            dropdown.value = countyName; // Set the selected county
                            dropdown.dispatchEvent(new Event('input', { bubbles: true }));
                            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }, jsonData.data.County.countyName);
                    
                    console.log(`Selected county: ${jsonData.data.County.countyName}`);
                    

                    // Save button
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const saveAddressButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Save the address');
                        if (saveAddressButton) {
                            saveAddressButton.click();
                        }
                    });

                    // Yes Button
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const yesButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Yes');
                        if (yesButton) {
                            yesButton.click();
                        }
                    });
                    console.log('Clicked "Yes" button.');


                    await new Promise(resolve => setTimeout(resolve, 30000))
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const confirmButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Confirm the document or continue');
                        if (confirmButton) {
                            confirmButton.click();
                        }
                    });
                    console.log('Clicked "Confirm the document or continue" button.');

                    //Incorporator Information
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const addIncorporatorButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Add incorporator');
                        if (addIncorporatorButton) {
                            addIncorporatorButton.click();
                        }
                    });
                    
                    console.log('Clicked the "Add incorporator" button.');


                    // dropdown
                    await page.waitForSelector('select#PartyType', { visible: true });
                    await page.select('select#PartyType', 'NO');
                    console.log('Selected "Individual" from the PartyType dropdown.');


                    const fullName1 = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName; // Example full name
                    const [firstName1, lastName1] = fullName1.split(' '); // Splitting the full name
                    
                    // Wait and Fill First Name
                    await page.waitForSelector('input[name="FirstName"]', { visible: true });
                    await page.type('input[name="FirstName"]', firstName1);
                    console.log(`Filled "FirstName" field with "${firstName1}".`);
                    
                    // Wait and Fill Last Name
                    await page.waitForSelector('input[name="LastName"]', { visible: true });
                    await page.type('input[name="LastName"]', lastName1);
                    console.log(`Filled "LastName" field with "${lastName1}".`);                    

                    //Address Line 1
                    await page.waitForSelector('textarea[name="Address"]', { visible: true });
                    await page.type('textarea[name="Address"]', payload.Incorporator_Information.Address.Street_Address);
                    console.log('Filled "Address" field with "123 Main Street, City, State, ZIP".');

                    // City
                    await page.waitForSelector('input[name="City"]', { visible: true });
                    await page.type('input[name="City"]', payload.Incorporator_Information.Address.City);
                    console.log('Filled "City" field with "Raleigh".');

                    // State
                    await page.waitForSelector('select#State', { visible: true });
                    await page.select('select#State', payload.Incorporator_Information.Address.State);
                    console.log('Selected "North Carolina" from the State dropdown.');

                    // Zip_code
                    const zipCode = String(payload.Incorporator_Information.Address.Zip_Code); 
                    await page.waitForSelector('input[name="Zip"]', { visible: true });
                    await page.type('input[name="Zip"]', zipCode);
                    console.log(`Filled "Zip" field with "${zipCode}".`);

                    // Save button
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const saveButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Save');
                        if (saveButton) {
                            saveButton.click();
                        }
                    });
                    console.log('Clicked the "Save" button.');

                    // Save Incorporator
                    
                    await new Promise(resolve => setTimeout(resolve, 6000))
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    // Click the "Save incorporators" button
                    await page.evaluate(() => {
                        const saveIncorporatorsButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Save incorporators');
                        if (saveIncorporatorsButton) {
                            saveIncorporatorsButton.click();
                        }
                    });

                    console.log('Clicked the "Save incorporators" button.');

                    // Save Officer
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const saveOfficersButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Save the officers');
                        if (saveOfficersButton) {
                            saveOfficersButton.click();
                        }
                    });
                    console.log('Clicked the "Save the officers" button.');

                    // Shares information
                    await page.waitForSelector('input[name="TextValue"]', { visible: true });
                    await page.type('input[name="TextValue"]', payload.Stock_Details.Number_Of_Shares);
                    console.log('Filled "TextValue" field with "Sample Input".');

                    //Save Stocks
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const saveStockButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'Save stock');
                        if (saveStockButton) {
                            saveStockButton.click();
                        }
                    });
                    console.log('Clicked the "Save stock" button.');

                    // Common stocks button
                    await page.waitForSelector('button.usa-button.spinButton', { visible: true });
                    await page.evaluate(() => {
                        const noCommonStockButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                            .find(btn => btn.textContent.trim() === 'No(common stock)');
                        if (noCommonStockButton) {
                            noCommonStockButton.click();
                        }
                    });
                    console.log('Clicked the "No(common stock)" button.');


                    
                    // // Text field
                    // await page.evaluate(() => {
                    //     const textarea = document.querySelector('textarea[name="TextValue"]');
                    //     if (textarea) {
                    //         textarea.value = 'Mandatory field';
                    //         textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    //         textarea.dispatchEvent(new Event('change', { bubbles: true }));
                    //     }
                    // });


                    // await page.waitForSelector('button.usa-button.spinButton', { visible: true });

                    // // Save
                    // await page.evaluate(() => {
                    //     const saveLicenseeButton = Array.from(document.querySelectorAll('button.usa-button.spinButton'))
                    //         .find(btn => btn.textContent.trim() === 'Save the licensee');
                    //     if (saveLicenseeButton) {
                    //         saveLicenseeButton.click();
                    //     }
                    // });
                    // console.log('Clicked the "Save the licensee" button.');





                    
                } catch (error) {
            logger.error('Error in North Carolina LLC form handler:', error.stack);
            throw new Error(`North Carolina LLC form submission failed: ${error.message}`);
        }
    }
}


module.exports = NorthCarolinaCORP;





