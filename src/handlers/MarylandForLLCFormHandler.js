const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class MarylandForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
   
    
    async MarylandForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            for(let i=0;i<stateMapping.length;i++){
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                    console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
                }
            }

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            await this.fillInputByName(page, 'UserName', data.State.filingWebsiteUsername);
            await this.fillInputByName(page, 'Password', data.State.filingWebsitePassword);
            await this.clickButton(page, 'button.btn.btn-large.btn-primary.loginBtnAlign');
            await this.clickButton(page, 'a.btn.btn-primary.btn-large.dropdown-toggle.appOptionsProfile');
            await this.clickOnLinkByText(page, 'New Business Filings');
            await this.clickOnLinkByText(page, '› Register a Business');
            await this.clickOnLinkByText(page, 'Maryland Limited Liability Company');
            await this.clickButton(page, 'button[type="submit"][name="FilingOptionSaveAndContinue"]');
           
            const name= payload.Name.Legal_Name; 
            const [name1,designator] =await this.extractnamedesignator(name);  
            // function extractCompanyName(companyName) {
            //     const regex = /^(.*?)(?:\s+(llc|limited liability company|limited liability|LLC|LIMITED LIABILITY COMPABY| Limited Liability Company|Limited Liability | llc))?$/i;
            //     const match = companyName.match(regex);
            //     return match ? match[1].trim() : null; 
            // }
            // function extractCompanyName1(companyName) {
            //     const regex = /^(.*?)(?:\s+(llc|limited liability company|limited liability|LLC|LIMITED LIABILITY COMPABY| Limited Liability Company|Limited Liability | llc))?$/i;
            //     const match = companyName.match(regex);
            //     return match ? match[2].trim() : null; 
            // }

            
            
            
            

            await this.fillInputByName(page, 'LLCName', name1);
          
            await this.clickDropdown(page, '#LLCSuffix', designator);
            await this.clickButton(page, 'button#SearchNames[name="btnSubmit"]');
            const name2= payload.Name.Alternate_Legal_Name; 
          const [name3,designator1] = await this.extractnamedesignator(name2);

        //   const name1 =extractCompanyName(name);  
        await this.tryAlternate(page,"#BusinessName",
            "#BusinessPhysicalAddress_AddressStreet1","#SearchNames",name3);
            await this.fillInputByName(page, 'BusinessPhysicalAddress.AddressStreet1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'BusinessPhysicalAddress.AddressStreet2', payload.Principal_Address['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'BusinessPhysicalAddress.AddressCity', payload.Principal_Address.City);
            await this.clickDropdown(page, '#BusinessPhysicalAddress_AddressCountyId', jsonData.data.County.countyName);
            await this.fillInputByName(page, 'BusinessPhysicalAddress.AddressZip', String(payload.Principal_Address.Zip_Code));
            await this.fillInputByName(page, 'ContactEmailAddress', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'BusinessPhone', payload.Registered_Agent.ContactNo);
            await this.clickButton(page, 'input#BusinessLicenseN[name="BusinessLicense"]');
            await this.clickButton(page, 'button#btnSubmitUBD');
            await this.clickDropdown(page, '#ResidentAgentTypeEnumValue', 'An Individual');
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = fullName.split(' ');
            await this.fillInputByName(page, 'ResidentAgent.FirstName', firstName);
            await this.fillInputByName(page, 'ResidentAgent.LastName', lastName);
            await this.fillInputByName(page, 'ResidentAgent.Phone', payload.Registered_Agent.ContactNo);
            await this.fillInputByName(page, 'ResidentAgent.Email', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'ResidentAgent.ConfirmEmail', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'ResidentAgent.PersonAddress.AddressStreet1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'ResidentAgent.PersonAddress.AddressStreet2', payload.Registered_Agent.Address['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'ResidentAgent.PersonAddress.AddressCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'ResidentAgent.PersonAddress.AddressZip', String(payload.Registered_Agent.Address.Zip_Code));
            await this.clickButton(page, '#btnSubmit');
            await this.clickButton(page, '#btnSubmitUBD');

            const res = "form filled successfully";
            return res

            

        } catch (error) {
            logger.error('Error in Maryland for LLC form handler:', error.stack);
            throw new Error(`Maryland for LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = MarylandForLLC;


