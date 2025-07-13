const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class DcForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async DcForLLC(page,jsonData,payload) {
        try {
            logger.info('Starting DC LLC form submission...');
            const data = Object.values(jsonData)[0];
            const stateMapping = await fetchByState(data.State.id);
            
            // Add defensive check for stateMapping
            if (!stateMapping || !Array.isArray(stateMapping) || stateMapping.length === 0) {
                throw new Error('No state mapping found for the given state ID: ' + data.State.id);
            }
            
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
            
            logger.info(`Retrieved ${stateMapping.length} mappings from database`);
            
            // Debug: Log all mappings
            for(let i=0; i<stateMapping.length; i++){
                if(data.orderType === stateMapping[i].order_type || data.orderFullDesc === stateMapping[i].entity_type){
                    logger.info(`Mapping ${i}: ${stateMapping[i].online_field_mapping} -> ${stateMapping[i].json_key}`);
                }
            }

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            
            // Login section using database mappings (LLC mappings start from index 69)
            await page.click(stateMapping[69].online_field_mapping);
            const inputFields = [
                { label: stateMapping[70].online_field_mapping, value: data.State.filingWebsiteUsername },
                { label: stateMapping[71].online_field_mapping, value: data.State.filingWebsitePassword }
            ];
            await this.addInput(page,inputFields);
            await page.click(stateMapping[72].online_field_mapping);
            await page.click(stateMapping[73].online_field_mapping);
            
            // Wait for and click wizard1 link
            try {
                await page.waitForSelector(stateMapping[74].online_field_mapping, { timeout: 10000 });
                await page.click(stateMapping[74].online_field_mapping);
            } catch (error) {
                logger.warn('Wizard1 link not found, trying alternative approach');
                // Try alternative navigation
                await page.waitForSelector('a[href="/Home.aspx/wizard1"]', { timeout: 10000 });
                await page.click('a[href="/Home.aspx/wizard1"]');
            }
            
            // Wait for and click wizard3 link
            try {
                await page.waitForSelector(stateMapping[75].online_field_mapping, { timeout: 10000 });
                await page.click(stateMapping[75].online_field_mapping);
            } catch (error) {
                logger.warn('Wizard3 link not found, trying alternative approach');
                // Try alternative navigation
                await page.waitForSelector('a.my-button[href="/Home.aspx/wizard3"]', { timeout: 10000 });
                await page.click('a.my-button[href="/Home.aspx/wizard3"]');
            }
            
            // Wait for and click service redirect (LLC uses 119)
            try {
                await page.waitForSelector(stateMapping[76].online_field_mapping, { timeout: 10000 });
                await page.click(stateMapping[76].online_field_mapping);
            } catch (error) {
                logger.warn('Service redirect link not found, trying alternative approach');
                // Try alternative navigation
                await page.waitForSelector('a[href="/Biz.aspx/RedirectFromNewService/119"]', { timeout: 10000 });
                await page.click('a[href="/Biz.aspx/RedirectFromNewService/119"]');
            }
            
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Business Information using database mappings (LLC mappings start from index 60)
            try {
                const businessName = await getSafeValue(stateMapping[60].json_key);
                console.log('Business name value:', businessName, 'Type:', typeof businessName);
                const businessNameStr = businessName ? String(businessName) : '';
                await this.fillInputByName(page, stateMapping[60].online_field_mapping, businessNameStr);
            } catch (error) {
                console.error('Error filling business name:', error);
                await this.fillInputByName(page, stateMapping[60].online_field_mapping, '');
            }
            
            // Click business suffix dropdown (LLC uses "Limited Liability Company")
            await this.clickDropdown(page, stateMapping[0].online_field_mapping, 'Limited Liability Company');
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Business Address using database mappings (LLC mappings start from index 61)
            await this.fillInputByName(page, stateMapping[61].online_field_mapping, await getSafeValue(stateMapping[61].json_key));
            await this.fillInputByName(page, stateMapping[62].online_field_mapping, await getSafeValue(stateMapping[62].json_key));
            await this.fillInputByName(page, stateMapping[63].online_field_mapping, await getSafeValue(stateMapping[63].json_key));
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.clickDropdown(page, stateMapping[77].online_field_mapping, 'District of Columbia');
            await this.fillInputByName(page, stateMapping[64].online_field_mapping, await getSafeValue(stateMapping[64].json_key));
            await page.click(stateMapping[18].online_field_mapping);
            
            // Registered Agent using database mappings
            await this.clickDropdown(page, stateMapping[78].online_field_mapping, 'Business Filings');
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Contact Information using database mappings
            const rafullname = await getSafeValue('Organizer_Information.keyPersonnelName');
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
                console.log('Organizer name is empty, using empty values');
            }
            
            // Use the actual organizer name instead of the database mapping
            console.log('Using organizer name from keyPersonnelName:', rafullname);
            await this.fillInputByName(page, stateMapping[38].online_field_mapping, firstName);
            await this.fillInputByName(page, stateMapping[39].online_field_mapping, lastName);
            
            logger.info('Form submission complete for DC LLC');
            
            // Fill contact address using database mappings (LLC mappings start from index 65)
            await this.fillInputByName(page, stateMapping[65].online_field_mapping, await getSafeValue(stateMapping[65].json_key));
            await this.fillInputByName(page, stateMapping[66].online_field_mapping, await getSafeValue(stateMapping[66].json_key));
            await this.fillInputByName(page, stateMapping[67].online_field_mapping, await getSafeValue(stateMapping[67].json_key));
            await this.clickDropdown(page, stateMapping[79].online_field_mapping, 'District of Columbia');
            await this.fillInputByName(page, stateMapping[68].online_field_mapping, await getSafeValue(stateMapping[68].json_key));
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Fill stipulation description using database mappings
            await page.waitForSelector(stateMapping[80].online_field_mapping);
            await page.type(stateMapping[80].online_field_mapping, 
                'Miscellaneous Provisions include various clauses and stipulations that cover areas not addressed elsewhere in the document.');
            
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping); 
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping); 
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping); 
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping); 
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping); 
            
            const res = "form filled successfully";
            return res;
 
        } catch (error) {
            logger.error('Error in Dc For LLC form handler:', error.stack);
            throw new Error(`Dc For LLC form submission failed: ${error.message}`);
        }
    }
}
module.exports = DcForLLC;