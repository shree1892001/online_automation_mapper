const logger = require('../utils/logger');
const BaseFormHandler = require('./BaseFormHandler');

class MichiganLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async MichiganLLC(page,jsonData,payload) {
    
    try {
        logger.info('Navigating to New York form submission page...');
        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;
        await this.navigateToPage(page, url);
        await page.click('#MainContent_parentRepeater_childRepeater_0_link_0');
        // const inputFields = [
        //     { label: 'Username', value: data.State.filingWebsiteUsername },
        //     { label: 'Password', value: data.State.filingWebsitePassword }
        // ];

        // await addInput(page, inputFields);
        // logger.info('Login form filled out successfully for New York LLC.');
        // await submitForm(page);
        // await clickLinkByLabel(page, 'Domestic Business Corporation (For Profit) and Domestic Limited Liability Company');
        // await clickLinkByLabel(page,'Articles of Organization for a Domestic Limited Liability Company (not for professional service limited liability companies)');
      // await this.clickLinkByLabel(page,'700 - ARTICLES OF ORGANIZATION');
       await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

        // await clickLinkByLabel1(page, '500 - ARTICLES OF INCORPORATION');

        const LLCfieldinput = [
            { label: 'MainContent_EntityNameMI1_txtEntityName', value: payload.Name.Legal_Name },
        ];
        await this.addInput(page, LLCfieldinput);
        await this.randomSleep()
       // await submitForm(page);
        //await page.waitForSelector('MainContent_EntityNameMI1_txtEntityName', { visible: true });
        //const articlefields = [
            //{ label: 'MainContent_EntityNameMI1_txtEntityName', value: payload.Name.Legal_Name },
           // {label:'txtGeneric',value: payload.Name.CD_Duration }]
        const registerAgentFields = [{ label: 'MainContent_ResidentAgentControl1_txtAgentName', value: payload.Registered_Agent.keyPersonnelName },
            {label:'MainContent_ResidentAgentControl1_txtAgentAddr1',value: payload.Registered_Agent.Address.Street_Address },
            { label: 'MainContent_ResidentAgentControl1_txtAgentCity', value: payload.Registered_Agent.Address.City },
            {label:'MainContent_ResidentAgentControl1_txtAgentPostalCode',value: payload.Registered_Agent.Address.Zip_Code }]
        const pricipleAddressFields = [
            {label:'MainContent_ResidentAgentControl1_PrincipalOfficeControl_MI1_txtAddr',value: payload.Principal_Address.Street_Address },
            { label: 'MainContent_ResidentAgentControl1_PrincipalOfficeControl_MI1_txtCity', value: payload.Principal_Address.City },
            { label: 'MainContent_ResidentAgentControl1_PrincipalOfficeControl_MI1_cboState', value: payload.Principal_Address.State },
            {label:'MainContent_ResidentAgentControl1_PrincipalOfficeControl_MI1_txtPostalCode',value: String( payload.Principal_Address.Zip_Code )}]
        
            

            const organizerFields = [{label:'MainContent_SignatureControl1_txtSignature',value: payload.Organizer_Information.keyPersonnelName }]
            await new Promise(resolve => setTimeout(resolve, 3000))
       // await this.addInput(page, articlefields);
       // await new Promise(resolve => setTimeout(resolve, 3000))
        await this.addInput(page, registerAgentFields);
        await new Promise(resolve => setTimeout(resolve, 3000))
        await this.addInput(page, pricipleAddressFields);
        await new Promise(resolve => setTimeout(resolve, 3000))
        await this.clickButton(page, '#MainContent_SignatureControl1_grdSignature_btnAddSignature');
        // await page.waitForSelector("MainContent_SignatureControl1_grdSignature_btnAddSignature");
        // await  page.click("#MainContent_SignatureControl1_grdSignature_btnAddSignature");
            
        await this.addInput(page, organizerFields);

        await  page.click("#MainContent_SignatureControl1_rdoAccept");
        await new Promise(resolve => setTimeout(resolve, 3000))
        await page.waitForSelector('#MainContent_SignatureControl1_btnSave', { visible: true });
        await page.click("#MainContent_SignatureControl1_btnSave")
              
        const contactFields = [{label:'MainContent_FilingFormContactInfoControl1_txtContactName',value: payload.Organizer_Information.keyPersonnelName },
             {label:'MainContent_FilingFormContactInfoControl1_txtStreetNo',value: payload.Organizer_Information.Address.Street_Address },
             {label:'MainContent_FilingFormContactInfoControl1_txtCity',value: payload.Organizer_Information.Address.City },
             {label:'MainContent_FilingFormContactInfoControl1_txtContactEmail',value: payload.Organizer_Information.EmailId },
             {label:'MainContent_FilingFormContactInfoControl1_txtZip',value:String( payload.Organizer_Information.Address.Zip_Code)},
             {label:'MainContent_FilingFormContactInfoControl1_txtNotificationEmail',value: payload.Organizer_Information.EmailId },
        ]
      // await clickButton(page, '#MainContent_ButtonsControlMI1_btnSubmitExternal'); 
      await new Promise(resolve => setTimeout(resolve, 3000))  
        await this.addInput(page, contactFields);
        await this.clickButton(page, '#MainContent_ButtonsControlMI1_btnSubmitExternal');
        const res = "form filled successfully";
        return res

       

    } catch (error) {
        // Log full error stack for debugging
        logger.error('Error in Michigan LLC form handler:', error.stack);
        throw new Error(`Michigan LLC form submission failed: ${error.message}`);
    }
}
}

module.exports = MichiganLLC;




