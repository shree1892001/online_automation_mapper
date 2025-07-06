const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class DcForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async DcForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            page.click('a[href="/Account.aspx/AccessDcLogOn?isAccessDc=true"]')
            const inputFields = [
                { label: 'input28', value: data.State.filingWebsiteUsername },
                { label: 'input36', value: data.State.filingWebsitePassword }
            ];
            await this.addInput(page,inputFields);
            await page.click('input[name="rememberMe"]');
            await page.click('input.button.button-primary[type="submit"][value="Sign in"]');
            await page.waitForSelector('a[href="/Home.aspx/wizard1"]');
            page.click('a[href="/Home.aspx/wizard1"]')
            await page.waitForSelector('a.my-button[href="/Home.aspx/wizard3"]');
            page.click('a.my-button[href="/Home.aspx/wizard3"]')
            await page.waitForSelector('a[href="/Biz.aspx/RedirectFromNewService/33"]');
            page.click('a[href="/Biz.aspx/RedirectFromNewService/33"]')
            await page.waitForSelector('#NextButton');
            await page.click('#NextButton');
            await page.waitForSelector('#NextButton');
            await page.click('#NextButton');
            await this.fillInputByName(page, 'BizData.BusinessName', payload.Name.Legal_Name);
            await this.clickDropdown(page, 'select[name="BizData.BusinessSuffix"]', 'Corporation');
            await page.waitForSelector('#NextButton');
            await page.click('#NextButton');
            await this.fillInputByName(page,'CurrentBusinessAddress.Line1',payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page,'CurrentBusinessAddress.Line2',payload.Incorporator_Information.Address['Address_Line_2']||"");
            await this.fillInputByName(page,'CurrentBusinessAddress.City',payload.Incorporator_Information.Address.City);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.clickDropdown(page, 'select[name="CurrentBusinessAddress.State"]', 'District of Columbia');
            await this.fillInputByName(page,'CurrentBusinessAddress.Zip',String(payload.Incorporator_Information.Address.Zip_Code));
            await page.click('#NextButton');
            await this.clickDropdown(page, 'select[name="CurrentStock.StockType"]', 'Common');
            await page.type('input[name="CurrentStock.Quantity"]',payload.Stock_Details.Number_Of_Shares.toString() );
            await page.type('input[name="CurrentStock.ShareValue"]', payload.Stock_Details.Shares_Par_Value.toString());
            await page.click('#AddBizStock');
            await page.waitForSelector('#NextButton');
            await page.click('#NextButton');
             await this.clickDropdown(page, 'select[name="BizData.RegisteredAgent.RegisteredAgentId"]', 'Business Filings');
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton');
             await page.type('textarea[name="CurrentStipulation[0].Description"]',
                'Miscellaneous Provisions include various clauses and stipulations that cover areas not addressed elsewhere in the document.',);
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton'); 
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton');
             const rafullname = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
             const [firstName, lastName] = await this.ra_split(rafullname);
             await this.fillInputByName(page, 'CurrentContact[0].FirstName', firstName);
             await this.fillInputByName(page, 'CurrentContact[0].LastName', lastName);
             logger.info('FoRm submission complete fot Michigan LLC')  
             await this.fillInputByName(page, 'CurrentContact[0].Address.Line1', payload.Incorporator_Information.Address.Street_Address);
             await this.fillInputByName(page, 'CurrentContact[0].Address.Line2', payload.Incorporator_Information.Address['Address_Line_2']||"");
             await this.fillInputByName(page, 'CurrentContact[0].Address.City', payload.Incorporator_Information.Address.City);
             await this.clickDropdown(page, 'select[name="CurrentContact[0].Address.State"]', 'District of Columbia');
             await this.fillInputByName(page, 'CurrentContact[0].Address.Zip',String( payload.Incorporator_Information.Address.Zip_Code));
             await this.fillInputByName(page,'CurrentContact[0].Email' ,payload.Incorporator_Information.Email_Address);
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton');
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton');
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton');
             const res = "form filled successfully";
             return res

    
        } catch (error) {
            logger.error('Error in Dc For CORP form handler:', error.stack);
            throw new Error(`Dc For CORP form submission failed: ${error.message}`);
        }
    }
}
module.exports = DcForCORP;