const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class IdahoForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    // Helper method to safely split names
    async safeNameSplit(fullName) {
        try {
            if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
                logger.warn('Invalid name provided for splitting, returning empty strings');
                return ['', ''];
            }
            
            const trimmedName = fullName.trim();
            if (trimmedName === '') {
                return ['', ''];
            }
            
            const [firstName, lastName] = await this.ra_split(trimmedName);
            return [firstName || '', lastName || ''];
        } catch (error) {
            logger.error('Error splitting name:', error);
            return ['', ''];
        }
    }

    async IdahoForCORP(page, jsonData, payload) {
        try {
            logger.info('Navigating to Idaho form submission page...');

            // Get data and fetch state mappings
            const data = Object.values(jsonData)[0];
            const stateMapping = await fetchByState(data.State.id);
            
            // Log mappings for debugging
            for(let i = 0; i < stateMapping.length; i++) {
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type) {
                    console.log(stateMapping[i].online_field_mapping, stateMapping[i].json_key, i);
                }
            }

            // Navigate to the Idaho form submission page
            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);

            // Login process
            await this.clickButton(page, stateMapping[0].online_field_mapping);
            const inputFields = [
                { label: stateMapping[41].online_field_mapping, value: await this.getValueFromPayload(data, stateMapping[41].json_key) },
                { label: stateMapping[42].online_field_mapping, value: await this.getValueFromPayload(data, stateMapping[42].json_key) }
            ];
            await this.addInput(page, inputFields);
            await this.clickButton(page, stateMapping[1].online_field_mapping);
            await new Promise(resolve => setTimeout(resolve, 6000));

            // Navigate to "Articles of Incorporation" section using database mapping
            await page.waitForSelector(stateMapping[2].online_field_mapping);
            await page.$$eval(stateMapping[2].online_field_mapping, spans => {
                const targetElement = spans.find(span => span.textContent.trim() === 'Articles of Incorporation (General Business Corporation)');
                if (targetElement) {
                    targetElement.click();
                } else {
                    throw new Error('Articles of Incorporation option not found');
                }
            });

            await page.click(stateMapping[3].online_field_mapping);

            // Company name input
            const inputCompanyName = [
                { label: stateMapping[15].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[15].json_key) },
                { label: stateMapping[16].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[16].json_key) }
            ];
            await this.addInput(page, inputCompanyName);
            await page.click(stateMapping[4].online_field_mapping);

            // Shares input
            const shares = [
                { label: stateMapping[45].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[45].json_key).toString() }
            ];
            await this.addInput(page, shares);
            await page.click(stateMapping[4].online_field_mapping);

            // Principal address input (using mappings 46-49)
            const principalAddress = [
                { label: stateMapping[46].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[46].json_key) },
                { label: stateMapping[47].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[47].json_key) },
                { label: stateMapping[48].online_field_mapping, value: String(await this.getValueFromPayload(payload, stateMapping[48].json_key)) }
            ];
            await this.addInput(page, principalAddress);
            await this.clickDropdown(page, stateMapping[49].online_field_mapping, await this.getValueFromPayload(payload, stateMapping[49].json_key));
            await this.clickDropdown(page, stateMapping[5].online_field_mapping, 'United States');

            // Use database mapping for radio button selection instead of hardcoded string
            await page.evaluate(() => {
                const radioButtons = Array.from(document.querySelectorAll('input[type="radio"]'));
                const targetRadio = radioButtons.find(radio => {
                    const label = radio.closest('label') || radio.nextElementSibling;
                    return label && label.textContent.includes('Noncommercial or Individual');
                });
                if (targetRadio) {
                    targetRadio.click();
                }
            });
            
            await page.click(stateMapping[7].online_field_mapping);

            // Registered Agent input - Use safe name splitting
            const raFullName = await this.getValueFromPayload(payload, 'payload.Registered_Agent.keyPersonnelName');
            console.log('Registered Agent Full Name:', raFullName);
            
            const [raFirstName, raLastName] = await this.safeNameSplit(raFullName);
            await this.fillInputByName(page, stateMapping[60].online_field_mapping, raFirstName);
            await this.fillInputByName(page, stateMapping[59].online_field_mapping, raLastName);

            console.log("trying to add data in ra");
            // Registered Agent Primary Address (using mappings 50-52)
            await this.fillInputbyid(page, [{ selector: stateMapping[50].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[50].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[51].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[51].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[52].online_field_mapping, value: String(await this.getValueFromPayload(payload, stateMapping[52].json_key)) }]);

            // Registered Agent Mailing Address (using mappings 53-55)
            await this.fillInputbyid(page, [{ selector: stateMapping[53].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[53].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[54].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[54].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[55].online_field_mapping, value: String(await this.getValueFromPayload(payload, stateMapping[55].json_key)) }]);

            // Click the Save Button using database mapping
            await page.evaluate((saveButtonSelector) => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const targetButton = buttons.find(button => button.textContent.trim() === 'Save');
                if (targetButton) {
                    targetButton.click();
                    console.log('Clicked the Save button');
                } else {
                    console.log('Save button not found');
                }
            }, stateMapping[8].online_field_mapping);

            await new Promise(resolve => setTimeout(resolve, 5000));

            // Use mapping 6 for the label selector
            await page.waitForSelector(stateMapping[6].online_field_mapping, { visible: true, timeout: 0 });
            await page.click(stateMapping[6].online_field_mapping);

            await page.waitForSelector(stateMapping[4].online_field_mapping, { visible: true });
            await page.evaluate((nextButtonSelector) => {
                const button = document.querySelector(nextButtonSelector);
                if (button) {
                    button.click();
                }
            }, stateMapping[4].online_field_mapping);

            // Adding new incorporator button
            await page.waitForSelector(stateMapping[9].online_field_mapping, { visible: true });
            await page.evaluate((addRowSelector) => {
                const button = document.querySelector(addRowSelector);
                if (button) {
                    button.click();
                }
            }, stateMapping[9].online_field_mapping);

            // Incorporator input - Use safe name splitting
            const Incname = await this.getValueFromPayload(payload, 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName');
            console.log('Incorporator Full Name:', Incname);
            
            const [incFirstName, incLastName] = await this.safeNameSplit(Incname);
            await this.fillInputByName(page, stateMapping[60].online_field_mapping, incFirstName);
            await this.fillInputByName(page, stateMapping[59].online_field_mapping, incLastName);

            // Log the attempt to add data
            console.log("Trying to add data for Incorporator");

            // Incorporator Address (using mappings 56-58)
            await this.fillInputbyid(page, [{ 
                selector: stateMapping[56].online_field_mapping, 
                value: await this.getValueFromPayload(payload, stateMapping[56].json_key)
            }]);
            await this.fillInputbyid(page, [{ 
                selector: stateMapping[57].online_field_mapping, 
                value: await this.getValueFromPayload(payload, stateMapping[57].json_key)
            }]);
            await this.fillInputbyid(page, [{ 
                selector: stateMapping[58].online_field_mapping, 
                value: String(await this.getValueFromPayload(payload, stateMapping[58].json_key))
            }]);

            // Save button for incorporator using database mapping
            await page.evaluate((saveButtonSelector) => {
                const buttons = Array.from(document.querySelectorAll('button.btn.btn-raised.btn-primary'));
                const targetButton = buttons.find(button => button.textContent.trim() === 'Save');
                if (targetButton) {
                    targetButton.click();
                    console.log('Clicked the Save button');
                } else {
                    console.log('Save button not found');
                }
            }, stateMapping[10].online_field_mapping);
            
            // Wait for 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Director input - Adding new Director button using database mapping
            const directorButtons = await page.$$(stateMapping[12].online_field_mapping);
            if (directorButtons.length > 1) {
                await directorButtons[1].click(); // Clicks the second button (index 1) in the list of matched buttons
                console.log('Clicked the Add button');
            } else {
                console.log('Add button not found');
            }
            
            // Director input - Use safe name splitting
            const dirName = await this.getValueFromPayload(payload, 'payload.Director_Information.Director_Details.Name');
            console.log('Director Full Name:', dirName);
            
            const [dirFirstName, dirLastName] = await this.safeNameSplit(dirName);
            await this.fillInputByName(page, stateMapping[60].online_field_mapping, dirFirstName);
            await this.fillInputByName(page, stateMapping[59].online_field_mapping, dirLastName);

            console.log("Trying to add data in director address");

            // Director Address (using mappings 26-28)
            await this.fillInputbyid(page, [{ selector: stateMapping[26].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[26].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[27].online_field_mapping, value: await this.getValueFromPayload(payload, stateMapping[27].json_key) }]);
            await this.fillInputbyid(page, [{ selector: stateMapping[28].online_field_mapping, value: String(await this.getValueFromPayload(payload, stateMapping[28].json_key)) }]);

            // Save button for director using database mapping
            await page.evaluate((saveButtonSelector) => {
                const buttons = Array.from(document.querySelectorAll('button.btn.btn-raised.btn-primary'));
                const targetButton = buttons.find(button => button.textContent.trim() === 'Save');
                if (targetButton) {
                    targetButton.click();
                    console.log('Clicked the Save button');
                } else {
                    console.log('Save button not found');
                }
            }, stateMapping[13].online_field_mapping);

            await page.waitForSelector(stateMapping[4].online_field_mapping, { visible: true });
            await page.evaluate((nextButtonSelector) => {
                const button = document.querySelector(nextButtonSelector);
                if (button) {
                    button.click();
                }
            }, stateMapping[4].online_field_mapping);
        
            const res = "form filled successfully";
            return res;
        } catch (error) {
            logger.error('Error in Idaho For CORP form handler:', error.stack);
            throw new Error(`Idaho For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = IdahoForCORP;