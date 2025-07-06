const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class DcForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async DcForLLC(page,jsonData,payload) {
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
            await page.waitForSelector('a[href="/Biz.aspx/RedirectFromNewService/119"]');
            page.click('a[href="/Biz.aspx/RedirectFromNewService/119"]')
            await page.waitForSelector('#NextButton');
            await page.click('#NextButton');
            await this.fillInputByName(page, 'BizData.BusinessName', payload.Name.Legal_Name);
            await this.clickDropdown(page, 'select[name="BizData.BusinessSuffix"]', 'Limited Liability Company');
            await page.waitForSelector('#NextButton');
            await page.click('#NextButton');
            await this.fillInputByName(page,'CurrentBusinessAddress.Line1',payload.Principal_Address.Street_Address);
            await this.fillInputByName(page,'CurrentBusinessAddress.Line2',payload.Principal_Address['Address_Line_2'] || " ");
             await this.fillInputByName(page,'CurrentBusinessAddress.City',payload.Principal_Address.City);
             await new Promise(resolve => setTimeout(resolve, 3000))
             await this.clickDropdown(page, 'select[name="CurrentBusinessAddress.State"]', 'District of Columbia');
             await this.fillInputByName(page,'CurrentBusinessAddress.Zip',String(payload.Principal_Address.Zip_Code));
             await page.click('#NextButton');
             await this.clickDropdown(page, 'select[name="BizData.RegisteredAgent.RegisteredAgentId"]', 'Business Filings');
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton');
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton');
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton');
             const rafullname = payload.Organizer_Information.keyPersonnelName;
             const [firstName, lastName] = await this.ra_split(rafullname);
             await this.fillInputByName(page, 'CurrentContact[0].FirstName', firstName);
             await this.fillInputByName(page, 'CurrentContact[0].LastName', lastName);
             logger.info('FoRm submission complete fot Michigan LLC')  
             await this.fillInputByName(page, 'CurrentContact[0].Address.Line1', payload.Organizer_Information.Address.Street_Address);
             await this.fillInputByName(page, 'CurrentContact[0].Address.Line2', payload.Organizer_Information.Address.Address_Line_2|| " ");
             await this.fillInputByName(page, 'CurrentContact[0].Address.City', payload.Organizer_Information.Address.City);
             await this.clickDropdown(page, 'select[name="CurrentContact[0].Address.State"]', 'District of Columbia');
             await this.fillInputByName(page, 'CurrentContact[0].Address.Zip', String(payload.Organizer_Information.Address.Zip_Code));
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton');
             await page.waitForSelector('textarea[name="CurrentStipulation[0].Description"]');
             await page.type('textarea[name="CurrentStipulation[0].Description"]', 
                'Miscellaneous Provisions include various clauses and stipulations that cover areas not addressed elsewhere in the document.',);
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton'); 
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton'); 
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton'); 
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton'); 
             await page.waitForSelector('#NextButton');
             await page.click('#NextButton'); 
             const res = "form filled successfully";
             return res

        } catch (error) {
            logger.error('Error in Dc For LLC form handler:', error.stack);
            throw new Error(`Dc For LLC form submission failed: ${error.message}`);
        }
    }
}
module.exports = DcForLLC;