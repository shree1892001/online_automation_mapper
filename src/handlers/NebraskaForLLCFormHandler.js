const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class NebraskaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async NebraskaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            await this.selectRadioButtonById(page, 'entn');
            await this.clickDropdown(page, '#entity', 'Domestic Limited Liability Company');
            await this.clickButton(page, '#submit');
            await this.fillInputByName(page, 'corporationName', payload.Name.Legal_Name);
            //add principle address
            await this.fillInputByName(page,'po.address1',payload.Principal_Address.Street_Address)
            await this.fillInputByName(page,'po.address2',payload.Principal_Address['Address_Line_2']  || " ")

            await this.fillInputByName(page,'po.city',payload.Principal_Address.City)
           
            await this.clickDropdown(page, '#postate',  payload.Principal_Address.State)
            await this.fillInputByName(page,'po.zipCode',String(payload.Principal_Address.Zip_Code))
            await this.selectRadioButtonById(page, 'eflano');
            //upload document
            // await this.clickButton(page, '#articlesDoc');
            await page.waitForSelector('#articlesDoc');
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click('#editDoc label')
            ]);
            const filePath = 'C:/Users/Acer/Desktop/OnlineFormDocuments/CertificateOfOrganization.pdf';
            await fileChooser.accept([filePath]);
            //continue button
            await this.clickButton(page, '#edocsubmit');
            //Registered agent
          //  await page.waitForSelector('input#rai[type="radio"][value="INDIVIDUAL"]', { visible: true });

            // Click on the radio button
           // await page.click('input#rai[type="radio"][value="INDIVIDUAL"]');
           await page.waitForSelector('input#rai[type="radio"][value="INDIVIDUAL"]', { visible: true });
           const isClickable = await page.$eval('input#rai[type="radio"][value="INDIVIDUAL"]', (el) => el && !el.disabled && el.offsetHeight > 0);
           if (isClickable) {
               await page.click('input#rai[type="radio"][value="INDIVIDUAL"]');
           } else {
               console.log("Element is either not clickable or not an Element");
           }
            const rafullname = payload.Registered_Agent.keyPersonnelName;
            console.log(rafullname)
            const [firstName, lastName] = await this.ra_split(rafullname);
            await page.waitForSelector('#raisfn');
            await page.click('#raisfn');
            await page.type('#raisfn', firstName);
            await page.waitForSelector('input[name="lastName"]');
            await this.fillInputByName(page, 'lastName', lastName);
            await this.clickButton(page, '#raisearch');
            const buttonSelector = 'input.newira[value="Create New Registered Agent Record"]';
            await this.clickButton(page, buttonSelector);
           
            await this.fillInputByName(page,'address.address1',  payload.Registered_Agent.Address.Street_Address );
                await this.fillInputByName(page,'address.address2', payload.Registered_Agent.Address['Address_Line_2']  || " " );

                await this.fillInputByName(page, 'address.city', payload.Registered_Agent.Address.City ),
                await this.fillInputByName(page, 'address.zipCode',  String(payload.Registered_Agent.Address.Zip_Code));
            
            await this.clickButton(page, '#lbrasubmit');
            const res = "form filled successfully"
            return res

        } catch (error) {
            logger.error('Error in Nebraska for LLC form handler:', error.stack);
            throw new Error(`Nebraska for LLC form submission failed: ${error.message}`);
        }
    }
    
}

module.exports = NebraskaForLLC;