const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class OhioForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async OhioForLLC(page, jsonData){
        logger.info('Navigating to Ohio form submission page...');
        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
        await this.navigateToPage(page, url);


        // Wait for the link and click it
        await page.waitForSelector('a.btn.menu-lnks');
        await page.click('a.btn.menu-lnks');

        await this.fillInputByName(page, 'ctl00$pageContent$txtUserName', data.State.filingWebsiteUsername);
        await this.fillInputByName(page, 'ctl00$pageContent$txtPassword', data.State.filingWebsitePassword);
        await this.fillInputByName(page, 'ctl00$pageContent$txtEsignature', 'UBTD');
        await page.waitForSelector('#ctl00_pageContent_btnLogin'); 
        await page.click('#ctl00_pageContent_btnLogin');

        await page.waitForSelector('#FileNew'); 
        await page.click('#FileNew');

        await page.waitForSelector('#dllForms'); 

        // Select an option from the dropdown by its visible text
        await page.select('#dllForms', 'Limited Liability Company (Ohio) $99');

        // await this.clickDropdown(page, '#ctl00$pageContent$dllForms', 'Limited Liability Company (Ohio) $99');

        await page.waitForSelector('#ctl00_pageContent_btnContinue'); // Using ID
        await page.click('#ctl00_pageContent_btnContinue');
        
        await this.fillInputByName(page, 'ctl00$pageContent$txtBusNm', payload.Name.Legal_Name);

        await page.waitForSelector('#ctl00_pageContent_btnContinue'); // Using ID
        await page.click('#ctl00_pageContent_btnContinue');

        
        await this.fillInputByName(page, 'ctl00$pageContent$txtNameOfComp', payload.Name.Legal_Name);

        // Purpose
        
        // await new Promise(resolve => setTimeout(resolve, 4000))
        // await this.fillInputByName(page, 'ctl00$pageContent$txtPurpose', payload.Name.Legal_Name);

        await page.waitForSelector('#ctl00_pageContent_btnContinue'); // Using ID
        await page.click('#ctl00_pageContent_btnContinue');

        await this.fillInputByName(page, 'ctl00$pageContent$txtAgentName', payload.Registered_Agent.keyPersonnelName);
        await this.fillInputByName(page, 'ctl00$pageContent$txtAddress', payload.Registered_Agent.Address.Street_Address);
        await this.fillInputByName(page, 'ctl00$pageContent$txtCity', payload.Registered_Agent.Address.City);
        await this.fillInputByName(page, 'ctl00$pageContent$txtZipCode', String(payload.Registered_Agent.Address.Zip_Code));
       
        await page.waitForSelector('#verifyBtn'); // Using ID
        await page.click('#verifyBtn');

        await this.fillInputByName(page, 'ctl00$pageContent$txtAgentSign', payload.Organizer_Information.keyPersonnelName);

        // Continue button 
        await page.waitForSelector('input[name="ctl00$pageContent$SaveButton"]');
        await page.click('input[name="ctl00$pageContent$SaveButton"]');

        // Attachment Continue
        await page.waitForSelector('#ctl00_pageContent_btnNotRequired');
        await page.click('#ctl00_pageContent_btnNotRequired');

        //Organizer Info  
        await this.fillInputByName(page, 'ctl00$pageContent$txtSignName', payload.Organizer_Information.keyPersonnelName);
        
        // Add Organizer 
        await page.waitForSelector('#ctl00_pageContent_btnAddSignature', { visible: true });
        await page.click('#ctl00_pageContent_btnAddSignature');

        
        await page.click('.tooltip__closetext__container');
        
        await page.waitForSelector('#ctl00_pageContent_Button1'); // Using ID
        await page.click('#ctl00_pageContent_Button1');
        const res = "form filled successfully";
            return res
        
      } catch (error) {
          // Log full error stack for debugging
          logger.error('Error in Washington LLC form handler:', error.stack);
          throw new Error(`Washington LLC form submission failed: ${error.message}`);
        }
    }
    

module.exports = OhioForLLC;