const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class IllinoisForCORP extends BaseFormHandler {
    constructor() {
        super();
    }
    async IllinoisForCORP(page,jsonData,payload) {
        try {
            logger.info('Navigating to New York form submission page...');
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            for(let i=0;i<stateMapping.length;i++){
                if(data.orderType === stateMapping[0].order_type || data.orderFullDesc === stateMapping[0].entity_type){
                    console.log(stateMapping[i].online_field_mapping,stateMapping[i].json_key,i);
                }
            }

            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            //select corp
            await this.clickOnLinkByText(page, 'Incorporate a Corporation');
            //add llc name
            await this.fillInputByName(page, 'corpName', payload.Name.Legal_Name);
           // await this.clickButton(page, '#continue');
            // await page.waitForSelector('input[name="agree"]', { visible: true });
            // await page.click('input[name="agree"]');
           // await this.clickButton(page, 'input[name="submit"]');
           await page.waitForSelector('#continue', { visible: true, timeout: 30000 });
           //await this.clickButton(page, 'input[type="submit"].formbutton');
           await page.click('#continue');
           await page.waitForSelector('input[name="agree"]', { visible: true });
           await page.click('input[name="agree"]');

        await this.randomSleep(1000,3000); 

      //     await page.waitForSelector('input[type="submit"]');
      //    await this.clickButton(page, 'input[type="submit"]');
      
      // Click the final submit button and ensure navigation
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }), // Ensure next page loads
        page.click('input#submit[type="submit"]')
        
      ]);
            //add register agent
            await this.fillInputByName(page, 'agentName', payload.Registered_Agent.keyPersonnelName);
            await this.fillInputByName(page, 'agentStreet', payload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'agentCity', payload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'agentZip', payload.Registered_Agent.Address.Zip_Code.toString().toString());
            // await this.clickDropdown(page, 'select[name="agentCounty"]', payload.County.CD_County);
            await this.clickDropdown(page, '#agentCounty',jsonData.data.County.countyName);

            await this.clickButton(page, 'input[name="submit"]');
            await this.clickButton(page, 'input[name="contwithout"]');
            await this.waitForTimeout(3000)
            await page.waitForSelector('#submitBtn');
            await page.click('#submitBtn');
            await this.waitForTimeout(3000)
            await page.waitForSelector('#Continue');
            await page.click('#Continue');
            //add shares
            await this.fillInputByName(page, 'authShares', payload.Stock_Details.Number_Of_Shares);
            await this.fillInputByName(page, 'issuedShares', payload.Stock_Details.Number_Of_Shares);
            await this.fillInputByName(page, 'totalCap', payload.Stock_Details.Number_Of_Shares);
            await this.clickButton(page, 'input[name="continue"]');
            await this.waitForTimeout(3000)
            await page.click('#continue');
            //add incorporator information
            await this.fillInputByName(page, 'incName', payload.Incorporator_Information.Incorporator_Details.keyPersonnelName);
            await this.fillInputByName(page, 'incStreet', payload.Incorporator_Information.Address.Street_Address);
            await this.fillInputByName(page, 'incCity', payload.Incorporator_Information.Address.City);
            await this.fillInputByName(page, 'incZip',payload.Incorporator_Information.Address.Zip_Code.toString());
            await this.clickButton(page, 'input[type="submit"][value="Submit"]');
            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in Illinois For CORP form handler:', error.stack);
            throw new Error(`Illinois For CORP form submission failed: ${error.message}`);
        }
    }
}

module.exports = IllinoisForCORP;
