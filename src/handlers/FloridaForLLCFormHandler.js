const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const mappingService = require('../services/mappingService');

class FloridaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }
    async FloridaForLLC(page,jsonData,payload) {
        try {
            logger.info('Navigating to Florida form submission page...');
            
            // Map the payload keys using database-driven mapping
            const mappedPayload = await mappingService.mapPayloadKeys(payload, 'llc');
            
            const data = Object.values(jsonData)[0];
            const url = data.State.stateUrl;            await this.navigateToPage(page, url);
            await this.clickOnLinkByText(page, 'Start a Business');
            await this.clickOnLinkByText(page, 'Articles of Organization');

            await this.clickOnLinkByText(page, 'File or Correct Florida LLC Articles of Organization');

            await this.clickButton(page, 'input[name="submit"][value="Start New Filing"]');
            await this.fillInputByName(page, 'corp_name', mappedPayload.Legal_Name);
            await this.fillInputByName(page, 'princ_addr1', mappedPayload.Street_Address);
            await this.fillInputByName(page, 'princ_city', mappedPayload.City);
            await this.fillInputByName(page, 'princ_st', mappedPayload.state);
            await this.fillInputByName(page, 'princ_zip', String(mappedPayload.Zip_Code));
            await this.fillInputByName(page, 'princ_cntry', "United States");
            // await this.clickButton(page, '#same_addr_flag');
             /*  Principal Mailing Address */

             await this.fillInputByName(page, 'mail_addr1', mappedPayload.Registered_Agent.Mailing_Information.Street_Address);
             await this.fillInputByName(page, 'mail_city', mappedPayload.Registered_Agent.Mailing_Information.City);
             await this.fillInputByName(page, 'mail_st', mappedpayload.Registered_Agent.Mailing_Information.State);
             await this.fillInputByName(page, 'mail_zip', String(mappedPayload.Registered_Agent.Mailing_Information.Zip_Code));
             
            const rafullname = mappedPayload.Registered_Agent.keyPersonnelName;
            console.log(rafullname);
            const [firstName, lastName] = await this.ra_split(rafullname);

            console.log(lastName);
            console.log(firstName)
            await this.fillInputByName(page, 'ra_name_last_name', lastName);
            await this.fillInputByName(page, 'ra_name_first_name', firstName);
            await this.fillInputByName(page, 'ra_addr1',mappedPayload.Registered_Agent.Address.Street_Address);
            await this.fillInputByName(page, 'ra_city',mappedPayload.Registered_Agent.Address.City);
            await this.fillInputByName(page, 'ra_zip', String(mappedPayload.Registered_Agent.Address.Zip_Code));
            await this.fillInputByName(page, 'ra_signature',mappedPayload.Registered_Agent.keyPersonnelName);
            // Correspondence Name And E-mail Address
            
            await this.fillInputByName(page, 'ret_name', mappedPayload.Organizer_Information.keyPersonnelName);
            await this.fillInputByName(page, 'ret_email_addr', mappedPayload.Organizer_Information.emailId);
            await this.fillInputByName(page, 'email_addr_verify', mappedPayload.Organizer_Information.emailId);
            
            await this.fillInputByName(page, 'signature', mappedPayload.Organizer_Information.keyPersonnelName);
            
            //Name And Address of Person(s) Authorized to Manage LLC
            const mbrfullName = mappedPayload.Member_Or_Manager_Details[0].Mom_Name;
            const [mbrfirstName, mbrlastName] = await this.ra_split(mbrfullName)
            let index = 0;
            while (index < mappedPayload.Member_Or_Manager_Details.length) {
                const memberDetails = mappedPayload.Member_Or_Manager_Details[index];
                
                // Check if Mom_Member_Or_Manager exists to avoid errors
                if (memberDetails.Mom_Member_Or_Manager) {
                    const mem_or_mgr = memberDetails.Mom_Member_Or_Manager;
                    const title = mem_or_mgr === 'Member' ? 'AMBR' : 'MGR';

                    await this.fillInputByName(page, `off${index + 1}_name_title`, title);
                    await this.fillInputByName(page, `off${index + 1}_name_last_name`, memberDetails.Mom_Name.split(' ').slice(-1).join(''));
                    await this.fillInputByName(page, `off${index + 1}_name_first_name`, memberDetails.Mom_Name.split(' ').slice(0, -1).join(' '));
                    await this.fillInputByName(page, `off${index + 1}_name_addr1`, memberDetails.Address?.MM_Address_Line_1 || '');
                    await this.fillInputByName(page, `off${index + 1}_name_city`, memberDetails.Address?.MM_City || '');
                    await this.fillInputByName(page, `off${index + 1}_name_st`, memberDetails.Address?.MM_State || '');
                    await this.fillInputByName(page, `off${index + 1}_name_zip`, String(memberDetails.Address?.MM_Zip_Code || ''));
                }

                index++;
            }

            await page.click('input[type="submit"][value="Continue"]');
            // await page.waitForSelector('#review', { visible: true, timeout: 0 });

            const res = "form filled successfully";
            return res
        } catch (error) {
            logger.error('Error in FloridaForLLC form handler:', error.stack);
            throw new Error(`Florida LLC form submission failed: ${error.message}`);
        }
    }
}

module.exports = FloridaForLLC;


