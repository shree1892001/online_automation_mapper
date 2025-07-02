const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
 const axios  = require('axios')
class NewhampshireForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
 
    async NewhampshireForLLC(page, jsonData,Payload){
        logger.info('Navigating to Verginia form submission page...');
                    const data = Object.values(jsonData)[0];

        const url = data.State.stateUrl;
        await this.navigateToPage(page, url);
        async function getEmailWithAxios() {
          try {
              const response = await axios.post('http://localhost:9500/get-email');
              console.log('Email data:', response.data);
              return response.data;
          } catch (error) {
              console.error('Error fetching email:', error.message);
              throw error;
          }
      }
        // Login
        await this.fillInputByName(page, 'txtUsername', data.State.filingWebsiteUsername);
        await page.click('button.btn.btn-lg.w-100.btn-primary');
      await this.randomSleep(1000, 3000);

      await page.waitForSelector("#login", { visible: true, timeout: 10000 });
  
      // await Promise.all([
      //     page.click("#login")
      // ]);
      await page.click("#login"); 
  
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




 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
        await page.waitForSelector('a.dropdown-btn');
        // Click the dropdown button
        await page.click('a.dropdown-btn');
 
 
        await page.waitForSelector('#header_3');
        // Click the link
        await page.click('#header_3');
 
 
        await page.waitForSelector('#rdbDomestic');
        // Click the radio button
        await page.click('#rdbDomestic');
 
        await new Promise(resolve => setTimeout(resolve, 4000))
        await page.select('#DomesticBusinessType', 'Limited Liability Company');
 
       
        await new Promise(resolve => setTimeout(resolve, 3000))
        await this.fillInputByName(page, 'BusinessName', payload.Name.Legal_Name);
 
       
        await new Promise(resolve => setTimeout(resolve, 3000))
        await page.select('#ddlBusinessPurpose', '11-Agriculture, Forestry, Fishing and Hunting');
 
       
        await new Promise(resolve => setTimeout(resolve, 3000))
        await page.select('#ddlNAICSSubCode', Payload.Naics_Code.NC_NAICS_Sub_Code);
 
        await page.click('#imgAddPurpose');
 
       
        await page.click('#btnCreateAgent');
 
 
        await new Promise(resolve => setTimeout(resolve, 2000))
        await page.select('#AgentType', 'Individual');
 
       
      // Registered agent
      await new Promise(resolve => setTimeout(resolve, 4000))
      await this.fillInputByName(page, 'AgentName', payload.Registered_Agent.keyPersonnelName);
 
 
       
      await this.fillInputByName(page, 'AgentBusinessAddress.StreetAddress1', payload.Registered_Agent.Address.Street_Address);
      await this.fillInputByName(page, 'AgentBusinessAddress.Zip', String(payload.Registered_Agent.Address.Zip_Code));
      await this.fillInputByName(page, 'AgentBusinessAddress.City1', payload.Registered_Agent.Address.City);
     
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#AgentBusinessAddress_County',jsonData.data.County.countyName );
 
      // Mailing Address
      await new Promise(resolve => setTimeout(resolve, 4000))
      await this.fillInputByName(page, 'AgentMailingAddress.StreetAddress1', payload.Registered_Agent.Mailing_Information.Street_Address);
      await this.fillInputByName(page, 'AgentMailingAddress.Zip', String(payload.Registered_Agent.Mailing_Information.Zip_Code));
      await this.fillInputByName(page, 'AgentMailingAddress.City1', payload.Registered_Agent.Mailing_Information.City);
     
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#AgentMailingAddress_County', jsonData.data.County.countyName);
 
      await page.click('#btnAssignAgent');
 
     
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#IsManagerManaged', 'Member-Managed');
 
 
      await page.waitForSelector('#Perpetual');
      await page.click('#Perpetual');
 
     
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#MiscellaneousPrincipal_TitleID', 'Member');
 
      const rafullname = Payload.Member_Or_Manager_Details[0].Mom_Name;
      const [firstName, lastName] = await this.ra_split(rafullname);
      await this.fillInputByName(page,'MiscellaneousPrincipal.FirstName',firstName);
      await this.fillInputByName(page,'MiscellaneousPrincipal.LastName',lastName);
 
      await new Promise(resolve => setTimeout(resolve, 4000))
      await this.fillInputByName(page, 'MiscellaneousPrincipal.BusinessAddress.Zip',String (Payload.Member_Or_Manager_Details[0].Member_Address.MM_Zip_Code));
      await this.fillInputByName(page, 'MiscellaneousPrincipal.BusinessAddress.City1', Member_Or_Manager_Details[0].Member_Address.MM_City);
 
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#MiscellaneousPrincipal_BusinessAddress_County', '');
      await page.click('#MiscellaneousPrincipal_Save');
 
      // Principal Address
      await new Promise(resolve => setTimeout(resolve, 4000))
      await this.fillInputByName(page, 'PrincipalOfficeAddress.StreetAddress1', payload.Principal_Address.Street_Address);
      await this.fillInputByName(page, 'PrincipalOfficeAddress.City1', payload.Principal_Address.City);
      await this.fillInputByName(page, 'PrincipalOfficeAddress.Zip', String(payload.Principal_Address.Zip_Code));
 
     
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#PrincipalOfficeAddress_County', '');
 
    //   Mailing Address
      await new Promise(resolve => setTimeout(resolve, 4000))
      await this.fillInputByName(page, 'MailingAddress.StreetAddress1', payload.Registered_Agent.Mailing_Information.Street_Address);
      await this.fillInputByName(page, 'MailingAddress.Zip', String(payload.Registered_Agent.Mailing_Information.Street_Address));
      await this.fillInputByName(page, 'MailingAddress.City1', payload.Registered_Agent.Mailing_Information.City);
     
      await new Promise(resolve => setTimeout(resolve, 3000))
      await page.select('#MailingAddress_County', '');
 
    // Signature
    const signfullname = payload.Registered_Agent.keyPersonnelName;
    const [signfirstName, signlastName] = await this.ra_split(signfullname);
    await this.fillInputByName(page,'Principal.FirstName',signfirstName);
    await this.fillInputByName(page,'Principal.LastName',signlastName);
 
 
     
 
    }
}
 
 
module.exports = NewhampshireForLLC;