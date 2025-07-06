const logger = require('../utils/logger');
const BaseFormHandler = require('./BaseFormHandler');
const { fetchByState } = require('../utils/getByState');

class MichiganCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async MichiganCORP(page,jsonData,payload) {
    
    try {
        logger.info('Navigating to New York form submission page...');
        const data = Object.values(jsonData)[0];

        const stateMapping = await fetchByState(data.State.id);
        
        for(let i=0;i<stateMapping.length;i++){
            if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
            }
        }

        const url = data.State.stateUrl;
        await this.navigateToPage(page, url)
        await page.click('#MainContent_parentRepeater_childRepeater_3_link_0');
        // await this.clickLinkByLabel(page,'500 - ARTICLES OF INCORPORATION');

        // await clickLinkByLabel1(page, '500 - ARTICLES OF INCORPORATION');
     await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
     const CORPfieldinput = [
           { label: 'MainContent_EntityNameWithArticleControl1_txtEntityName', value: payload.Name.Legal_Name },
        ];
        await this.addInput(page, CORPfieldinput);
        await this.randomSleep()
        // await page.click('select[name="ctl00$MainContent$CapitalStockClassControl1$ddlClassOfStock"]');
        // await page.select('select[name="ctl00$MainContent$CapitalStockClassControl1$ddlClassOfStock"]', 'CNP');


       await this.clickDropdown(page, '#MainContent_CapitalStockClassControl1_ddlClassOfStock','COMMON')
        
        const articlefields = [
            {label:'MainContent_CapitalStockClassControl1_txtTotalAuthorizedNumShares',value: payload.Stock_Details.Number_Of_Shares }]
          const value =[{label:'MainContent_CapitalStockClassControl1_StockDesignationControl1_txtArea',value: payload.Stock_Details.Number_Of_Shares }] 
            
            const registerAgentFields = [{ label: 'MainContent_ResidentAgentControl1_txtAgentName', value: payload.Registered_Agent.keyPersonnelName },
                {label:'MainContent_ResidentAgentControl1_txtAgentAddr1',value: payload.Registered_Agent.Address.Street_Address },
                { label: 'MainContent_ResidentAgentControl1_txtAgentCity', value: payload.Registered_Agent.Address.City },
                {label:'MainContent_ResidentAgentControl1_txtAgentPostalCode',value: payload.Registered_Agent.Address.Zip_Code }]
            const pricipleAddressFields = [
                {label:'MainContent_ResidentAgentControl1_PrincipalOfficeControl_MI1_txtAddr',value: payload.Principal_Address.Street_Address },
                { label: 'MainContent_ResidentAgentControl1_PrincipalOfficeControl_MI1_txtCity', value: payload.Principal_Address.City },
                { label: 'MainContent_ResidentAgentControl1_PrincipalOfficeControl_MI1_cboState', value: payload.Principal_Address.State },
                {label:'MainContent_ResidentAgentControl1_PrincipalOfficeControl_MI1_txtPostalCode',value:String( payload.Principal_Address.Zip_Code )}]

                const organizerFields =[{label: 'MainContent_OfficersControl1_txtIndividualName', value: payload.Incorporator_Information.Incorporator_Details.keyPersonnelName},
                {label:'MainContent_OfficersControl1_txtResAddress',value: payload.Principal_Address.Street_Address },
                { label: 'MainContent_OfficersControl1_txtCity', value: payload.Principal_Address.City },
                { label: 'txtState', value: payload.Principal_Address.State },
                {label:'MainContent_OfficersControl1_txtZip',value: String(payload.Principal_Address.Zip_Code) },
               {label:'MainContent_OfficersControl1_cboCountry',value: "United States" }]
                           
                        //    await page.click('select[name="ctl00$MainContent$CapitalStockClassControl1$ddlClassOfStock"]');
                        //    await page.select('select[name="ctl00$MainContent$CapitalStockClassControl1$ddlClassOfStock"]', 'US');
                   
                
                const orgFields = [{label:'MainContent_SignatureControl1_txtSignature',value: payload.Incorporator_Information.Incorporator_Details.keyPersonnelName}]
                
            await this.addInput(page, articlefields);
            await this.clickButton(page, '#MainContent_CapitalStockClassControl1_btnSave');
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.addInput(page,value);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.addInput(page, registerAgentFields );
            await new Promise(resolve => setTimeout(resolve, 3000))
            //await clickButton(page, '#MainContent_OfficersControl1_btnAddOfficer');
            await this.addInput(page, pricipleAddressFields );
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector('#MainContent_OfficersControl1_btnAddOfficer', { visible: true });
            await this.clickButton(page, '#MainContent_OfficersControl1_btnAddOfficer');
            await this.addInput(page, organizerFields);
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.click('#MainContent_OfficersControl1_btnSave');

           // await page.waitForSelector('#MainContent_OfficersControl1_btnSave');
           // await page.click('#MainContent_OfficersControl1_btnSave');
           // await page.waitForSelector('#MainContent_OfficersControl1_btnSave', { visible: true });
           // await this.clickButton(page,'#MainContent_OfficersControl1_btnSave');
            logger.info('FoRm submission complete fot Michigan CORP')  
            await new Promise(resolve => setTimeout(resolve, 10000))
            await this.clickButton(page,'#MainContent_SignatureControl1_grdSignature_btnAddSignature');
            await new Promise(resolve => setTimeout(resolve, 10000))
            await this.addInput(page, orgFields );
            await page.click("#MainContent_SignatureControl1_rdoAccept");
            await new Promise(resolve => setTimeout(resolve, 3000))
            await page.waitForSelector('#MainContent_SignatureControl1_btnSave', { visible: true });
            await page.click("#MainContent_SignatureControl1_btnSave")
            logger.info('FoRm submission complete fot Michigan CORP')

            const contactFields = [{label:'MainContent_FilingFormContactInfoControl1_txtContactName',value: payload.Incorporator_Information.Incorporator_Details.keyPersonnelName},
                {label:'MainContent_FilingFormContactInfoControl1_txtStreetNo',value: payload.Incorporator_Information.Address.Street_Address },
                {label:'MainContent_FilingFormContactInfoControl1_txtCity',value: payload.Incorporator_Information.Address.City },
                {label:'MainContent_FilingFormContactInfoControl1_txtContactEmail',value: payload.Incorporator_Information.Email_Address },
                {label:'MainContent_FilingFormContactInfoControl1_txtZip',value: String(payload.Incorporator_Information.Address.Zip_Code)},
                {label:'MainContent_FilingFormContactInfoControl1_txtNotificationEmail',value: payload.Incorporator_Information.Email_Address }
           ]
         // await clickButton(page, '#MainContent_ButtonsControlMI1_btnSubmitExternal');
           await new Promise(resolve => setTimeout(resolve, 3000))   
           await this.addInput(page, contactFields);
           await this.clickButton(page, '#MainContent_ButtonsControl1_btnSubmitExternal');
           const res = "form filled successfully";
           return res

    } catch (error) {
        // Log full error stack for debugging
        logger.error('Error in Michigan CORP form handler:', error.stack);
        throw new Error(`Michigan COPR form submission failed: ${error.message}`);
    }
}
}

module.exports = MichiganCORP;




