const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class DcForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async DcForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];
            const stateMapping = await fetchByState(data.State.id);
            
            // Add defensive check for stateMapping
            if (!stateMapping || !Array.isArray(stateMapping) || stateMapping.length === 0) {
                throw new Error('No state mapping found for the given state ID: ' + data.State.id);
            }
            
            // Helper function to find mapping by selector
            const findMappingBySelector = (selector) => {
                return stateMapping.find(mapping => mapping.online_field_mapping === selector);
            };
            
            // Helper function to safely get value from payload
            const getSafeValue = async (jsonKey) => {
                try {
                    const value = await this.getValueFromPayload(payload, jsonKey);
                    console.log(`Raw value for ${jsonKey}:`, value, 'Type:', typeof value);
                    if (value === null || value === undefined) {
                        return '';
                    }
                    const stringValue = String(value);
                    console.log(`Converted value for ${jsonKey}:`, stringValue, 'Type:', typeof stringValue);
                    return stringValue;
                } catch (error) {
                    console.log(`Error getting value for ${jsonKey}:`, error.message);
                    return '';
                }
            };
            
            for(let i=0;i<stateMapping.length;i++){
                if(data.orderType === stateMapping[i].order_type || data.orderFullDesc === stateMapping[i].entity_type){
                    console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
                }
            }
            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            
            // Login section using database mappings
            await page.click(stateMapping[14].online_field_mapping);
            const inputFields = [
                { label: stateMapping[15].online_field_mapping, value: data.State.filingWebsiteUsername },
                { label: stateMapping[16].online_field_mapping, value: data.State.filingWebsitePassword }
            ];
            await this.addInput(page,inputFields);
            await page.click(stateMapping[17].online_field_mapping);
            await page.click(stateMapping[19].online_field_mapping);
            await page.waitForSelector(stateMapping[20].online_field_mapping);
            page.click(stateMapping[20].online_field_mapping)
            await page.waitForSelector(stateMapping[21].online_field_mapping);
            page.click(stateMapping[21].online_field_mapping)
            await page.waitForSelector(stateMapping[22].online_field_mapping);
            page.click(stateMapping[22].online_field_mapping)
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Business Information using database mappings
            try {
                const businessName = await this.getValueFromPayload(payload, stateMapping[1].json_key);
                console.log('Business name value:', businessName, 'Type:', typeof businessName);
                const businessNameStr = businessName ? String(businessName) : '';
                await this.fillInputByName(page, stateMapping[1].online_field_mapping, businessNameStr);
            } catch (error) {
                console.error('Error filling business name:', error);
                await this.fillInputByName(page, stateMapping[1].online_field_mapping, '');
            }
            await this.clickDropdown(page, stateMapping[0].online_field_mapping, 'Corporation');
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Business Address using database mappings
            await this.fillInputByName(page, stateMapping[2].online_field_mapping, await getSafeValue(stateMapping[2].json_key));
            await this.fillInputByName(page, stateMapping[3].online_field_mapping, await getSafeValue(stateMapping[3].json_key));
            await this.fillInputByName(page, stateMapping[4].online_field_mapping, await getSafeValue(stateMapping[4].json_key));
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.clickDropdown(page, stateMapping[25].online_field_mapping, 'District of Columbia');
            await this.fillInputByName(page, stateMapping[5].online_field_mapping, await getSafeValue(stateMapping[5].json_key));
            await page.click(stateMapping[18].online_field_mapping);
            
            // Stock Information using database mappings
            await this.clickDropdown(page, stateMapping[26].online_field_mapping, 'Common');
            try {
                const stockQuantity = await getSafeValue(stateMapping[6].json_key);
                const stockValue = await getSafeValue(stateMapping[7].json_key);
                console.log('Stock Quantity:', stockQuantity, 'Type:', typeof stockQuantity);
                console.log('Stock Value:', stockValue, 'Type:', typeof stockValue);
                
                if (typeof stockQuantity === 'string') {
                    await page.type(stateMapping[6].online_field_mapping, stockQuantity);
                } else {
                    console.log('Stock quantity is not a string, using empty value');
                    await page.type(stateMapping[6].online_field_mapping, '');
                }
                
                if (typeof stockValue === 'string') {
                    await page.type(stateMapping[7].online_field_mapping, stockValue);
                } else {
                    console.log('Stock value is not a string, using empty value');
                    await page.type(stateMapping[7].online_field_mapping, '');
                }
            } catch (error) {
                console.error('Error filling stock information:', error);
                // Try to fill with empty values as fallback
                await page.type(stateMapping[6].online_field_mapping, '');
                await page.type(stateMapping[7].online_field_mapping, '');
            }
            await page.click(stateMapping[27].online_field_mapping);
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Registered Agent using database mappings
            await this.clickDropdown(page, stateMapping[28].online_field_mapping, 'Business Filings');
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Stipulations using database mappings
            await page.type(stateMapping[29].online_field_mapping,
                'Miscellaneous Provisions include various clauses and stipulations that cover areas not addressed elsewhere in the document.');
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping); 
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Contact Information using database mappings
            const rafullname = await getSafeValue('Incorporator_Information.Incorporator_Details.keyPersonnelName');
            let firstName = '', lastName = '';
            if (rafullname && rafullname.trim() !== '') {
                try {
                    const nameParts = await this.ra_split(rafullname);
                    firstName = nameParts[0] || '';
                    lastName = nameParts[1] || '';
                } catch (error) {
                    console.log('Error splitting name:', error.message);
                    firstName = rafullname;
                    lastName = '';
                }
            } else {
                console.log('Registered Agent name is empty, using empty values');
            }
            
            // Use the actual incorporator name instead of the database mapping
            console.log('Using incorporator name from keyPersonnelName:', rafullname);
            await this.fillInputByName(page, stateMapping[8].online_field_mapping, firstName);
            await this.fillInputByName(page, stateMapping[9].online_field_mapping, lastName);
            logger.info('FoRm submission complete fot Michigan LLC')  
            await this.fillInputByName(page, stateMapping[10].online_field_mapping, await getSafeValue(stateMapping[10].json_key));
            await this.fillInputByName(page, stateMapping[11].online_field_mapping, await getSafeValue(stateMapping[11].json_key));
            await this.fillInputByName(page, stateMapping[12].online_field_mapping, await getSafeValue(stateMapping[12].json_key));
            await this.clickDropdown(page, stateMapping[30].online_field_mapping, 'District of Columbia');
            await this.fillInputByName(page, stateMapping[13].online_field_mapping, await getSafeValue(stateMapping[13].json_key));
            await this.fillInputByName(page, stateMapping[81].online_field_mapping, await getSafeValue(stateMapping[81].json_key));
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            const res = "form filled successfully";
            return res

    
        } catch (error) {
            logger.error('Error in Dc For CORP form handler:', error.stack);
            throw new Error(`Dc For CORP form submission failed: ${error.message}`);
        }
    }
}
module.exports = DcForCORP;