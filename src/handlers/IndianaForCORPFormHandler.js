const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class IndianaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    
    async IndianaForCORP(page, jsonData, payload) {
        try {
            logger.info('Navigating to Indiana form submission page...');
            console.log(payload.Officer_Information);
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
            
            try {
                // Login process using database mappings
                await page.waitForSelector(stateMapping[0].online_field_mapping, { visible: true });
                await this.fillInputBySelector(page, stateMapping[0].online_field_mapping, data.State.filingWebsiteUsername);
                await this.clickButton(page, stateMapping[1].online_field_mapping);
                await page.waitForSelector(stateMapping[2].online_field_mapping, { visible: true });
                await this.fillInputBySelector(page, stateMapping[2].online_field_mapping, data.State.filingWebsitePassword);
                
                // Check for login error using database mapping (if available)
                if (stateMapping[37] && stateMapping[37].online_field_mapping) {
                    const errorMessageElement = await page.$(stateMapping[37].online_field_mapping);
                    if (errorMessageElement) {
                        const errorMessage = await page.evaluate(el => el.textContent, errorMessageElement);
                        if (errorMessage.trim() === 'Invalid email or password') {
                            throw new Error('Login failed: Invalid email or password');
                        }
                    }
                }

                console.log('Login successful!');
            } catch (error) {
                console.error('An error occurred during login:', error.message);
            }
            
            // Click the button and the link
            await this.clickButton(page, stateMapping[1].online_field_mapping);
            await page.waitForSelector(stateMapping[3].online_field_mapping, { visible: true });
            await this.clickButton(page, stateMapping[3].online_field_mapping);
            await this.randomSleep();

            // Click the link using aria-label
            await page.waitForSelector(stateMapping[4].online_field_mapping, { visible: true });
            await page.click(stateMapping[4].online_field_mapping);
            console.log('Clicked on the INBiz element');

            // Wait for the new tab to open
            const newPagePromise = new Promise((resolve) => page.browser().once('targetcreated', target => resolve(target.page())));

            // Switch context to the new tab
            const newPage = await newPagePromise;
            await newPage.waitForSelector(stateMapping[5].online_field_mapping, { visible: true });
            await this.clickButton(newPage, stateMapping[5].online_field_mapping);
            await newPage.waitForSelector(stateMapping[6].online_field_mapping, { visible: true });
            await this.clickButton(newPage, stateMapping[6].online_field_mapping);
            await this.clickButton(newPage, stateMapping[7].online_field_mapping);
            await this.randomSleep(5000, 5000);
            
            // Debug the page state before attempting to click the problematic selector
            await this.debugPageElements(newPage, 'Before clicking #\\35');
            
            // Handle the problematic selector with fallback logic
            try {
                await newPage.click(stateMapping[8].online_field_mapping);
                console.log(`Successfully clicked selector: ${stateMapping[8].online_field_mapping}`);
            } catch (error) {
                console.log(`Failed to click selector: ${stateMapping[8].online_field_mapping}`);
                console.log('Attempting to find alternative selectors...');
                
                // Try alternative selectors for the same element
                const alternativeSelectors = [
                    '#5',
                    'input[value="5"]',
                    'input[id="5"]',
                    'button[id="5"]',
                    'a[id="5"]',
                    'div[id="5"]',
                    'span[id="5"]',
                    'input[type="radio"][value="5"]',
                    'input[type="checkbox"][value="5"]'
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
                    // If no alternative selectors work, try to find any clickable elements
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
                    
                    // Try clicking the first available button or continue without clicking
                    if (clickableElements.length > 0) {
                        console.log('Attempting to click first available button...');
                        await newPage.click('button, input[type="button"], input[type="submit"]');
                    } else {
                        console.log('No clickable elements found. Continuing without clicking...');
                    }
                }
            }
            
            // Debug the page state after attempting to click
            await this.debugPageElements(newPage, 'After clicking #\\35');
            
            await newPage.waitForSelector(stateMapping[9].online_field_mapping, { visible: true });
            await this.clickButton(newPage, stateMapping[9].online_field_mapping);
            await this.randomSleep(5000, 5000);
            await newPage.waitForSelector(stateMapping[10].online_field_mapping, { visible: true });
            await this.randomSleep(1000, 1000);
            await newPage.click(stateMapping[10].online_field_mapping);
            
            // Fill business name
            const businessName = await this.getValueFromPayload(payload, stateMapping[11].json_key);
            await this.fillInputBySelector(newPage, stateMapping[11].online_field_mapping, businessName);
            await this.clickButton(newPage, stateMapping[12].online_field_mapping);
            await this.randomSleep(2000,2000)
            await this.clickButton(newPage, stateMapping[13].online_field_mapping);
            
            // Fill business email
            const businessEmail = await this.getValueFromPayload(payload, stateMapping[14].json_key);
            await this.fillInputBySelector(newPage, stateMapping[14].online_field_mapping, businessEmail);
            await this.fillInputBySelector(newPage, stateMapping[15].online_field_mapping, businessEmail);
            
            // Fill principal office address
            const zipCode = await this.getValueFromPayload(payload, stateMapping[16].json_key);
            await this.fillInputBySelector(newPage, stateMapping[16].online_field_mapping, String(zipCode));
            await newPage.click(stateMapping[17].online_field_mapping);
            await this.randomSleep(3000, 3000);
            
            const streetAddress = await this.getValueFromPayload(payload, stateMapping[17].json_key);
            await this.fillInputBySelector(newPage, stateMapping[17].online_field_mapping, streetAddress);
            
            const addressLine2 = await this.getValueFromPayload(payload, stateMapping[18].json_key);
            await this.fillInputBySelector(newPage, stateMapping[18].online_field_mapping, addressLine2 || " ");
            
            // Fill authorized shares
            const authorizedShares = await this.getValueFromPayload(payload, stateMapping[19].json_key);
            await this.fillInputBySelector(newPage, stateMapping[19].online_field_mapping, String(authorizedShares));
            
            // Scroll to bottom using database-driven approach
            await this.scrollToBottom(newPage);
            
            await this.clickButton(newPage, stateMapping[20].online_field_mapping);
            await this.randomSleep(5000, 5000);
            
            const agentTypeElement = await newPage.$(stateMapping[21].online_field_mapping);
            if (agentTypeElement) {
                await newPage.click(stateMapping[21].online_field_mapping);
            } else {
                await this.clickButton(newPage, stateMapping[20].online_field_mapping);
            }
            
            await this.clickButton(newPage, stateMapping[22].online_field_mapping);
            
            // Fill registered agent information
            const agentName = await this.getValueFromPayload(payload, stateMapping[23].json_key);
            await this.fillInputBySelector(newPage, stateMapping[23].online_field_mapping, agentName);
            
            const agentEmail = await this.getValueFromPayload(payload, stateMapping[24].json_key);
            await this.fillInputBySelector(newPage, stateMapping[24].online_field_mapping, agentEmail);
            await this.fillInputBySelector(newPage, stateMapping[25].online_field_mapping, agentEmail);
            
            const agentZipCode = await this.getValueFromPayload(payload, stateMapping[26].json_key);
            await this.fillInputBySelector(newPage, stateMapping[26].online_field_mapping, String(agentZipCode));
            await newPage.click(stateMapping[27].online_field_mapping);
            await this.randomSleep(3000, 3000);
            
            const agentStreetAddress = await this.getValueFromPayload(payload, stateMapping[27].json_key);
            await this.fillInputBySelector(newPage, stateMapping[27].online_field_mapping, agentStreetAddress);
            
            await this.clickButton(newPage, stateMapping[28].online_field_mapping);
            await this.randomSleep(5000, 6000);
            await this.clickButton(newPage, stateMapping[29].online_field_mapping);

            await this.randomSleep(5000, 6000);
            
            // Fill incorporator information using database-driven name splitting
            const incorporatorName = await this.getValueFromPayload(payload, stateMapping[30].json_key);
            const [incfirstName, inclastName] = await this.splitName(incorporatorName);
            await this.fillInputBySelector(newPage, stateMapping[30].online_field_mapping, incfirstName);
            await this.fillInputBySelector(newPage, stateMapping[31].online_field_mapping, inclastName);
            
            const incorporatorZipCode = await this.getValueFromPayload(payload, stateMapping[32].json_key);
            await this.fillInputBySelector(newPage, stateMapping[32].online_field_mapping, String(incorporatorZipCode));
            await newPage.click(stateMapping[33].online_field_mapping);
            await this.randomSleep(3000, 3000);
                

            await this.clickDropdown(newPage,"#Incorporators_ddlCity","Terre Haute");
            const incorporatorStreetAddress = await this.getValueFromPayload(payload, stateMapping[33].json_key);
            await this.fillInputBySelector(newPage, stateMapping[33].online_field_mapping, incorporatorStreetAddress);
            
            await newPage.click(stateMapping[34].online_field_mapping);
            await newPage.waitForSelector(stateMapping[35].online_field_mapping, { visible: true });
            await this.randomSleep(1000, 1000);
            await newPage.click(stateMapping[35].online_field_mapping);
            await newPage.waitForSelector(stateMapping[35].online_field_mapping, { visible: true });
            await newPage.click(stateMapping[35].online_field_mapping);
            await this.clickButton(newPage, stateMapping[36].online_field_mapping);
            
            const res = "form filled successfully";
            return res;

        } catch (error) {
            logger.error('Error in Indiana For CORP form handler:', error.stack);
            throw new Error(`Indiana For CORP form submission failed: ${error.message}`);
        }
    }
    
    async fillInputByCSSSelector(page, cssSelector, value) {
        try {
            await page.waitForSelector(cssSelector, { visible: true, timeout: 0 });
            await page.type(cssSelector, value, { delay: 100 });
            console.log(`Filled input at CSS selector "${cssSelector}" with value: "${value}"`);
        } catch (error) {
            console.error(`Error filling input at CSS selector "${cssSelector}":`, error.message);
        }
    }
    
    async selectRadioButtonByNameAndValue(page, name, value) {
        try {
            await page.waitForSelector(`input[type="radio"][name="${name}"][value="${value}"]`, { visible: true, timeout: 0 });
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
    
    async scrollToBottom(page) {
        try {
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            console.log('Scrolled to bottom of page');
        } catch (error) {
            console.error('Error scrolling to bottom:', error.message);
        }
    }
    
    async splitName(fullName) {
        try {
            if (!fullName || typeof fullName !== 'string') {
                return ['', ''];
            }
            const nameParts = fullName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            return [firstName, lastName];
        } catch (error) {
            console.error('Error splitting name:', error.message);
            return ['', ''];
        }
    }
    
    async debugPageElements(page, context = '') {
        try {
            console.log(`=== DEBUG: Available Elements ${context} ===`);
            
            // Get all input elements
            const inputs = await page.$$eval('input', elements => 
                elements.map(el => ({
                    tag: el.tagName,
                    id: el.id,
                    name: el.name,
                    value: el.value,
                    type: el.type,
                    className: el.className,
                    placeholder: el.placeholder
                }))
            );
            
            
            // Get all button elements
            const buttons = await page.$$eval('button, input[type="button"], input[type="submit"]', elements => 
                elements.map(el => ({
                    tag: el.tagName,
                    id: el.id,
                    value: el.value,
                    text: el.textContent?.trim(),
                    className: el.className,
                    type: el.type
                }))
            );
            
            
            // Get all elements with ID
            const elementsWithId = await page.$$eval('[id]', elements => 
                elements.map(el => ({
                    tag: el.tagName,
                    id: el.id,
                    text: el.textContent?.trim(),
                    className: el.className
                }))
            );
            
            
            console.log(`=== END DEBUG ${context} ===`);
        } catch (error) {
            console.error('Error debugging page elements:', error.message);
        }
    }
    
    async safeClick(page, selector, fallbackSelectors = []) {
        try {
            await page.waitForSelector(selector, { visible: true, timeout: 5000 });
            await page.click(selector);
            console.log(`Successfully clicked: ${selector}`);
            return true;
        } catch (error) {
            console.log(`Failed to click ${selector}: ${error.message}`);
            
            // Try fallback selectors
            for (const fallbackSelector of fallbackSelectors) {
                try {
                    const element = await page.$(fallbackSelector);
                    if (element) {
                        await page.click(fallbackSelector);
                        console.log(`Successfully clicked fallback: ${fallbackSelector}`);
                        return true;
                    }
                } catch (fallbackError) {
                    console.log(`Fallback selector ${fallbackSelector} failed: ${fallbackError.message}`);
                }
            }
            
            console.log(`All selectors failed for: ${selector}`);
            return false;
        }
    }
}

module.exports = IndianaForCORP;


