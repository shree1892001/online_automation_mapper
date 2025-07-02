const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class NewYorkForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async NewYorkForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');

            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            console.log(data.State.filingWebsiteUsername)
            console.log(data.State.filingWebsitePassword )
            const inputFields = [
                { label: 'Username', value: data.State.filingWebsiteUsername },
                { label: 'Password', value: data.State.filingWebsitePassword }
            ];

            await this.addInput1(page, inputFields);
            logger.info('Login form filled out successfully for New York LLC.');
            await this.submitForm(page);

            await this.clickLinkByLabel(page, 'Domestic Business Corporation (For Profit) and Domestic Limited Liability Company');
            await this.clickLinkByLabel(page, 'Articles of Organization for a Domestic Limited Liability Company (not for professional service limited liability companies)');
            await this.fillInputByName1(page, 'P2_ENTITY_NAME', payload.Name.Legal_Name);
                await this.randomSleep();
                 await page.evaluate(() => {
                const submitButton = document.querySelector('button.t-Button--hot');
                if (submitButton) {
                    submitButton.click();
                }
            });            
            
            const  check_alternate=await this.keyExists(jsonData,"Alternate_Legal_Name");
            console.log(check_alternate);


               var isNameREplaced=false;
            if(check_alternate){

                isNameREplaced=await this.tryAlternate(
                page, 
                "#P2_ENTITY_NAME",  // selector2
                "#P4_INITIAL_STATEMENT_0",  // selector1
                "button.t-Button--hot",  // nextbtnSelec
                payload.Name.Alternate_Legal_Name
              
            );
        }         
            //   await page.click('#P4_INITIAL_STATEMENT_0');
            await page.waitForSelector('label.u-checkbox[for="P4_INITIAL_STATEMENT_0"]');

    await page.evaluate(() => {
        const label = document.querySelector('label.u-checkbox[for="P4_INITIAL_STATEMENT_0"]');
        if (label) {
            label.click(); 
        } else {
            console.error('Label not found!');
        }
    });

            var name=""
            if(!isNameREplaced){
            await page.waitForSelector('#P4_INITIAL_STATEMENT_0', { visible: true });

            await this.fillInputByName1(page, 'P4_ENTITY_NAME', payload.Name.Legal_Name);
            name= payload.Name.Legal_Name
            }else{
                await page.waitForSelector('#P4_INITIAL_STATEMENT_0', { visible: true });

            await this.fillInputByName1(page, 'P4_ENTITY_NAME', payload.Name.Alternate_Legal_Name);
            name= payload.Name.Alternate_Legal_Name

        }
            await this.clickDropdown(page, "#P4_COUNTY", jsonData.data.County.countyName.toUpperCase());

            await this.fillInputByName1(page, 'P4_SOP_NAME', name);
            await this.fillInputByName1(page, 'P4_SOP_ADDR1', payload.Principal_Address.Street_Address);
            await this.fillInputByName1(page, 'P4_SOP_ADDR2', payload.Principal_Address['Address_Line_2'] || " ");

            await this.fillInputByName1(page, 'P4_SOP_CITY', payload.Principal_Address.City);
            await this.fillInputByName1(page, 'P4_SOP_POSTAL_CODE', String(payload.Principal_Address.Zip_Code.toString()));

            if (payload.Registered_Agent) {
                await page.evaluate(() => {
                    const check = document.querySelector('#P4_RA_OPTION_0');
                    check.click();
                });
                await this.fillInputByName1(page, 'P4_RA_NAME', payload.Registered_Agent.keyPersonnelName);
                await this.fillInputByName1(page, 'P4_RA_ADDR1', payload.Registered_Agent.Address.Street_Address);
                await this.fillInputByName1(page, 'P4_RA_ADDR2', payload.Registered_Agent.Address['Address_Line_2'] || " ");

                await this.fillInputByName1(page, 'P4_RA_CITY', payload.Registered_Agent.Address.City);
                await this.fillInputByName1(page, 'P4_RA_POSTAL_CODE', payload.Registered_Agent.Address.Zip_Code.toString());
            }

            await page.evaluate(() => {
                const effectiveDate = document.querySelector('input#P4_EXISTENCE_OPTION_0');
                const Dissolution_Date = document.querySelector('input#P4_DISSOLUTION_OPTION_0');
                const liability_statement = document.querySelector('input#P4_LIAB_STATEMENT_0');

                if (effectiveDate) {
                    effectiveDate.click();
                }
                if (Dissolution_Date) {
                    Dissolution_Date.click();
                }
                if (liability_statement) {
                    liability_statement.click();
                }
            });

            await this.fillInputByName1(page, 'P4_ORGANIZER_NAME', payload.Organizer_Information.keyPersonnelName);
            await this.fillInputByName1(page, 'P4_SIGNATURE', payload.Organizer_Information.keyPersonnelName);
            await this.fillInputByName1(page, 'P4_FILER_NAME', "vState Filings");
            await this.fillInputByName1(page, 'P4_FILER_ADDR1', "301 Mill Road");
            await this.fillInputByName1(page, 'P4_FILER_ADDR2', "Suite U5");
            await this.fillInputByName1(page, 'P4_FILER_CITY', "Hewlett");
            await this.fillInputByName1(page, 'P4_FILER_POSTAL_CODE', "11557");
            await page.evaluate(() => {
                // Trigger the exact function without relying on click
                if (window.apex && typeof apex.submit === 'function') {
                  apex.submit({ request: 'CONTINUE', validate: true });
                }
              });
            // await page.evaluate(() => {
            //     const submitButton = document.querySelector('button.t-Button--hot');
            //     if (submitButton) {
            //         submitButton.click();
            //     }
            // });

            // await page.waitForSelector('.app-EFILING', { visible: true, timeout: 0 });
            // logger.info('Page with class .app-EFILING is visible.');
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
            
            const res = "Form filled successfully";
            return res;
        } catch (error) {
            logger.error('Error in New York For LLC form handler:', error.stack);
            throw new Error(`New York For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = NewYorkForLLC;