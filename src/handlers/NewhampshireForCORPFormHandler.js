const BaseFormHandler = require('../handlers/BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
const axios  = require('axios')

 
class NewhampshireForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
 
    async NewhampshireForCORP(page, jsonData,Payload){
        logger.info('Navigating to Verginia form submission page...');
        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
        await this.navigateToPage(page, url);
       
        // Login
        await this.fillInputByName(page, 'txtUsername', data.State.filingWebsiteUsername);
        await page.click('button.btn.btn-lg.w-100.btn-primary');
 
         await page.waitForSelector("#login", { visible: true, timeout: 10000 });
         
             // await Promise.all([
             //     page.click("#login")
             // ]);
         await this.clickButton(page,"#login");
          await this.randomSleep(1000, 3000);
       
                
               await this.randomSleep(1000,3000);
               const response = await axios.post('http://localhost:9500/get-email', {
                 subject: 'Your request for Authentication Code has been received.'
               });
       console.log("otp is",response.data);
       
       
       
       
       const otpDigits = response.data.toString().split('');
       
               // Fill in each digit
               for (let i = 1; i <= 6; i++) {
                   const inputSelector = `#txtDig${i}`;
                   await page.waitForSelector(inputSelector);
                   
                   // Type the digit
                   await page.type(inputSelector, otpDigits[i-1], { delay: 100 });
               }
       
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
       
        // Shares
        await new Promise(resolve => setTimeout(resolve, 2000))
        await page.select('#ddlShares', 'Common');
        await this.fillInputByName(page, 'NumShares', payload.Stock_Details.Number_Of_Shares);
        await page.click('#imgAddShare');
 
       
       
      // Registered agent
      await page.click('#btnCreateAgent');
      await new Promise(resolve => setTimeout(resolve, 2000))
      await page.select('#AgentType', 'Individual');
 
      await new Promise(resolve => setTimeout(resolve, 2000))      
      const Regfullname = payload.Registered_Agent.keyPersonnelName;
      const [RegfirstName, ReglastName] = await this.ra_split(Regfullname);
      await this.fillInputByName(page,'FirstName',RegfirstName);
      await this.fillInputByName(page,'LastName',ReglastName);
 
      await this.fillInputByName(page, 'AgentBusinessAddress.StreetAddress1', payload.Registered_Agent.Address.Street_Address);
      await this.fillInputByName(page, 'AgentBusinessAddress.Zip', payload.Registered_Agent.Address.Zip_Code);
      await this.fillInputByName(page, 'AgentBusinessAddress.City1', payload.Registered_Agent.Address.City);
     
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#AgentBusinessAddress_County', '');
 
      // Mailing Address
      await new Promise(resolve => setTimeout(resolve, 4000))
      await this.fillInputByName(page, 'AgentMailingAddress.StreetAddress1', payload.Registered_Agent.Mailing_Information.Street_Address);
      await this.fillInputByName(page, 'AgentMailingAddress.Zip', String(payload.Registered_Agent.Mailing_Information.Zip_Code));
      await this.fillInputByName(page, 'AgentMailingAddress.City1', payload.Registered_Agent.Mailing_Information.City);
     
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#AgentMailingAddress_County', '');
 
      await page.click('#btnAssignAgent');
 
      await page.waitForSelector('#Perpetual');
      await page.click('#Perpetual');
 
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#ddlBusinessPurpose', '11-Agriculture, Forestry, Fishing and Hunting');
 
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#ddlNAICSSubCode', payload.Naics_Code.Naics_Code);
     
      await page.click('#imgAddPurpose');
     
      await page.click('#btnContinue');
     
 
     
      const Incfullname = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
      const [IncfirstName, InclastName] = await this.ra_split(Incfullname);
      await this.fillInputByName(page,'Incorporator.FirstName',IncfirstName);
      await this.fillInputByName(page,'Incorporator.LastName',InclastName);
 
        // Principal Address
        await new Promise(resolve => setTimeout(resolve, 4000))
        await this.fillInputByName(page, 'Incorporator.BusinessAddress.StreetAddress1', payload.Incorporator_Information.Address.Street_Address);
        await this.fillInputByName(page, 'Incorporator.BusinessAddress.City1', payload.Incorporator_Information.Address.City);
        await this.fillInputByName(page, 'Incorporator.BusinessAddress.Zip', String(payload.Incorporator_Information.Address.Zip_Code));
 
       
        await new Promise(resolve => setTimeout(resolve, 3000))
        await page.select('#Incorporator_BusinessAddress_County', '');
 
        // Continue button
        await page.click('#Incorporator_Save');
     
       // Principal Address
       await new Promise(resolve => setTimeout(resolve, 4000))
       await this.fillInputByName(page, 'PrincipalOfficeAddress.StreetAddress1', payload.Principal_Address.Street_Address);
       await this.fillInputByName(page, 'PrincipalOfficeAddress.City1', payload.Principal_Address.City);
       await this.fillInputByName(page, 'PrincipalOfficeAddress.Zip', String(payload.Principal_Address.Zip_Code));
 
       
       await new Promise(resolve => setTimeout(resolve, 3000))
       await page.select('#PrincipalOfficeAddress_County', '');
 
     // Mailing Address
              await new Promise(resolve => setTimeout(resolve, 4000))
      await this.fillInputByName(page, 'AgentMailingAddress.StreetAddress1', payload.Registered_Agent.Mailing_Information.Street_Address);
      await this.fillInputByName(page, 'AgentMailingAddress.Zip', String(payload.Registered_Agent.Mailing_Information.Zip_Code));
      await this.fillInputByName(page, 'AgentMailingAddress.City1', payload.Registered_Agent.Mailing_Information.City);
       
       await new Promise(resolve => setTimeout(resolve, 3000))
       await page.select('#MailingAddress_County', '');
 
     // Clickbox
      await page.click('#chkCertify');
 
     // Signature
     const sigfullname = payload.Registered_Agent.keyPersonnelName;
     const [sigfirstName, siglastName] = await this.ra_split(sigfullname);
     await this.fillInputByName(page,'Principal.FirstName',sigfirstName);
     await this.fillInputByName(page,'Principal.LastName',siglastName);
 
    // Continue button
     await page.click('#btnContinue');
 
    }
}
 
 
module.exports = NewhampshireForCORP;
 
