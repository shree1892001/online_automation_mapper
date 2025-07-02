const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class RhodeislandForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async RhodeislandForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;;
            await this.navigateToPage(page, url);
            await page.select('select[name="tblDataTable_length"]', '100');
            await page.waitForSelector('a[href="https://business.sos.ri.gov/corp/LoginSystem/FormRouter.asp?FilingCode=0801093&NewFormation=True"]', { visible: true, timeout: 10000 });

            // Click the FileOnline link
            await page.click('a[href="https://business.sos.ri.gov/corp/LoginSystem/FormRouter.asp?FilingCode=0801093&NewFormation=True"]');
             await this.fillInputByName(page, 'EntityName', payload.Name.Legal_Name);
            //add register agent
            await this.fillInputByName(page, 'AgentAddr1', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'AgentAddr2', payload.Registered_Agent.Address['Address_Line_2']  || " ");

            await this.fillInputByName(page, 'AgentCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'AgentName', payload.Registered_Agent.keyPersonnelName);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.fillInputByName(page, 'AgentPostalCode', String(payload.Registered_Agent.Address.Zip_Code)); 
            await page.click('input[name="ArticlesChanged1"][value="C"]'); 
            await this.fillInputByName(page, 'Addr1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(page, 'City', payload.Principal_Address.City); 
            await new Promise(resolve => setTimeout(resolve, 3000))

            
               const  state="RI";
                payload.Principal_Address.State =state;
                // payload.organizer_information.Address.state =state;

                await page.evaluate(() => {
                    CS(1, 'State', document.TemplateForm.ContactState); 
                  });
                
                  const state1=payload.organizer_information.Address.state.split("-"); 
                  const req=state1[0]+" "+state1[1]; 
                  const newPagePromise1=new Promise(resolve=>{
                    page.once('popup',resolve); 
                  });
                  const newPage=await newPagePromise1;
    
                 await newPage.click("#submitItem");

    

            
            await this.fillInputByName(page, 'State', payload.Principal_Address.State);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.fillInputByName(page, 'PostalCode', String(payload.Principal_Address.Zip_Code)); 
            await this.fillInputByName(page, 'CountryCode',"USA"); 

            await page.click('input[name="DateType"][value="P"]');   
            await page.click('input[name="FiscalDay"][value="01"]');

            await this.fillInputByName(page, 'ContactName', payload.Organizer_Information.keyPersonnelName);
            await this.fillInputByName(page, 'ContactOrgName', payload.Name.Legal_Name);
            await this.fillInputByName(page, 'ContactAddr1', payload.Organizer_Information.Address.Street_Address);
            await this.fillInputByName(page, 'ContactAddr2', payload.Organizer_Information.Address['Address_Line_2']  || " ");

            await this.fillInputByName(page, 'ContactCity', payload.Organizer_Information.Address.City);
            await this.fillInputByName(page, 'ContactPhone', String(payload.Organizer_Information.ContactNo));
            await this.fillInputByName(page, 'ContactEMail', payload.Organizer_Information.EmailId);

            
            await this.fillInputByName(page, 'ContactState', req);
            await this.fillInputByName(page, 'ContactPostalCode', String(payload.Organizer_Information.Address.Zip_Code)); 
            await this.fillInputByName(page, 'ContactCountryCode',"USA"); 
            await this.fillInputByName(page, 'UnderSignedName1', payload.Organizer_Information.keyPersonnelName)
            await new Promise(resolve => setTimeout(resolve, 3000))
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
            logger.error('Error in Rhodeisland LLC form handler:', error.stack);
            throw new Error(`Rhodeisland For LLC form submission failed: ${error.message}`);
        }
    }
}
module.exports = RhodeislandForLLC;
