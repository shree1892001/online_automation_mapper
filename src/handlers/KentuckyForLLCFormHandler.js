const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class KentuckyForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async KentuckyForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            await page.waitForSelector('a[href="NewBusiness.aspx"]');
            await page.click('a[href="NewBusiness.aspx"]');
            await this.selectRadioButtonById(page, 'ctl00_MainContent_dombutt');
            await page.waitForSelector('a#ctl00_MainContent_LLClink', { visible: true});
            await page.click('a#ctl00_MainContent_LLClink');  
            let llcName = payload.Name.Legal_Name;
            const [name1, designator] = await this.extractnamedesignator(llcName);
            await this.fillInputByName(page, 'ctl00$MainContent$TName', name1);  
            await this.clickDropdown(page, "#ctl00_MainContent_ddLLCEnding", designator); 
            const emailInputSelector = '#ctl00_MainContent_email'; // The selector for the email input
            const emailValue = payload.Registered_Agent.EmailId; // The email address you want to enter
            await this.waitForTimeout(3000);
            await this.setInputValue(page, emailInputSelector, emailValue); 

            // await this.selectRadioButtonById(page,'ctl00_MainContent_rbTobaccoN')

            // await page.click('#ctl00_MainContent_rbTobaccoN');

            await this.waitForTimeout(4000)
            await this.selectRadioButtonById(page,'ctl00_MainContent_membermanaged')
            await page.waitForSelector('#ctl00_MainContent_POAddr1', { visible: true });
            const addrvalue = payload.Principal_Address.Street_Address
            await page.click('#ctl00_MainContent_POAddr1');
            await this.waitForTimeout(4000)
            await this.setInputValue(page, '#ctl00_MainContent_POAddr1',addrvalue);
            await this.waitForTimeout(4000)
            // await this.fillInputByName(page, 'ctl00$MainContent$POAddr1', payload.Principal_Address.Street_Address);
            await page.waitForSelector('input[name="ctl00$MainContent$POCity"]');
            await this.fillInputByName(page, 'ctl00$MainContent$POCity', payload.Principal_Address.City);
            await page.waitForSelector('input[name="ctl00$MainContent$POState"]');
            await this.fillInputByName(page, 'ctl00$MainContent$POState', payload.Principal_Address.State);
            await page.waitForSelector('input[name="ctl00$MainContent$POZip"]');
            await this.fillInputByName(page, 'ctl00$MainContent$POZip', String(payload.Principal_Address.Zip_Code));
            await this.waitForTimeout(1000)
            await page.waitForSelector('#ctl00_MainContent_txtOrgName', { visible: true });
            await this.waitForTimeout(4000)
            await page.click('#ctl00_MainContent_txtOrgName');
            await this.waitForTimeout(4000)
            await this.setInputValue(page, '#ctl00_MainContent_txtOrgName',payload.Organizer_Information.keyPersonnelName);
            // await this.fillInputByName(page, 'ctl00$MainContent$txtOrgName', payload.Organizer_Information.keyPersonnelName);
            await page.waitForSelector('#ctl00_MainContent_btnAdd', { visible: true });
            await page.click('#ctl00_MainContent_btnAdd');
            await this.randomSleep()
            await this.selectRadioButtonById(page, 'ctl00_MainContent_rbIndividual');
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(fullName);
            await this.waitForTimeout(1000)
            await page.waitForSelector('input[name="ctl00$MainContent$RAFName"]');
            await this.fillInputByName(page, "ctl00$MainContent$RAFName", firstName);
            await this.waitForTimeout(1000)
            await page.waitForSelector('input[name="ctl00$MainContent$RALName"]');
            await this.fillInputByName(page, "ctl00$MainContent$RALName", lastName);
            await page.waitForSelector('input[name="ctl00$MainContent$RAAddr1"]');
            await this.fillInputByName(page, "ctl00$MainContent$RAAddr1", payload.Registered_Agent.Address.Street_Address);
            await page.waitForSelector('input[name="ctl00$MainContent$RACity"]');
            await this.fillInputByName(page, "ctl00$MainContent$RACity", payload.Registered_Agent.Address.City);
            await page.waitForSelector('input[name="ctl00$MainContent$RAZip"]');
            await this.fillInputByName(page,"ctl00$MainContent$RAZip", String(payload.Registered_Agent.Address.Zip_Code));
            await this.waitForTimeout(1000)
            await page.waitForSelector('#ctl00_MainContent_RAsignFname', { visible: true });
            await page.click('#ctl00_MainContent_RAsignFname');
            await this.waitForTimeout(3000)
            await this.setInputValue(page, '#ctl00_MainContent_RAsignFname',firstName);
            
            // await this.fillInputByName(page, "ctl00$MainContent$RAsignFname", firstName);
            await page.waitForSelector('input[name="ctl00$MainContent$RAsignLname"]');
            await this.fillInputByName(page, "ctl00$MainContent$RAsignLname", lastName);
            await page.waitForSelector('#ctl00_MainContent_CbStandard', { visible: true});
            await page.click('#ctl00_MainContent_CbStandard');
            await this.waitForTimeout(1000)
            await page.waitForSelector('#ctl00_MainContent_bFile', { visible: true});
            await page.click('#ctl00_MainContent_bFile');
            const selector = 'input#ctl00_MainContent_bad';
            try {
                await page.waitForSelector(selector, { timeout: 3000 });
                console.log("Button is available on the page.");
            } catch (error) {
                const errorExists = await page.evaluate(() => {
                    const errorElement = document.querySelector('span.errmsg');
                    return errorElement 
                        ? errorElement.textContent.includes("The name") && errorElement.textContent.includes("is not available in Kentucky.") 
                        : false;
                });
                if (errorExists) {
                    await page.click('[name="ctl00$MainContent$TName"]'), await page.keyboard.down('Control'), await page.keyboard.press('A'), await page.keyboard.up('Control'), await page.keyboard.press('Backspace'), await page.type('[name="ctl00$MainContent$TName"]', payload.Name.Alternate_Legal_Name);
                    await page.click('#ctl00_MainContent_bFile');
                } else {
                    console.log("Error message is not found.");
                }
            }
            const res = "form filled successfully";
            return res    
            
        } catch (error) {
            logger.error('Error in Kentucky For LLC form handler:', error.stack);
            throw new Error(`Kentucky LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = KentuckyForLLC;


