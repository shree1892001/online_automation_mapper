const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class MarylandForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async MarylandForCORP(page,jsonData,payload) {
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
            await this.clickOnLinkByText(page, 'Maryland Close Corporation');
            await this.clickButton(page, 'button[type="submit"][name="FilingOptionSaveAndContinue"]');
            const name= payload.Name.Legal_Name; 
            const [name1,designator] = await this.extractnamedesignator(name);
            // function extractCompanyName(companyName) {
            //     const regex = /^(.*?)(?:\s+(corp|corp.|Corp|Corporation|Corp.|Inc|Incorporated|CORP|CORPORATION|CORP.|  Corp| corp| corp.| Corporation| Corp.| Inc| Incorporated| corp| Corp ))?$/i;
            //     const match = companyName.match(regex);
            //     return match ? match[1].trim() : null; 
            // }
            await this.fillInputByName(page, 'CorpName', name1);
            await this.clickDropdown(page, '#CorpSuffix', designator);
            await this.clickButton(page, 'button#SearchNames[name="btnSubmit"]');
            
            const name2= payload.Name.Alternate_Legal_Name; 

          const [name3,designator1] = await this.extractnamedesignator(name2) ;
          await this.tryAlternate(page,"#BusinessName",
            "#BusinessPhysicalAddress_AddressStreet1","#SearchNames",name3 || " ");

            // await this.clickButton(page, 'button#SearchNames[name="btnSubmit"]');
            await this.fillInputByName(page, 'BusinessPhysicalAddress.AddressStreet1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'BusinessPhysicalAddress.AddressStreet2', payload.Principal_Address['Address_Line_2']);
            await this.fillInputByName(page, 'BusinessPhysicalAddress.AddressCity', payload.Principal_Address.City);
            await this.clickDropdown(page, '#BusinessPhysicalAddress_AddressCountyId', jsonData.data.County.countyName);
            await this.fillInputByName(page, 'BusinessPhysicalAddress.AddressZip', String(payload.Principal_Address.Zip_Code));
            await this.fillInputByName(page, 'ContactEmailAddress', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'BusinessPhone', payload.Registered_Agent.ContactNo);
            const inputData = [
                { selector: '#description', value: ' business purpose ' }
            ];
            await this.fillInputbyid(page, inputData);
            await this.clickButton(page, 'input#BusinessLicenseN[name="BusinessLicense"]');
            await this.clickButton(page, 'button#btnSubmitUBD');
            await this.clickOnLinkByText(page, 'Add Incorporator');
            const fullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [firstName, lastName] = fullName.split(' ');
            await this.fillInputByName(page, 'Incorporator.FirstName', firstName);
            await this.fillInputByName(page, 'Incorporator.LastName', lastName);
            await this.fillInputByName(page, 'IncorporatorAddress.AddressStreet1', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, 'IncorporatorAddress.AddressStreet2', payload.Incorporator_Information.Address['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'IncorporatorAddress.AddressCity', payload.Incorporator_Information.Address.City);
            await this.fillInputByName(page, 'IncorporatorAddress.AddressZip', String(payload.Incorporator_Information.Address.Zip_Code.toString()));
            await this.clickButton(page, 'button.btn.btn-primary');
            await this.clickButton(page, 'button[name="IndexAndContinue"].btn-primary');
            await this.clickDropdown(page, '#ResidentAgentTypeEnumValue', 'An Individual');
            const RAfullName = payload.Registered_Agent.keyPersonnelName;
            const [RAfirstName, RAlastName] = RAfullName.split(' ');
            await this.fillInputByName(page, 'ResidentAgent.FirstName', RAfirstName);
            await this.fillInputByName(page, 'ResidentAgent.LastName', RAlastName);
            await this.fillInputByName(page, 'ResidentAgent.Phone', payload.Registered_Agent.ContactNo);
            await this.fillInputByName(page, 'ResidentAgent.Email', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'ResidentAgent.ConfirmEmail', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'ResidentAgent.PersonAddress.AddressStreet1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'ResidentAgent.PersonAddress.AddressStreet2', payload.Registered_Agent.Address['Address_Line_2'] ||"");
            await this.fillInputByName(page, 'ResidentAgent.PersonAddress.AddressCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'ResidentAgent.PersonAddress.AddressZip', payload.Registered_Agent.Address.Zip_Code.toString());
            await this.clickButton(page, '#btnSubmit');
            await this.fillInputByName(page, 'NumberOfShares', String(payload.Stock_Details.Number_Of_Shares));
            await this.fillInputByName(page, 'ValuePerShare', String(payload.Stock_Details.Shares_Par_Value));
            await this.clickButton(page, 'button[name="EditShareInfoAndContinue"].btn-primary');
            await this.clickOnLinkByText(page, 'Add Director');
            const orgfullName = payload.Director_Information.Director_Details.Name;
            const [orgfirstName, orglastName] = orgfullName.split(' ');
            await this.fillInputByName(page, 'Director.FirstName', orgfirstName);
            await this.fillInputByName(page, 'Director.LastName', orglastName);
            await this.fillInputByName(page, 'Director.PersonAddress.AddressStreet1', payload.Director_Information.Address.Dir_Address_Line_1);
            await this.fillInputByName(page, 'Director.PersonAddress.AddressStreet2', payload.Director_Information.Address.Dir_Address_Line_2 ||"");
            await this.fillInputByName(page, 'Director.PersonAddress.AddressCity', payload.Director_Information.Address.City);
            await this.fillInputByName(page, 'Director.PersonAddress.AddressZip', payload.Director_Information.Address.Zip_Code.toString());
            await this.clickButton(page, 'button[type="submit"].btn.btn-primary');
            await this.clickButton(page, 'button[name="IndexAndContinue"]');
            await this.clickButton(page, '#btnSubmitUBD');
            const res = "form filled successfully";
            return res

        } catch (error) {
            logger.error('Error in Maryland For CORP form handler:', error.stack);
            throw new Error(`Maryland For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = MarylandForCORP;


