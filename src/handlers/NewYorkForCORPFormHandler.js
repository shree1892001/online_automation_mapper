const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class NewYorkForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

   

    async NewYorkForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await page.setCacheEnabled(false);
           

            await this.navigateToPage(page, url);

            const inputFields = [
                { label: 'Username', value: data.State.filingWebsiteUsername },
                { label: 'Password', value: data.State.filingWebsitePassword }
            ];

            await this.addInput1(page, inputFields);
            logger.info('Login form filled out successfully for New York CORP.');
            await this.submitForm(page);
           

            await this.clickLinkByLabel(page, 'Domestic Business Corporation (For Profit) and Domestic Limited Liability Company');
            await this.clickLinkByLabel(page, 'Certificate of Incorporation for a Domestic Business Corporation (not for professional service corporations)');
            
            
            const LLCfieldinput = [
                { label: 'P2_ENTITY_NAME', value: payload.Name.Legal_Name },
            ];
            await this.addInput1(page, LLCfieldinput);
            await page.evaluate(() => {
                const submitButton = document.querySelector('button.t-Button--hot');
                if (submitButton) {
                    submitButton.click();
                }
            });
            const is_present=await this.keyExists(data ,"legal_name");
            var isNameREplaced=false; 
            if(is_present){
            isNameREplaced=await this.tryAlternate(
                page, 
                "#P2_ENTITY_NAME",  // selector2
                "#P3_INITIAL_STATEMENT_0",  // selector1
                "button.t-Button--hot",  // nextbtnSelec
                payload.Name.Alternate_Legal_Name
              
            );
        }
            // await page.waitForSelector('#P3_INITIAL_STATEMENT_0', { visible: true });
            // await page.click('#P3_INITIAL_STATEMENT_0');
            await page.waitForSelector('label.u-checkbox[for="P3_INITIAL_STATEMENT_0"]',{ visible: true, timeout: 0 });

            await page.evaluate(() => {
                const label = document.querySelector('label.u-checkbox[for="P3_INITIAL_STATEMENT_0"]');
                if (label) {
                    label.click(); 
                } else {
                    console.error('Label not found!');
                }
            });
            let name=""
            if(!isNameREplaced){
                await page.waitForSelector('#P3_INITIAL_STATEMENT_0', { visible: true });

                await this.fillInputByName1(page, 'P3_ENTITY_NAME', payload.Name.Legal_Name);
                name=payload.Name.Legal_Name; 
                }else{
                //     await page.waitForSelector('#P3_INITIAL_STATEMENT_0', { visible: true });
                // await page.click('#P3_INITIAL_STATEMENT_0');

                await this.fillInputByName1(page, 'P3_ENTITY_NAME', payload.Name.Alternate_Legal_Name);
                name=payload.Name.CD_Alernate_Corporation_Name; 

            }


            // Article Fields
            // await this.fillInputByName1(page, 'P3_ENTITY_NAME', payload.Name.Legal_Name);
           
            await page.waitForSelector('#P3_COUNTY');

            // await page.click('#P3_COUNTY');
            await this.clickDropdown(page, "#P3_COUNTY", jsonData.data.County.countyName.toUpperCase());

            // Registered Agent Fields  
            if (payload.Registered_Agent) {
                await page.evaluate(() => {
                    const check = document.querySelector('#P3_RA_OPTION_0');
                    check.click();
                });
               const  [name,designator] =  await this.extractnamedesignator(payload.Registered_Agent.keyPersonnelName); 
                await this.fillInputByName1(page, 'P3_RA_NAME', name);
                await this.fillInputByName1(page, 'P3_RA_ADDR1', payload.Registered_Agent.Address.Street_Address);
                // await this.fillInputByName1(page, 'P3_RA_ADDR2', payload.Registered_Agent.Address['Address_Line_2']);

                await this.fillInputByName1(page, 'P3_RA_CITY', payload.Registered_Agent.Address.City);
                await this.fillInputByName1(page, 'P3_RA_POSTAL_CODE', String(payload.Registered_Agent.Address.Zip_Code));
            }

            await page.evaluate((payload) => {
                const stockInfo = payload.Stock_Information;
                console.log("Stock information is:", stockInfo);

                const shareValue = payload.Stock_Details.Shares_Par_Value;
                const stockType = shareValue !== undefined && shareValue !== null ? 'PV' : 'NPV';

                const numSharesInput = document.querySelector('input[name="P3_NUM_SHARES"]');
                if (numSharesInput) {
                    numSharesInput.value = payload.Stock_Details.Number_Of_Shares;
                    numSharesInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                const stockTypeSelect = document.querySelector('#P3_STOCK_TYPE');
                if (stockTypeSelect) {
                    stockTypeSelect.value = stockType;
                    stockTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }

                if (stockType === 'PV') {
                    const shareValueInput = document.querySelector('#P3_SHARE_VALUE');
                    if (shareValueInput) {
                        shareValueInput.value = shareValue.toString();
                        shareValueInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
            }, payload);

            // Principal Address Fields
            console.log(name); 
            await this.fillInputByName1(page, 'P3_SOP_NAME',payload.Name.Legal_Name);
            await this.fillInputByName1(page, 'P3_SOP_ADDR1', payload.Principal_Address.Street_Address);
            await this.fillInputByName1(page, 'P3_SOP_ADDR2', payload.Principal_Address['Address_Line_2'] || " " || " ");
            await this.fillInputByName1(page, 'P3_SOP_CITY', payload.Principal_Address.City);
            await this.fillInputByName1(page, 'P3_SOP_POSTAL_CODE', String(payload.Principal_Address.Zip_Code));

            await page.evaluate(() => {
                const effectiveDate = document.querySelector('input#P3_EXISTENCE_OPTION_0');
                const dissolutionDate = document.querySelector('input#P3_DURATION_OPTION_0');
                const liabilityStatement = document.querySelector('input#P3_LIAB_STATEMENT_0');

                if (effectiveDate) {
                    effectiveDate.click();
                    const radio1 = document.querySelector("input#P3_EXISTENCE_TYPE_0");
                    const radio2 = document.querySelector("input#P3_EXISTENCE_TYPE_1");

                    if (radio1 && radio1.checked) {
                        radio1.checked = true;
                    } else if (radio2 && radio2.checked) {
                        const effectiveDateInput = document.querySelector('input[name="P3_EXIST_CALENDAR"]');
                        if (effectiveDateInput) {
                            effectiveDateInput.value = data.effectiveDate;

                            effectiveDateInput.dispatchEvent(new Event('change', { bubbles: true }));

                            const dateComponent = document.querySelector('#P3_EXIST_CALENDAR');
                            if (dateComponent) {
                                const event = new Event('ojInputDateValueChanged', { bubbles: true });
                                dateComponent.dispatchEvent(event);
                            }
                        }
                    }
                }

                if (dissolutionDate) {
                    dissolutionDate.click();
                    const radio1 = document.querySelector("input#P3_DISSOLUTION_TYPE_0");
                    const radio2 = document.querySelector("input#P3_DISSOLUTION_TYPE_1");

                    if (radio1 && radio1.checked) {
                        radio1.checked = true;
                    } else if (radio2 && radio2.checked) {
                        const effectiveDateInput = document.querySelector('input[name="P3_DIS_CALENDAR"]');
                        if (effectiveDateInput) {
                            effectiveDateInput.value = data.effectiveDate;

                            effectiveDateInput.dispatchEvent(new Event('change', { bubbles: true }));

                            const dateComponent = document.querySelector('#P3_DIS_CALENDAR');
                            if (dateComponent) {
                                const event = new Event('ojInputDateValueChanged', { bubbles: true });
                                dateComponent.dispatchEvent(event);
                            }
                        }
                    }
                }

                if (liabilityStatement) {
                    liabilityStatement.click();
                }
            });

            // Organizer Fields
            
            const fullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [firstName, lastName] = fullName.split(' ');

            
            await this.fillInputByName1(page, 'P3_INCORP_FNAME', firstName);

            await this.fillInputByName1(page, 'P3_INCORP_LNAME', lastName);
            await this.fillInputByName1(page, 'P3_SIGNATURE', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);

            await this.fillInputByName1(page, 'P3_INCORP_ADDR1', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName1(page, 'P3_INCORP_ADDR2', payload.Incorporator_Information.Address['Address_Line_2'] || " " || " ");

            await this.fillInputByName1(page, 'P3_INCORP_CITY', payload.Incorporator_Information.Address.City);
            await this.fillInputByName1(page, 'P3_INCORP_POSTAL_CODE', String(payload.Incorporator_Information.Address.Zip_Code));
            await this.fillInputByName1(page, 'P3_FILER_NAME', "vState Filings");
            await this.fillInputByName1(page, 'P3_FILER_ADDR1', "301 Mill Road");
            await this.fillInputByName1(page, 'P3_FILER_ADDR2', "Suite U5");
            await this.fillInputByName1(page, 'P3_FILER_CITY', "Hewlett");
            await this.fillInputByName1(page, 'P3_FILER_POSTAL_CODE',"11557");
            const clicked = await page.$$eval('span.t-Button-label', spans => {
                for (const span of spans) {
                  if (span.textContent.trim().toLowerCase().includes('continue')) {
                    span.closest('button')?.click();
                    return true;
                  }
                }
                return false;
              });
            
              if (clicked) {
                console.log('Clicked the Continue button.');
              } else {
                console.log('Continue button not found.');
              }
            // await page.evaluate(() => {
            //     const submitButton = document.querySelector('button.t-Button--hot');
            //     if (submitButton) {
            //         submitButton.click();
            //     }
            // });
            
            // const maxRetries = 10;
            // const retryDelay = 1000; // ms
            // let attempt = 0;
            // let found = false;
            
            // while (attempt < maxRetries) {
            //     try {
            //         await page.waitForSelector('.app-EFILING', { visible: true, timeout: retryDelay });
            //         logger.info(`.app-EFILING found on attempt ${attempt + 1}`);
            //         found = true;
            //         break;
            //     } catch (err) {
            //         logger.warn(`Attempt ${attempt + 1}: .app-EFILING not found, reloading page...`);
            //         await page.reload({ waitUntil: 'networkidle2' });
            //         await this.waitForTimeout(500);
            //         attempt++;
            //     }
            // }
            
            // if (!found) {
            //     throw new Error('Failed to detect .app-EFILING after form submission and retries');
            // }
            // await page.evaluate(() => {
            //     const submitButton = document.querySelector('button.t-Button--hot');
            //     if (submitButton) {
            //         submitButton.click();
            //     }
            // });

          
            // // Wait for the page with the class name .app-EFILING to be visible
            
            //     try {
            //         await page.waitForSelector('.app-EFILING', { visible: true, timeout:0});
            //         console.log('Page with class .app-EFILING is visible.');

            //         // Perform a hard reload after the element is detected
                   

            //         // Exit loop if successful

            //     } catch (error) {
            //         console.error('Error waiting for .app-EFILING or during reload:', error.message);
            //         // Optionally, you can also try reloading the page here if the selector isn't found
                    

            //         await this.randomSleep(1000, 2000);


            //     }

            logger.info('New York CORP form submitted successfully.');
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in New-york For CORP form handler:', error.stack);
            throw new Error(`New-york For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = NewYorkForCORP;
