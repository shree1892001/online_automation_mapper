const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');
//const {selectRadioButtonByLabel,clickOnTitle,navigateToPage,addInput,clickButton  } = require('../utils/puppeteerUtils');

class DcForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async DcForCORP(page, jsonData, payload) {
        try {
            logger.info('Navigating to DC Corp form submission page...');
            const data = Object.values(jsonData)[0];
            
            // Fetch state mappings from database
            const stateMapping = await fetchByState(data.State.id);
            
            // Add defensive check for stateMapping
            if (!stateMapping || !Array.isArray(stateMapping) || stateMapping.length === 0) {
                throw new Error('No state mapping found for the given state ID: ' + data.State.id);
            }
            
            console.log("StateMapping", stateMapping);
            console.log("Order type match:", data.orderType === stateMapping[0].order_type);
            console.log("Entity type match:", data.orderFullDesc === stateMapping[0].entity_type);
            
            // Log all mappings for debugging
            for(let i = 0; i < stateMapping.length; i++) {
                console.log(stateMapping[i].online_field_mapping, stateMapping[i].json_key, i);
            }
            
            const url = data.State.stateUrl;            
            await this.navigateToPage(page, url);
            logger.info('Successfully navigated to page');
            
            // Click login link - using mapping index 14
            await page.waitForSelector(stateMapping[14].online_field_mapping, { timeout: 10000 });
            await page.click(stateMapping[14].online_field_mapping);
            logger.info('Clicked login link');
            
            // Fill username and password
            await this.fillInputByName(page, stateMapping[15].online_field_mapping, data.State.filingWebsiteUsername);
            await this.fillInputByName(page, stateMapping[16].online_field_mapping, data.State.filingWebsitePassword);
            
            // Click remember me checkbox
            await page.click(stateMapping[17].online_field_mapping);
            
            // Click sign in button
            await page.click(stateMapping[19].online_field_mapping);
            
            // Navigate through wizard steps
            await page.waitForSelector(stateMapping[20].online_field_mapping);
            await page.click(stateMapping[20].online_field_mapping);
            
            await page.waitForSelector(stateMapping[21].online_field_mapping);
            await page.click(stateMapping[21].online_field_mapping);
            
            await page.waitForSelector(stateMapping[22].online_field_mapping);
            await page.click(stateMapping[22].online_field_mapping);
            
            // Click next buttons
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            await page.waitForSelector(stateMapping[23].online_field_mapping);
            await page.click(stateMapping[23].online_field_mapping);
            
            // Fill business name
            await this.fillInputByName(page, stateMapping[1].online_field_mapping, payload.Name.Legal_Name);
            
            // Select business suffix
            await this.clickDropdown(page, stateMapping[0].online_field_mapping, 'Corporation');
            
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Fill business address
            await this.fillInputByName(page, stateMapping[2].online_field_mapping, payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, stateMapping[3].online_field_mapping, payload.Incorporator_Information.Address['Address_Line_2'] || "");
            await this.fillInputByName(page, stateMapping[4].online_field_mapping, payload.Incorporator_Information.Address.City);
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            await this.clickDropdown(page, stateMapping[25].online_field_mapping, 'District of Columbia');
            await this.fillInputByName(page, stateMapping[5].online_field_mapping, String(payload.Incorporator_Information.Address.Zip_Code));
            
            await page.click(stateMapping[18].online_field_mapping);
            
            // Fill stock details
            await this.clickDropdown(page, stateMapping[26].online_field_mapping, 'Common');
            await page.type(stateMapping[6].online_field_mapping, payload.Stock_Details.Number_Of_Shares.toString());
            await page.type(stateMapping[7].online_field_mapping, payload.Stock_Details.Shares_Par_Value.toString());
            await page.click(stateMapping[27].online_field_mapping);
            
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Select registered agent
            await this.clickDropdown(page, stateMapping[28].online_field_mapping, 'Business Filings');
            
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Fill stipulation
            await page.type(stateMapping[29].online_field_mapping,
                'Miscellaneous Provisions include various clauses and stipulations that cover areas not addressed elsewhere in the document.');
            
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            // Fill incorporator information - using Inc_Name for both first and last name
            const rafullname = payload.Incorporator_Information.Incorporator_Details.Inc_Name;
            const [firstName, lastName] = await this.ra_split(rafullname);
            await this.fillInputByName(page, stateMapping[8].online_field_mapping, firstName);
            await this.fillInputByName(page, stateMapping[9].online_field_mapping, lastName);
            
            // Fill incorporator address
            await this.fillInputByName(page, stateMapping[10].online_field_mapping, payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, stateMapping[11].online_field_mapping, payload.Incorporator_Information.Address['Address_Line_2'] || "");
            await this.fillInputByName(page, stateMapping[12].online_field_mapping, payload.Incorporator_Information.Address.City);
            await this.clickDropdown(page, stateMapping[30].online_field_mapping, 'District of Columbia');
            await this.fillInputByName(page, stateMapping[13].online_field_mapping, String(payload.Incorporator_Information.Address.Zip_Code));
            await this.fillInputByName(page, stateMapping[81].online_field_mapping, payload.Incorporator_Information.Incorporator_Details.Email_Address);
            
            // Final navigation
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            await page.waitForSelector(stateMapping[18].online_field_mapping);
            await page.click(stateMapping[18].online_field_mapping);
            
            const res = "form filled successfully";
            logger.info('DC Corp form automation completed successfully');
            return res;

        } catch (error) {
            logger.error('Error in DC For CORP form handler:', error.stack);
            throw new Error(`DC For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = DcForCORP;