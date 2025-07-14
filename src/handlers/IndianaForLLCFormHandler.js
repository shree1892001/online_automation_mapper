const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class IndianaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async IndianaForLLC(page, jsonData, payload) {
        try {
            logger.info('Navigating to Indiana LLC form submission page...');
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            // Add defensive check for stateMapping
            if (!stateMapping || !Array.isArray(stateMapping) || stateMapping.length === 0) {
                throw new Error('No state mapping found for the given state ID: ' + data.State.id);
            }
            
            console.log("StateMapping", stateMapping);
            
            for (let i = 0; i < stateMapping.length; i++) {
                if (data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type) {
                    console.log(stateMapping[i].online_field_mapping, stateMapping[i].json_key, i);
                }
            }

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);

            // Login process using database mappings (LLC mappings start from index 37)
            await page.waitForSelector(stateMapping[37].online_field_mapping, { visible: true });
            await this.fillInputBySelector(page, stateMapping[37].online_field_mapping, data.State.filingWebsiteUsername);
            await this.clickButton(page, stateMapping[39].online_field_mapping);

            await page.waitForSelector(stateMapping[38].online_field_mapping, { visible: true });
            await this.fillInputBySelector(page, stateMapping[38].online_field_mapping, data.State.filingWebsitePassword);
            await this.clickButton(page, stateMapping[39].online_field_mapping);

            await page.waitForSelector(stateMapping[40].online_field_mapping, { visible: true });
            await this.clickButton(page, stateMapping[40].online_field_mapping);
            await this.randomSleep();

            await page.waitForSelector(stateMapping[41].online_field_mapping, { visible: true });
            await page.click(stateMapping[41].online_field_mapping);
            console.log('Clicked on the INBiz element');

            const newPagePromise = new Promise((resolve) =>
                page.browser().once('targetcreated', (target) => resolve(target.page()))
            );
            const newPage = await newPagePromise;

            await newPage.waitForSelector(stateMapping[42].online_field_mapping, { visible: true });
            await this.clickButton(newPage, stateMapping[42].online_field_mapping);

            await newPage.waitForSelector(stateMapping[43].online_field_mapping, { visible: true });
            await this.clickButton(newPage, stateMapping[43].online_field_mapping);
            await this.clickButton(newPage, stateMapping[44].online_field_mapping);
            
            // Handle the problematic selector with fallback logic (LLC uses #7 instead of #5)
            try {
                await newPage.click(stateMapping[45].online_field_mapping);
                console.log(`Successfully clicked selector: ${stateMapping[45].online_field_mapping}`);
            } catch (error) {
                console.log(`Failed to click selector: ${stateMapping[45].online_field_mapping}`);
                console.log('Attempting to find alternative selectors...');
                
                // Try alternative selectors for the same element
                const alternativeSelectors = [
                    '#7',
                    'input[value="7"]',
                    'input[id="7"]',
                    'button[id="7"]',
                    'a[id="7"]',
                    'div[id="7"]',
                    'span[id="7"]',
                    'input[type="radio"][value="7"]',
                    'input[type="checkbox"][value="7"]'
                ];
                
                let clicked = false;
                for (const altSelector of alternativeSelectors) {
                    try {
                        const element = await newPage.$(altSelector);
                        if (element) {
                            await newPage.click(altSelector);
                            console.log(`Successfully clicked alternative selector: ${altSelector}`);
                            clicked = true;
                            break;
                        }
                    } catch (altError) {
                        console.log(`Alternative selector ${altSelector} not found or not clickable`);
                    }
                }
                
                if (!clicked) {
                    console.log('No alternative selectors found. Looking for any clickable elements...');
                    const clickableElements = await newPage.$$eval('button, input[type="button"], input[type="submit"], a, [role="button"]', elements => 
                        elements.map(el => ({
                            tag: el.tagName,
                            id: el.id,
                            value: el.value,
                            text: el.textContent?.trim(),
                            className: el.className
                        }))
                    );
                    console.log('Available clickable elements:', clickableElements);
                    
                    if (clickableElements.length > 0) {
                        console.log('Attempting to click first available button...');
                        await newPage.click('button, input[type="button"], input[type="submit"]');
                    } else {
                        console.log('No clickable elements found. Continuing without clicking...');
                    }
                }
            }
            
            await this.clickButton(newPage, stateMapping[46].online_field_mapping);

            await newPage.waitForSelector(stateMapping[47].online_field_mapping, { visible: true });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await newPage.click(stateMapping[47].online_field_mapping);
            
            // Fill business name
            const businessName = await this.getValueFromPayload(payload, stateMapping[48].json_key);
            await this.fillInputBySelector(newPage, stateMapping[48].online_field_mapping, businessName);
            await this.clickButton(newPage, stateMapping[49].online_field_mapping);
            await newPage.waitForSelector(stateMapping[50].online_field_mapping, { visible: true });
            await this.clickButton(newPage, stateMapping[50].online_field_mapping);
            
            // Fill business email
            const businessEmail = await this.getValueFromPayload(payload, stateMapping[51].json_key);
            await newPage.waitForSelector(stateMapping[51].online_field_mapping, { visible: true });
            await this.fillInputBySelector(newPage, stateMapping[51].online_field_mapping, businessEmail);
            await this.fillInputBySelector(newPage, stateMapping[52].online_field_mapping, businessEmail);
            
            // Fill principal office address
            const zipCode = await this.getValueFromPayload(payload, stateMapping[53].json_key);
            await this.fillInputBySelector(newPage, stateMapping[53].online_field_mapping, String(zipCode));

            await newPage.click(stateMapping[54].online_field_mapping);
            await Promise.all([
                new Promise((resolve) => setTimeout(resolve, 3000)),
                this.fillInputBySelector(newPage, stateMapping[55].online_field_mapping, await this.getValueFromPayload(payload, stateMapping[55].json_key))
            ]);
            
            const addressLine2 = await this.getValueFromPayload(payload, stateMapping[56].json_key);
            await this.fillInputBySelector(newPage, stateMapping[56].online_field_mapping, addressLine2 || " ");
            
            await newPage.waitForSelector(stateMapping[57].online_field_mapping, { visible: true });
            await this.clickButton(newPage, stateMapping[57].online_field_mapping);
            
            await Promise.all([
                new Promise((resolve) => setTimeout(resolve, 5000)),
                newPage.waitForSelector(stateMapping[58].online_field_mapping, { visible: true })
            ]);
            await newPage.click(stateMapping[58].online_field_mapping);
            await this.clickButton(newPage, stateMapping[59].online_field_mapping);

            // Fill registered agent information
            const agentName = await this.getValueFromPayload(payload, stateMapping[60].json_key);
            await this.fillInputBySelector(newPage, stateMapping[60].online_field_mapping, agentName);
            
            const agentEmail = await this.getValueFromPayload(payload, stateMapping[61].json_key);
            await this.fillInputBySelector(newPage, stateMapping[61].online_field_mapping, agentEmail);
            await this.fillInputBySelector(newPage, stateMapping[62].online_field_mapping, agentEmail);
            
            const agentZipCode = await this.getValueFromPayload(payload, stateMapping[63].json_key);
            await this.fillInputBySelector(newPage, stateMapping[63].online_field_mapping, String(agentZipCode));

            await newPage.click(stateMapping[64].online_field_mapping);
            await Promise.all([
                new Promise((resolve) => setTimeout(resolve, 3000)),
                this.fillInputBySelector(newPage, stateMapping[65].online_field_mapping, await this.getValueFromPayload(payload, stateMapping[65].json_key))
            ]);
            
            await this.clickButton(newPage, stateMapping[66].online_field_mapping);
            await Promise.all([
                new Promise((resolve) => setTimeout(resolve, 3000)),
                newPage.waitForSelector(stateMapping[67].online_field_mapping, { visible: true })
            ]);
            await this.clickButton(newPage, stateMapping[67].online_field_mapping);

            await newPage.waitForSelector(stateMapping[68].online_field_mapping, { visible: true });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await this.waitForTimeout(3000);
            await newPage.click(stateMapping[68].online_field_mapping);
            await this.randomSleep();
            await this.clickButton(newPage, stateMapping[69].online_field_mapping);
            await newPage.waitForSelector(stateMapping[70].online_field_mapping, { visible: true });
            await this.clickButton(newPage, stateMapping[70].online_field_mapping);
            
            const res = "form filled successfully";
            return res;
            
        } catch (error) {
            logger.error('Error in Indiana LLC form handler:', error.stack);
            throw new Error(`Indiana LLC form submission failed: ${error.message}`);
        }
    }

    async fillInputByCSSSelector(page, cssSelector, value) {
        try {
            await page.waitForSelector(cssSelector, { visible: true });
            await page.type(cssSelector, value, { delay: 100 });
            console.log(`Filled input at CSS selector "${cssSelector}" with value: "${value}"`);
        } catch (error) {
            console.error(`Error filling input at CSS selector "${cssSelector}":`, error.message);
        }
    }

    async selectRadioButtonByNameAndValue(page, name, value) {
        try {
            await page.waitForSelector(`input[type="radio"][name="${name}"][value="${value}"]`, { visible: true });
            await page.click(`input[type="radio"][name="${name}"][value="${value}"]`);
            console.log(`Successfully selected radio button with name: "${name}" and value: "${value}"`);
        } catch (error) {
            console.error(`Error selecting radio button with name "${name}" and value "${value}":`, error);
        }
    }
    
    async fillInputBySelector(page, selector, value) {
        try {
            // Wait for the input field to be visible
            await page.waitForSelector(selector, { visible: true });
            
            // Click to focus on the input field
            await page.click(selector);
            
            // Clear the field first
            await page.evaluate((sel) => {
                const element = document.querySelector(sel);
                if (element) {
                    element.value = '';
                }
            }, selector);
            
            // Type the value
            await page.type(selector, value, { delay: 100 });
            
            console.log(`Filled input with selector "${selector}" with value: "${value}"`);
        } catch (error) {
            console.error(`Failed to fill input with selector "${selector}":`, error.message);
            throw error;
        }
    }
}

module.exports = IndianaForLLC;
