const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class NebraskaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async NebraskaForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            await this.selectRadioButtonById(page, 'entn');
            await this.clickDropdown(page, '#entity', 'Domestic Corporation');
            await this.clickButton(page, '#submit');
            await this.fillInputByName(page, 'corporationName', payload.Name.Legal_Name);
            await this.fillInputByName(page, 'capitalStock', String(payload.Stock_Details.Number_Of_Shares));
            await this.selectRadioButtonById(page, 'duexno');
            await this.selectRadioButtonById(page, 'eflano');
            await page.waitForSelector('#articlesDoc');
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click('#editDoc label')
            ]);
            const filePath = 'C:/Users/Acer/Desktop/OnlineFormDocuments/CertificateOfOrganization.pdf';
            await fileChooser.accept([filePath]);
            await this.clickButton(page, '#edocsubmit');
            //Registered agent
            await page.waitForSelector('#rai');
            await page.evaluate(() => {
                document.querySelector('#rai').click();
            });
            const rafullname = payload.Registered_Agent.keyPersonnelName;
            console.log(rafullname)
            const [firstName, lastName] = await this.ra_split(rafullname);
            await page.waitForSelector('#raisfn', { visible: true });
            await page.click('#raisfn');
            await page.type('#raisfn', firstName);
            await page.waitForSelector('input[name="lastName"]', { visible: true });
            await this.fillInputByName(page, 'lastName', lastName);
            await this.clickButton(page, '#raisearch');
            const buttonSelector = 'input.newira[value="Create New Registered Agent Record"]';
            await this.clickButton(page, buttonSelector);

                await this.fillInputByName(page,'address.address1',  payload.Registered_Agent.Address.Street_Address );
                await this.fillInputByName(page,'address.address2', payload.Registered_Agent.Address['Address_Line_2']  || " " );

                await this.fillInputByName(page, 'address.city', payload.Registered_Agent.Address.City ),
                await this.fillInputByName(page, 'address.zipCode',  String(payload.Registered_Agent.Address.Zip_Code));

            await this.clickButton(page, '#lbrasubmit');
            const res = "form filled successfully";
            return res

        } catch (error) {
            logger.error('Error in Nebraska for corp form handler:', error.stack);
            throw new Error(`Nebraska for corp form submission failed: ${error.message}`);
        }
    }
    
}

module.exports = NebraskaForCORP;


