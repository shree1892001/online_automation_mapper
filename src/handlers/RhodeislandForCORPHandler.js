const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class RhodeislandForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async RhodeislandForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            // Click the FileOnline link
            await page.click('a[href="https://business.sos.ri.gov/corp/LoginSystem/FormRouter.asp?FilingCode=0200013&NewFormation=True"]');
            await this.fillInputByName(page, 'EntityName', payload.Name.Legal_Name);
            await page.waitForSelector('select[name="StockClass_1"]', { visible: true, timeout: 10000 });
            await this.clickDropdown(page, 'select[name="StockClass_1"]', 'CWP');
            await page.waitForSelector('input[name="stock2_1"]', { visible: true, timeout: 60000 });
            // Manually type data into the input field
            await page.type('input[name="stock2_1"]', payload.Stock_Details.Number_Of_Shares);
            await this.fillInputByName(page, 'AgentAddr1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'AgentAddr2', payload.Registered_Agent.Address['Address_Line_2']  || " ");
            await this.fillInputByName(page, 'AgentCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'AgentName', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(page, 'AgentPostalCode',String( payload.Registered_Agent.Address.Zip_Code));
            await page.select('select[name="Title_1000"]', 'Incorporator');
            let state=""; 

            
                state="RI";
                payload.Incorporator_Information.Address.State =state;



            const rafullname = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [firstName, lastName] = rafullname.split(' ');
            await this.fillInputByName(page, 'FirstName_1000', firstName);
            await this.fillInputByName(page, 'LastName_1000', lastName);
            logger.info('FoRm submission complete fot Michigan LLC')  
            await this.fillInputByName(page, 'BusAddr_1000', payload.Incorporator_Information.Address.Street_Address);

            await this.fillInputByName(page, 'BusCity_1000', payload.Incorporator_Information.Address.City);
            await this.fillInputByName(page, 'BusState_1000', payload.Incorporator_Information.Address.State);
            await this.fillInputByName(page, 'BusPostalCode_1000', String(payload.Incorporator_Information.Address.Zip_Code));
            await this.fillInputByName(page, 'BusCountryCode_1000',"USA");
            await page.waitForSelector('input[name="AddIndividual"]');
            await page.click('input[name="AddIndividual"]');




            

           

            await this.fillInputByName(page, 'ContactName', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByName(page, 'ContactOrgName', payload.Name.Legal_Name);
            await this.fillInputByName(page, 'ContactAddr1', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, 'ContactAddr2', payload.Incorporator_Information.Address['Address_Line_2']  || " ");

            await this.fillInputByName(page, 'ContactCity', payload.Incorporator_Information.Address.City);
            await this.fillInputByName(page, 'ContactPhone', payload.Incorporator_Information.Incorporator_Details.Inc_Contact_No);
            await this.fillInputByName(page, 'ContactEMail', payload.Incorporator_Information.Email_Address);



            await page.evaluate(() => {
                CS(1, 'State', document.TemplateForm.ContactState); 
              });
            
              const state1=payload.Incorporator_Information.Address.State.split("-"); 
              const req=state1[0]+" "+state1[1]; 
              const newPagePromise1=new Promise(resolve=>{
                page.once('popup',resolve); 
              });
              const newPage=await newPagePromise1;

             await newPage.click("#submitItem");
            await this.fillInputByName(page, 'ContactState', req);
            
            
              


            await this.fillInputByName(page, 'ContactPostalCode', String(payload.Incorporator_Information.Address.Zip_Code)); 
            await this.fillInputByName(page, 'ContactCountryCode', "USA"); 
          // await page.waitForSelector('input[name="VerifyDisclaimer"][value="A"]', { visible: true, timeout: 60000 });
            await page.click('input[name="VerifyDisclaimer"][value="A"]');
            try {
                await page.waitForSelector('input[name="Submit"]');
                await page.click('input[name="Submit"]');
                
                // Wait for navigation or a specific element that indicates success
                await page.waitForNavigation(); // You may need to adjust this based on your flow
            } catch (error) {
                console.error('Error during form submission:', error);
            }
            const res = "form filled successfully";
            return res



        } catch (error) {
            logger.error('Error in Rhodeisland CORP form handler:', error.stack);
            throw new Error(` Rhodeisland CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = RhodeislandForCORP;
