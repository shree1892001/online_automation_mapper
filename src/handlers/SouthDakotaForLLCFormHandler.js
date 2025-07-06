const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
const mappingService = require('../services/mappingService');

class SouthDakotaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async SouthDakotaForLLC(page, jsonData, payload) {
        try {
            logger.info('Navigating to SouthDakota form submission page...');
            
            // Map the payload keys using database-driven mapping
            const mappedPayload = await mappingService.mapPayloadKeys(payload, 'llc');
            
            let url1 = "https://sosenterprise.sd.gov/BusinessServices/Business/RegistrationLLC.aspx?d=true";
            const llcurl = url1.split('/RegistrationLLC.aspx?d=true')[1];
            console.log(llcurl);
            const appendurl = `${jsonData.data.State.stateUrl}/RegistrationLLC.aspx?d=true`;

            await this.navigateToPage(page, appendurl);
            await this.waitForTimeout(2000);
            
            const businessNameInput = [
                { label: 'txtName', value: mappedPayload.Legal_Name }
            ];
            await this.addInput(page, businessNameInput);
            
            await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtNameConfirm', mappedPayload.Legal_Name);

            logger.info('Filled all input fields successfully.');
            await page.waitForSelector('#ContinueButton', { visible: true, timeout: 5000 });
            await this.clickButton(page, '#ContinueButton');

            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr1', mappedPayload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr2', mappedPayload.Principal_Address['Address_Line_2'] || " ");

            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtCity', mappedPayload.Principal_Address.City);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPostal', String(mappedPayload.Principal_Address.Zip_Code));
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtEmail', mappedPayload.Registered_Agent.EmailId);

            // Wait for the checkbox to be available
            const checkbox = await page.waitForSelector('#chkCopyAddress');
            await checkbox.click();

            await page.click('.btn.btn-success.btn-md');

            await page.waitForSelector('select#ddlRaType', { visible: true });

            // Select the option with value "RA" (Non-Commercial Registered Agent)
            await page.select('select#ddlRaType', 'RA');

            await page.click('#SaveButton');

            await new Promise(resolve => setTimeout(resolve, 3000));

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
            
            await this.waitForTimeout(10000);
            const FullName = mappedPayload.Registered_Agent.keyPersonnelName;
            const [FirstName, LastName] = await this.ra_split(FullName);
            
            // Assign the split first name and last name to the respective fields
            const Regagent = [
                { label: 'txtFirstName', value: FirstName },
                { label: 'txtLastName', value: LastName }
            ];
            await this.addInput(page, Regagent);
            await this.waitForTimeout(7000);
            
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr1', mappedPayload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr2', mappedPayload.Registered_Agent.Address['Address_Line_2'] || " ");

            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtCity', mappedPayload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtPostal', String(mappedPayload.Registered_Agent.Address.Zip_Code));
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtEmail', mappedPayload.Registered_Agent.EmailId);

            await this.waitForTimeout(7000);
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr1Mail', mappedPayload.Registered_Agent.Mailing_Information.Street_Address);
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtAddr2Mail', mappedPayload.Registered_Agent.Mailing_Information['Address_Line_2'] || " ");

            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtCityMail', mappedPayload.Registered_Agent.Mailing_Information.City);
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtPostalMail', String(mappedPayload.Registered_Agent.Mailing_Information.Zip_Code));

            await page.click('.btn.btn-success.btn-md');

            // Organizer info
            await this.waitForTimeout(10000);

            const OrgFullName = mappedPayload.Organizer_Information.keyPersonnelName;
            const [orgFirstName, orgLastName] = await this.ra_split(OrgFullName);
            console.log("lastname::", orgLastName);
            
            // Assign the split first name and last name to the respective fields
            const org = [
                { label: 'txtFirstName', value: orgFirstName },
                { label: 'txtLastName', value: orgLastName }
            ];
            await this.addInput(page, org);

            await new Promise(resolve => setTimeout(resolve, 3000));

            // Wait for the address input field and fill it
            await page.waitForSelector('input[name="ctl00$MainContent$ucOrganizers$txtMail1"]');
            await this.fillInputByName(
                page,
                'ctl00$MainContent$ucOrganizers$txtMail1',
                `${mappedpayload.Organizer_Information.Address.Street_Address}, ${mappedpayload.Organizer_Information.Address.City}, ${mappedpayload.Organizer_Information.Address.Zip_Code}`
            );

            await new Promise(resolve => setTimeout(resolve, 3000));

            // Wait for the save button and click it
            await page.waitForSelector('#ucOrganizers_SaveButton');
            await page.click('#ucOrganizers_SaveButton');

            await new Promise(resolve => setTimeout(resolve, 5000));

            // Wait for the success button and click it
            await page.waitForSelector('.btn.btn-success.btn-md');
            await page.click('.btn.btn-success.btn-md');

            await new Promise(resolve => setTimeout(resolve, 4000));
            await page.waitForSelector('.btn.btn-success.btn-md');
            await page.click('.btn.btn-success.btn-md');

            // member or manager 
            await page.waitForSelector('select#ddlSelections', { visible: true });
            await page.select('select#ddlSelections', '502');

            await new Promise(resolve => setTimeout(resolve, 3000));

            const memFullName = mappedPayload.Organizer_Information.keyPersonnelName;
            const [memFirstName, memLastName] = memFullName.split(' ');
            
            // Assign the split first name and last name to the respective fields
            const mem = [
                { label: 'txtFirstName', value: memFirstName },
                { label: 'txtLastName', value: memLastName }
            ];
            await this.addInput(page, mem);

            await this.fillInputByName(page, 'ctl00$MainContent$ucManagers$txtOrgName', mappedPayload.Legal_Name);
            await this.fillInputByName(page, 'ctl00$MainContent$ucManagers$txtMail1', mappedpayload.Organizer_Information.Address.Street_Address, ',', mappedpayload.Organizer_Information.Address.City, ',', mappedpayload.Organizer_Information.Address.Zip_Code);

            await page.click('.btn.btn-primary.btn-sm');
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            await page.click('.btn.btn-primary.btn-sm');
            await new Promise(resolve => setTimeout(resolve, 3000));

            await page.click('.btn.btn-primary.btn-sm');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            await page.click('.btn.btn-success.btn-md');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            await page.click('.btn.btn-success.btn-md');
            await new Promise(resolve => setTimeout(resolve, 3000));

            await new Promise(resolve => setTimeout(resolve, 8000));
            await page.click('.btn.btn-success.btn-md');

            await new Promise(resolve => setTimeout(resolve, 8000));
            await page.click('.btn.btn-success.btn-md');
            
            const res = "form filled successfully";
            return res;

        } catch (error) {
            logger.error('Error in South Dakota For LLC form handler:', error.stack);
            throw new Error(`South Dakota For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = SouthDakotaForLLC;
