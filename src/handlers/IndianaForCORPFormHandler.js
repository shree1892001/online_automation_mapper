const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class IndianaForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async IndianaForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to Indiana form submission page...');
            console.log( payload.Officer_Information)
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            for(let i=0;i<stateMapping.length;i++){
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                    console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
                }
            }

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            try {
                await page.waitForSelector('input[name="username"]', { visible: true });
                await this.fillInputByName(page, 'username', data.State.filingWebsiteUsername);
                await this.clickButton(page, 'span.icon-button__text.icon-button__text--transform-right');
                await page.waitForSelector('input[name="password"]', { visible: true });
                await this.fillInputByName(page, 'password', data.State.filingWebsitePassword);             
                const errorMessageSelector = '.alert.alert--alert .alert__content'; // Selector for the error message
                const errorMessageElement = await page.$(errorMessageSelector);

                if (errorMessageElement) {
                    const errorMessage = await page.evaluate(el => el.textContent, errorMessageElement);
                    if (errorMessage.trim() === 'Invalid email or password') {
                        throw new Error('Login failed: Invalid email or password');
                    }
                }


                console.log('Login successful!');                
            } catch (error) {
                console.error('An error occurred during login:', error.message);
            }
            // Click the button and the link
            await this.clickButton(page, 'span.icon-button__text.icon-button__text--transform-right');
            await page.waitForSelector('a[href="/portal/services"]', { visible: true });
            await this.clickButton(page, 'a[href="/portal/services"]');
            await this.randomSleep();

            // Click the link using aria-label
            const selector = '[aria-label="Go to INBiz"]';
            await page.waitForSelector(selector, { visible: true});
            await page.click(selector); // Click the element
            console.log('Clicked on the INBiz element');

            // Wait for the new tab to open
            const newPagePromise = new Promise((resolve) => page.browser().once('targetcreated', target => resolve(target.page())));

            // Switch context to the new tab
            const newPage = await newPagePromise; // Wait for the new page to open
            await newPage.waitForSelector('a[title="START A NEW BUSINESS"]', { visible: true });
            await this.clickButton(newPage, 'a[title="START A NEW BUSINESS"]');
            await newPage.waitForSelector('input[type="button"][value="Next"]', { visible: true });
            await this.clickButton(newPage, 'input[type="button"][value="Next"]');
            await this.clickButton(newPage, 'input[type="button"][value="Frequent User"]');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await newPage.click('#\\35');
            await newPage.waitForSelector('input[type="submit"][value="Continue"]', { visible: true });
            await this.clickButton(newPage, 'input[type="submit"][value="Continue"]');
            await new Promise(resolve => setTimeout(resolve, 5000))
            await newPage.waitForSelector('input[name="BusinessInfo.IsBusinessNameReserved"][value="false"]', { visible: true });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await newPage.click('input[name="BusinessInfo.IsBusinessNameReserved"][value="false"]');
            await this.fillInputByName(newPage, 'BusinessInfo.BusinessName', payload.Name.Legal_Name);
            await this.clickButton(newPage, '#btnCheckAvailability');
            await this.clickButton(newPage, '#btnNextButton');
            await this.fillInputByName(newPage, 'BusinessInfo.BusinessEmail', payload.Registered_Agent.EmailId);
            await this.fillInputByName(newPage, 'BusinessInfo.ConfirmBusinessEmail', payload.Registered_Agent.EmailId);
            await this.fillInputByName(newPage, 'BusinessInfo.PrincipalOfficeAddress.Zip5', String(payload.Principal_Address.Zip_Code));
            await newPage.click('input[name="BusinessInfo.PrincipalOfficeAddress.StreetAddress1"]');
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.fillInputByName(newPage, 'BusinessInfo.PrincipalOfficeAddress.StreetAddress1', payload.Principal_Address.Street_Address);
            await this.fillInputByName(newPage, 'BusinessInfo.PrincipalOfficeAddress.StreetAddress2', payload.Principal_Address['Address_Line_2'] || " ");
            await this.fillInputByName(newPage, 'BusinessInfo.AuthorizedShares', String(payload.Stock_Details.Number_Of_Shares)); 
            await newPage.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });          
            await this.clickButton(newPage, 'input[type="button"][value="Next"]');
            await new Promise(resolve => setTimeout(resolve, 5000))
            const agentTypeElement = await newPage.$('input[name="rbtnAgentType"][value="Individual"]');
            if (agentTypeElement) {
                await newPage.click('input[name="rbtnAgentType"][value="Individual"]');
            } else {
                await this.clickButton(newPage, 'input[type="button"][value="Next"]');
            }
            await this.clickButton(newPage, '#btnCreate');
            await this.fillInputByName(newPage, 'RegisteredAgent.AgentName', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(newPage, 'RegisteredAgent.EmailAddress', payload.Registered_Agent.EmailId);
            await this.fillInputByName(newPage, 'RegisteredAgent.ConfirmEmailAddress', payload.Registered_Agent.EmailId);
            await this.fillInputByName(newPage, 'RegisteredAgent.PrincipalAddress.Zip5', String(payload.Registered_Agent.Address.Zip_Code));
            await newPage.click('input[name="RegisteredAgent.PrincipalAddress.StreetAddress1"]');
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.fillInputByName(newPage, 'RegisteredAgent.PrincipalAddress.StreetAddress1', payload.Registered_Agent.Address.Street_Address);
            await this.clickButton(newPage, '#btnSaveNewAgent');
            await this.clickButton(newPage, 'input[type="submit"][value="Next"]');

            await new Promise((resolve) => setTimeout(resolve, 6000));
            const incfullName = payload.Incorporator_Information.Incorporator_Details.keyPersonnelName;
            const [incfirstName, inclastName] = incfullName.split(' ');
            await this.fillInputByName(newPage, 'IncorporatorInfo.FirstName',incfirstName );
            await this.fillInputByName(newPage, 'IncorporatorInfo.LastName',inclastName );
            await this.fillInputByName(newPage, 'IncorporatorInfo.PrincipalAddress.Zip5',String(payload.Incorporator_Information.Address.Zip_Code));
            await newPage.click('input[name="IncorporatorInfo.PrincipalAddress.StreetAddress1"]');
            await new Promise(resolve => setTimeout(resolve, 3000))
            await this.fillInputByName(newPage, 'IncorporatorInfo.PrincipalAddress.StreetAddress1', payload.Incorporator_Information.Address.Street_Address);
            await newPage.click('#btnAdd');
            await newPage.waitForSelector('input[type="submit"][value="Next"]', { visible: true });
            await new Promise(resolve => setTimeout(resolve, 1000))
            await newPage.click('input[type="submit"][value="Next"]');
            await newPage.waitForSelector('input[type="submit"][value="Next"]', { visible: true });
            await newPage.click('input[type="submit"][value="Next"]');
            await this.clickButton(newPage, '#Next');
            const res = "form filled successfully";
            return res
    
        } catch (error) {
            logger.error('Error in Indiana For CORP form handler:', error.stack);
            throw new Error(`Indiana For CORP form submission failed: ${error.message}`);
        }
    }
    async fillInputByCSSSelector(page, cssSelector, value) {
        try {
            // Wait for the input field to be visible using CSS selector
            await page.waitForSelector(cssSelector, { visible: true, timeout: 0 });
            
            // Type the value into the input field
            await page.type(cssSelector, value, { delay: 100 });
            console.log(`Filled input at CSS selector "${cssSelector}" with value: "${value}"`);
        } catch (error) {
            console.error(`Error filling input at CSS selector "${cssSelector}":`, error.message);
        }
    }
    async selectRadioButtonByNameAndValue(page, name, value) {
        try {
            // Wait for the radio button to be visible
            await page.waitForSelector(`input[type="radio"][name="${name}"][value="${value}"]`, { visible: true, timeout: 0 });
    
            // Click the radio button
            await page.click(`input[type="radio"][name="${name}"][value="${value}"]`);
            console.log(`Successfully selected radio button with name: "${name}" and value: "${value}"`);
        } catch (error) {
            console.error(`Error selecting radio button with name "${name}" and value "${value}":`, error);
        }
    }
    
    
}

module.exports = IndianaForCORP;


