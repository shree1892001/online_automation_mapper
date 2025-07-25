const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class AlaskaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async AlaskaForCORP(page, jsonData, payload) {
        try {
            logger.info('Navigating to Alaska form submission page...');
                        const data = Object.values(jsonData)[0];


            const stateMapping = await fetchByState(data.State.id);

            for(let i=0;i< stateMapping.length;i++){

              console.log(i,stateMapping[i].online_field_mapping,stateMapping[i].json_key);
            }

            // Helper function to safely get value from payload
            const getSafeValue = async (payload, jsonKey, defaultValue = "") => {
                const value = await this.getValueFromPayload(payload, jsonKey);
                return value !== null && value !== undefined ? String(value) : defaultValue;
            };

            await this.navigateToPage(page, data.State.stateUrl);
            await this.randomSleep(10000, 20000);

            // Navigation steps using mapping
            await page.waitForSelector(stateMapping[82].online_field_mapping, { state: 'visible' });
            await this.clickButton(page, stateMapping[82].online_field_mapping);

            await page.waitForSelector(stateMapping[83].online_field_mapping, { state: 'visible' });
            await this.clickButton(page, stateMapping[83].online_field_mapping);

            await page.waitForSelector(stateMapping[84].online_field_mapping, { state: 'visible' });
            await this.clickButton(page, stateMapping[84].online_field_mapping);

            await page.waitForSelector(stateMapping[85].online_field_mapping, { state: 'visible' });
            await this.clickButton(page, stateMapping[85].online_field_mapping);
            await this.randomSleep(3000, 4000);

            // Wait for all accordions to appear (index 86)
            await page.waitForSelector(stateMapping[86].online_field_mapping, { state: 'visible', timeout: 60000 });
            await page.click(stateMapping[86].online_field_mapping);

            // Wait for all anchors to appear
            await page.waitForSelector('a', { state: 'visible', timeout: 60000 });
            const found = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a'));
                const targetLink = links.find(link =>
                    link.textContent && link.textContent.includes('Domestic (Alaskan)') &&
                    !!(link.offsetWidth || link.offsetHeight || link.getClientRects().length)
                );
                if (targetLink && typeof targetLink.click === 'function') {
                    targetLink.scrollIntoView();
                    targetLink.click();
                    return true;
                }
                return false;
            });

            if (!found) {
                throw new Error('Could not find clickable link for "Domestic (Alaskan)"');
            }

            await page.waitForSelector(stateMapping[88].online_field_mapping, { state: 'visible' });
            await page.click(stateMapping[88].online_field_mapping);

            await page.waitForSelector(stateMapping[89].online_field_mapping, { state: 'visible' });
            await page.click(stateMapping[89].online_field_mapping);

            const newPagePromise = new Promise((resolve) => page.browser().once('targetcreated', target => resolve(target.page())));
            const newPage = await newPagePromise;

            // Purpose
            await this.fillInputbyid(newPage, [{ selector: stateMapping[0].online_field_mapping, value: 'Business purpose' }]);

            // Legal Name
            await this.fillInputByName(newPage, stateMapping[28].online_field_mapping, await getSafeValue(payload, stateMapping[28].json_key));

            // NAICS Code (use mapping index 29)
            await new Promise(resolve => setTimeout(resolve, 4000));
            await this.selectDropdownOptionByText(
                newPage,
                stateMapping[29].online_field_mapping,
                await getSafeValue(payload, stateMapping[29].json_key)
            );
            await new Promise(resolve => setTimeout(resolve, 4000));

            // Registered Agent Name (split logic)
            const agentFullName = await getSafeValue(payload, 'payload.Registered_Agent.keyPersonnelName');
            const [firstName, lastName] = agentFullName.split(' ');
            await this.fillInputByName(newPage, stateMapping[65].online_field_mapping, firstName);
            await this.fillInputByName(newPage, stateMapping[66].online_field_mapping, lastName);

            // Registered Agent Mailing Address
            await this.fillInputByName(newPage, stateMapping[67].online_field_mapping, await getSafeValue(payload, stateMapping[67].json_key));
            await this.fillInputByName(newPage, stateMapping[68].online_field_mapping, await getSafeValue(payload, stateMapping[68].json_key) || " ");
            await this.fillInputByName(newPage, stateMapping[69].online_field_mapping, await getSafeValue(payload, stateMapping[69].json_key));
            await this.fillInputByName(newPage, stateMapping[70].online_field_mapping, await getSafeValue(payload, stateMapping[70].json_key));

            // Copy Agent Physical Address
            await this.clickButton(newPage, stateMapping[1].online_field_mapping);

            // Entity Mailing Address
            await this.fillInputByName(newPage, stateMapping[71].online_field_mapping, await getSafeValue(payload, stateMapping[71].json_key));
            await this.fillInputByName(newPage, stateMapping[72].online_field_mapping, await getSafeValue(payload, stateMapping[72].json_key) || " ");
            await this.fillInputByName(newPage, stateMapping[73].online_field_mapping, await getSafeValue(payload, stateMapping[73].json_key));
            await this.clickDropdown(newPage, stateMapping[80].online_field_mapping, await getSafeValue(payload, stateMapping[80].json_key));
            await this.fillInputByName(newPage, stateMapping[74].online_field_mapping, await getSafeValue(payload, stateMapping[74].json_key));

            // Copy Entity Physical Address
            await this.clickButton(newPage, stateMapping[2].online_field_mapping);

            // Shares
            await this.clickDropdown(newPage, stateMapping[3].online_field_mapping, 'Common');
            await this.fillInputByName(newPage, stateMapping[39].online_field_mapping, await getSafeValue(payload, stateMapping[39].json_key));
            await this.clickButton(newPage, stateMapping[4].online_field_mapping);

            // Incorporator
            await this.clickButton(newPage, stateMapping[5].online_field_mapping);
            const incName= await getSafeValue(payload, 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName');
            const [incFirstName, incLastName] = incName.split(' ');
           
            await this.fillInputByName(newPage, stateMapping[40].online_field_mapping, incFirstName);
            await this.fillInputByName(newPage, stateMapping[41].online_field_mapping, incLastName);
            await this.clickButton(newPage, stateMapping[6].online_field_mapping);

            // Signature
            await newPage.waitForSelector(stateMapping[7].online_field_mapping, { visible: true });
            await newPage.click(stateMapping[7].online_field_mapping);
            await this.fillInputByName(newPage, stateMapping[42].online_field_mapping, incFirstName + ' ' + incLastName);
            await this.fillInputByName(newPage, stateMapping[43].online_field_mapping, await getSafeValue(payload, stateMapping[43].json_key));
            await this.clickButton(newPage, stateMapping[8].online_field_mapping);

            return "form filled successfully";
        } catch (error) {
            logger.error('Error in Alaska For CORP form handler:', error.stack);
            throw new Error(`Alaska For CORP form submission failed: ${error.message}`);
        }
    }

    async selectDropdownOptionByText(page, selector, textToMatch) {
                try {
                    await page.waitForSelector(selector, { visible: true, timeout: 60000 });
                    const optionData = await page.evaluate((sel, text) => {
                        const select = document.querySelector(sel);
                        const options = Array.from(select.options);
                const matchingOption = options.find(option => option.text.includes(text));
                        if (matchingOption) {
                    return { value: matchingOption.value, text: matchingOption.text, found: true };
                        }
                        return { found: false };
                    }, selector, textToMatch);

                    if (!optionData.found) {
                        throw new Error(`No option found containing text: ${textToMatch}`);
                    }
                    await page.select(selector, optionData.value);
                    logger.info(`Selected option "${optionData.text}" (value: ${optionData.value}) successfully`);
                    return true;
                } catch (error) {
                    logger.error(`Failed to select dropdown option: ${error.message}`);
                    throw error;
        }
    }
}

module.exports = AlaskaForCORP;
