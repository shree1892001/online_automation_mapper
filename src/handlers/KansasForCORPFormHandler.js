const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class KansasForCORP extends BaseFormHandler {
    constructor() {
        super();
    }


    async  KansasForCORP(page,jsonData,payload) {
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
        logger.info('Form submission completed for Kansas CORP.');

        const createBusinessButtonSelector = '#MainContent_lnkbtnFormations';
        await page.waitForSelector(createBusinessButtonSelector, { visible: true });
        await page.click(createBusinessButtonSelector);
        const filingTypeLabelSelector = 'label[for="MainContent_rblFilingTypes_0"]';
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
            await page.waitForSelector('#MainContent_btnNameContinue', { visible: true, timeout: 5000 });
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
        logger.info('Form submission completed for Kansas CORP.');

      
        await this.selectCheckboxByLabel(page, '#MainContent_chkGeneralPurpose');

        const labelForAttribute = 'MainContent_chkGeneralPurpose';  
        await page.waitForSelector(`label[for="${labelForAttribute}"]`, { visible: true, timeout: 30000 });
        await page.click(`label[for="${labelForAttribute}"]`);
       
        await this.clickButton(page, '#MainContent_btnPurposeSubmit'); 
        logger.info('Form submission completed for Kansas CORP.');


        await this.clickButton(page, '#MainContent_rblStockAuthority_0'); 
        logger.info('Form submission completed for Kansas CORP.');

        const share = [
          {label: 'MainContent_gvStock_txtShares',value:payload.Stock_Details.Number_Of_Shares},
          {label: 'MainContent_gvStock_txtValue',value:payload.Stock_Details.Shares_Par_Value},
        ]
          await this.addInput(page, share);

          await this.clickButton(page, '#MainContent_gvStock_lbAddNew'); 
          logger.info('Form submission completed for Kansas CORP.');

          await this.clickButton(page, '#MainContent_btnStockSubmitContinue'); 
          logger.info('Form submission completed for Kansas CORP.');

          const incorporatorinfo = [
          {label: 'MainContent_txtIncorporatorName',value: payload.Incorporator_Information.Incorporator_Details.keyPersonnelName},
          {label: 'MainContent_txtIncorporatorAddress1',value: payload.Incorporator_Information.Address.Street_Address},
          {label: 'MainContent_txtIncorporatorAddress2',value: payload.Incorporator_Information.Address['Address_Line_2'] ||""},
          {label: 'MainContent_txtIncorporatorZip',value: String(payload.Incorporator_Information.Address.Zip_Code)},
          {label: 'MainContent_txtIncorporatorCity',value: payload.Incorporator_Information.Address.City}
        ];
        await this.addInput(page, incorporatorinfo);
        await this.clickDropdown(page, '#MainContent_ddlIncorporatorCountry', 'USA');
        // await this.clickDropdown(page, '#MainContent_ddlIncorporatorStates', payload.Incorporator_Information.Address.State);

        await this.clickButton(page, '#MainContent_btnContinueIncorporators'); 
        logger.info('Form submission completed for Kansas CORP.');


        const directorinfo = [
          {label: 'MainContent_txtDirectorName',value: payload.Director_Information.Director_Details.Name},
          {label: 'MainContent_txtDirectorAddress1',value: payload.Director_Information.Address.Street_Address},
          {label: 'MainContent_txtDirectorAddress2',value: payload.Director_Information.Address.Dir_Address_Line_2 ||"" },
          {label: 'MainContent_txtDirectorZip',value: String(payload.Director_Information.Address.Dir_Zip_Code)},
          {label: 'MainContent_txtDirectorCity',value: payload.Director_Information.Address.Dir_City }
        ];
        await this.addInput(page, directorinfo);
        await this.clickDropdown(page, '#MainContent_ddlDirectorCountry', 'USA');
        // await this.clickDropdown(page, '#MainContent_ddlDirectorStates',payload.Director_Information.Address.Dir_State);

        await this.clickButton(page, '#MainContent_btnContinueDirectors'); 
        const res = "form filled successfully";
        return res        

      } catch (error) {
          // Log full error stack for debugging
          logger.error('Error in Kansas CORP form handler:', error.stack);
          throw new Error(`Kansas CORP form submission failed: ${error.message}`);
        }
      }
    }

module.exports = KansasForCORP;
