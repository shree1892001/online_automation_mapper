const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');

class AlaskaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }

    async AlaskaForCORP(page, jsonData, payload) {
        try {
            logger.info('Navigating to New York form submission page...');
                        const data = Object.values(jsonData)[0];

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            await this.randomSleep(10000, 20000);
            await page.waitForSelector('a[title="Department of Commerce, Community, & Economic Development"]', { state: 'visible' });
            await this.clickButton(page, 'a[title="Department of Commerce, Community, & Economic Development"]');

            await page.waitForSelector('div.wrap h4.block-title + ul a[href="/web/cbpl/"]', { state: 'visible' });
            await this.clickButton(page, 'div.wrap h4.block-title + ul a[href="/web/cbpl/"]');

            await page.waitForSelector('h4.block-title + div #dnn_ctr1318_HtmlModule_lblContent a[href="/web/cbpl/Corporations.aspx"]', { state: 'visible' });
            await this.clickButton(page, 'h4.block-title + div #dnn_ctr1318_HtmlModule_lblContent a[href="/web/cbpl/Corporations.aspx"]');

            await page.waitForSelector('a[href="/web/cbpl/Corporations/CorpFormsFees/FormsbyEntity.aspx"]', { state: 'visible' });
            await this.clickButton(page, 'a[href="/web/cbpl/Corporations/CorpFormsFees/FormsbyEntity.aspx"]');
            await this.randomSleep(3000, 4000);
            await page.waitForSelector('a.deptUserAccord', { state: 'visible' });
            await page.locator('a.deptUserAccord', { hasText: 'Business Corporations' }).click();

            await page.waitForSelector('a.deptUserAccord');
            await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a.deptUserAccord'));
                const targetLink = links.find(link => link.textContent.includes('Domestic (Alaskan)'));
                if (targetLink) targetLink.click();
            });

            await page.waitForSelector('a[href="/web/cbpl/Corporations/OnlineFilingInstructionsBusCorpArticles.aspx"]', { state: 'visible' });
            await page.click('a[href="/web/cbpl/Corporations/OnlineFilingInstructionsBusCorpArticles.aspx"]');

            await page.waitForSelector('a.deptButton[href="/CBP/Corporation/startpage.aspx?file=CRFIL&entity=BUSC&isforeign=N"]', { state: 'visible' });
            await page.click('a.deptButton[href="/CBP/Corporation/startpage.aspx?file=CRFIL&entity=BUSC&isforeign=N"]');

            const newPagePromise = new Promise((resolve) => page.browser().once('targetcreated', target => resolve(target.page())));
            const newPage = await newPagePromise;

            await this.fillInputByName(newPage, 'ctl00$ContentMain$TextBoxLegalName', payload.Name.Legal_Name);

            const inputData = [{ selector: '#ContentMain_TextAreaPurpose', value: 'Business purpose' }];
            await this.fillInputbyid(newPage, inputData);

            // await new Promise(resolve => setTimeout(resolve, 4000))
            // await this.clickDropdown(newPage, '#ContentMain_DDLNAICS_DDLNAICS', payload.Naics_Code.NC_NAICS_Code);
            // await new Promise(resolve => setTimeout(resolve, 4000))

            
            async function selectDropdownOptionByText(page, selector, textToMatch) {
                try {
                    // Wait for the dropdown to be visible
                    await page.waitForSelector(selector, { visible: true, timeout: 60000 });

                    // Get all available options and their values
                    const optionData = await page.evaluate((sel, text) => {
                        const select = document.querySelector(sel);
                        const options = Array.from(select.options);

                        // Find the option that contains the text we're looking for
                        const matchingOption = options.find(option =>
                            option.text.includes(text)
                        );

                        if (matchingOption) {
                            return {
                                value: matchingOption.value,
                                text: matchingOption.text,
                                found: true
                            };
                        }

                        return { found: false };
                    }, selector, textToMatch);

                    if (!optionData.found) {
                        throw new Error(`No option found containing text: ${textToMatch}`);
                    }

                    // Now select the option using its value (more reliable than typing text)
                    await page.select(selector, optionData.value);

                    logger.info(`Selected option "${optionData.text}" (value: ${optionData.value}) successfully`);
                    return true;
                } catch (error) {
                    logger.error(`Failed to select dropdown option: ${error.message}`);
                    throw error;
                }
            }

            // In your main code:
            await new Promise(resolve => setTimeout(resolve, 4000));
            await selectDropdownOptionByText(
                newPage,
                '#ContentMain_DDLNAICS_DDLNAICS',
                payload.Naics_Code.NAICS_Code
            );
            await new Promise(resolve => setTimeout(resolve, 4000));



            const raFullName = payload.Registered_Agent.keyPersonnelName;
            const [firstName, lastName] = raFullName.split(' ');
            await this.fillInputByName(newPage, 'ctl00$ContentMain$TextBoxAgentFirstName', firstName);
            await this.fillInputByName(newPage, 'ctl00$ContentMain$TextBoxAgentLastName', lastName);

            await newPage.waitForSelector('input[name="ctl00$ContentMain$AgentMailingAddress$TextBoxLine1"]', { state: 'visible' });
            await this.fillInputByName(newPage, 'ctl00$ContentMain$AgentMailingAddress$TextBoxLine1', payload.Registered_Agent.Address.Street_Address);
            await this.randomSleep(1000, 3000);
            await newPage.waitForSelector('input[name="ctl00$ContentMain$AgentMailingAddress$TextBoxLine2"]', { state: 'visible', timeout: 10000 });

            await this.fillInputByName(newPage, 'ctl00$ContentMain$AgentMailingAddress$TextBoxLine2', payload.Registered_Agent.Address['Address_Line_2'] || " ");

            await newPage.waitForSelector('input[name="ctl00$ContentMain$AgentMailingAddress$TextBoxCityState"]', { state: 'visible' });
            await this.fillInputByName(newPage, 'ctl00$ContentMain$AgentMailingAddress$TextBoxCityState', payload.Registered_Agent.Address.City);

            await newPage.waitForSelector('input[name="ctl00$ContentMain$AgentMailingAddress$TextBoxZip"]', { state: 'visible' });
            await this.fillInputByName(newPage, 'ctl00$ContentMain$AgentMailingAddress$TextBoxZip', String(payload.Registered_Agent.Address.Zip_Code));

            await this.clickButton(newPage, '#ContentMain_AgentPhysicalAddress_ButtonCopy');

            await this.fillInputByName(newPage, 'ctl00$ContentMain$EntityMailingAddress$TextBoxLine1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(newPage, 'ctl00$ContentMain$EntityMailingAddress$TextBoxLine2', payload.Principal_Address['Address_Line_2'] || " ");
            await this.fillInputByName(newPage, 'ctl00$ContentMain$EntityMailingAddress$TextBoxCityState', payload.Principal_Address.City);

            await this.clickDropdown(newPage, '#ContentMain_EntityMailingAddress_DDLState', payload.Principal_Address.State);

            await this.fillInputByName(newPage, 'ctl00$ContentMain$EntityMailingAddress$TextBoxZip', String(payload.Principal_Address.Zip_Code));
            await this.clickButton(newPage, '#ContentMain_EntityPhysicalAddress_ButtonCopy');

            await this.clickDropdown(newPage, '#ContentMain_Shares_DDLClass', 'Common');
            await this.fillInputByName(newPage, 'ctl00$ContentMain$Shares$TextBoxAuthorized', String(payload.Stock_Details.Number_Of_Shares));
            await this.clickButton(newPage, '#ContentMain_Shares_ButtonAdd');

            await this.clickButton(newPage, '#ContentMain_Incorporators_ButtonAdd');
            const incFullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [incfirstName, inclastName] = incFullName.split(' ');
            await this.fillInputByName(newPage, 'ctl00$ContentMain$TextBoxFirstName', incfirstName);
            await this.fillInputByName(newPage, 'ctl00$ContentMain$TextBoxLastName', inclastName);
            await this.clickButton(newPage, '#ContentMain_ButtonSave');

            await newPage.waitForSelector('#ContentMain_Signature_CheckBoxIPromise', { visible: true });
            await newPage.click('#ContentMain_Signature_CheckBoxIPromise');

            await this.fillInputByName(newPage, 'ctl00$ContentMain$Signature$TextBoxMyName', incFullName);
            await this.fillInputByName(newPage, 'ctl00$ContentMain$Signature$TextBoxPhone', String(payload.Incorporator_Information.Contact_No));
            await this.clickButton(newPage, '#ContentMain_ButtonProceed');
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in Alaska For CORP form handler:', error.stack);
            throw new Error(`Alaska For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = AlaskaForCORP;
