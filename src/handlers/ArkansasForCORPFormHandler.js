const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { add } = require('winston');
const { json } = require('express/lib/response');

class ArkansasForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async  ArkansasForCORP(page,jsonData,payload) {
      try {
        logger.info('Navigating to Arkansas form submission page...');
                    const data = Object.values(jsonData)[0];


        const url = data.State.stateUrl;
        await this.navigateToPage(page, url);
       await this.randomSleep(30000,50000); 
        await page.evaluate(() => {
            document.querySelector('a[href="javascript:showOptions(1)"]').click();
        });

        // start form 
        await page.click('input[type="submit"][name="do:StartForm=1"]');

        // Entity Name  
        const entityname=[
          {label:'entity_name', value:payload.Name.Legal_Name}
        ];
        await this.addInput(page, entityname);

        // Stock info
        await page.click('#stock_nonstock_yes');

        const Stock =[
            {label:'auth_stock_total_shares', value: String(payload.Stock_Details.Number_Of_Shares)},
            {label:'auth_stock_par_value', value: String(payload.Stock_Details.Shares_Par_Value)}
        ];
        await this.addInput(page, Stock);


        // Registerd agent

         // Sample values to fill in
         const labels = await page.evaluate(() => {
            const fieldsets = Array.from(document.querySelectorAll('fieldset.group'));
              
            // Find the one that contains "Registered Agent"
            const registeredAgentFieldset = fieldsets.find(fieldset => {
                const legend = fieldset.querySelector('legend');
                return legend && legend.textContent.trim() === 'Registered Agent';
            });
    
            // If the Registered Agent fieldset is found, get all labels in it
            if (registeredAgentFieldset) {
                const labelElements = Array.from(registeredAgentFieldset.querySelectorAll('label'));
                return labelElements.map(label => label.textContent.trim());
            }
            
            return []; // Return an empty array if not found
        });
    
        // Print the labels to the console
        console.log("Registered Agent Labels:", labels);
    
            const inputFields = [
                {
                    label: 'Business Name',
                    value: payload.Registered_Agent.keyPersonnelName,
                    sectionText: 'Registered Agent'
                },
          
                {
                    label: '*Address 1',
                    value: payload.Registered_Agent.Address.Street_Address,
                    sectionText: 'Registered Agent'
                },
                {
                  label: '*Address 2',
                  value: payload.Registered_Agent.Address['Address_Line_2']|| " ",
                  sectionText: 'Registered Agent'
              },
              
                {
                    label: '*Zip',
                    value: payload.Registered_Agent.Address.Zip_Code, // Example Arkansas zip code
                    sectionText: 'Registered Agent'
                },
                {
                    label: 'City',
                    value: payload.Registered_Agent.Address.City,
                    sectionText: 'Registered Agent'
                 },
               
            ];
    
            await this.addInputbyselector(page, inputFields);

             // Incorporator/Organizer
            //  Incorporator

            const Manager =[
            {label: 'officer_organization_name', value: payload.Name.Legal_Name}
            ];
            await this.addInput(page, Manager);
            await this.clickDropdown(page, '#officer_title', 'Incorporator/Organizer');
  
            const Manageradd =[
              {label: 'officer_address_1',value: payload.Incorporator_Information.Address.Street_Address},
              {label: 'officer_address_2',value: payload.Incorporator_Information.Address['Address_Line_2']|| " "},
              {label: 'officer_city',value: payload.Incorporator_Information.Address.City},
              {label: 'officer_zip_code',value: String(payload.Incorporator_Information.Address.Zip_Code)}
            ];
            await this.addInput(page, Manageradd);
            await page.click('input[name="save_add_officer"]');
  
            // Officer
              const [ofname1 ,ofname2]=await this.ra_split(payload.Officer_Information.Officer_Details.keyPersonnelName); 
              
              await this.fillInputByName(page,"officer_first_name",ofname1); 
              await this.fillInputByName(page,"officer_last_name",ofname2); 

              
              await this.clickDropdown(page, '#officer_title', 'General Manager');
    
              const Memberadd =[
                {label: 'officer_address_1',value: payload.Officer_Information.Address.Street_Address},
                {label: 'officer_address_2',value: payload.Officer_Information.Address.Of_Address_Line_2 || " "},
                {label: 'officer_city',value: payload.Officer_Information.Address.City},
                {label: 'officer_zip_code',value: String(payload.Officer_Information.Address.Of_Zip_Code)}
              ];
              await this.addInput(page, Memberadd);
              await page.click('input[name="save_add_officer"]');


              const purpose =[
                {label: 'purpose',value:payload.Purpose.Purpose_Details}
              ];
              await this.addInput(page, purpose);
              
              //Submitter Contact Info 

              const submittor =[
                {label: 'contact_organization_name', value: payload.Name.Legal_Name}
                ];
                await this.addInput(page, submittor);

              const submittoradd =[
                {label: 'contact_address_1',value:payload.Incorporator_Information.Address.Street_Address},
                {label: 'contact_address_2',value:payload.Incorporator_Information.Address['Address_Line_2']},
                {label: 'contact_city',value:payload.Incorporator_Information.Address.City},
                {label: 'contact_zip_code',value: String(payload.Incorporator_Information.Address.Zip_Code)},
                {label: 'contact_phone_number', value:payload.Incorporator_Information.Incorporator_Details.Inc_Contact_No},
                {label: 'contact_email', value:payload.Incorporator_Information.Email_Address}
              
              ];
              await this.addInput(page, submittoradd);

              // Annual Report Contact Information 
              const Annual =[
                {label : 'tax_contact_organization_name',value:payload.Name.Legal_Name}
                ];
                await this.addInput(page, Annual);
      
                const Annualadd =[
                  {label: 'tax_contact_address_1',value: payload.Officer_Information.Address.Street_Address},
                  {label: 'tax_contact_address_2',value: payload.Officer_Information.Address.Of_Address_Line_2},
                  {label: 'tax_contact_city',value:payload.Officer_Information.Address.City},
                  {label: 'tax_contact_zip_code',value: String(payload.Officer_Information.Address.Of_Zip_Code)},
                  {label: 'tax_contact_phone_number', value: payload.Officer_Information.Officer_Details.Off_Contact_No},
                  {label: 'tax_contact_email', value: payload.Officer_Information.Officer_Details.Off_Email_Address},
                  {label: 'tax_contact_signature', value:payload.Officer_Information.Officer_Details.keyPersonnelName}
                
                ];
                await this.addInput(page, Annualadd);


                await page.click('#agreement');

                const sign=[
                  {label: 'filing_signature', value:payload.Officer_Information.Officer_Details.keyPersonnelName}
                ]
                await this.addInput(page, sign);

                await this.clickDropdown(page, '#signature_title', 'Director');

                await page.click('#save_form');

                await page.click('input[value="Next"]');

                const res = "form filled successfully";
                return res
        } catch (error) {
            // Log full error stack for debugging
            logger.error('Error in Arkansas LLC form handler:', error.stack);
            throw new Error(`Arkansas LLC form submission failed: ${error.message}`);
          }
        }
        async addInputbyselector(page, inputFields) {
          try {
              for (let field of inputFields) {
                  const { value, label, sectionText } = field;
      
                  // Log the current field being processed
                  console.log(`Processing field: ${label}`);
      
                  // Find the section that contains the specified text
                  const inputSelector = await page.evaluate((label, sectionText) => {
                      // Find the fieldset for Registered Agent
                      const fieldsets = Array.from(document.querySelectorAll('fieldset.group'));
                      const registeredAgentFieldset = fieldsets.find(fieldset => {
                          const legend = fieldset.querySelector('legend');
                          return legend && legend.textContent.trim() === sectionText; // Ensure we're checking the right section
                      });
      
                      if (registeredAgentFieldset) {
                          // Find the label element
                          const labelElement = Array.from(registeredAgentFieldset.querySelectorAll('label'))
                              .find(el => el.textContent.trim() === label);
                          
                          if (labelElement) {
                              // Log the found label
                              console.log(`Found label: ${label}`);
                              // Find the associated input
                              const inputElement = labelElement.closest('p').querySelector('input, select');
                              return inputElement ? `#${inputElement.id}` : null;
                          } else {
                              console.log(`Label not found: ${label}`);
                          }
                      }
                      return null;
                  }, label, sectionText);
      
                  if (inputSelector) {
                      await page.waitForSelector(inputSelector, { visible: true });
                      console.log(`Attempting to fill input for label "${label}" with value "${value}"`);
                      await page.type(inputSelector, value, { delay: 100 });
                      console.log(`Filled input for label "${label}" with value "${value}" in section containing "${sectionText}"`);
                  } else {
                      console.error(`Input not found for label "${label}" in section containing "${sectionText}"`);
                  }
              }
          } catch (error) {
              console.error("Error filling input fields:", error.message);
              throw error;
          }
      }
      
      
        
      }
    

    module.exports = ArkansasForCORP;