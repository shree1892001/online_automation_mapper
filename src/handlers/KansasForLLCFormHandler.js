const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class KansasForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async KansasForLLC(page,jsonData,payload) {
      try {
        logger.info('Navigating to Kansas form submission page...');

const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;          await this.navigateToPage(page, url);
        
        const loginLinkSelector = 'a[href="https://www.sos.ks.gov/eforms/user_login.aspx?frm=BS"]';
          await page.waitForSelector(loginLinkSelector, { visible: true });
          await page.click(loginLinkSelector);
      
          const inputFields = [
            { label: 'MainContent_txtUserAccount', value: data.State.filingWebsiteUsername },
            { label: 'MainContent_txtPassword', value: data.State.filingWebsitePassword }
        ];
        await this.addInput(page, inputFields);

        await this.clickButton(page, '#MainContent_btnSignIn');  
        logger.info('Login form filled out successfully for Kensas LLC.');
        // await clickButton(page, 'a[href="/Form/Statement-of-Foreign-Qualification-of-Foreign-Limited-Liability-Partnership"]'); 
        logger.info('Form submission completed for Kansas LLC.');

        const createBusinessButtonSelector = '#MainContent_lnkbtnFormations';
        await page.waitForSelector(createBusinessButtonSelector, { visible: true });
        await page.click(createBusinessButtonSelector);

        const filingTypeLabelSelector = 'label[for="MainContent_rblFilingTypes_2"]';
        await page.waitForSelector(filingTypeLabelSelector, { visible: true });
        await page.click(filingTypeLabelSelector);

        const nextButtonSelector = '#MainContent_btnSelectEntityTypeContinue';
            await page.waitForSelector(nextButtonSelector, { visible: true });
            await page.click(nextButtonSelector);

        const businessNameInput = [
            { label: 'MainContent_txtBusinessName', value: payload.Name.Legal_Name }
            ];
            await this.addInput(page, businessNameInput);
            await this.tryAlternate(
              page, 
              "#MainContent_txtBusinessName",  // selector2
              "#MainContent_btnNameContinue",  // selector1
              "#MainContent_btnCheckName",  // nextbtnSelec
              payload.Name.Alternate_Legal_Name
            
          );
        logger.info('Filled all input fields successfully.');
        await page.waitForSelector('#MainContent_btnNameContinue', { visible: true, timeout: 0 });
        await this.clickButton(page, '#MainContent_btnNameContinue'); 


        await page.click('#MainContent_rblRAType_0');

        await page.click('#MainContent_btnResidentAgentSubmit');

    const residentagentinformation = [
       {label: 'MainContent_txtRAEntityName',value: payload.Registered_Agent.keyPersonnelName},
        {label: 'MainContent_txtRAAddress1',value: payload.Registered_Agent.Address.Street_Address},
        {label: 'MainContent_txtRAAddress2',value: payload.Registered_Agent.Address['Address_Line_2'] ||""},
        {label: 'MainContent_txtRAZip',value: String(payload.Registered_Agent.Address.Zip_Code)},
       {label: 'MainContent_txtRACity',value: payload.Registered_Agent.Address.City}
    ];
    await this.addInput(page, residentagentinformation);
       await this.clickDropdown(page, '#MainContent_ddlRAStates', 'Kansas');

    await this.clickButton(page, '#MainContent_btnResidentAgentSubmit'); 
    const res = "form filled successfully";
    return res

    } catch (error) {
        // Log full error stack for debugging
        logger.error('Error in Kansas LLC form handler:', error.stack);
        throw new Error(`Kansas LLC form submission failed: ${error.message}`);
      }
    }
}
module.exports = KansasForLLC;
