const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');

class VirginiaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async VirginiaForCORP(page, jsonData,Payload){
        logger.info('Navigating to Verginia form submission page...');
        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
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


      //  await this.randomSleep(1000,2000);

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
      await page.waitForSelector('a[onclick*="NavigateToController(\'BusinessFilingSelect\',\'BusinesEntityOnlineShared\',\'New Businesses\')"]'); // Wait for the element to appear
      await page.click('a[onclick*="NavigateToController(\'BusinessFilingSelect\',\'BusinesEntityOnlineShared\',\'New Businesses\')"]');
     
      await new Promise(resolve => setTimeout(resolve, 4000))
      await page.select('#entityType', '1');
      await new Promise(resolve => setTimeout(resolve, 4000))
      await page.select('#filingType', '22');

      await page.waitForSelector('#btnContinue');
      await page.click('#btnContinue');

      await new Promise(resolve => setTimeout(resolve, 5000))
      await this.fillInputByName(page, 'SharedSteps_EntitySearch_EntityName',payload.Name.Legal_Name);

      //Check Avaibility 
      await new Promise(resolve => setTimeout(resolve, 7000))
      await page.waitForSelector('#btnSearch');
      await page.click('#btnSearch');

      // Next Button
      await new Promise(resolve => setTimeout(resolve, 10000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');

      await this.randomSleep(2000,3000); 
      await page.waitForSelector('#DocumentProcessingSteps_EntityInformation_NewStockCorporationFormation_EntityEmailAddresTextBox');

      await this.fillInputByIdSingle(page,"#DocumentProcessingSteps_EntityInformation_NewStockCorporationFormation_EntityEmailAddresTextBox",payload.Registered_Agent.EmailId)
      // await page.type('#DocumentProcessingSteps_EntityInformation_NewLLCFormation_EntityEmailAddressTextBox', jsonData.data.Payload.Registered_Agent.Name.Email);

      await page.waitForSelector('#DocumentProcessingSteps_EntityInformation_NewStockCorporationFormation_EntityContactNumberTextBox');
      await page.type('#DocumentProcessingSteps_EntityInformation_NewStockCorporationFormation_EntityContactNumberTextBox', payload.Registered_Agent.ContactNo);

    //   Stock Info
    await new Promise(resolve => setTimeout(resolve, 3000))
    await this.fillInputByName(page, 'NewStockCorporationFormation_AuthorizedShare_EntityTotalSharesTextBox', payload.Stock_Details.Number_Of_Shares);

    //Next Button 
    await page.evaluate(() => {
        const button = document.querySelector('#btnNext');
        if (button) button.click();
      });
    
    // // Next Button
    //   await new Promise(resolve => setTimeout(resolve, 3000))
    //   await page.waitForSelector('#btnNext');
    //   await page.click('#btnNext');

    await page.click('#btnNext');

      // Create Agent
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#createAgent');
      await page.click('#createAgent');

 
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#createAgentinfo_NameFields_RegisterAgentTypeId', '49');

      
      await new Promise(resolve => setTimeout(resolve, 4000))

      const rafullname = payload.Registered_Agent.keyPersonnelName;
      const [firstName, lastName] = await this.ra_split(rafullname);
      await this.fillInputByName(page, 'createAgentinfo_NameFields.FirstName', firstName);
      // await new Promise(resolve => setTimeout(resolve, 3000))
      await this.fillInputByName(page, 'createAgentinfo_NameFields.LastName', lastName);

      
      // Registered agent
      await new Promise(resolve => setTimeout(resolve, 4000))
      await this.fillInputByName(page, 'documentProcessingStep_CreateStatutoryAgentModal_PrincipalAddess.StreetAddress1', payload.Registered_Agent.Address.Street_Address);
      await this.fillInputByName(page, 'documentProcessingStep_CreateStatutoryAgentModal_PrincipalAddess.City', payload.Registered_Agent.Address.City);
      await this.fillInputByName(page, 'documentProcessingStep_CreateStatutoryAgentModal_PrincipalAddess.Zip5', payload.Registered_Agent.Address.Zip_Code.toString());


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
      await this.fillInputByName(page, 'PrincipalOfficeAddress.StreetAddress1', payload.Principal_Address.Street_Address);
      await this.fillInputByName(page, 'PrincipalOfficeAddress.City', payload.Principal_Address.City);
      await this.fillInputByName(page, 'PrincipalOfficeAddress.Zip5', payload.Principal_Address.Zip_Code.toString());

      //Next 
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');


      // Checkbox
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.waitForSelector('#PrincipalOfficeAddressVerifiedAddress');
      await page.click('#PrincipalOfficeAddressVerifiedAddress');




        // Director Checkbox
        await new Promise(resolve => setTimeout(resolve, 3000))
        await page.waitForSelector('#chkDirectors');
        await page.click('#chkDirectors');
      
        
      const dirfullname = payload.Director_Information.Director_Details.Name;
      const [dirfirstName, dirlastName] = dirfullname.split(' ');
      await this.fillInputByName(page, 'PrincipalInfoName.FirstName', dirfirstName);
      // await new Promise(resolve => setTimeout(resolve, 3000))
      await this.fillInputByName(page, 'PrincipalInfoName.LastName', dirlastName);


        // Director Address
        await new Promise(resolve => setTimeout(resolve, 4000))
        await this.fillInputByName(page, 'PrincipalInfoName.StreetAddress1', Payload.Director_Information.Address.Dir_Address_Line_1);
        await this.fillInputByName(page, 'PrincipalInfoName.City', Payload.Director_Information.Address.Dir_City);
        await this.fillInputByName(page, 'PrincipalInfoName.Zip5', Payload.Director_Information.Address.Dir_Zip_Code.toString());
      

        // Add director
        await new Promise(resolve => setTimeout(resolve, 5000))
        await page.waitForSelector('#buttonAdd');
        await page.click('#buttonAdd');


      //Next 
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');


      //Next 
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');



      //Incorporator Details
      await new Promise(resolve => setTimeout(resolve, 4000))
      await this.fillInputByName(page, 'NewStockCorporationFormation.CurrentSignature.Name', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
      
      await new Promise(resolve => setTimeout(resolve, 4000))

      const orgfullname = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
      const [orgfirstName, orglastName] = orgfullname.split(' ');
      await this.fillInputByName(page, 'NewStockCorporationFormation.CurrentSignature.PrintedName.FirstName', orgfirstName);
      // await new Promise(resolve => setTimeout(resolve, 3000))
      await this.fillInputByName(page, 'NewStockCorporationFormation.CurrentSignature.PrintedName.LastName', orglastName);



      //Addbutton
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#AddSignatureBtn');
      await page.click('#AddSignatureBtn');

      await new Promise(resolve => setTimeout(resolve, 4000))
      await page.click('button.confirm');

      //Next 
      await new Promise(resolve => setTimeout(resolve, 5000))
      await page.waitForSelector('#btnNext');
      await page.click('#btnNext');

    }
}

  
module.exports = VirginiaForCORP;
