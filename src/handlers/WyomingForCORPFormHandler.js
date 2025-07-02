const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class WyomingForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async WyomingForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to wyoming form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            await this.clickButton(page, '#regStartNow');
            await this.selectRadioButtonById(page, 'MainContent_chkAgree');
            await this.clickDropdown(page, '#MainContent_slctBusType', 'Profit Corporation (Domestic)');
            await new Promise(resolve => setTimeout(resolve, 5000));
            await page.waitForSelector('#MainContent_ContinueButton');
            await page.click('#MainContent_ContinueButton');
            await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtName', payload.Name.Legal_Name );
            await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtNameConfirm', payload.Name.Legal_Name);
            await this.clickButton(page, '#ContinueButton');
            const isNameREplaced=await this.tryAlternate1(
                page, 
                "#txtName",  // selector2
                "#ddlDuration",  // selector1
                payload.Name.Alternate_Legal_Name
              
            );
            if(isNameREplaced){
            
                await this.fillInputByName(page, 'ctl00$MainContent$ucName$txtNameConfirm', payload.Name.Alternate_Legal_Name);
                await this.clickButton(page, '#ContinueButton');

                }
        
            
            //add shares
            await this.clickDropdown(page, '#ddlShareClass', 'Common');
            await this.fillInputByName(page, 'ctl00$MainContent$ucDetail$txtCommonShares', String(payload.Stock_Details.Number_Of_Shares));
            await this.fillInputByName(page, 'ctl00$MainContent$ucDetail$txtCommonPar', String(payload.Stock_Details.Shares_Par_Value));
            await this.clickButton(page, '#ContinueButton');

            // add registered agent information
            const fullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = await this.ra_split(fullName);
            const inputFieldsforRA = [
                { selector: '#txtFirstName', value: firstName },        // First Name input
                { selector: '#txtLastName', value: lastName },          // Last Name input (make sure this ID is correct)
                { selector: '#txtAddr1', value: payload.Registered_Agent.Address.Street_Address },
                { selector: '#txtAddr2', value: payload.Registered_Agent.Address['Address_Line_2']  || " " },  // Address input
                { selector: '#txtCity', value: payload.Registered_Agent.Address.City },      // City input (ensure proper ID)
            ];
            await this.addInput(page, inputFieldsforRA);
            await this.clickButton(page, '#txtPhone');
            await this.clickButton(page, '.postalCodeListItem:nth-child(1)');
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtPhone', payload.Registered_Agent.ContactNo );
            await this.fillInputByName(page, 'ctl00$MainContent$ucRA$txtEmail', payload.Registered_Agent.EmailId);
            await page.click('#chkRAConsent');
            await this.clickButton(page, '#ContinueButton');
            await this.waitForTimeout(5000)
            const errorMessageSelector = '#lblErrorMessage';  // Define the selector
            try {
                // Wait for the error message to appear on the page
                await page.waitForSelector(errorMessageSelector, { visible: true, timeout: 5000 });
                console.log('Error message detected.');
                await this.clickButton(page, '#ContinueButton');
            } catch (error) {
                console.log('Error message not found or other issue:', error.message);
                await this.clickButton(page, '#ContinueButton');
            }
            await this.waitForTimeout(5000)
            await this.clickButton(page, '#ContinueButton');
            await this.waitForTimeout(5000)
            //add principle address information
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr2', payload.Principal_Address['Address_Line_2']  || " ");
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtCity', payload.Principal_Address.City);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtState', payload.Principal_Address.State);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPostal', String(payload.Principal_Address.Zip_Code));
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPhone', payload.Registered_Agent.ContactNo);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtEmail', payload.Registered_Agent.EmailId);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr1Mail', payload.Registered_Agent.Mailing_Information.Street_Address);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtAddr2Mail', payload.Registered_Agent.Mailing_Information['Address_Line_2']  || " ");

            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtCityMail', payload.Registered_Agent.Mailing_Information.City);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtStateMail', payload.Registered_Agent.Mailing_Information.State);
            await this.fillInputByName(page, 'ctl00$MainContent$ucAddress$txtPostalMail', String( payload.Registered_Agent.Mailing_Information.Zip_Code));
            await this.clickButton(page, '#ContinueButton');
            
           

            // add incorporator information
            const OrgfullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [OrgfirstName, OrglastName] = OrgfullName.split(' ');
            await this.fillInputByName(page, 'ctl00$MainContent$ucParties$txtFirstName', OrgfirstName);
            await this.fillInputByName(page, 'ctl00$MainContent$ucParties$txtLastName', OrglastName);
            await this.fillInputByName(page, 'ctl00$MainContent$ucParties$txtMail1', 
                payload.Incorporator_Information.Address.Street_Address + ', ' +
                payload.Incorporator_Information.Address.City + ', ' +
                payload.Incorporator_Information.Address.State + ', ' +
                payload.Incorporator_Information.Address.Zip_Code
            );
            await this.waitForTimeout(2000)
            await new Promise(resolve => setTimeout(resolve, 1000))
            await page.waitForSelector('#SaveButton');
            await this.clickButton(page, '#SaveButton');
            await this.waitForTimeout(7000)
            const errorMessage = await page.evaluate(
                (selector) => document.querySelector(selector)?.innerText,
                selector
            );
            if (errorMessage === 'Please enter at least one Incorporator.') {
                console.log('Error message detected. Performing the required action...');
                await page.waitForSelector('#SaveButton');
            } else {
                console.log('Error message does not match. No action taken.');
            }
            await this.clickButton(page, '#SaveButton');
            await new Promise(resolve => setTimeout(resolve, 1000))
            await page.waitForSelector('#ContinueButton');
            await page.click('#ContinueButton');
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector('#ContinueButton');
            await page.click('#ContinueButton');
            const res = "form filled successfully";
            return res

        } catch (error) {
            logger.error('Error in wyoming For CORP form handler:', error.stack);
            throw new Error(`wyoming For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = WyomingForCORP;
