const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class OhioForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async OhioForCORP(page, jsonData){
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
        await page.select('#dllForms', 'For-Profit Corporation (Ohio) $99');

        await page.waitForSelector('#ctl00_pageContent_btnContinue');
        await page.click('#ctl00_pageContent_btnContinue');
        
        await this.fillInputByName(page, 'ctl00$pageContent$txtBusNm', payload.Name.Legal_Name);

        await page.waitForSelector('#ctl00_pageContent_btnContinue'); 
        await page.click('#ctl00_pageContent_btnContinue');

        
        await this.fillInputByName(page, 'ctl00$pageContent$txtNameOfComp', payload.Name.Legal_Name);
        await this.fillInputByName(page, 'ctl00$pageContent$txtCity', payload.Principal_Address.City);

        // Working method  
        await page.waitForSelector('#ddlCounty'); 
        await page.click('#ddlCounty'); 
        await page.select('#ddlCounty',payload.Principal_Address.PA_County);

        // Purpose
        await new Promise(resolve => setTimeout(resolve, 5000))
        // await this.fillInputByName(page, 'ctl00$pageContent$txtPurpose', payload.Name.Legal_Name);

        await page.waitForSelector('#ctl00_pageContent_btnContinue');
        await page.click('#ctl00_pageContent_btnContinue');

        // Shares Value 
        await this.fillInputByName(page, 'ctl00$pageContent$txtNumShares', payload.Stock_Details.Number_Of_Shares);        
        await this.clickDropdown(page, '#ddlShareCode', 'COMMON');
        
        // Continue button 
        await page.waitForSelector('#ctl00_pageContent_btnContinue');
        await page.click('#ctl00_pageContent_btnContinue');

        // Registered Agent 
        await this.fillInputByName(page, 'ctl00$pageContent$txtAgentName', payload.Registered_Agent.Name.RA_Name);
        await this.fillInputByName(page, 'ctl00$pageContent$txtAddress', payload.Registered_Agent.Address.Street_Address);
        await this.fillInputByName(page, 'ctl00$pageContent$txtCity', payload.Registered_Agent.Address.City);
        await this.fillInputByName(page, 'ctl00$pageContent$txtZipCode', String(payload.Registered_Agent.Address.RA_Postal_Code));
       
        await page.waitForSelector('#verifyBtn');
        await page.click('#verifyBtn');

        await this.fillInputByName(page, 'ctl00$pageContent$txtAgentSign', payload.Name.Legal_Name);

        // Continue button 
        await page.waitForSelector('input[name="ctl00$pageContent$SaveButton"]');
        await page.click('input[name="ctl00$pageContent$SaveButton"]');

        // Attachment Continue
        await page.waitForSelector('#ctl00_pageContent_btnNotRequired');
        await page.click('#ctl00_pageContent_btnNotRequired');

        // Incorporator Information 
        await this.fillInputByName(page, 'ctl00$pageContent$txtSignName', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
        
        // Add Incorporator 
        await page.waitForSelector('#ctl00_pageContent_btnAddSignature', { visible: true });
        await page.click('#ctl00_pageContent_btnAddSignature');

        
        // await page.waitForSelector('#ctl00_pageContent_Button1'); 
        // await page.click('#ctl00_pageContent_Button1');

        await page.click('.tooltip__closetext__container');

        
        await page.waitForSelector('#ctl00_pageContent_Button1'); 
        await page.click('#ctl00_pageContent_Button1');
        const res = "form filled successfully";
            return res


      } catch (error) {
          // Log full error stack for debugging
          logger.error('Error in Washington LLC form handler:', error.stack);
          throw new Error(`Washington LLC form submission failed: ${error.message}`);
        }
    }
   
module.exports = OhioForCORP;