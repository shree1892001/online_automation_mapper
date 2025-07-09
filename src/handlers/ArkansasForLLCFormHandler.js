const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
const { add } = require('winston');
const { json } = require('express/lib/response');

class ArkansasForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async  ArkansasForLLC(page,jsonData,payload) {
      try {
        logger.info('Navigating to Arkansas form submission page...');
        const data = Object.values(jsonData)[0];

        const stateMapping = await fetchByState(data.State.id);
        
        for(let i=0;i<stateMapping.length;i++){
            if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
            }
        }

        const url = data.State.stateUrl;
        await this.navigateToPage(page, url);
        await this.randomSleep(20000,30000); 
        
        await page.evaluate(() => {
          const link = document.querySelector('a[href="javascript:showOptions(13)"]');
          if (link) {
              link.click();
          } else {
              console.error("Link not found!");
          }
      });
  

        // start form 
        await page.click('tr#form_row_13 input[type="submit"][value="Start Form"]');



        // Entity Name  
        const entityname=[
          {label:'entity_name', value:payload.Name.Legal_Name},
          // {label:'principal_organization_name', value:payload.Name.Legal_Name},
        ];
        await this.addInput(page, entityname);

        await new Promise(resolve => setTimeout(resolve, 4000))

        // Principal Information
        const princinfo=[
          {label:'principal_organization_name', value:payload.Name.Legal_Name},
          {label:'principal_address_1', value:payload.Principal_Address.Street_Address},
          {label:'principal_address_2', value:payload.Principal_Address['Address_Line_2'] || " "},
          {label:'principal_city', value:payload.Principal_Address.City},
          {label:'principal_zip_code', value:String(payload.Principal_Address.Zip_Code)}
        ];
        await this.addInput(page, princinfo);
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
                value: String(payload.Registered_Agent.Address.Zip_Code), // Example Arkansas zip code
                sectionText: 'Registered Agent'
            },
            {
                label: 'City',
                value: payload.Registered_Agent.Address.City,
                sectionText: 'Registered Agent'
             },

        ];

        await this.addInputbyselector(page, inputFields);


        // Organizer Information

        // Incorporator/Organizer

        const orgFullName = payload.Organizer_Information.keyPersonnelName;
        const [orgFirstName, orgLastName] = orgFullName.split(' ');
        // Assign the split first name and last name to the respective fields
        const organizerDetails = [
            { label: 'officer_first_name', value: orgFirstName },
            { label: 'officer_last_name', value: orgLastName }
        ];
        await this.addInput(page, organizerDetails);


        // const Manager =[
        //   {label: 'officer_organization_name', value: payload.Name.Legal_Name}
        //   ];
        //   await this.addInput(page, Manager);
        
          await this.clickDropdown(page, '#officer_title', 'Incorporator/Organizer');
          const Manageradd =[
            {label: 'officer_address_1',value: payload.Organizer_Information.Address.Street_Address},
            {label: 'officer_address_2',value: payload.Organizer_Information.Address['Address_Line_2']|| " "},
            {label: 'officer_city',value: payload.Organizer_Information.Address.City},
            {label: 'officer_zip_code',value: String(payload.Organizer_Information.Address.Zip_Code)}
          ];
          await this.addInput(page, Manageradd);
          await page.click('input[name="save_add_officer"]');

          // Member or manager
          
        const memFullName = payload.Member_Or_Manager_Details[0].Mom_Name;
        const [memFirstName, memLastName] = memFullName.split(' ');
        // Assign the split first name and last name to the respective fields
        const memberDetails = [
            { label: 'officer_first_name', value: memFirstName },
            { label: 'officer_last_name', value: memLastName }
        ];
        await this.addInput(page, memberDetails);

          // const Member =[
          //   {label: 'officer_organization_name', value: payload.Name.Legal_Name}
          //   ];
          //   await this.addInput(page, Member);
            await this.clickDropdown(page, '#officer_title', 'Member');
  
            const Memberadd =[
              {label: 'officer_address_1',value: payload.Member_Or_Manager_Details[0].Address.Street_Address},
              {label: 'officer_address_2',value: payload.Member_Or_Manager_Details[0].Address.Address_Line_2|| " "},
              {label: 'officer_city',value: payload.Member_Or_Manager_Details[0].Address.City},
              {label: 'officer_zip_code',value: payload.Member_Or_Manager_Details[0].Address.Zip_Code.toString()}
            ];
            await this.addInput(page, Memberadd);
            await page.click('input[name="save_add_officer"]');

             //Submitter Contact Info 

            const submittor =[
              {label: 'contact_organization_name', value: payload.Name.Legal_Name}
              ];
              await this.addInput(page, submittor);
    
              const submittoradd =[
                {label: 'contact_address_1',value: payload.Organizer_Information.Address.Street_Address},
                {label: 'contact_address_2',value: payload.Organizer_Information.Address['Address_Line_2']|| " "},
                {label: 'contact_city',value: payload.Organizer_Information.Address.City},
                {label: 'contact_zip_code',value: String(payload.Organizer_Information.Address.Zip_Code)},
                {label: 'contact_phone_number', value: payload.Organizer_Information.ContactNo},
                {label: 'contact_email', value: payload.Organizer_Information.EmailId}
              
              ];
              await this.addInput(page, submittoradd);



              // Annual Report Contact Information 
              const Annual =[
                {label: 'tax_contact_organization_name', value: payload.Name.Legal_Name}
                ];
                await this.addInput(page, Annual);
      
                const Annualadd =[
                  {label: 'tax_contact_address_1',value: payload.Registered_Agent.Address.Street_Address},
                  {label: 'tax_contact_address_2',value: payload.Registered_Agent.Address['Address_Line_2']|| " "},
                  {label: 'tax_contact_city',value: payload.Registered_Agent.Address.City},
                  {label: 'tax_contact_zip_code',value: String(payload.Registered_Agent.Address.Zip_Code)},
                  {label: 'tax_contact_phone_number', value: payload.Registered_Agent.ContactNo},
                  {label: 'tax_contact_email', value: payload.Registered_Agent.EmailId},
                  {label: 'tax_contact_signature', value:payload.Registered_Agent.keyPersonnelName}
                
                ];
                await this.addInput(page, Annualadd);


                await page.click('#agreement');

                const sign=[
                  {label: 'filing_signature', value:payload.Organizer_Information.keyPersonnelName}
                ]
                await this.addInput(page, sign);

                await page.click('#save_form');

                await new Promise(resolve => setTimeout(resolve, 4000))

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
    

    module.exports = ArkansasForLLC;

