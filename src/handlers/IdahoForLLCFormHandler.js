const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class IdahoForLLC extends BaseFormHandler {
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

    async IdahoForLLC(page, jsonData, payload) {
        try {
            logger.info('Starting Idaho LLC form submission...');
            
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
            logger.info(`Navigating to URL: ${url}`);
            await this.navigateToPage(page, url);
            
            // Login process - using mapping indices 0, 41-42
            await this.clickButton(page, stateMapping[0].online_field_mapping);
            
            const inputFields = [
                { label: stateMapping[41].online_field_mapping, value: data.State.filingWebsiteUsername },
                { label: stateMapping[42].online_field_mapping, value: data.State.filingWebsitePassword }
            ];
            await this.addInput(page, inputFields);
            
            await this.clickButton(page, stateMapping[1].online_field_mapping);
            logger.info('Login submitted, waiting for page to load...');
            await new Promise(resolve => setTimeout(resolve, 8000));
            
            // Wait for page to be fully loaded
            await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15000 });

            // Navigate to "Certificate of Organization" section - using mapping index 2
            // For LLC forms, we need to look for the correct LLC selector
            let certificateSelector = stateMapping[2].online_field_mapping;
            logger.info(`Looking for certificate selector: ${certificateSelector}`);
            
            // Fix invalid CSS selectors that contain text() functions
            if (certificateSelector && certificateSelector.includes('text()')) {
                logger.warn(`Invalid CSS selector detected: ${certificateSelector}`);
                // Extract the base selector before the text() part
                const baseSelector = certificateSelector.split('[')[0];
                certificateSelector = baseSelector;
                logger.info(`Using base selector: ${certificateSelector}`);
            }
            
            try {
                await page.waitForSelector(certificateSelector, { timeout: 10000 });
                logger.info('Certificate selector found, looking for LLC option');
                
                const spans = await page.$$(certificateSelector);
                logger.info(`Found ${spans.length} span.title elements`);
                
                let found = false;
                for (let i = 0; i < spans.length; i++) {
                    const text = await spans[i].evaluate(el => el.textContent.trim());
                    logger.info(`Span ${i} text: "${text}"`);
                    
                    // Look for LLC-specific options
                    if (text.includes('Certificate of Organization') || text.includes('Limited Liability Company') || text.includes('LLC')) {
                        await spans[i].click();
                        found = true;
                        logger.info(`Clicked on LLC option: "${text}"`);
                        break;
                    }
                }
                
                if (!found) {
                    logger.warn('LLC option not found, trying alternative approach');
                    // Try clicking on any span that contains LLC-related text
                    for (let i = 0; i < spans.length; i++) {
                        const text = await spans[i].evaluate(el => el.textContent.trim());
                        if (text.includes('Certificate') || text.includes('Organization') || text.includes('LLC')) {
                            await spans[i].click();
                            logger.info(`Clicked on alternative option: "${text}"`);
                            break;
                        }
                    }
                }
            } catch (error) {
                logger.error(`Error finding certificate selector: ${error.message}`);
                // Try alternative selectors for LLC forms
                const alternativeSelectors = [
                    'span.title',
                    '.title',
                    '[class*="title"]'
                ];
                
                for (const altSelector of alternativeSelectors) {
                    try {
                        logger.info(`Trying alternative selector: ${altSelector}`);
                        await page.waitForSelector(altSelector, { timeout: 5000 });
                        const elements = await page.$$(altSelector);
                        
                        for (const element of elements) {
                            const text = await element.evaluate(el => el.textContent.trim());
                            if (text.includes('Certificate of Organization') || text.includes('Limited Liability Company') || text.includes('LLC')) {
                                await element.click();
                                logger.info(`Clicked on LLC option: "${text}"`);
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
            await this.clickButton(page, stateMapping[3].online_field_mapping);

            // Select "Limited Liability Company" radio button
            await this.selectRadioButtonByLabel(page, 'Limited Liability Company');

            // Company name input - using mapping indices 15-16
            logger.info('=== FILLING COMPANY NAME SECTION ===');
            const inputCompanyName = [
                { label: stateMapping[15].online_field_mapping, value: await getSafeValue(stateMapping[15].json_key) },
                { label: stateMapping[16].online_field_mapping, value: await getSafeValue(stateMapping[16].json_key) }
            ];
            await this.addInput(page, inputCompanyName);
            
            // Next button - using mapping index 4
            await this.clickButton(page, stateMapping[4].online_field_mapping);

            // Principal address input - using mapping indices 17-21
            logger.info('=== FILLING PRINCIPAL ADDRESS SECTION ===');
            const principalAddress = [
                { label: stateMapping[17].online_field_mapping, value: await getSafeValue(stateMapping[17].json_key) },
                { label: stateMapping[18].online_field_mapping, value: await getSafeValue(stateMapping[18].json_key) },
                { label: stateMapping[19].online_field_mapping, value: await getSafeValue(stateMapping[19].json_key) }
            ];
            await this.addInput(page, principalAddress);
            await this.clickDropdown(page, stateMapping[20].online_field_mapping, await getSafeValue(stateMapping[20].json_key));
            
            // Country dropdown - using mapping index 21
            if (stateMapping[21].json_key && stateMapping[21].json_key !== 'null') {
                await this.clickDropdown(page, stateMapping[21].online_field_mapping, await getSafeValue(stateMapping[21].json_key));
            } else {
                await this.clickDropdown(page, stateMapping[21].online_field_mapping, 'United States');
            }

            // Mailing address input - using mapping indices 22-25
            logger.info('=== FILLING MAILING ADDRESS SECTION ===');
            const mailingAddress = [
                { label: stateMapping[22].online_field_mapping, value: await getSafeValue(stateMapping[22].json_key) },
                { label: stateMapping[23].online_field_mapping, value: await getSafeValue(stateMapping[23].json_key) },
                { label: stateMapping[24].online_field_mapping, value: await getSafeValue(stateMapping[24].json_key) }
            ];
            await this.addInput(page, mailingAddress);
            await this.clickDropdown(page, stateMapping[25].online_field_mapping, await getSafeValue(stateMapping[25].json_key));

            // Next button to proceed to Registered Agent section
            await this.clickButton(page, stateMapping[4].online_field_mapping);
            logger.info('Clicked next button to proceed to Registered Agent section');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Wait for page to load
            await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15000 });

            // Select "Noncommercial or Individual" radio button
            await this.selectRadioButtonByLabel(page, 'Noncommercial or Individual');
            
            // Add button - using mapping index 7
            const addButtonSelector = stateMapping[7].online_field_mapping;
            logger.info(`Looking for add button with selector: ${addButtonSelector}`);
            
            try {
                await page.waitForSelector(addButtonSelector, { visible: true, timeout: 10000 });
                await page.click(addButtonSelector);
                logger.info('Add button clicked successfully');
            } catch (error) {
                logger.error(`Error clicking add button with selector "${addButtonSelector}": ${error.message}`);
                throw new Error(`Could not find add button with selector: ${addButtonSelector}`);
            }

            // Registered Agent input - using mapping indices 29-34
            const raFullName = payload.Registered_Agent.keyPersonnelName;
            console.log('RA Full Name:', raFullName);
            const [firstName, lastName] = await this.ra_split(raFullName);
            
            // First and Last name fields - using mapping indices 59-60
            await this.fillInputByName(page, stateMapping[60].online_field_mapping, firstName);
            await this.fillInputByName(page, stateMapping[59].online_field_mapping, lastName);

            console.log("Trying to add data in RA");
            
            // RA Primary Address - using mapping indices 29-31
            await this.fillInputbyid(page, [{ selector: stateMapping[29].online_field_mapping, value: await getSafeValue(stateMapping[29].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[30].online_field_mapping, value: await getSafeValue(stateMapping[30].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[31].online_field_mapping, value: await getSafeValue(stateMapping[31].json_key) }]);

            // RA Mailing Address - using mapping indices 32-34
            await this.fillInputbyid(page, [{ selector: stateMapping[32].online_field_mapping, value: await getSafeValue(stateMapping[32].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[33].online_field_mapping, value: await getSafeValue(stateMapping[33].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[34].online_field_mapping, value: await getSafeValue(stateMapping[34].json_key) }]);

            // Save button - using mapping index 8
            const saveButtonSelector = stateMapping[8].online_field_mapping;
            logger.info(`Looking for save button with selector: ${saveButtonSelector}`);
            
            // Debug: Log all available buttons on the current step
            const availableButtonsOnStep = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('button')).map(btn => ({
                    text: btn.textContent.trim(),
                    class: btn.className,
                    id: btn.id,
                    visible: btn.offsetParent !== null
                }));
            });
            logger.info('Available buttons on current step:', availableButtonsOnStep);
            
            try {
                await page.waitForSelector(saveButtonSelector, { visible: true, timeout: 10000 });
                await page.click(saveButtonSelector);
                logger.info('Save button clicked successfully');
            } catch (error) {
                logger.error(`Error clicking save button with selector "${saveButtonSelector}": ${error.message}`);
                
                // Try alternative approach - find button by text from database
                try {
                    const saveButtonText = await this.getSafeValue(payload, stateMapping[8].json_key) || 'Save';
                    logger.info(`Trying to find save button by text: "${saveButtonText}"`);
                    
                    await page.evaluate((text) => {
                        const buttons = Array.from(document.querySelectorAll('button'));
                        const targetButton = buttons.find(button => button.textContent.trim() === text);
                        if (targetButton) {
                            targetButton.click();
                            console.log(`Clicked the ${text} button`);
                        } else {
                            console.log(`${text} button not found`);
                        }
                    }, saveButtonText);
                    logger.info(`Save button clicked using text search: ${saveButtonText}`);
                } catch (textError) {
                    logger.error(`Text search for save button also failed: ${textError.message}`);
                    
                    // Try alternative selectors
                    const alternativeSelectors = [
                        'button[text()="Save"]',
                        'button.btn.btn-primary',
                        'button.btn.btn-raised.btn-primary',
                        'button[class*="save"]',
                        'button[class*="btn-primary"]'
                    ];
                    
                    let clicked = false;
                    for (const altSelector of alternativeSelectors) {
                        try {
                            logger.info(`Trying alternative selector: ${altSelector}`);
                            await page.waitForSelector(altSelector, { visible: true, timeout: 5000 });
                            await page.click(altSelector);
                            logger.info(`Successfully clicked button with alternative selector: ${altSelector}`);
                            clicked = true;
                            break;
                        } catch (altError) {
                            logger.warn(`Alternative selector ${altSelector} failed: ${altError.message}`);
                        }
                    }
                    
                    if (!clicked) {
                        // Try clicking any button that contains "Save" text
                        try {
                            await page.evaluate(() => {
                                const buttons = Array.from(document.querySelectorAll('button'));
                                const saveButton = buttons.find(button => 
                                    button.textContent.trim().toLowerCase().includes('save')
                                );
                                if (saveButton) {
                                    saveButton.click();
                                    console.log('Clicked save button found by text search');
                                } else {
                                    console.log('No save button found by text search');
                                }
                            });
                            logger.info('Save button clicked using text search fallback');
                        } catch (fallbackError) {
                            logger.error(`All save button attempts failed: ${fallbackError.message}`);
                            throw new Error(`Could not find or click save button. Available buttons: ${JSON.stringify(availableButtonsOnStep)}`);
                        }
                    }
                }
            }

            await new Promise(resolve => setTimeout(resolve, 5000));

            // Label for attribute - using mapping index 6
            const labelForAttribute = stateMapping[6].online_field_mapping;
            
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

            await page.waitForSelector(stateMapping[4].online_field_mapping, { visible: true });
            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, stateMapping[4].online_field_mapping);

            // Adding new governor button - using mapping index 9
            const addGovernorSelector = stateMapping[9].online_field_mapping;
            logger.info(`Looking for add governor button with selector: ${addGovernorSelector}`);
            
            try {
                await page.waitForSelector(addGovernorSelector, { visible: true, timeout: 10000 });
                await page.click(addGovernorSelector);
                logger.info('Add governor button clicked successfully');
            } catch (error) {
                logger.error(`Error clicking add governor button with selector "${addGovernorSelector}": ${error.message}`);
                throw new Error(`Could not find add governor button with selector: ${addGovernorSelector}`);
            }

            // Governor input - using mapping indices 35-38
            const govName = payload.Governor_Information.GI_Name;
            const [firstGov, lastGov] = await this.ra_split(govName);
            await this.fillInputByName(page, stateMapping[60].online_field_mapping, firstGov);
            await this.fillInputByName(page, stateMapping[59].online_field_mapping, lastGov);

            console.log("Trying to add data for Governor");

            await this.fillInputbyid(page, [{ selector: stateMapping[35].online_field_mapping, value: await getSafeValue(stateMapping[35].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[36].online_field_mapping, value: await getSafeValue(stateMapping[36].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[38].online_field_mapping, value: await getSafeValue(stateMapping[38].json_key) }]);

            // Governor state dropdown - using mapping index 39
            if (stateMapping[39].json_key && stateMapping[39].json_key !== 'null') {
                await this.clickDropdown(page, stateMapping[39].online_field_mapping, await getSafeValue(stateMapping[39].json_key));
            } else {
                await this.clickDropdown(page, stateMapping[39].online_field_mapping, 'ID');
            }

            // Governor country dropdown - using mapping index 40
            if (stateMapping[40].json_key && stateMapping[40].json_key !== 'null') {
                await this.clickDropdown(page, stateMapping[40].online_field_mapping, await getSafeValue(stateMapping[40].json_key));
            } else {
                await this.clickDropdown(page, stateMapping[40].online_field_mapping, 'United States');
            }

            // Save button for governor - using mapping index 10
            const saveGovernorSelector = stateMapping[10].online_field_mapping;
            logger.info(`Looking for save governor button with selector: ${saveGovernorSelector}`);
            
            try {
                await page.waitForSelector(saveGovernorSelector, { visible: true, timeout: 10000 });
                await page.click(saveGovernorSelector);
                logger.info('Save governor button clicked successfully');
            } catch (error) {
                logger.error(`Error clicking save governor button with selector "${saveGovernorSelector}": ${error.message}`);
                
                // Try alternative approach - find button by text from database
                try {
                    const saveGovernorButtonText = await this.getSafeValue(payload, stateMapping[10].json_key) || 'Save';
                    logger.info(`Trying to find save governor button by text: "${saveGovernorButtonText}"`);
                    
                    await page.evaluate((text) => {
                        const buttons = Array.from(document.querySelectorAll('button'));
                        const targetButton = buttons.find(button => button.textContent.trim() === text);
                        if (targetButton) {
                            targetButton.click();
                            console.log(`Clicked the ${text} button`);
                        } else {
                            console.log(`${text} button not found`);
                        }
                    }, saveGovernorButtonText);
                    logger.info(`Save governor button clicked using text search: ${saveGovernorButtonText}`);
                } catch (textError) {
                    logger.error(`Text search for save governor button also failed: ${textError.message}`);
                    
                    // Try alternative selectors
                    const alternativeSelectors = [
                        'button[text()="Save"]',
                        'button.btn.btn-primary',
                        'button.btn.btn-raised.btn-primary',
                        'button[class*="save"]',
                        'button[class*="btn-primary"]'
                    ];
                    
                    let clicked = false;
                    for (const altSelector of alternativeSelectors) {
                        try {
                            logger.info(`Trying alternative selector for governor: ${altSelector}`);
                            await page.waitForSelector(altSelector, { visible: true, timeout: 5000 });
                            await page.click(altSelector);
                            logger.info(`Successfully clicked governor button with alternative selector: ${altSelector}`);
                            clicked = true;
                            break;
                        } catch (altError) {
                            logger.warn(`Alternative selector ${altSelector} failed: ${altError.message}`);
                        }
                    }
                    
                    if (!clicked) {
                        // Try clicking any button that contains "Save" text
                        try {
                            await page.evaluate(() => {
                                const buttons = Array.from(document.querySelectorAll('button'));
                                const saveButton = buttons.find(button => 
                                    button.textContent.trim().toLowerCase().includes('save')
                                );
                                if (saveButton) {
                                    saveButton.click();
                                    console.log('Clicked save governor button found by text search');
                                } else {
                                    console.log('No save governor button found by text search');
                                }
                            });
                            logger.info('Save governor button clicked using text search fallback');
                        } catch (fallbackError) {
                            logger.error(`All save governor button attempts failed: ${fallbackError.message}`);
                            throw new Error(`Could not find or click save governor button`);
                        }
                    }
                }
            }

            await new Promise(resolve => setTimeout(resolve, 5000));

            // Final next button - using mapping index 14
            await page.waitForSelector(stateMapping[14].online_field_mapping, { visible: true });
            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, stateMapping[14].online_field_mapping);
         
            const res = "form filled successfully";
            return res;
        } catch (error) {
            logger.error('Error in Idaho LLC form handler:', error.stack);
            throw new Error(`Idaho LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = IdahoForLLC;
