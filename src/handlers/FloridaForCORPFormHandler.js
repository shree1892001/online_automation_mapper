const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class FloridaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    // Helper function to extract field name from CSS selector
    extractFieldName(selector) {
        if (selector.startsWith('input[name="') && selector.endsWith('"]')) {
            return selector.replace('input[name="', '').replace('"]', '');
        }
        return selector;
    }

    async FloridaForCORP(page,jsonData,payload) {
        try {
            logger.info('Starting Florida CORP form submission...');
            console.log(payload.Officer_Information);
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            // Add defensive check for stateMapping
            if (!stateMapping || !Array.isArray(stateMapping) || stateMapping.length === 0) {
                throw new Error('No state mapping found for the given state ID: ' + data.State.id);
            }
            
            logger.info(`Retrieved ${stateMapping.length} mappings from database`);
            
            // Debug: Log all mappings
            for(let i=0; i<stateMapping.length; i++){
                if(data.orderType === stateMapping[i].order_type || data.orderFullDesc === stateMapping[i].entity_type){
                    logger.info(`Mapping ${i}: ${stateMapping[i].online_field_mapping} -> ${stateMapping[i].json_key}`);
                }
            }

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            await this.clickOnLinkByText(page, 'Start a Business');
            await this.clickOnLinkByText(page, 'Profit Articles of Incorporation');
            
            // Get start filing button selector
            await this.clickButton(page, stateMapping[30].online_field_mapping);
            
            await this.selectCheckboxByLabel(page, 'Disclaimer');
            
            // Get submit button selector
            await this.clickButton(page, stateMapping[31].online_field_mapping);
            
            // Fill corporation name
            const businessName = await this.getValueFromPayload(payload, stateMapping[0].json_key);
            const corpNameField = this.extractFieldName(stateMapping[0].online_field_mapping);
            await this.fillInputByName(page, corpNameField, businessName);
            
            // Fill stock shares
            const stockSharesValue = await this.getValueFromPayload(payload, stateMapping[1].json_key);
            const stockSharesField = this.extractFieldName(stateMapping[1].online_field_mapping);
            await this.fillInputByName(page, stockSharesField, String(stockSharesValue));

            // Fill principal address
            const princAddr1Value = await this.getValueFromPayload(payload, stateMapping[2].json_key);
            const princAddr1Field = this.extractFieldName(stateMapping[2].online_field_mapping);
            await this.fillInputByName(page, princAddr1Field, princAddr1Value);
            
            const princCityValue = await this.getValueFromPayload(payload, stateMapping[3].json_key);
            const princCityField = this.extractFieldName(stateMapping[3].online_field_mapping);
            await this.fillInputByName(page, princCityField, princCityValue);
            
            const princStValue = await this.getValueFromPayload(payload, stateMapping[4].json_key);
            const princStField = this.extractFieldName(stateMapping[4].online_field_mapping);
            await this.fillInputByName(page, princStField, princStValue);
            
            const princZipValue = await this.getValueFromPayload(payload, stateMapping[5].json_key);
            const princZipField = this.extractFieldName(stateMapping[5].online_field_mapping);
            await this.fillInputByName(page, princZipField, String(princZipValue));
            
            // Fill country (hardcoded value)
            const princCntryField = this.extractFieldName(stateMapping[29].online_field_mapping);
            await this.fillInputByName(page, princCntryField, "United States");
            
            /* MAILING ADDRESS */
            const mailAddr1Value = await this.getValueFromPayload(payload, stateMapping[6].json_key);
            const mailAddr1Field = this.extractFieldName(stateMapping[6].online_field_mapping);
            await this.fillInputByName(page, mailAddr1Field, mailAddr1Value);
            
            const mailCityValue = await this.getValueFromPayload(payload, stateMapping[7].json_key);
            const mailCityField = this.extractFieldName(stateMapping[7].online_field_mapping);
            await this.fillInputByName(page, mailCityField, mailCityValue);
            
            const mailStValue = await this.getValueFromPayload(payload, stateMapping[8].json_key);
            const mailStField = this.extractFieldName(stateMapping[8].online_field_mapping);
            await this.fillInputByName(page, mailStField, mailStValue);
            
            const mailZipValue = await this.getValueFromPayload(payload, stateMapping[9].json_key);
            const mailZipField = this.extractFieldName(stateMapping[9].online_field_mapping);
            await this.fillInputByName(page, mailZipField, String(mailZipValue));
             
            // Fill registered agent information
            const rafullname = await this.getValueFromPayload(payload, stateMapping[10].json_key);
            const [firstName, lastName] = await this.ra_split(rafullname); 
            // Note: These field names might need to be added to the database mapping
            await this.fillInputByName(page, 'ra_name_last_name', lastName);
            await this.fillInputByName(page, 'ra_name_first_name', firstName);
            
            const raAddr1Value = await this.getValueFromPayload(payload, stateMapping[11].json_key);
            const raAddr1Field = this.extractFieldName(stateMapping[11].online_field_mapping);
            await this.fillInputByName(page, raAddr1Field, raAddr1Value);
            
            const raCityValue = await this.getValueFromPayload(payload, stateMapping[12].json_key);
            const raCityField = this.extractFieldName(stateMapping[12].online_field_mapping);
            await this.fillInputByName(page, raCityField, raCityValue);
            
            const raZipValue = await this.getValueFromPayload(payload, stateMapping[13].json_key);
            const raZipField = this.extractFieldName(stateMapping[13].online_field_mapping);
            await this.fillInputByName(page, raZipField, String(raZipValue));
            
            const raSignatureValue = await this.getValueFromPayload(payload, stateMapping[10].json_key);
            const raSignatureField = this.extractFieldName(stateMapping[10].online_field_mapping);
            await this.fillInputByName(page, raSignatureField, raSignatureValue);
            
            // Fill incorporator information
            const incorporator1Value = await this.getValueFromPayload(payload, stateMapping[14].json_key);
            const incorporator1Field = this.extractFieldName(stateMapping[14].online_field_mapping);
            await this.fillInputByName(page, incorporator1Field, incorporator1Value);
            
            const incorporator2Value = await this.getValueFromPayload(payload, stateMapping[15].json_key);
            const incorporator2Field = this.extractFieldName(stateMapping[15].online_field_mapping);
            await this.fillInputByName(page, incorporator2Field, incorporator2Value);
            
            // Get incorporator city, state, zip from database mappings
            const incorporatorCityValue = await this.getValueFromPayload(payload, stateMapping[16].json_key);
            const incorporatorStateValue = await this.getValueFromPayload(payload, stateMapping[17].json_key);
            const incorporatorZipValue = await this.getValueFromPayload(payload, stateMapping[18].json_key);
            const incorporator4Value = `${incorporatorCityValue}, ${incorporatorStateValue}, ${String(incorporatorZipValue)}`;
            const incorporator4Field = this.extractFieldName(stateMapping[18].online_field_mapping);
            await this.fillInputByName(page, incorporator4Field, incorporator4Value);
            
            const signatureValue = await this.getValueFromPayload(payload, stateMapping[19].json_key);
            const signatureField = this.extractFieldName(stateMapping[19].online_field_mapping);
            await this.fillInputByName(page, signatureField, signatureValue);
            
            // Fill purpose
            const purposeValue = await this.getValueFromPayload(payload, stateMapping[20].json_key);
            await this.fillInputbyid(page, [{ selector: stateMapping[20].online_field_mapping, value: purposeValue }]);

            // Fill correspondence information
            const retNameValue = await this.getValueFromPayload(payload, stateMapping[21].json_key);
            const retNameField = this.extractFieldName(stateMapping[21].online_field_mapping);
            await this.fillInputByName(page, retNameField, retNameValue);
            
            const retEmailAddrValue = await this.getValueFromPayload(payload, stateMapping[22].json_key);
            const retEmailAddrField = this.extractFieldName(stateMapping[22].online_field_mapping);
            await this.fillInputByName(page, retEmailAddrField, retEmailAddrValue);
            
            const emailAddrVerifyValue = await this.getValueFromPayload(payload, stateMapping[23].json_key);
            const emailAddrVerifyField = this.extractFieldName(stateMapping[23].online_field_mapping);
            await this.fillInputByName(page, emailAddrVerifyField, emailAddrVerifyValue);
            
            // Fill officer information
            const ofcrfullName = await this.getValueFromPayload(payload, stateMapping[24].json_key);
            const [ofcrfirstName, ofcrlastName] = await this.ra_split(ofcrfullName);
            
            const off1NameTitleField = this.extractFieldName(stateMapping[32].online_field_mapping);
            await this.fillInputByName(page, off1NameTitleField, 'MGR');
            
            // Note: These field names might need to be added to the database mapping
            await this.fillInputByName(page, 'off1_name_last_name', ofcrlastName);
            await this.fillInputByName(page, 'off1_name_first_name', ofcrfirstName);
            
            const off1NameAddr1Value = await this.getValueFromPayload(payload, stateMapping[25].json_key);
            const off1NameAddr1Field = this.extractFieldName(stateMapping[25].online_field_mapping);
            await this.fillInputByName(page, off1NameAddr1Field, off1NameAddr1Value);
            
            const off1NameCityValue = await this.getValueFromPayload(payload, stateMapping[26].json_key);
            const off1NameCityField = this.extractFieldName(stateMapping[26].online_field_mapping);
            await this.fillInputByName(page, off1NameCityField, off1NameCityValue);
            
            const off1NameStValue = await this.getValueFromPayload(payload, stateMapping[27].json_key);
            const off1NameStField = this.extractFieldName(stateMapping[27].online_field_mapping);
            await this.fillInputByName(page, off1NameStField, off1NameStValue);
            
            const off1NameZipValue = await this.getValueFromPayload(payload, stateMapping[28].json_key);
            const off1NameZipField = this.extractFieldName(stateMapping[28].online_field_mapping);
            await this.fillInputByName(page, off1NameZipField, String(off1NameZipValue));
            
            // Get continue button selector
            await page.click(stateMapping[33].online_field_mapping);
            
            const res = "form filled successfully";
            return res;

        } catch (error) {
            logger.error('Error in Florida For CORP form handler:', error.stack);
            throw new Error(`Florida For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = FloridaForCORP;


