const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class SouthDakotaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async SouthDakotaForCORP(page, jsonData,payload){
        logger.info('Navigating to SouthDakota form submission page...');
        const appendurl=`${jsonData.data.State.stateUrl}/RegistrationCorpProfit.aspx?d=true`;
    //   console.log(appendurl);

        await this.navigateToPage(page, appendurl);

        // await this.navigateToPage(page, url);

        await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtName', payload.Name.Legal_Name);
      
    
     
      await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtNameConfirm', payload.Name.Legal_Name);
      

  logger.info('Filled all input fields successfully.');
  await page.waitForSelector('#ContinueButton', { visible: true, timeout: 5000 });
  await this.clickButton(page, '#ContinueButton');
      //  await page.click('.btn.btn-success.btn-md');

        await this.fillInputByName(page, 'ctl00$MainContent$ucDetail$txtCommonShares', payload.Stock_Details.Number_Of_Shares);
        await this.fillInputByName(page, 'ctl00$MainContent$ucDetail$txtPreferredShares', payload.Stock_Details.Number_Of_Shares);

        

        await new Promise(resolve => setTimeout(resolve, 4000))

        await page.click('.btn.btn-success.btn-md');

        await new Promise(resolve => setTimeout(resolve, 5000))
        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr1', payload.Principal_Address.Street_Address);

        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtCity', payload.Principal_Address.City);
        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPostal', String(payload. Principal_Address.PA_Zip_Code));
        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtEmail', payload.Registered_Agent.EmailId);

        // Wait for the checkbox to be available
        // const checkbox = await page.waitForSelector('#chkCopyAddress');
        // await checkbox.click();
        await new Promise(resolve => setTimeout(resolve, 5000))
        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr1Mail', payload.Registered_Agent.Mailing_Information.Street_Address);
        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr2Mail', payload.Registered_Agent.Mailing_Information['Address_Line_2']  || " ");

        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtCityMail', payload.Registered_Agent.Mailing_Information.City);
        await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPostalMail', String(payload.Registered_Agent.Mailing_Information.Zip_Code));


        await page.click('.btn.btn-success.btn-md');

        await page.waitForSelector('select#ddlRaType', { visible: true });

        // Select the option with value "RA" (Non-Commercial Registered Agent)
        await page.select('select#ddlRaType', 'RA');

        await page.click('#SaveButton');

        await new Promise(resolve => setTimeout(resolve, 3000))
        // add button

        await page.waitForSelector('button.btn.btn-default');

        // Click the button using its text
        await page.evaluate(() => {
            const button = Array.from(document.querySelectorAll('button.btn.btn-default'))
            .find(btn => btn.textContent.trim() === 'Add a New Agent');
            if (button) {
            button.click();
            }
        });

        const FullName = payload.Registered_Agent.keyPersonnelName;
        const [FirstName, LastName] = await this.ra_split(FullName);
        // Assign the split first name and last name to the respective fields
        const Regagent = [
            { label: 'txtFirstName', value: FirstName },
            { label: 'txtLastName', value: LastName }
        ];
        await this.addInput(page, Regagent);

        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr1', payload.Registered_Agent.Address.Street_Address);
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr2', payload.Registered_Agent.Address['Address_Line_2']  || " ");

        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtCity', payload.Registered_Agent.Address.City);
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtPostal', String(payload.Registered_Agent.Address.Zip_Code));
        await new Promise(resolve => setTimeout(resolve, 5000))
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtEmail', payload.Registered_Agent.EmailId);

        await new Promise(resolve => setTimeout(resolve, 5000))        
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr1Mail', payload.Registered_Agent.Mailing_Information.Street_Address);
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr2Mail', payload.Registered_Agent.Mailing_Information['Address_Line_2']  || " ");

        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtCityMail', payload.Registered_Agent.Mailing_Information.City);
        await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtPostalMail', String(payload.Registered_Agent.Mailing_Information.Zip_Code));

        await page.waitForSelector('.btn.btn-success.btn-md');
        await page.click('.btn.btn-success.btn-md');

        // Incorporator info
await new Promise(resolve => setTimeout(resolve, 3000));

const OrgFullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
const [orgFirstName, orgLastName] = OrgFullName.split(' ');

// Assign the split first name and last name to the respective fields
const org = [
    { label: 'txtFirstName', value: orgFirstName },
    { label: 'txtLastName', value: orgLastName }
];
await this.addInput(page, org);

await new Promise(resolve => setTimeout(resolve, 3000));

// Wait for the address input field and fill it
await page.waitForSelector('input[name="ctl00$MainContent$ucIncorporators$txtMail1"]');
await this.fillInputByName(
    page,
    'ctl00$MainContent$ucIncorporators$txtMail1',
    `${payload.Incorporator_Information.Address.Street_Address}, ${payload.Incorporator_Information.Address.City}, ${payload.Incorporator_Information.Address.Zip_Code}`
);

await new Promise(resolve => setTimeout(resolve, 3000));
await page.waitForSelector('#ucIncorporators_SaveButton');
await page.click('#ucIncorporators_SaveButton');


await new Promise(resolve => setTimeout(resolve, 6000));

// Wait for the success button and click it
await page.waitForSelector('.btn.btn-success.btn-md');
await page.click('.btn.btn-success.btn-md');

        // Director

        await new Promise(resolve => setTimeout(resolve, 4000))

        await page.click('.btn.btn-success.btn-md');

        await new Promise(resolve => setTimeout(resolve, 4000))

        await page.click('.btn.btn-success.btn-md');

        await new Promise(resolve => setTimeout(resolve, 4000))

        await page.click('.btn.btn-success.btn-md');
        await new Promise(resolve => setTimeout(resolve, 4000))

        await page.click('.btn.btn-success.btn-md');
        // await new Promise(resolve => setTimeout(resolve, 4000))

        // await page.click('.btn.btn-success.btn-md');

        const res = "form filled successfully";
        return res

            // Additional form handling code here
        } catch (error) {
            logger.error('Error in South Dakota For Corp form handler:', error.stack);
            throw new Error(`South Dakota For Corp form submission failed: ${error.message}`);
            
        }
        
    }

  
module.exports = SouthDakotaForCORP;
