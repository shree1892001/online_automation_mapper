const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
const mappingService = require('../services/mappingService');

class VirginiaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async VirginiaForLLC(page, jsonData, payload) {
        try {
            logger.info('Navigating to Virginia form submission page...');
            
            // Map the payload keys using database-driven mapping
            const mappedPayload = await mappingService.mapPayloadKeys(payload, 'llc');
            
        const data = Object.values(jsonData)[0];
            const url = data.State.stateUrl;
        await this.navigateToPage(page, url);

        await page.evaluate(() => {
          const div = Array.from(document.querySelectorAll('div.panel--header_title'))
            .find(el => el.textContent.trim() === 'Limited Liability Company');
          if (div) {
            div.click();
          } else {
            console.error('Div element not found');
          }
        });

        // File Online
        await page.evaluate(() => {
          const anchor = document.querySelector('a[href="https://cis.scc.virginia.gov/"]');
          if (anchor) {
            anchor.click();
          } else {
            console.error('Anchor element not found');
          }
        });
        
        // Login
        await this.fillInputByName(page, 'Username', data.State.filingWebsiteUsername);
        await this.fillInputByName(page, 'Password', data.State.filingWebsitePassword);
        await page.click('#Login');

      await new Promise(resolve => setTimeout(resolve, 3000))
        
       await page.evaluate(() => {
        const anchor = document.querySelector('a[href="/OnlineMenu/Index"]');
        if (anchor) {
          anchor.click();
        } else {
          console.error('Anchor element not found');
        }
      });

      await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector('a[onclick*="NavigateToController(\'BusinessFilingSelect\',\'BusinesEntityOnlineShared\',\'New Businesses\')"]');
      await page.click('a[onclick*="NavigateToController(\'BusinessFilingSelect\',\'BusinesEntityOnlineShared\',\'New Businesses\')"]');
     
      await new Promise(resolve => setTimeout(resolve, 4000))
      await page.select('#entityType', '7');
      await new Promise(resolve => setTimeout(resolve, 4000))
      await page.select('#filingType', '25');

      await page.waitForSelector('#btnContinue');
      await page.click('#btnContinue');

      await new Promise(resolve => setTimeout(resolve, 5000))
            await this.fillInputByName(page, 'SharedSteps_EntitySearch_EntityName', mappedPayload.Legal_Name || payload.Name.Legal_Name);

            //Check Availability 
      await new Promise(resolve => setTimeout(resolve, 7000))
      await page.waitForSelector('#btnSearch');
      await page.click('#btnSearch');

      // Next Button
      await new Promise(resolve => setTimeout(resolve, 10000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');

            await this.randomSleep(2000, 3000); 
      await page.waitForSelector('#DocumentProcessingSteps_EntityInformation_NewLLCFormation_EntityEmailAddressTextBox');

            await this.fillInputByIdSingle(page, "#DocumentProcessingSteps_EntityInformation_NewLLCFormation_EntityEmailAddressTextBox", mappedPayload.Registered_Agent?.EmailId || payload.Registered_Agent.EmailId);

      await page.waitForSelector('#DocumentProcessingSteps_EntityInformation_NewLLCFormation_EntityContactNumberTextBox');
            await page.type('#DocumentProcessingSteps_EntityInformation_NewLLCFormation_EntityContactNumberTextBox', mappedPayload.Registered_Agent?.ContactNo || payload.Registered_Agent.ContactNo);

      // Next Button
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');

      // Create Agent
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#createAgent');
      await page.click('#createAgent');
 
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#createAgentinfo_NameFields_RegisterAgentTypeId', '8');
      
      await new Promise(resolve => setTimeout(resolve, 4000))

            const rafullname = mappedPayload.Registered_Agent?.keyPersonnelName || payload.Registered_Agent.keyPersonnelName;
      const [firstName, lastName] = await this.ra_split(rafullname);
      await this.fillInputByName(page, 'createAgentinfo_NameFields.FirstName', firstName);
      await this.fillInputByName(page, 'createAgentinfo_NameFields.LastName', lastName);
      
      // Registered agent
      await new Promise(resolve => setTimeout(resolve, 4000))
            await this.fillInputByName(page, 'documentProcessingStep_CreateStatutoryAgentModal_PrincipalAddess.StreetAddress1', mappedPayload.Registered_Agent?.Address?.Street_Address || payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'documentProcessingStep_CreateStatutoryAgentModal_PrincipalAddess.City', mappedPayload.Registered_Agent?.Address?.City || payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'documentProcessingStep_CreateStatutoryAgentModal_PrincipalAddess.Zip5', (mappedPayload.Registered_Agent?.Address?.Zip_Code || payload.Registered_Agent.Address.Zip_Code).toString());

      // Done
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnCreateAgent');
      await page.click('#btnCreateAgent');
      
      // Checkbox
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.waitForSelector('#documentProcessingStep_CreateStatutoryAgentModal_PrincipalAddessVerifiedAddress');
      await page.click('#documentProcessingStep_CreateStatutoryAgentModal_PrincipalAddessVerifiedAddress');
      
      // Done
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnCreateAgent');
      await page.click('#btnCreateAgent');
      
      // Checkbox
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.waitForSelector('#NewRAStatAgentName_ResidentOfVA');
      await page.click('#NewRAStatAgentName_ResidentOfVA');

      //Next 
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');

      // Principal Address
      await new Promise(resolve => setTimeout(resolve, 4000))
            await this.fillInputByName(page, 'PrincipalOfficeAddress.StreetAddress1', mappedPayload.Principal_Address?.Street_Address || payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'PrincipalOfficeAddress.City', mappedPayload.Principal_Address?.City || payload.Principal_Address.City);
            await this.fillInputByName(page, 'PrincipalOfficeAddress.Zip5', (mappedPayload.Principal_Address?.Zip_Code || payload.Principal_Address.Zip_Code).toString());

      //Next 
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');

      // Checkbox
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.waitForSelector('#PrincipalOfficeAddressVerifiedAddress');
      await page.click('#PrincipalOfficeAddressVerifiedAddress');
      
      // Member/manager Dropdown
      await new Promise(resolve => setTimeout(resolve, 4000))
      await page.select('#NewLLCFormation_ManagementStructureId', '1');

      //Next 
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');

      //Next 
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');

      // Organizer details
      await new Promise(resolve => setTimeout(resolve, 4000))
            await this.fillInputByName(page, 'NewLLCFormation.CurrentSignature.Name', mappedPayload.Organizer_Information?.keyPersonnelName || payload.Organizer_Information.keyPersonnelName);
      
      await new Promise(resolve => setTimeout(resolve, 4000))

            const orgfullname = mappedPayload.Organizer_Information?.keyPersonnelName || payload.Organizer_Information.keyPersonnelName;
      const [orgfirstName, orglastName] = orgfullname.split(' ');
      await this.fillInputByName(page, 'NewLLCFormation.CurrentSignature.PrintedName.FirstName', orgfirstName);
      await this.fillInputByName(page, 'NewLLCFormation.CurrentSignature.PrintedName.LastName', orglastName);

      //Addbutton
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#AddSignatureBtn');
      await page.click('#AddSignatureBtn');

      //Okbutton 
      await new Promise(resolve => setTimeout(resolve, 4000))
      await page.click('button.confirm');

      //Next 
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');
      
        } catch (error) {
            logger.error('Error in Virginia LLC form handler:', error.stack);
            throw new Error(`Virginia LLC form submission failed: ${error.message}`);
        }
    }
}
  
module.exports = VirginiaForLLC;
