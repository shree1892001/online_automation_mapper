const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class IdahoForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async getValueFromPayload(payload, jsonKey) {
        try {
            if (!jsonKey || jsonKey === 'null') return null;
            
            // Remove 'payload.' prefix if present
            let cleanKey = jsonKey;
            if (cleanKey.startsWith('payload.')) {
                cleanKey = cleanKey.substring(8); // Remove 'payload.' prefix
            }
            
            const keys = cleanKey.split('.');
            let value = payload;
            
            logger.info(`Looking for key: ${cleanKey} in payload`);
            
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                    if (typeof value === 'object' && value !== null) {
                        logger.info(`Found key: ${key}, value: [object Object]`);
                    } else {
                        logger.info(`Found key: ${key}, value: ${value}`);
                    }
                } else {
                    logger.warn(`Key ${key} not found in payload path ${cleanKey}`);
                    return null;
                }
            }
            
            logger.info(`Final value for ${cleanKey}: ${value}`);
            return value;
        } catch (error) {
            logger.error(`Error getting value from payload for key ${jsonKey}:`, error);
            return null;
        }
    }

    async getSafeValue(payload, jsonKey) {
        const value = await this.getValueFromPayload(payload, jsonKey);
        return value !== null && value !== undefined ? String(value) : '';
    }

    async IdahoForCORP(page, jsonData, payload) {
        try {
            logger.info('Navigating to Idaho form submission page...');

            // Navigate to the Idaho form submission page
            const data = Object.values(jsonData)[0];
            const stateMapping = await fetchByState(data.State.id);
            
            logger.info(`Found ${stateMapping.length} mappings for Idaho CORP`);
            
            // Debug: Log payload structure
            logger.info('Payload structure keys:', Object.keys(payload));
            if (payload.Name) {
                logger.info('Name keys:', Object.keys(payload.Name));
            }
            if (payload.Stock_Details) {
                logger.info('Stock_Details keys:', Object.keys(payload.Stock_Details));
            }
            if (payload.Registered_Agent) {
                logger.info('Registered_Agent keys:', Object.keys(payload.Registered_Agent));
            }

            const url = data.State.stateUrl;
            logger.info(`Navigating to URL: ${url}`);
            await this.navigateToPage(page, url);
            
            // Debug: Log current page info
            const currentUrl = page.url();
            const pageTitle = await page.title();
            logger.info(`Current URL after navigation: ${currentUrl}`);
            logger.info(`Page title: ${pageTitle}`);
            
            // Debug: Check if there are any links on the page
            const links = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('a')).map(a => a.innerText.trim()).filter(text => text.length > 0);
            });
            logger.info('Available links on page:', links);

            // Login process - using mapping indices 0, 41-42
            const loginSelector = stateMapping[0]?.online_field_mapping;
            await this.clickButton(page, loginSelector);
            
            const usernameSelector = stateMapping[41]?.online_field_mapping;
            const passwordSelector = stateMapping[42]?.online_field_mapping;
            
            // Get username and password from database mapping instead of hardcoded paths
            const usernameValue = await this.getSafeValue(data, stateMapping[41]?.json_key) || data.State.filingWebsiteUsername;
            const passwordValue = await this.getSafeValue(data, stateMapping[42]?.json_key) || data.State.filingWebsitePassword;
            
            const inputFields = [
                { label: usernameSelector, value: usernameValue },
                { label: passwordSelector, value: passwordValue }
            ];
            await this.addInput(page, inputFields);
            
            const submitSelector = stateMapping[1]?.online_field_mapping;
            await this.clickButton(page, submitSelector);
            logger.info('Login submitted, waiting for page to load...');
            await new Promise(resolve => setTimeout(resolve, 8000));
            
            // Wait for page to be fully loaded (Puppeteer approach)
            await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15000 });

            // Navigate to "Articles of Incorporation" section - using mapping index 2
            const articlesSelector = stateMapping[2]?.online_field_mapping;
            logger.info(`Waiting for Articles selector: ${articlesSelector}`);
            
            try {
                await page.waitForSelector(articlesSelector, { timeout: 10000 });
                logger.info('Articles selector found, looking for Articles of Incorporation option');
                
                const spans = await page.$$(articlesSelector);
                logger.info(`Found ${spans.length} span.title elements`);
                
                let found = false;
                for (let i = 0; i < spans.length; i++) {
                    const text = await spans[i].evaluate(el => el.textContent.trim());
                    logger.info(`Span ${i} text: "${text}"`);
                    if (text === 'Articles of Incorporation (General Business Corporation)') {
                        await spans[i].click();
                        found = true;
                        logger.info('Clicked on Articles of Incorporation option');
                        break;
                    }
                }
                
                if (!found) {
                    logger.warn('Articles of Incorporation option not found, trying alternative approach');
                    // Try clicking on any span that contains "Articles"
                    for (let i = 0; i < spans.length; i++) {
                        const text = await spans[i].evaluate(el => el.textContent.trim());
                        if (text.includes('Articles')) {
                            await spans[i].click();
                            logger.info(`Clicked on alternative option: "${text}"`);
                            break;
                        }
                    }
                }
            } catch (error) {
                logger.error(`Error finding Articles selector: ${error.message}`);
                // Try alternative selectors
                const alternativeSelectors = ['span.title', '.title', '[data-testid="articles"]', 'a[href*="articles"]'];
                for (const altSelector of alternativeSelectors) {
                    try {
                        logger.info(`Trying alternative selector: ${altSelector}`);
                        await page.waitForSelector(altSelector, { timeout: 5000 });
                        const elements = await page.$$(altSelector);
                        for (const element of elements) {
                            const text = await element.evaluate(el => el.textContent.trim());
                            if (text.includes('Articles') || text.includes('Incorporation')) {
                                await element.click();
                                logger.info(`Clicked on alternative option: "${text}"`);
                                break;
                            }
                        }
                        break;
                    } catch (altError) {
                        logger.warn(`Alternative selector ${altSelector} failed: ${altError.message}`);
                    }
                }
            }

            // Click primary button - using mapping index 3
            const primaryButtonSelector = stateMapping[3]?.online_field_mapping;
            await page.click(primaryButtonSelector);

            // Company name input - using mapping indices 15-16
            logger.info('=== FILLING COMPANY NAME SECTION ===');
            const companyName1Selector = stateMapping[15]?.online_field_mapping;
            const companyName2Selector = stateMapping[16]?.online_field_mapping;
            const companyNameValue = await this.getSafeValue(payload, stateMapping[15]?.json_key);
            
            const inputCompanyName = [
                { label: companyName1Selector, value: companyNameValue },
                { label: companyName2Selector, value: companyNameValue }
            ];
            await this.addInput(page, inputCompanyName);
            
            // Next button - using mapping index 4
            const nextButtonSelector = stateMapping[4]?.online_field_mapping;
            await page.click(nextButtonSelector);

            // Shares input - using mapping index 45
            logger.info('=== FILLING SHARES SECTION ===');
            const sharesSelector = stateMapping[45]?.online_field_mapping;
            const sharesValue = await this.getSafeValue(payload, stateMapping[45]?.json_key);
            
            const shares = [{ label: sharesSelector, value: sharesValue }];
            await this.addInput(page, shares);
            await page.click(nextButtonSelector);

            // Principal address input - using mapping indices 46-49
            const principalAddressStreet = stateMapping[46]?.online_field_mapping;
            const principalAddressCity = stateMapping[47]?.online_field_mapping;
            const principalAddressZip = stateMapping[48]?.online_field_mapping;
            const principalAddressState = stateMapping[49]?.online_field_mapping;
            
            const principalAddressStreetValue = await this.getSafeValue(payload, stateMapping[46]?.json_key);
            const principalAddressCityValue = await this.getSafeValue(payload, stateMapping[47]?.json_key);
            const principalAddressZipValue = await this.getSafeValue(payload, stateMapping[48]?.json_key);
            const principalAddressStateValue = await this.getSafeValue(payload, stateMapping[49]?.json_key);
            
            const principalAddress = [
                { label: principalAddressStreet, value: principalAddressStreetValue },
                { label: principalAddressCity, value: principalAddressCityValue },
                { label: principalAddressZip, value: principalAddressZipValue }
            ];
            await this.addInput(page, principalAddress);
            await this.clickDropdown(page, principalAddressState, principalAddressStateValue);
            
            // Country dropdown - using mapping index 5
            const countrySelector = stateMapping[5]?.online_field_mapping;
            const countryValue = await this.getSafeValue(payload, stateMapping[5]?.json_key) || 'United States';
            await this.clickDropdown(page, countrySelector, countryValue);

            const noncommercialLabel = await this.getSafeValue(payload, stateMapping[7]?.json_key) || 'Noncommercial or Individual';
            await this.selectRadioButtonByLabel(page, noncommercialLabel);
            
            // Add button - using mapping index 7
            const addButtonSelector = stateMapping[7]?.online_field_mapping;
            await page.click(addButtonSelector);

            // Registered Agent input - using mapping indices 50-55
            const raFullName = payload.Registered_Agent.keyPersonnelName;
            console.log('RA Full Name:', raFullName);
            const [firstName, lastName] = await this.ra_split(raFullName);
            
            // First and Last name fields - using mapping indices 59-60
            const firstNameSelector = stateMapping[60]?.online_field_mapping;
            const lastNameSelector = stateMapping[59]?.online_field_mapping;
            
            await this.fillInputByName(page, firstNameSelector, firstName);
            await this.fillInputByName(page, lastNameSelector, lastName);

            console.log("Trying to add data in RA");
            
            // RA Primary Address - using mapping indices 50-52
            const raPrimaryStreet = stateMapping[50]?.online_field_mapping;
            const raPrimaryCity = stateMapping[51]?.online_field_mapping;
            const raPrimaryZip = stateMapping[52]?.online_field_mapping;
            
            const raPrimaryStreetValue = await this.getSafeValue(payload, stateMapping[50]?.json_key);
            const raPrimaryCityValue = await this.getSafeValue(payload, stateMapping[51]?.json_key);
            const raPrimaryZipValue = await this.getSafeValue(payload, stateMapping[52]?.json_key);
            
            await this.fillInputbyid(page, [{ selector: raPrimaryStreet, value: raPrimaryStreetValue }]);
            await this.fillInputbyid(page, [{ selector: raPrimaryCity, value: raPrimaryCityValue }]);
            await this.fillInputbyid(page, [{ selector: raPrimaryZip, value: raPrimaryZipValue }]);

            // RA Mailing Address - using mapping indices 53-55
            const raMailStreet = stateMapping[53]?.online_field_mapping;
            const raMailCity = stateMapping[54]?.online_field_mapping;
            const raMailZip = stateMapping[55]?.online_field_mapping;
            
            const raMailStreetValue = await this.getSafeValue(payload, stateMapping[53]?.json_key);
            const raMailCityValue = await this.getSafeValue(payload, stateMapping[54]?.json_key);
            const raMailZipValue = await this.getSafeValue(payload, stateMapping[55]?.json_key);
            
            await this.fillInputbyid(page, [{ selector: raMailStreet, value: raMailStreetValue }]);
            await this.fillInputbyid(page, [{ selector: raMailCity, value: raMailCityValue }]);
            await this.fillInputbyid(page, [{ selector: raMailZip, value: raMailZipValue }]);

            // Save button - using mapping index 8
            const saveButtonSelector = stateMapping[8]?.online_field_mapping;
            await page.evaluate((selector) => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const targetButton = buttons.find(button => button.textContent.trim() === 'Save');
                if (targetButton) {
                    targetButton.click();
                    console.log('Clicked the Save button');
                } else {
                    console.log('Save button not found');
                }
            }, saveButtonSelector);

            await new Promise(resolve => setTimeout(resolve, 5000));

            // Label for attribute - using mapping index 6
            const labelForAttribute = stateMapping[6]?.online_field_mapping;
            
            // Check if the selector already includes 'label[for="'
            let finalSelector;
            if (labelForAttribute.includes('label[for="')) {
                finalSelector = labelForAttribute;
            } else {
                finalSelector = `label[for="${labelForAttribute}"]`;
            }
            
            logger.info(`Using label selector: ${finalSelector}`);
            await page.waitForSelector(finalSelector, { visible: true, timeout: 10000 });
            await page.click(finalSelector);

            await page.waitForSelector(nextButtonSelector, { visible: true });
            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, nextButtonSelector);

            // Adding new incorporator button - using mapping index 9
            const addIncorporatorSelector = stateMapping[9]?.online_field_mapping;
            await page.waitForSelector(addIncorporatorSelector, { visible: true });
            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, addIncorporatorSelector);

            // Incorporator input - using mapping indices 56-58
            const Incname = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [firstInc, lastInc] = await this.ra_split(Incname);
            await this.fillInputByName(page, firstNameSelector, firstInc);
            await this.fillInputByName(page, lastNameSelector, lastInc);

            console.log("Trying to add data for Incorporator");

            const incStreet = stateMapping[56]?.online_field_mapping;
            const incCity = stateMapping[57]?.online_field_mapping;
            const incZip = stateMapping[58]?.online_field_mapping;
            
            const incStreetValue = await this.getSafeValue(payload, stateMapping[56]?.json_key);
            const incCityValue = await this.getSafeValue(payload, stateMapping[57]?.json_key);
            const incZipValue = await this.getSafeValue(payload, stateMapping[58]?.json_key);

            await this.fillInputbyid(page, [{ selector: incStreet, value: incStreetValue }]);
            await this.fillInputbyid(page, [{ selector: incCity, value: incCityValue }]);
            await this.fillInputbyid(page, [{ selector: incZip, value: incZipValue }]);

            // Save button for incorporator - using mapping index 10
            const saveIncorporatorSelector = stateMapping[10]?.online_field_mapping;
            await page.evaluate((selector) => {
                const buttons = Array.from(document.querySelectorAll('button.btn.btn-raised.btn-primary'));
                const targetButton = buttons.find(button => button.textContent.trim() === 'Save');
                if (targetButton) {
                    targetButton.click();
                    console.log('Clicked the Save button');
                } else {
                    console.log('Save button not found');
                }
            }, saveIncorporatorSelector);

            await new Promise(resolve => setTimeout(resolve, 5000));

            // Director input - using mapping indices 12-13
            logger.info('=== FILLING DIRECTOR SECTION ===');
            const addDirectorSelector = stateMapping[12]?.online_field_mapping;
            const buttons = await page.$$('button.btn.btn-raised.btn-primary.form-button.add-row');
            if (buttons.length > 1) {
                await buttons[1].click();
                logger.info('Clicked the Add button for Director');
                // Wait for director form fields to load
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                logger.warn('Add button for Director not found');
            }

            const dirName = payload.Director_Information.Director_Details.keyPersonnelName;
            logger.info(`Director name: ${dirName}`);
            
            if (!dirName) {
                logger.error('Director name is null or undefined');
                throw new Error('Director name not found in payload');
            }
            
            const [firstDir, lastDir] = await this.ra_split(dirName);
            logger.info(`Director first name: "${firstDir}", last name: "${lastDir}"`);
            
            if (!firstDir || !lastDir) {
                logger.error('Failed to split director name properly');
                throw new Error('Failed to split director name');
            }
            
            logger.info(`Filling director first name field "${firstNameSelector}" with value "${firstDir}"`);
            await this.fillInputByName(page, firstNameSelector, firstDir);
            
            logger.info(`Filling director last name field "${lastNameSelector}" with value "${lastDir}"`);
            await this.fillInputByName(page, lastNameSelector, lastDir);

            console.log("Trying to add data in director address");

            // Director address - using mapping indices 26-28
            const dirStreet = stateMapping[26]?.online_field_mapping;
            const dirCity = stateMapping[27]?.online_field_mapping;
            const dirZip = stateMapping[28]?.online_field_mapping;
            
            const dirStreetValue = await this.getSafeValue(payload, stateMapping[26]?.json_key);
            const dirCityValue = await this.getSafeValue(payload, stateMapping[27]?.json_key);
            const dirZipValue = await this.getSafeValue(payload, stateMapping[28]?.json_key);

            await this.fillInputbyid(page, [{ selector: dirStreet, value: dirStreetValue }]);
            await this.fillInputbyid(page, [{ selector: dirCity, value: dirCityValue }]);
            await this.fillInputbyid(page, [{ selector: dirZip, value: dirZipValue }]);

            // Save button for director - using mapping index 13
            const saveDirectorSelector = stateMapping[13]?.online_field_mapping;
            await page.evaluate((selector) => {
                const buttons = Array.from(document.querySelectorAll('button.btn.btn-raised.btn-primary'));
                const targetButton = buttons.find(button => button.textContent.trim() === 'Save');
                if (targetButton) {
                    targetButton.click();
                    console.log('Clicked the Save button');
                } else {
                    console.log('Save button not found');
                }
            }, saveDirectorSelector);

            // Final next button - using mapping index 14
            const finalNextSelector = stateMapping[14]?.online_field_mapping;
            await page.waitForSelector(finalNextSelector, { visible: true });
            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, finalNextSelector);

            const res = "form filled successfully";
            return res;
        } catch (error) {
            logger.error('Error in Idaho For CORP form handler:', error.stack);
            throw new Error(`Idaho For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = IdahoForCORP;