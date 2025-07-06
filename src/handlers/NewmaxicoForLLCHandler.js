const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class NewmaxicoForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async NewmaxicoForLLC(page, jsonData, payload) {
        try {
            logger.info('Navigating to New Mexico form submission page...');
            const data = Object.values(jsonData)[0];
            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            await this.fillInputByName(page, 'txtUsername', data.State.filingWebsiteUsername);
            await this.fillInputByName(page, 'txtPassword', data.State.filingWebsitePassword);

            await this.clickButton(page ,'#btnSave');
            await new Promise(resolve => setTimeout(resolve, 3000))

            const dialogSelector = '.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons.ui-draggable';
            await page.waitForSelector(dialogSelector, { visible: true });

            console.log('Dialog is visible. Waiting for OK button...');

            // Wait for the OK button inside the dialog to be visible
            const okButtonSelector = 'button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only.button';
            await page.waitForSelector(okButtonSelector, { visible: true });

            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.click(okButtonSelector);

            console.log('Clicked the OK button.');
            await new Promise(resolve => setTimeout(resolve, 3000))
            // Optionally, wait for the dialog to disappear after clicking OK
            await page.waitForFunction(() => {
            const dialog = document.querySelector('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-buttons.ui-draggable');
            return !dialog || window.getComputedStyle(dialog).display === 'none';
            });

            const corporationsSelector = 'li[title="Corporations"] > a.top_link'; // Adjust the selector if needed
            await page.waitForSelector(corporationsSelector, { visible: true });
            await page.click(corporationsSelector); // Click to open the dropdown
          
            // Step 2: Wait for the "Business Search" option to become visible and select it
            const businessSearchSelector = 'li[title="Domestic (NM) LLC Formation"] > a'; // Selector for "Business Search"
            await page.waitForSelector(businessSearchSelector, { visible: true });
            await page.click(businessSearchSelector); // Click the "Business Search" option
            console.log('Clicked on "Domestic (NM) LLC Formation".');
            await this.fillInputByName(page, 'txtEntityName', payload.Name.Legal_Name);
            await page.click('#btnContinue');

            const buttonSelector = 'input[type="button"][onclick="return ValidateControls();"][value="Continue"]';

            // Wait for the "Continue" button to be available and visible
            try {
                await page.waitForSelector(buttonSelector, { visible: true, timeout: 30000 });
                console.log('Continue button is visible.');
            } catch (error) {
                console.error('Error waiting for "Continue" button:', error);
            }
    

    // Attempt to click the "Continue" button
    try {
        await page.evaluate(() => {
            const button = document.querySelector('input[type="button"][onclick="return ValidateControls();"][value="Continue"]');
            if (button) {
                button.click();
            }
        });
        console.log('Clicked on the "Continue" button.');
        await new Promise(resolve => setTimeout(resolve, 3000))
        await this.clickButton(page,'#btnCreateAgent');
        const rafullname = payload.Registered_Agent.keyPersonnelName;
        const [firstName, lastName] = await this.ra_split(rafullname);
        await this.fillInputByName(page, 'txtCreateAgentFirstName', firstName);
        await this.fillInputByName(page, 'txtCreateAgentLastName', lastName);
        await page.waitForSelector('#chkGeographicalLoc', { visible: true });

  // Click the checkbox
      await page.click('#chkGeographicalLoc');
      console.log('Clicked the checkbox.');
      await new Promise(resolve => setTimeout(resolve, 3000))

      await page.waitForSelector('#CreateAgentPhy_GEOStreetAddress1', { visible: true });
      await page.type('#CreateAgentPhy_GEOStreetAddress1',payload.Registered_Agent.Address.Street_Address);
      await page.waitForSelector('#CreateAgentPhy_City', { visible: true });
      await page.type('#CreateAgentPhy_City', payload.Registered_Agent.Address.City);
      await page.waitForSelector('#CreateAgentPhy_Zip5', { visible: true }); 
      await page.type('#CreateAgentPhy_Zip5', String(payload.Registered_Agent.Address.Zip_Code)); 

      await page.click('#chkAgentSamePhyAddr');
      console.log('Checkbox checked');

      await page.evaluate(() => {
        const button = document.querySelector('input[type="button"][value="Create Agent"]');
        if (button) {
            button.click(); // Simulate the click
        } else {
            throw new Error('Button not found.');
        }
    });
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector(`input[name="Principal.StreetAddress1"]`, { visible: true });
            await this.fillInputByName(page,'Principal.StreetAddress1',payload.Principal_Address.Street_Address);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.fillInputByName(page,'Principal.City',payload.Principal_Address.City);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector('#Principal_Zip5');

  // Type the zip code in the input field without the hyphen
            await page.type('#Principal_Zip5', String(payload.Principal_Address.Zip_Code));
            await new Promise(resolve => setTimeout(resolve, 3000))

            await page.evaluate(() => {
                const button = document.querySelector('input[type="button"][value="Continue"]');
                if (button) {
                    button.click(); // Simulate the click
                    console.log('Continue button clicked.');
                } else {
                    throw new Error('Button not found.');
                }
            });
             // Wait for the button to be available
             await this.waitForTimeout(5000)
             await page.waitForSelector('#imgAddMembers');
             await page.click('#imgAddMembers');
            await page.waitForSelector('#Member_Type');

            // Select the "Individual" option by its value ('I')
            await page.select('#Member_Type', 'I');
            const inputFields = payload.Member_Or_Manager_Details[0].Mom_Name
            const [firstNam, lastNam] = inputFields.split(' ');
            const registerAgentFields = [{ label: 'Member_FirstName', value: firstNam },
                {label:'Member_LastName',value: lastNam },
            ];
            await this.addInput(page,registerAgentFields);

            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.fillInputByName(page,'MemberPhysical.StreetAddress1',payload.Principal_Address.Street_Address);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector('#MemberPhysical_Zip5');
            await page.type('#MemberPhysical_Zip5', payload.Principal_Address.Zip_Code.toString());
            await page.click('input[name="MemberPhysical.StreetAddress1"]');
            await this.waitForTimeout(3000)
            await page.waitForSelector('#Member_ChkSameasPhysical', { visible: true });
            await page.click('#Member_ChkSameasPhysical');
            await this.waitForTimeout(5000)
            await page.waitForSelector('#Member_btnAdd', { visible: true });

            // Click the button
            await page.click('#Member_btnAdd');

            await page.click('#btnContinue');

            await page.waitForSelector('#imgAddOrganizer');

            // Click the button to trigger the AddOrganizer function
            await page.click('#imgAddOrganizer');

            await page.waitForSelector( '#rbOrganizerIndividual');

           // Click the radio button to select it
            await page.click( '#rbOrganizerIndividual');

            const input = payload.Organizer_Information.keyPersonnelName;
            const [firstNamed, lastNamed] = input.split(' ');
            const organizerFields = [
                { label: 'txtOrgFirstName', value: firstNamed },
                { label: 'txtOrgLastName', value: lastNamed }
            ];
    
           await this.addInput(page,organizerFields);


           await this.fillInputByName(page, 'OrganizerAddress.StreetAddress1', payload.Organizer_Information.Address.Street_Address);
           await this.clickDropdown(page, 'select[name="OrganizerAddress.Country"]', 'United States');
        //    await this.fillInputByName(page, 'OrganizerAddress.City', payload.Organizer_Information.Address.City);
        //    await new Promise(resolve => setTimeout(resolve, 3000))
        //    await this.fillInputByName(page, 'OrganizerAddress.Zip5',String( payload.Organizer_Information.Address.Zip_Code));
           await this.fillInputByName(page, 'OrganizerAddress.Zip5',String( payload.Organizer_Information.Address.Zip_Code));
           await page.click('input[name="OrganizerAddress.StreetAddress1"]');
            await this.waitForTimeout(3000)
           await page.waitForSelector('#btnAddOrganizer');

           // Click the button
           await page.click('#btnAddOrganizer');
           await page.waitForSelector('#chkOrganizerAuthorizer1');
           await page.click('#chkOrganizerAuthorizer1');
           await page.waitForSelector('#btnBrowse');
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click('#btnBrowse')
            ]);
            const filePath = '""C:/Users/Redberyl/Downloads/Notification document..pdf/"';
            await fileChooser.accept([filePath]);
            await this.waitForTimeout(2000)
            await this.clickButton(page,'#btnUpload')
            await this.waitForTimeout(5000)            
            await page.keyboard.press('Enter');
            await this.clickButton(page,'#btnContinue')
        
            const res = "form filled successfully";
            return res
     

    } catch (error) {
        console.error('Error clicking the "Continue" button:', error);
    }
            
    } catch (error) {
        logger.error('Error in Newmaxico For LLC form handler:', error.stack);
        throw new Error(`Newmaxico For LLC form submission failed: ${error.message}`);
    }
}
}

module.exports = NewmaxicoForLLC;