const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class MassachusettsForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async MassachusettsForCORP(page,jsonData,payload) {
      try {
          logger.info('Navigating to Massachusetts form submission page...');
          const data = Object.values(jsonData)[0];

          const stateMapping = await fetchByState(data.State.id);
          
          for(let i=0;i<stateMapping.length;i++){
              if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                  console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
              }
          }

          const url = data.State.stateUrl;          await this.navigateToPage(page, url);

          await this.clickOnLinkByText(page, 'click here');
          await this.clickOnLinkByText(page, 'Articles of Organization');

          await page.waitForNavigation({ waitUntil: 'networkidle0' });

          const name=[
            {label:'MainContent_EntityNameWithArticleControl1_txtEntityName',value:payload.Name.Legal_Name}
          ]
          await this.addInput(page, name);

          await page.click('#MainContent_CapitalStockClassControl1_grdStocks_btnAddStock');
         
          await this.clickDropdown(page, '#MainContent_CapitalStockClassControl1_ddlClassOfStock', 'PREFERRED NO PAR');
          const shares=[
            {label:'MainContent_CapitalStockClassControl1_txtTotalAuthorizedNumShares', value:payload.Stock_Details.Number_Of_Shares}
          ];
          await this.addInput(page, shares);

          await page.click('#MainContent_CapitalStockClassControl1_btnSave');
          // await this.randomSleep(1000,3000); 
          await this.waitForTimeout(3000); 
          console.log("zip code::",payload.Registered_Agent.Address.Zip_Code)
          await this.fillInputByName(page,"ctl00$MainContent$ResidentAgentControl1$txtAgentName",payload.Registered_Agent.keyPersonnelName);
        const regagent= [
            // {label: 'MainContent_ResidentAgentControl1_txtAgentName',value: payload.Registered_Agent.keyPersonnelName},
            {label: 'MainContent_ResidentAgentControl1_txtAgentAddr1',value: payload.Registered_Agent.Address.Street_Address},
            {label: 'MainContent_ResidentAgentControl1_txtAgentAddr2',value: payload.Registered_Agent.Address['Address_Line_2'] ||""},
            {label: 'MainContent_ResidentAgentControl1_txtAgentCity',value: payload.Registered_Agent.Address.City}
        ];
        await this.addInput(page, regagent);
        await this.fillInputByName(page,"ctl00$MainContent$ResidentAgentControl1$txtAgentPostalCode", String(payload.Registered_Agent.Address.Zip_Code))

        await page.click('#MainContent_OfficersControl1_grdOfficers_btnAddOfficer');


        //President
        await this.clickDropdown(page, "#MainContent_OfficersControl1_cboTitle", 'PRESIDENT');
        // const incFullName = payload.President_Information.Pre_Name;
        const president_name= payload.President_Information.Pre_Name.split(" ");
        await this.randomSleep(1000,2000);
        await this.waitForTimeout(3000); 

        await page.waitForSelector('input[name="ctl00$MainContent$OfficersControl1$txtFirstName"]');
       await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtFirstName",president_name[0]); 

       await page.waitForSelector('input[name="ctl00$MainContent$OfficersControl1$txtLastName"]');

       await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtLastName",president_name[1]); 

        const off=[
          {label: 'MainContent_OfficersControl1_txtResAddress',value: payload.President_Information.Address.Pre_Address_Line_1},
          {label: 'MainContent_OfficersControl1_txtCity',value: payload.President_Information.Address.Pre_City},
          {label: 'MainContent_OfficersControl1_txtZip',value: payload.President_Information.Address.Pre_Zip_Code.toString()}
        ];
        await this.addInput(page, off);
        
        const submitButtonSelector = '#MainContent_OfficersControl1_btnSave';
        await page.waitForSelector(submitButtonSelector, { visible: true });
        await page.click(submitButtonSelector);

        await new Promise(resolve => setTimeout(resolve, 3000))

        
            // Director
            // Selector for the button using its ID
              const addNewEntryButtonSelector = '#MainContent_OfficersControl1_grdOfficers_btnAddPartner';
              await page.waitForSelector(addNewEntryButtonSelector, { visible: true });
              await page.click(addNewEntryButtonSelector);

              await new Promise(resolve => setTimeout(resolve, 6000))
              await this.waitForTimeout(40000); 
              await new Promise(resolve => setTimeout(resolve, 3000));


            await this.clickDropdown(page, "#MainContent_OfficersControl1_cboTitle", 'DIRECTOR');

            const incFullName1 = payload.Director_Information.Director_Details.Name.split(" ");
            await page.waitForSelector('input[name="ctl00$MainContent$OfficersControl1$txtFirstName"]',{visible:true,timeout:60000});

            await this.waitForTimeout(3000); 
            await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtFirstName",incFullName1[0]);
            await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtLastName",incFullName1[1]);
           
            await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtResAddress",payload.Director_Information.Address.Dir_Address_Line_1);
            await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtCity",payload.Director_Information.Address.City);

            await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtZip", String(payload.Director_Information.Address.Zip_Code))

            
            // await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtZip",payload.Director_Information.Address.Zip_Code.toString())
            console.log("COntinue button clicked"); 

            await page.waitForSelector(submitButtonSelector, { visible: true });
            await page.click(submitButtonSelector);
           
          //   // Instead of using evaluate, click directly using the selector
          //   await page.waitForSelector('#MainContent_OfficersControl1_btnSave', {
          //     visible: true,
          //     timeout: 20000
          //   });
            
          //   // Use evaluate to click the button by id within the page's DOM
          //   await page.evaluate(() => {
          //     document.getElementById('MainContent_OfficersControl1_btnSave').click();
          //   });
          // console.log("Data been saved");


            // Secretory
            // Selector for the button using its ID
            await new Promise(resolve => setTimeout(resolve, 3000));


            const addNewEntryButtonSelec = '#MainContent_OfficersControl1_grdOfficers_btnAddPartner';
            await page.waitForSelector(addNewEntryButtonSelec, { visible: true });
            await page.click(addNewEntryButtonSelec);

            await new Promise(resolve => setTimeout(resolve, 6000))
            await this.waitForTimeout(3000); 

           await this.clickDropdown(page, "#MainContent_OfficersControl1_cboTitle", 'SECRETARY');

          await page.waitForSelector('input[name="ctl00$MainContent$OfficersControl1$txtFirstName"]',{visible:true,timeout:60000});
           const secName1= payload.Secretary_Information.Sec_Name.split(" "); 
          await this.waitForTimeout(3000); 
          
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtFirstName",secName1[0]);
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtLastName",secName1[1]);

          
          
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtResAddress",payload.Secretary_Information.Address.Sec_Address_Line_1);
          await this.randomSleep(10000,20000);
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtCity",payload.Secretary_Information.Address.Sec_City);
          // await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtZip",payload.Secretary.sec_Zip_Code.toString());
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtZip",payload.Secretary_Information.Address.Sec_Zip_Code.toString());


          // const submitButtonSelector3 = '#MainContent_OfficersControl1_btnSave';
          // await page.waitForSelector(submitButtonSelector2, { visible: true });
          // await page.click(submitButtonSelector3);

          await page.waitForSelector('#MainContent_OfficersControl1_btnSave', {
            visible: true,
            timeout: 20000
          });
          
          // Use evaluate to click the button by id within the page's DOM
          await page.evaluate(() => {
            document.getElementById('MainContent_OfficersControl1_btnSave').click();
          });
        console.log("Data been saved");



        // Treasurer
            // Selector for the button using its ID
            await new Promise(resolve => setTimeout(resolve, 3000));


            const addNewEntryButtonSele = '#MainContent_OfficersControl1_grdOfficers_btnAddPartner';
            await page.waitForSelector(addNewEntryButtonSele, { visible: true });
            await page.click(addNewEntryButtonSele);

            await new Promise(resolve => setTimeout(resolve, 6000))
            await this.waitForTimeout(3000); 

           await this.clickDropdown(page, "#MainContent_OfficersControl1_cboTitle", 'TREASURER');

          await page.waitForSelector('input[name="ctl00$MainContent$OfficersControl1$txtFirstName"]',{visible:true,timeout:60000});
           const secName2= payload.Treasurer_Information.Tre_Name.split(" "); 
          await this.waitForTimeout(3000); 
          
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtFirstName",secName2[0]);
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtLastName",secName2[1]);

          
          
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtResAddress",payload.Treasurer_Information.Address.Tre_Address_Line_1);
          await this.randomSleep(10000,20000);
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtCity",payload.Treasurer_Information.Address.Tre_City);
          await this.fillInputByName(page,"ctl00$MainContent$OfficersControl1$txtZip",payload.Treasurer_Information.Address.Tre_Zip_Code.toString());

          await page.waitForSelector('#MainContent_OfficersControl1_btnSave', {
            visible: true,
            timeout: 20000
          });
          
          // Use evaluate to click the button by id within the page's DOM
          await page.evaluate(() => {
            document.getElementById('MainContent_OfficersControl1_btnSave').click();
          });
        console.log("Data been saved");

        // Selector for the button using its ID
        await new Promise(resolve => setTimeout(resolve, 3000));
       
        // // Purpose
        // await page.waitForSelector('input[name="ctl00$MainContent$BriefPurposeControl1$txtBriefPurpose"]', { timeout: 60000 });
        // await this.fillInputByName(page,"ctl00$MainContent$BriefPurposeControl1$txtBriefPurpose",payload.Purpose.Purpose_Details);


        const purpose=[
          {label: 'MainContent_BriefPurposeControl1_txtBriefPurpose', value:payload.Purpose.Purpose_Details}
        ]
        await this.addInput(page, purpose);

        // Principle address

            const nameaddress = [
            {label: 'MainContent_PrincipalOfficeControl1_txtAddr',value: payload.Registered_Agent.Address.Street_Address},
            {label: 'MainContent_PrincipalOfficeControl1_txtCity',value: payload.Registered_Agent.Address.City},
            {label: 'MainContent_PrincipalOfficeControl1_txtPostalCode',value: payload.Registered_Agent.Address.Zip_Code.toString()},
            ];
        await this.addInput(page, nameaddress);
        await this.clickDropdown(page, '#MainContent_PrincipalOfficeControl1_cboState', 'MA');

            const sixno =[
              // {label: 'MainContent_ManagerControl1_txtFirstName', value: payload.Organizer_Information.keyPersonnelName},
              {label: 'MainContent_RecordingOfficeControl1_txtAddr', value: payload.Registered_Agent.Address.Street_Address},
              {label: 'MainContent_RecordingOfficeControl1_txtCity',value: payload.Registered_Agent.Address.City},
              {label: 'MainContent_RecordingOfficeControl1_txtPostalCode',value: payload.Registered_Agent.Address.Zip_Code.toString()}
            ];
            await this.addInput(page, sixno);



            // MainContent_RecordingOfficeControl1_rdoRegisteredOffice

            // await this.click('MainContent_RecordingOfficeControl1_rdoRegisteredOffice'); 
            
            await page.waitForSelector('#MainContent_RecordingOfficeControl1_rdoRegisteredOffice', { timeout: 60000 });
            await page.click('#MainContent_RecordingOfficeControl1_rdoRegisteredOffice');
  
            const tenno = [
            {label: 'MainContent_FilingFormContactInfoControl1_txtContactName',value: payload.Incorporator_Information.Incorporator_Details.keyPersonnelName},
            {label: 'MainContent_FilingFormContactInfoControl1_txtStreetNo',value: payload.Incorporator_Information.Address.Street_Address},
            {label: 'MainContent_FilingFormContactInfoControl1_txtCity',value: payload.Incorporator_Information.Address.City},
            {label: 'MainContent_FilingFormContactInfoControl1_txtZip',value: payload.Incorporator_Information.Address.Zip_Code.toString()}, 
            {label: 'MainContent_FilingFormContactInfoControl1_txtContactEmail',value: payload.Incorporator_Information.Email_Address}
            
        ];
        await this.addInput(page, tenno);

        const sign=[
          {label: 'MainContent_DisclaimerNonProfitControl1_txtUndersigned1',value:payload.Registered_Agent.keyPersonnelName}
        ]
        await this.addInput(page, sign);
        await this.clickButton(page, '#MainContent_DisclaimerNonProfitControl1_rdoAccept');  
        logger.info('Login form filled out successfully for Massachusetts LLC.');
        
        await this.clickButton(page, '#MainContent_ButtonsControl1_btnSubmitExternal');  
        logger.info('Login form filled out successfully for Massachusetts LLC.');
        const res = "form filled successfully";
        return res

    } catch (error) {
        // Log full error stack for debugging
        logger.error('Error in Massachusetts CORP form handler:', error.stack);
        throw new Error(`Massachusetts CORP form submission failed: ${error.message}`);
      }
    }
  }
  
module.exports = MassachusettsForCORP;
