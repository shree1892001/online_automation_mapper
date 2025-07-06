const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class IndianaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    async IndianaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to Indiana LLC form submission page...');
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            for(let i=0;i<stateMapping.length;i++){
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                    console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
                }
            }

            const url = data.State.stateUrl;

            await this.navigateToPage(page, url);

            // Ensure elements are available before interacting with them
            await page.waitForSelector('input[name="username"]', { visible: true });
            await this.fillInputByName(page, 'username', data.State.filingWebsiteUsername);
            await this.clickButton(page, 'span.icon-button__text.icon-button__text--transform-right');

            await page.waitForSelector('input[name="password"]', { visible: true });
            await this.fillInputByName(page, 'password', data.State.filingWebsitePassword);
            await this.clickButton(page, 'span.icon-button__text.icon-button__text--transform-right');

            await page.waitForSelector('a[href="/portal/services"]', { visible: true });
            await this.clickButton(page, 'a[href="/portal/services"]');
            await this.randomSleep();

            const selector = '[aria-label="Go to INBiz"]';
            await page.waitForSelector(selector, { visible: true});
            await page.click(selector);
            console.log('Clicked on the INBiz element');

            const newPagePromise = new Promise((resolve) =>
                page.browser().once('targetcreated', (target) => resolve(target.page()))
            );
            const newPage = await newPagePromise;

            await newPage.waitForSelector('a[title="START A NEW BUSINESS"]', { visible: true });
            await this.clickButton(newPage, 'a[title="START A NEW BUSINESS"]');

            await newPage.waitForSelector('input[type="button"][value="Next"]', { visible: true });
            await this.clickButton(newPage, 'input[type="button"][value="Next"]');
            await this.clickButton(newPage, 'input[type="button"][value="Frequent User"]');
            await Promise.all([
                new Promise((resolve) => setTimeout(resolve, 5000)),
                newPage.waitForSelector('input[name="BusinessInfo.IsBusinessNameReserved"][value="false"]', { visible: true })
            ]);
            
            await newPage.click('#\\37');
            await this.clickButton(newPage, 'input[type="submit"][value="Continue"]');

            await newPage.waitForSelector('input[name="BusinessInfo.IsBusinessNameReserved"][value="false"]', { visible: true });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await newPage.click('input[name="BusinessInfo.IsBusinessNameReserved"][value="false"]');
            
            await this.fillInputByName(newPage, 'BusinessInfo.BusinessName', payload.Name.Legal_Name);
            await this.clickButton(newPage, '#btnCheckAvailability');
            await newPage.waitForSelector('#btnNextButton', { visible: true });
            await this.clickButton(newPage, '#btnNextButton');

            await newPage.waitForSelector('input[name="BusinessInfo.BusinessEmail"]', { visible: true});
            await this.fillInputByName(newPage, 'BusinessInfo.BusinessEmail', payload.Registered_Agent.EmailId);

            await this.fillInputByName(newPage, 'BusinessInfo.ConfirmBusinessEmail', payload.Registered_Agent.EmailId);
            await this.fillInputByName(newPage, 'BusinessInfo.PrincipalOfficeAddress.Zip5', String(payload.Principal_Address.Zip_Code));

            await newPage.click('input[name="BusinessInfo.PrincipalOfficeAddress.StreetAddress1"]');
            await Promise.all([
                new Promise((resolve) => setTimeout(resolve, 3000)),
                this.fillInputByName(newPage, 'BusinessInfo.PrincipalOfficeAddress.StreetAddress1', payload.Principal_Address.Street_Address)
            ]);
            await this.fillInputByName(newPage, 'BusinessInfo.PrincipalOfficeAddress.StreetAddress2', payload.Principal_Address['Address_Line_2'] || " ");
            await newPage.waitForSelector('input[type="button"][value="Next"]', { visible: true});
            await this.clickButton(newPage, 'input[type="button"][value="Next"]');
            
            await Promise.all([
                new Promise((resolve) => setTimeout(resolve, 5000)),
                newPage.waitForSelector('input[name="rbtnAgentType"][value="Individual"]', { visible: true })
            ]);
            await newPage.click('input[name="rbtnAgentType"][value="Individual"]');
            await this.clickButton(newPage, '#btnCreate');

            await this.fillInputByName(newPage, 'RegisteredAgent.AgentName', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(newPage, 'RegisteredAgent.EmailAddress', payload.Registered_Agent.EmailId);
            await this.fillInputByName(newPage, 'RegisteredAgent.ConfirmEmailAddress', payload.Registered_Agent.EmailId);
            await this.fillInputByName(newPage, 'RegisteredAgent.PrincipalAddress.Zip5', String(payload.Registered_Agent.Address.Zip_Code));

            await newPage.click('input[name="RegisteredAgent.PrincipalAddress.StreetAddress1"]');
            await Promise.all([
                new Promise((resolve) => setTimeout(resolve, 3000)),
                this.fillInputByName(newPage, 'RegisteredAgent.PrincipalAddress.StreetAddress1', payload.Registered_Agent.Address.Street_Address)
            ]);
            await this.clickButton(newPage, '#btnSaveNewAgent');
            await Promise.all([
                new Promise((resolve) => setTimeout(resolve, 3000)),
                newPage.waitForSelector('input[type="submit"][value="Next"]', { visible: true})
            ]);
            await this.clickButton(newPage, 'input[type="submit"][value="Next"]');

            await newPage.waitForSelector('input[name="PrincipalManagementInfo.IsManagerManaged"][value="false"]', { visible: true });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await this.waitForTimeout(3000)
            await newPage.click('input[name="PrincipalManagementInfo.IsManagerManaged"][value="false"]');
            await this.randomSleep();
            await this.clickButton(newPage, '#btnNext');
            await newPage.waitForSelector('input[type="submit"][value="Next"]', { visible: true});
            await this.clickButton(newPage, 'input[type="submit"][value="Next"]');
            const res = "form filled successfully";
            return res
            
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
}

module.exports = IndianaForLLC;
