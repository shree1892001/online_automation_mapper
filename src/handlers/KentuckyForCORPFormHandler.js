const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class KentuckyForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async KentuckyForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            await page.waitForSelector('a[href="NewBusiness.aspx"]');
            await page.click('a[href="NewBusiness.aspx"]');
            await this.selectRadioButtonById(page, 'ctl00_MainContent_dombutt');
            await page.waitForSelector('a#ctl00_MainContent_LLClink', { visible: true, timeout: 60000 });
            await page.click('a#ctl00_MainContent_Corplink');  
            await this.selectRadioButtonById(page, 'ctl00_MainContent_profit');
            let llcName = payload.Name.Legal_Name;
           const [name1, designator] = await this.extractnamedesignator(llcName);
        
            await this.fillInputByName(page, 'ctl00$MainContent$tName', name1);  
            await this.clickDropdown(page, "#ctl00_MainContent_ddCorpEnding", designator);
            await page.waitForSelector('#ctl00_MainContent_tShares', { visible: true });
            await page.click('#ctl00_MainContent_tShares');
            await this.waitForTimeout(1000)
            await this.setInputValue(page, '#ctl00_MainContent_tShares', String(payload.Stock_Details.Number_Of_Shares));
            await this.waitForTimeout(1000)
            // await this.fillInputByName(page, 'ctl00$MainContent$tShares', String(payload.Stock_Details.Number_Of_Shares));

            
            await this.selectRadioButtonById(page,'ctl00_MainContent_rbTobaccoN')

            await this.selectRadioButtonById(page, 'ctl00_MainContent_rbRIndividual');
            const RAfullName = payload.Registered_Agent.keyPersonnelName;
            const [RAfirstName, RAlastName] = await this.ra_split(RAfullName);
            await this.fillInputByName(page, "ctl00$MainContent$RAFName", RAfirstName);
            await this.fillInputByName(page, "ctl00$MainContent$RALName", RAlastName);
            await this.fillInputByName(page, "ctl00$MainContent$RAAddr1", payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, "ctl00$MainContent$RACity", payload.Registered_Agent.Address.City);
            await this.fillInputByName(page,"ctl00$MainContent$RAZip", payload.Registered_Agent.Address.Zip_Code);
            
            await this.fillInputByName(page, 'ctl00$MainContent$POAddr1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$MainContent$POCity', payload.Principal_Address.City);
            await this.fillInputByName(page, 'ctl00$MainContent$POState', payload.Principal_Address.State);
            await this.fillInputByName(page, 'ctl00$MainContent$POZip', String(payload.Principal_Address.Zip_Code));
            await this.randomSleep()
            
            const fullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [firstName, lastName] = fullName.split(' ');
            await this.fillInputByName(page, "ctl00$MainContent$txtIncorpFName", firstName);
            await this.fillInputByName(page, "ctl00$MainContent$txtIncorpLName", lastName);
            await this.fillInputByName(page, "ctl00$MainContent$txtIncorpAddr", payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, "ctl00$MainContent$txtIncorpCity", payload.Incorporator_Information.Address.City);
            await this.fillInputByName(page, "ctl00$MainContent$txtIncorpState", payload.Incorporator_Information.Address.State);
            await this.fillInputByName(page,"ctl00$MainContent$txtIncorpZip", String(payload.Incorporator_Information.Address.Zip_Code));
            await page.waitForSelector('#ctl00_MainContent_btnAddIncorp', { visible: true, timeout: 60000 });
            await page.click('#ctl00_MainContent_btnAddIncorp');
            await this.waitForTimeout(2000)
            await page.waitForSelector('#ctl00_MainContent_sign', { visible: true });
            await page.click('#ctl00_MainContent_sign');
            await this.waitForTimeout(1000)
            await this.setInputValue(page, '#ctl00_MainContent_sign', firstName);
            await this.waitForTimeout(1000)

            // await this.fillInputByName(page, "ctl00$MainContent$sign", firstName);
            await this.fillInputByName(page, "ctl00$MainContent$RAsignFname", RAfirstName);
            await this.fillInputByName(page, "ctl00$MainContent$RAsignLname", RAlastName);
            
            await page.waitForSelector('#ctl00_MainContent_email', { visible: true });
            await page.click('#ctl00_MainContent_email');
            await this.waitForTimeout(1000)
            console.log(payload.Registered_Agent.EmailId)
            await this.setInputValue(page, '#ctl00_MainContent_email',  payload.Registered_Agent.EmailId);
            await this.waitForTimeout(1000)

            // await this.fillInputByName(page, "ctl00$MainContent$email", payload.Registered_Agent.Name.Email);
            await page.waitForSelector('#ctl00_MainContent_cbStandard', { visible: true});
            await page.click('#ctl00_MainContent_cbStandard');
            await page.waitForSelector('#ctl00_MainContent_bFile', { visible: true});
            await page.click('#ctl00_MainContent_bFile');
            const res = "form filled successfully";
            return res

        } catch (error) {
            logger.error('Error in Kentucky For CORP form handler:', error.stack);
            throw new Error(`Kentucky For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = KentuckyForCORP;


