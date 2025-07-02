const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class MassachusettsForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async MassachusettsForLLC(page,jsonData,payload) {
      try {
          logger.info('Navigating to Massachusetts form submission page...');
const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;
                      await this.navigateToPage(page, url);


          await this.clickOnLinkByText(page, 'click here');
          await this.clickOnLinkByText(page, 'Certificate of Organization');


          await page.waitForNavigation({ waitUntil: 'networkidle0' });

          const nameaddress = [
            {label: 'MainContent_EntityNameControl1_txtEntityName',value: payload.Name.Legal_Name},
            {label: 'MainContent_RecordingOfficeControl1_txtAddr',value: payload.Principal_Address.Street_Address},
            {label: 'MainContent_RecordingOfficeControl1_txtCity',value: payload.Principal_Address.City},
            {label: 'MainContent_RecordingOfficeControl1_txtPostalCode',value: String(payload.Principal_Address.Zip_Code)},
          ];
            await this.addInput(page, nameaddress);

            // await page.type('textarea[name="ctl00$MainContent$PurposeControl1$txtArea"]','Business(Field is mandatory not in the json',);
            await page.type('textarea[name="ctl00$MainContent$PurposeControl1$txtArea"]',payload.Purpose.Purpose_Details);

            
            const name =[
            {label: 'MainContent_ResidentAgentControl1_txtAgentName',value: payload.Registered_Agent.keyPersonnelName},
            {label: 'MainContent_ResidentAgentControl1_txtAgentAddr1',value: payload.Registered_Agent.Address.Street_Address},
            {label: 'MainContent_ResidentAgentControl1_txtAgentAddr2',value: payload.Registered_Agent.Address['Address_Line_2'] ||""},
            {label: 'MainContent_ResidentAgentControl1_txtAgentCity',value: payload.Registered_Agent.Address.City},
            {label: 'MainContent_ResidentAgentControl1_txtAgentPostalCode',value: String(payload.Registered_Agent.Address.Zip_Code)},
           {label: 'MainContent_ResidentAgentConsentControl1_txtClerk',value: payload.Registered_Agent.keyPersonnelName},
          ]
            await this.addInput(page, name);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.click('#MainContent_ManagerControl1_grdOfficers_btnAddPartner');
            await new Promise(resolve => setTimeout(resolve, 3000))
           
            // organizer 
            const orgFullName = payload.Organizer_Information.keyPersonnelName;
            const [orgFirstName, orgLastName] = orgFullName.split(' ');
            // Assign the split first name and last name to the respective fields
            const organizerDetails = [
                { label: 'MainContent_ManagerControl1_txtFirstName', value: orgFirstName },
                { label: 'MainContent_ManagerControl1_txtLastName', value: orgLastName }
            ];
            await this.addInput(page, organizerDetails);
            const sixno =[
              {label: 'MainContent_ManagerControl1_txtBusAddress', value: payload.Organizer_Information.Address.Street_Address},
              {label: 'MainContent_ManagerControl1_txtBusCity',value: payload.Organizer_Information.Address.City},
              {label: 'MainContent_ManagerControl1_txtBusZip',value: String(payload.Organizer_Information.Address.Zip_Code)}
            ];
            await this.addInput(page, sixno);

            await new Promise(resolve => setTimeout(resolve, 3000))

            await page.click('#MainContent_ManagerControl1_btnSave');
            await new Promise(resolve => setTimeout(resolve, 3000))

            await page.click('#MainContent_OtherManagerControl1_grdOfficers_btnAddPartner');

            // manager

            await new Promise(resolve => setTimeout(resolve, 3000))

            const manFullName = payload.Organizer_Information.keyPersonnelName;
            const [manFirstName, manLastName] = manFullName.split(' ');
            // Assign the split first name and last name to the respective fields
            const managerDetails = [
                { label: 'MainContent_OtherManagerControl1_txtFirstName', value: manFirstName },
                { label: 'MainContent_OtherManagerControl1_txtLastName', value: manLastName }
            ];
            await this.addInput(page, managerDetails);
            const sevenno =[
              {label: 'MainContent_OtherManagerControl1_txtBusAddress', value: payload.Organizer_Information.Address.Street_Address},
              {label: 'MainContent_OtherManagerControl1_txtBusCity',value: payload.Organizer_Information.Address.City},
              {label: 'MainContent_OtherManagerControl1_txtBusZip',value: String(payload.Organizer_Information.Address.Zip_Code)}
            ];
            await this.addInput(page, sevenno);

            await new Promise(resolve => setTimeout(resolve, 3000))

            await page.click('#MainContent_OtherManagerControl1_btnSave');


            await new Promise(resolve => setTimeout(resolve, 3000))
          // Contact Person 
            const tenno = [
            {label: 'MainContent_FilingFormContactInfoControl1_txtContactName',value: payload.Organizer_Information.keyPersonnelName},
            {label: 'MainContent_FilingFormContactInfoControl1_txtStreetNo',value: payload.Organizer_Information.Address.Street_Address},
            {label: 'MainContent_FilingFormContactInfoControl1_txtCity',value: payload.Organizer_Information.Address.City},
            {label: 'MainContent_FilingFormContactInfoControl1_txtZip',value: String(payload.Organizer_Information.Address.Zip_Code)}, 
            {label: 'MainContent_FilingFormContactInfoControl1_txtContactEmail',value: payload.Organizer_Information.EmailId}
            
        ];
        await this.addInput(page, tenno);
        

        const sign=[
          {label: 'MainContent_DisclaimerNonProfitControl1_txtUndersigned1',value:payload.Organizer_Information.keyPersonnelName}
        ]
        await this.addInput(page, sign);

        await this.clickButton(page, '#MainContent_DisclaimerNonProfitControl1_rdoAccept');  
        logger.info('Login form filled out successfully for Massachusetts LLC.');

        
        await this.clickButton(page, '#MainContent_ButtonsControl1_btnSubmitExternal');  
        logger.info('Login form filled out successfully for Massachusetts LLC.');
        const res = "form filled successfully";
        return res

    } catch (error) {
        // Log full error stack for debugging
        logger.error('Error in Massachusetts LLC form handler:', error.stack);
        throw new Error(`Massachusetts LLC form submission failed: ${error.message}`);
      }
    }
  }
  
module.exports = MassachusettsForLLC;
