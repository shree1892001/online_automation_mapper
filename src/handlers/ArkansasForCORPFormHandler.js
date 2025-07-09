const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class ArkansasForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async ArkansasForCORP(page, jsonData, payload) {
      try {
            logger.info('Navigating to Arkansas CORP form submission page...');
        const data = Object.values(jsonData)[0];

        const stateMapping = await fetchByState(data.State.id);
        
        for(let i=0;i<stateMapping.length;i++){
                console.log(i, stateMapping[i].online_field_mapping, stateMapping[i].json_key);
            }

            // Helper function to safely get value from payload
            const getSafeValue = (payload, jsonKey) => {
                try {
                    const keys = jsonKey.replace('payload.', '').split('.');
                    let value = payload;
                    for (const key of keys) {
                        if (value && typeof value === 'object' && key in value) {
                            value = value[key];
                        } else {
                            return '';
                        }
                    }
                    return value || '';
                } catch (error) {
                    logger.warn(`Error getting value for ${jsonKey}:`, error.message);
                    return '';
                }
            };

        const url = data.State.stateUrl;
        await this.navigateToPage(page, url);
            await this.randomSleep(30000, 50000);
            
            // Click the Domestic option - using mapping table selector
            // Note: This selector needs to be added to mapping table
        await page.evaluate(() => {
            document.querySelector('a[href="javascript:showOptions(1)"]').click();
        });

            // Start form - using mapping table index 35
            logger.info(`Attempting to click Start Form button with selector: ${stateMapping[35].online_field_mapping}`);
            
            try {
                await this.clickButton(page, stateMapping[35].online_field_mapping);
            } catch (error) {
                logger.warn(`Failed to click Start Form button with mapping selector: ${error.message}`);
                logger.info('Attempting to find Start Form button with alternative selectors...');
                
                // Try alternative selectors
                const alternativeSelectors = [
                    'input[type="submit"][value="Start Form"]',
                    'input[type="submit"][name="do:StartForm=1"]',
                    'input[value="Start Form"]',
                    'button[value="Start Form"]',
                    'input[type="submit"]'
                ];
                
                let clicked = false;
                for (const selector of alternativeSelectors) {
                    try {
                        logger.info(`Trying alternative selector: ${selector}`);
                        await page.waitForSelector(selector, { timeout: 5000 });
                        await page.click(selector);
                        logger.info(`Successfully clicked Start Form button with selector: ${selector}`);
                        clicked = true;
                        break;
                    } catch (altError) {
                        logger.warn(`Alternative selector ${selector} failed: ${altError.message}`);
                    }
                }
                
                if (!clicked) {
                    throw new Error('Could not find Start Form button with any selector');
                }
            }

            // Wait for page to load after clicking Start Form
            await this.randomSleep(3000, 5000);

            // Entity Name - using index 42
            const entityName = await getSafeValue(payload, stateMapping[42].json_key);
            await this.fillInputByName(page, stateMapping[42].online_field_mapping, entityName);

            // Stock info - using index 63
            await this.clickButton(page, stateMapping[63].online_field_mapping);

            // Stock shares and par value - using indices 43, 44
            const stockShares = await getSafeValue(payload, stateMapping[43].json_key);
            const stockParValue = await getSafeValue(payload, stateMapping[44].json_key);
            await this.fillInputByName(page, stateMapping[43].online_field_mapping, String(stockShares));
            await this.fillInputByName(page, stateMapping[44].online_field_mapping, String(stockParValue));

            // Wait for Registered Agent section to be available
            logger.info('Waiting for Registered Agent section to load...');
            await this.randomSleep(2000, 3000);

            // Check if we're on the correct page/section
            const pageContent = await page.content();
            if (!pageContent.includes('Registered Agent') && !pageContent.includes('Business Name')) {
                logger.warn('Registered Agent section not found on current page. Checking page state...');
                // Log current page URL and title for debugging
                const currentUrl = page.url();
                const pageTitle = await page.title();
                logger.info(`Current URL: ${currentUrl}`);
                logger.info(`Page Title: ${pageTitle}`);
            }

            // Registered Agent - using mapping table indices 45-49
            const raBusinessName = await getSafeValue(payload, stateMapping[45].json_key);
            const raAddress1 = await getSafeValue(payload, stateMapping[46].json_key);
            const raAddress2 = await getSafeValue(payload, stateMapping[47].json_key) || " ";
            const raZip = await getSafeValue(payload, stateMapping[48].json_key);
            const raCity = await getSafeValue(payload, stateMapping[49].json_key);

            // Using database-driven selectors directly with better error handling
            logger.info(`Attempting to fill Registered Agent Business Name with selector: ${stateMapping[45].online_field_mapping}`);
            logger.info(`Business Name value: ${raBusinessName}`);
            
            try {
                // Wait for the specific element to be present
                await page.waitForSelector(stateMapping[45].online_field_mapping, { timeout: 10000 });
                await this.fillInputByName(page, stateMapping[45].online_field_mapping, raBusinessName);
                logger.info('Successfully filled Registered Agent Business Name');
            } catch (error) {
                logger.warn(`Failed to fill Registered Agent Business Name with mapping selector: ${error.message}`);
                logger.info('Attempting to find Registered Agent Business Name field with alternative selectors...');
                
                // Try alternative selectors for Registered Agent Business Name
                const alternativeSelectors = [
                    'input[name="Business Name"]',
                    'input[name="business_name"]',
                    'input[name="registered_agent_name"]',
                    'input[name="agent_name"]',
                    'input[placeholder*="Business"]',
                    'input[placeholder*="Agent"]',
                    'input[id*="business"]',
                    'input[id*="agent"]'
                ];
                
                let filled = false;
                for (const selector of alternativeSelectors) {
                    try {
                        logger.info(`Trying alternative selector for Registered Agent Business Name: ${selector}`);
                        await page.waitForSelector(selector, { timeout: 5000 });
                        await page.fill(selector, raBusinessName);
                        logger.info(`Successfully filled Registered Agent Business Name with selector: ${selector}`);
                        filled = true;
                        break;
                    } catch (altError) {
                        logger.warn(`Alternative selector ${selector} failed: ${altError.message}`);
                    }
                }
                
                if (!filled) {
                    logger.error('Could not find Registered Agent Business Name field with any selector');
                    // Continue with other fields instead of failing completely
                }
            }

            try {
                await this.fillInputByName(page, stateMapping[46].online_field_mapping, raAddress1);
            } catch (error) {
                logger.warn(`Failed to fill Registered Agent Address 1: ${error.message}`);
            }

            try {
                await this.fillInputByName(page, stateMapping[47].online_field_mapping, raAddress2);
            } catch (error) {
                logger.warn(`Failed to fill Registered Agent Address 2: ${error.message}`);
            }

            try {
                await this.fillInputByName(page, stateMapping[48].online_field_mapping, raZip);
            } catch (error) {
                logger.warn(`Failed to fill Registered Agent Zip: ${error.message}`);
            }

            try {
                await this.fillInputByName(page, stateMapping[49].online_field_mapping, raCity);
            } catch (error) {
                logger.warn(`Failed to fill Registered Agent City: ${error.message}`);
            }

            // Incorporator/Organizer - using index 50
            const incorpOrgName = await getSafeValue(payload, stateMapping[50].json_key);
            await this.fillInputByName(page, stateMapping[50].online_field_mapping, incorpOrgName);
            
            // Officer title dropdown - using index 36
            await this.clickDropdown(page, stateMapping[36].online_field_mapping, 'Incorporator/Organizer');

            // Incorporator address - using indices 51-54
            const incorpAddress1 = await getSafeValue(payload, stateMapping[51].json_key);
            const incorpAddress2 = await getSafeValue(payload, stateMapping[52].json_key) || " ";
            const incorpCity = await getSafeValue(payload, stateMapping[53].json_key);
            const incorpZip = await getSafeValue(payload, stateMapping[54].json_key);

            await this.fillInputByName(page, stateMapping[51].online_field_mapping, incorpAddress1);
            await this.fillInputByName(page, stateMapping[52].online_field_mapping, incorpAddress2);
            await this.fillInputByName(page, stateMapping[53].online_field_mapping, incorpCity);
            await this.fillInputByName(page, stateMapping[54].online_field_mapping, incorpZip);

            // Officer information - using indices 62, 55
            const offName = await getSafeValue(payload, stateMapping[62].json_key);
            const offLastName = await getSafeValue(payload, stateMapping[55].json_key);
            await this.fillInputByName(page, stateMapping[62].online_field_mapping, offName);
            await this.fillInputByName(page, stateMapping[55].online_field_mapping, offLastName);

            // Officer title dropdown - using index 36
            await this.clickDropdown(page, stateMapping[36].online_field_mapping, 'General Manager');

            // Officer address - using indices 68-71
            const offAddress1 = await getSafeValue(payload, stateMapping[68].json_key);
            const offAddress2 = await getSafeValue(payload, stateMapping[69].json_key) || " ";
            const offCity = await getSafeValue(payload, stateMapping[70].json_key);
            const offZip = await getSafeValue(payload, stateMapping[71].json_key);

            await this.fillInputByName(page, stateMapping[68].online_field_mapping, offAddress1);
            await this.fillInputByName(page, stateMapping[69].online_field_mapping, offAddress2);
            await this.fillInputByName(page, stateMapping[70].online_field_mapping, offCity);
            await this.fillInputByName(page, stateMapping[71].online_field_mapping, offZip);

            // Contact information - using indices 57-60, 72-73
            const contactOrgName = await getSafeValue(payload, stateMapping[57].json_key);
            const contactAddress1 = await getSafeValue(payload, stateMapping[58].json_key);
            const contactAddress2 = await getSafeValue(payload, stateMapping[41].json_key) || " ";
            const contactCity = await getSafeValue(payload, stateMapping[59].json_key);
            const contactZip = await getSafeValue(payload, stateMapping[60].json_key);
            const contactPhone = await getSafeValue(payload, stateMapping[72].json_key);
            const contactEmail = await getSafeValue(payload, stateMapping[73].json_key);

            await this.fillInputByName(page, stateMapping[57].online_field_mapping, contactOrgName);
            await this.fillInputByName(page, stateMapping[58].online_field_mapping, contactAddress1);
            await this.fillInputByName(page, stateMapping[41].online_field_mapping, contactAddress2);
            await this.fillInputByName(page, stateMapping[59].online_field_mapping, contactCity);
            await this.fillInputByName(page, stateMapping[60].online_field_mapping, contactZip);
            await this.fillInputByName(page, stateMapping[72].online_field_mapping, contactPhone);
            await this.fillInputByName(page, stateMapping[73].online_field_mapping, contactEmail);

            // Tax contact information - using indices 61, 74-79
            const taxContactOrgName = await getSafeValue(payload, stateMapping[61].json_key);
            const taxContactAddress1 = await getSafeValue(payload, stateMapping[74].json_key);
            const taxContactAddress2 = await getSafeValue(payload, stateMapping[75].json_key) || " ";
            const taxContactCity = await getSafeValue(payload, stateMapping[76].json_key);
            const taxContactZip = await getSafeValue(payload, stateMapping[77].json_key);
            const taxContactPhone = await getSafeValue(payload, stateMapping[78].json_key);
            const taxContactEmail = await getSafeValue(payload, stateMapping[79].json_key);

            await this.fillInputByName(page, stateMapping[61].online_field_mapping, taxContactOrgName);
            await this.fillInputByName(page, stateMapping[74].online_field_mapping, taxContactAddress1);
            await this.fillInputByName(page, stateMapping[75].online_field_mapping, taxContactAddress2);
            await this.fillInputByName(page, stateMapping[76].online_field_mapping, taxContactCity);
            await this.fillInputByName(page, stateMapping[77].online_field_mapping, taxContactZip);
            await this.fillInputByName(page, stateMapping[78].online_field_mapping, taxContactPhone);
            await this.fillInputByName(page, stateMapping[79].online_field_mapping, taxContactEmail);

            // Purpose - using index 56
            const purpose = await getSafeValue(payload, stateMapping[56].json_key);
            await this.fillInputByName(page, stateMapping[56].online_field_mapping, purpose);

            // Save add officer - using index 37
            await this.clickButton(page, stateMapping[37].online_field_mapping);

            // Agreement checkbox - using index 38
            await this.clickButton(page, stateMapping[38].online_field_mapping);

            // Save form - using index 39
            await this.clickButton(page, stateMapping[39].online_field_mapping);

            // Next button - using index 40
            await this.clickButton(page, stateMapping[40].online_field_mapping);

            logger.info('Arkansas CORP form submission completed successfully');

        } catch (error) {
            logger.error('Error in Arkansas CORP form handler:', error.stack);
            throw new Error(`Arkansas CORP form submission failed: ${error.message}`);
        }
    }
}

    module.exports = ArkansasForCORP;