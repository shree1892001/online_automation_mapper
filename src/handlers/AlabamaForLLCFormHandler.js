const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class AlabamaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async normalizePhoneNumber(phoneNumber) {
        // Remove all non-digit characters
        const digits = phoneNumber.replace(/\D/g, '');

        // Check the length of the digits
        if (digits.length === 10) {
            // Format as +1-XXX-XXX-XXXX
            return `1${digits.slice(0, 3)}${digits.slice(3, 6)}${digits.slice(6)}`;
        } else if (digits.length === 11 && digits.startsWith('1')) {
            // Format as +1-XXX-XXX-XXXX
            return `${digits[0]}${digits.slice(1, 4)}${digits.slice(4, 7)}${digits.slice(7)}`;
        } else {
            // Invalid number
            return null;
        }
    }

    async AlabamaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to Alabama LLC form submission page...');
            
            const data = Object.values(jsonData)[0];
            const stateMapping = await fetchByState(data.State.id);
            
            for(let i=0;i<stateMapping.length;i++){
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                    console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
                }
            }

            const url = data.State.stateUrl;
            
            // Helper function to safely get value from payload
            const getSafeValue = async (payload, jsonKey, defaultValue = "") => {
                const value = await this.getValueFromPayload(payload, jsonKey);
                return value !== null && value !== undefined ? String(value) : defaultValue;
            };

            await this.navigateToPage(page, url);
            await page.click(stateMapping[1].online_field_mapping);
            await this.clickOnLinkByText(page, stateMapping[2].online_field_mapping);
            
            await this.fillInputByName(page, stateMapping[3].online_field_mapping, await getSafeValue(payload, stateMapping[3].json_key));
            
            const pno = await getSafeValue(payload, stateMapping[4].json_key);
            console.log('Original phone number from payload:', pno);
            
            // Check if phone number exists and is not empty
            if (!pno || pno.trim() === '') {
                logger.warn('Phone number is empty or null, using default value');
                await this.fillInputByName(page, stateMapping[4].online_field_mapping, '1234567890');
            } else {
                const normalizedPhoneNumber = await this.normalizePhoneNumber(pno);
                console.log('Normalized phone number:', normalizedPhoneNumber);

                if (normalizedPhoneNumber) {
                    await this.fillInputByName(page, stateMapping[4].online_field_mapping, normalizedPhoneNumber);
                } else {
                    logger.warn(`Phone number normalization failed for: "${pno}", using original value`);
                    // Use the original phone number if normalization fails
                    await this.fillInputByName(page, stateMapping[4].online_field_mapping, pno);
                }
            }
            
            await this.fillInputByName(page, stateMapping[5].online_field_mapping, await getSafeValue(payload, stateMapping[5].json_key));
            await this.fillInputByName(page, stateMapping[6].online_field_mapping, await getSafeValue(payload, stateMapping[6].json_key));
            await this.fillInputByName(page, stateMapping[7].online_field_mapping, await getSafeValue(payload, stateMapping[7].json_key));
            await this.fillInputByName(page, stateMapping[8].online_field_mapping, await getSafeValue(payload, stateMapping[8].json_key));
            await this.fillInputByName(page, stateMapping[9].online_field_mapping, await getSafeValue(payload, stateMapping[9].json_key));
            
            await this.clickButton(page, stateMapping[10].online_field_mapping);
            await this.fillInputByName(page, stateMapping[11].online_field_mapping, await getSafeValue(payload, stateMapping[11].json_key));
            await this.clickButton(page, stateMapping[12].online_field_mapping);
            await this.selectRadioButtonById(page, stateMapping[13].online_field_mapping);
            await this.selectRadioButtonById(page, stateMapping[67].online_field_mapping); // entityTypeLLC
            await this.clickButton(page, stateMapping[15].online_field_mapping);
            
            //alternate legal name 
            const isNameREplaced = await this.tryAlternate(
                page, 
                stateMapping[16].online_field_mapping,  // selector2
                stateMapping[17].online_field_mapping,  // selector1
                stateMapping[15].online_field_mapping,  // nextbtnSelec
                await getSafeValue(payload, stateMapping[16].json_key)
            );
            
            await this.clickOnLinkByText(page, stateMapping[18].online_field_mapping);
            await this.selectRadioButtonById(page, stateMapping[70].online_field_mapping); // requestorTypeORGANIZATION
            await this.randomSleep(10000,20000);
            
            await this.fillInputByName(page, stateMapping[71].online_field_mapping, await getSafeValue(payload, stateMapping[71].json_key));
            await this.fillInputByName(page, stateMapping[72].online_field_mapping, await getSafeValue(payload, stateMapping[72].json_key));
            await this.fillInputByName(page, stateMapping[73].online_field_mapping, await getSafeValue(payload, stateMapping[73].json_key));
            await this.fillInputByName(page, stateMapping[74].online_field_mapping, await getSafeValue(payload, stateMapping[74].json_key));
            
            await this.clickButton(page, stateMapping[75].online_field_mapping);
            
            await page.waitForSelector(stateMapping[76].online_field_mapping, { visible: true, timeout: 30000 });
            await page.click(stateMapping[76].online_field_mapping);
            console.log('Checked the checkbox with ID "review"');

            await this.clickButton(page, stateMapping[77].online_field_mapping);

            await this.clickDropdown(page, stateMapping[94].online_field_mapping, data.County.countyName);
            console.log('Selected county from the dropdown');

            await this.selectRadioButtonById(page, stateMapping[78].online_field_mapping); // llcTypeLL

            await this.clickButton(page, stateMapping[79].online_field_mapping);

            await this.selectRadioButtonById(page, stateMapping[80].online_field_mapping);
            
            const rafullname = await getSafeValue(payload, stateMapping[81].json_key);
            const [firstName, lastName] = rafullname.split(' ');
            await this.fillInputByName(page, 'agent.lastName', lastName);
            await this.fillInputByName(page, 'agent.firstName', firstName);
            
            await this.fillInputByName(page, stateMapping[82].online_field_mapping, await getSafeValue(payload, stateMapping[82].json_key));
            await this.fillInputByName(page, stateMapping[83].online_field_mapping, await getSafeValue(payload, stateMapping[83].json_key));
            await this.fillInputByName(page, stateMapping[84].online_field_mapping, await getSafeValue(payload, stateMapping[84].json_key));

            await page.waitForSelector(stateMapping[85].online_field_mapping, { visible: true, timeout: 30000 });
            await page.click(stateMapping[85].online_field_mapping);
            console.log('Checked the checkbox with ID "certifyPhysicalAddress"');

            await this.fillInputByName(page, stateMapping[86].online_field_mapping, await getSafeValue(payload, stateMapping[86].json_key));
            await this.fillInputByName(page, stateMapping[87].online_field_mapping, await getSafeValue(payload, stateMapping[87].json_key));
            await this.fillInputByName(page, stateMapping[88].online_field_mapping, await getSafeValue(payload, stateMapping[88].json_key));
            
            await this.clickDropdown(page, stateMapping[96].online_field_mapping, data.County.countyName);
            
            await page.waitForSelector(stateMapping[89].online_field_mapping, { visible: true, timeout: 30000 });
            await page.click(stateMapping[89].online_field_mapping);
            console.log('Checked the checkbox with ID "certifyRegisteredAgent"');
        
            await this.clickButton(page, stateMapping[90].online_field_mapping);

            await new Promise(resolve => setTimeout(resolve, 4000));

            await this.clickOnLinkByText(page, stateMapping[51].online_field_mapping);

            await this.clickButton(page, stateMapping[91].online_field_mapping);

            await page.waitForSelector(stateMapping[92].online_field_mapping, { visible: true, timeout: 30000 });
            await page.click(stateMapping[92].online_field_mapping);
            console.log('Checked the checkbox with ID "other"');
            
            await page.waitForSelector(stateMapping[93].online_field_mapping);
            await page.click(stateMapping[93].online_field_mapping);
            
            const res = "form filled successfully";
            return res   
        } catch (error) {
            logger.error('Error in Alabama For LLC form handler:', error.stack);
            throw new Error(`Alabama For LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = AlabamaForLLC;
