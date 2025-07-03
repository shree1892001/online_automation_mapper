const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class SouthCarolinaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async SouthCarolinaForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            //login 
            await this.clickOnLinkByText(page, 'Log In');
            await this.fillInputByName(page, 'Username', data.State.filingWebsiteUsername);
            await this.fillInputByName(page, 'Password', data.State.filingWebsitePassword);
            await this.clickButton(page, '.mainButton');
            //enter businees name
            await this.fillInputByName(page, 'EntityName', payload.Name.Legal_Name);
            await this.clickButton(page, '#AddEntityButton');
            // await this.selectRadioButtonById(page, 'DomesticRadioButton');
            // await this.clickButton(page, '#AddIndistinguishableEntityButton');
            try{
                await page.waitForSelector('#EntityTypes', { visible: true, timeout: 10000 });
                console.log("dropdown not found")
            } catch (error) {
                await this.clickOnLinkByText(page, 'Back');
                await this.waitForTimeout(10000)
                await this.clearFieldWithDelete(page, 'input[name="EntityName"]');
                await this.fillInputByName(page, 'EntityName', payload.Name.Legal_Name);
                await this.clickButton(page, '#AddEntityButton');
            }
            await this.clickDropdown(page, '#EntityTypes', 'Corporation');
            await this.clickButton(page, 'a.startButton');
            //add contact information
            await this.fillInputByName(page, 'ContactCdto.Contact.Name', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(page, 'ContactCdto.Contact.Email', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'ContactCdto.Contact.Phone', payload.Registered_Agent.ContactNo);
            await this.fillInputByName(page, 'ContactCdto.AddressCdto.Address1', payload.Registered_Agent.Address.Street_Address);

            await this.fillInputByName(page, 'ContactCdto.AddressCdto.City', payload.Registered_Agent.Address.City);
            await this.clickDropdown(page, '#ContactCdto_AddressCdto_StateId', payload.Registered_Agent.Address.State);
            await this.fillInputByName(page, 'ContactCdto.AddressCdto.ZipCode', String(payload.Registered_Agent.Address.Zip_Code));
            await this.clickButton(page, '#ContinueButton');
            //add registered agent information
            await this.fillInputByName(page, 'FormsCdto.Agent.AgentName', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(page, 'FormsCdto.Agent.AgentAddressCdto.Address1', payload.Registered_Agent.Address.Street_Address);

            await this.fillInputByName(page, 'FormsCdto.Agent.AgentAddressCdto.City', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'FormsCdto.Agent.AgentAddressCdto.ZipCode', String(payload.Registered_Agent.Address.Zip_Code));
            //add stock details
            await this.selectRadioButtonById(page, 'SingleClassShareRadioButton');
            await this.fillInputByName(page, 'FormsCdto.SharesCdto.SingleClassShareCount', String(payload.Stock_Details.Number_Of_Shares));
            //add incorporator information
            await this.fillInputByName(page, 'FormsCdto.IncorporatorCdto.IncorporatorName', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByName(page, 'FormsCdto.IncorporatorCdto.IncorpatorAddressCdto.Address1', payload.Incorporator_Information.Address.Street_Address);

            await this.fillInputByName(page,'FormsCdto.IncorporatorCdto.IncorpatorAddressCdto.City',payload.Incorporator_Information.Address.City);
            await this.clickDropdown(page, '#FormsCdto_IncorporatorCdto_IncorpatorAddressCdto_StateId',payload.Incorporator_Information.Address.State);
            await this.fillInputByName(page, 'FormsCdto.IncorporatorCdto.IncorpatorAddressCdto.ZipCode',String(payload.Incorporator_Information.Address.Zip_Code));
            //add signature for organizer
            await this.clickDropdown(page, '#FormsCdto_IncorporatorCdto_IncorporatorSignatureCdto_SelectedOption', 'Incorporator');
            await page.click('#IncorporatorSignatureConfirmationCheckbox');
            await this.fillInputByName(page, 'FormsCdto.IncorporatorCdto.IncorporatorSignatureCdto.Text', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            //add attorney information
            await this.fillInputByName(page, 'FormsCdto.AttorneyNameText', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(page, 'FormsCdto.AttorneyPhoneNumber', payload.Registered_Agent.ContactNo);
            await this.fillInputByName(page, 'FormsCdto.AttorneyAddress.Address1', payload.Registered_Agent.Address.Street_Address);

            await this.fillInputByName(page, 'FormsCdto.AttorneyAddress.City', payload.Registered_Agent.Address.City);
            await this.clickDropdown(page, '#FormsCdto_AttorneyAddress_StateId',payload.Registered_Agent.Address.State);
            await this.fillInputByName(page, 'FormsCdto.AttorneyAddress.ZipCode', String(payload.Registered_Agent.Address.Zip_Code));
            await this.clickDropdown(page, '#FormsCdto_AttorneySignatureCdto_SelectedOption', 'Attorney');
            await page.click('#AttorneySignatureConfirmationCheckbox');
            await this.fillInputByName(page, 'FormsCdto.AttorneySignatureCdto.Text', payload.Registered_Agent.keyPersonnelName);
            await this.clickButton(page, '#ContinueButton');

            // upload file
            await this.clickButton(page, 'a.formUploadButton');
            await page.waitForSelector('#FileData');

            // Trigger the file chooser by clicking on the button (you may need to adjust this selector)
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click('#FileData') // Adjust this selector to match your button
            ]);

            // Specify the path to the file you want to upload
            const filePath = 'C:/Users/Acer/Desktop/OnlineFormDocuments/CertificateOfOrganization.pdf';

            // Accept the file in the file chooser
            await fileChooser.accept([filePath]);
            await this.clickButton(page, '#UploadButton')
            await this.clickButton(page, '#ContinueButton');
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in SOUTH CAROLINA FOR CORP form handler:', error.stack);
            throw new Error(`SOUTH CAROLINA FOR CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = SouthCarolinaForCORP;


