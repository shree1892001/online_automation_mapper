const BaseFormHandler = require('./BaseFormHandler');
const logger = require('../utils/logger');
const { fetchByState } = require('../utils/getByState');

class FloridaForLLC extends BaseFormHandler {
    constructor() {
        super();
    }

    // Helper function to extract field name from CSS selector
    extractFieldName(selector) {
        if (selector.startsWith('input[name="') && selector.endsWith('"]')) {
            return selector.replace('input[name="', '').replace('"]', '');
        }
        return selector;
    }

    async FloridaForLLC(page, jsonData, payload) {
        try {
            logger.info('Starting Florida LLC form submission...');
            console.log(payload);
            const data = Object.values(jsonData)[0];

            const stateMapping = await fetchByState(data.State.id);
            
            // Add defensive check for stateMapping
            if (!stateMapping || !Array.isArray(stateMapping) || stateMapping.length === 0) {
                throw new Error('No state mapping found for the given state ID: ' + data.State.id);
            }
            
            logger.info(`Retrieved ${stateMapping.length} mappings from database`);
            
            // Debug: Log all mappings
            for(let i=0; i<stateMapping.length; i++){
                if(data.orderType === stateMapping[i].order_type || data.orderFullDesc === stateMapping[i].entity_type){
                    logger.info(`Mapping ${i}: ${stateMapping[i].online_field_mapping} -> ${stateMapping[i].json_key}`);
                }
            }

            const url = data.State.stateUrl;
            await this.navigateToPage(page, url);
            
            // Use hardcoded navigation links since they're not in the database mappings
            await this.clickOnLinkByText(page, 'Start a Business');
            await this.clickOnLinkByText(page, 'Articles of Organization');
            await this.clickOnLinkByText(page, 'File or Correct Florida LLC Articles of Organization');

            // Get start filing button selector from database
            await this.clickButton(page, stateMapping[31].online_field_mapping);
            
            // Fill corporation name using database mapping
            const businessName = await this.getValueFromPayload(payload, stateMapping[0].json_key);
            const corpNameField = this.extractFieldName(stateMapping[0].online_field_mapping);
            await this.fillInputByName(page, corpNameField, businessName);
            
            // Fill principal address using database mappings
            const princAddr1Value = await this.getValueFromPayload(payload, stateMapping[2].json_key);
            const princAddr1Field = this.extractFieldName(stateMapping[2].online_field_mapping);
            await this.fillInputByName(page, princAddr1Field, princAddr1Value);
            
            const princCityValue = await this.getValueFromPayload(payload, stateMapping[3].json_key);
            const princCityField = this.extractFieldName(stateMapping[3].online_field_mapping);
            await this.fillInputByName(page, princCityField, princCityValue);
            
            const princStValue = await this.getValueFromPayload(payload, stateMapping[4].json_key);
            const princStField = this.extractFieldName(stateMapping[4].online_field_mapping);
            await this.fillInputByName(page, princStField, princStValue);
            
            const princZipValue = await this.getValueFromPayload(payload, stateMapping[5].json_key);
            const princZipField = this.extractFieldName(stateMapping[5].online_field_mapping);
            await this.fillInputByName(page, princZipField, String(princZipValue));
            
            // Fill country using database mapping
            const princCntryField = this.extractFieldName(stateMapping[29].online_field_mapping);
            await this.fillInputByName(page, princCntryField, "United States");
            
            /* MAILING ADDRESS using database mappings */
            const mailAddr1Value = await this.getValueFromPayload(payload, stateMapping[6].json_key);
            const mailAddr1Field = this.extractFieldName(stateMapping[6].online_field_mapping);
            await this.fillInputByName(page, mailAddr1Field, mailAddr1Value);
            
            const mailCityValue = await this.getValueFromPayload(payload, stateMapping[7].json_key);
            const mailCityField = this.extractFieldName(stateMapping[7].online_field_mapping);
            await this.fillInputByName(page, mailCityField, mailCityValue);
            
            const mailStValue = await this.getValueFromPayload(payload, stateMapping[8].json_key);
            const mailStField = this.extractFieldName(stateMapping[8].online_field_mapping);
            await this.fillInputByName(page, mailStField, mailStValue);
            
            const mailZipValue = await this.getValueFromPayload(payload, stateMapping[9].json_key);
            const mailZipField = this.extractFieldName(stateMapping[9].online_field_mapping);
            await this.fillInputByName(page, mailZipField, String(mailZipValue));
             
            // Fill registered agent information using database mappings
            const rafullname = await this.getValueFromPayload(payload, stateMapping[10].json_key);
            const [firstName, lastName] = await this.ra_split(rafullname);

            // Fill registered agent name fields using database mappings
            const raFirstNameField = this.extractFieldName(stateMapping[46].online_field_mapping);
            await this.fillInputByName(page, raFirstNameField, firstName);

            const raLastNameField = this.extractFieldName(stateMapping[65].online_field_mapping);
            await this.fillInputByName(page, raLastNameField, lastName);
            
            // Fill registered agent address using database mappings
            const raAddr1Value = await this.getValueFromPayload(payload, stateMapping[47].json_key);
            const raAddr1Field = this.extractFieldName(stateMapping[47].online_field_mapping);
            await this.fillInputByName(page, raAddr1Field, raAddr1Value);
            
            const raCityValue = await this.getValueFromPayload(payload, stateMapping[48].json_key);
            const raCityField = this.extractFieldName(stateMapping[48].online_field_mapping);
            await this.fillInputByName(page, raCityField, raCityValue);
            
            const raZipValue = await this.getValueFromPayload(payload, stateMapping[49].json_key);
            const raZipField = this.extractFieldName(stateMapping[49].online_field_mapping);
            await this.fillInputByName(page, raZipField, String(raZipValue));
            
            const raSignatureValue = await this.getValueFromPayload(payload, stateMapping[50].json_key);
            const raSignatureField = this.extractFieldName(stateMapping[50].online_field_mapping);
            await this.fillInputByName(page, raSignatureField, raSignatureValue);
            
            // Fill ORGANIZER information (LLC-specific) using database mappings
            const organizerNameValue = await this.getValueFromPayload(payload, stateMapping[51].json_key);
            const organizerNameField = this.extractFieldName(stateMapping[51].online_field_mapping);
            await this.fillInputByName(page, organizerNameField, organizerNameValue);
            
            // Fill purpose using database mapping
            const purposeValue = await this.getValueFromPayload(payload, stateMapping[20].json_key);
            await this.fillInputbyid(page, [{ selector: stateMapping[20].online_field_mapping, value: purposeValue }]);

            // Fill correspondence information using database mappings
            await this.fillCorrespondenceInfo(page, payload, stateMapping);
            
            // Fill officer information using database mappings
            const ofcrfullName = await this.getValueFromPayload(payload, stateMapping[24].json_key);
            const [ofcrfirstName, ofcrlastName] = await this.ra_split(ofcrfullName);
            
            const off1NameTitleField = this.extractFieldName(stateMapping[32].online_field_mapping);
            await this.fillInputByName(page, off1NameTitleField, 'MGR');
            
            // Fill officer name fields using hardcoded selectors since they're not in database mappings
            await this.fillInputByName(page, 'off1_name_first_name', ofcrfirstName);
            await this.fillInputByName(page, 'off1_name_last_name', ofcrlastName);
            
            // Fill officer address fields using database mappings
            const off1NameAddr1Value = await this.getValueFromPayload(payload, stateMapping[25].json_key);
            const off1NameAddr1Field = this.extractFieldName(stateMapping[25].online_field_mapping);
            await this.fillInputByName(page, off1NameAddr1Field, off1NameAddr1Value);
            
            const off1NameCityValue = await this.getValueFromPayload(payload, stateMapping[26].json_key);
            const off1NameCityField = this.extractFieldName(stateMapping[26].online_field_mapping);
            await this.fillInputByName(page, off1NameCityField, off1NameCityValue);
            
            const off1NameStValue = await this.getValueFromPayload(payload, stateMapping[27].json_key);
            const off1NameStField = this.extractFieldName(stateMapping[27].online_field_mapping);
            await this.fillInputByName(page, off1NameStField, off1NameStValue);
            
            const off1NameZipValue = await this.getValueFromPayload(payload, stateMapping[28].json_key);
            const off1NameZipField = this.extractFieldName(stateMapping[28].online_field_mapping);
            await this.fillInputByName(page, off1NameZipField, String(off1NameZipValue));
            
            // Handle Member/Manager details for LLC using database mappings
            await this.fillMemberManagerFields(page, payload, stateMapping);
            
            // Get continue button selector from database
            await page.click(stateMapping[33].online_field_mapping);

            const res = "form filled successfully";
            return res;

        } catch (error) {
            logger.error('Error in Florida For LLC form handler:', error.stack);
            throw new Error(`Florida For LLC form submission failed: ${error.message}`);
        }
    }

    /**
     * Fill correspondence information using database mappings
     * @param {Object} page - Puppeteer page object
     * @param {Object} payload - The payload data
     * @param {Array} stateMapping - Database state mappings
     */
    async fillCorrespondenceInfo(page, payload, stateMapping) {
        // Use organizer information for LLC (index 51-54)
        const organizerNameValue = await this.getValueFromPayload(payload, stateMapping[51].json_key);
        const organizerEmailValue = await this.getValueFromPayload(payload, stateMapping[52].json_key);
        
        // if (organizerNameValue) {
        //     const organizerNameField = this.extractFieldName(stateMapping[51].online_field_mapping);
        //     await this.fillInputByName(page, organizerNameField, organizerNameValue);
        // }
        
        if (organizerEmailValue) {
            const organizerEmailField = this.extractFieldName(stateMapping[52].online_field_mapping);
            const organizerEmailVerifyField = this.extractFieldName(stateMapping[53].online_field_mapping);
            await this.fillInputByName(page, organizerEmailField, organizerEmailValue);
            await this.fillInputByName(page, organizerEmailVerifyField, organizerEmailValue);
        }
        
        if (organizerNameValue) {
            const organizerSignatureField = this.extractFieldName(stateMapping[54].online_field_mapping);
            await this.fillInputByName(page, organizerSignatureField, organizerNameValue);
        }
    }

    /**
     * Fill member/manager fields for LLC using database mappings
     * @param {Object} page - Puppeteer page object
     * @param {Object} payload - The payload data
     * @param {Array} stateMapping - Database state mappings
     */
    async fillMemberManagerFields(page, payload, stateMapping) {
        const memberDetails = payload.Member_Or_Manager_Details;
        if (!memberDetails || !Array.isArray(memberDetails)) return;

            let index = 0;
        while (index < memberDetails.length) {
            const member = memberDetails[index];
            
            if (member.Mom_Member_Or_Manager) {
                const memOrMgr = member.Mom_Member_Or_Manager;
                const title = memOrMgr === 'Member' ? 'AMBR' : 'MGR';

                // Fill member/manager fields using database mappings
                const titleSelector = this.extractFieldName(stateMapping[59].online_field_mapping).replace('${index + 1}', index + 1);
                const lastNameSelector = this.extractFieldName(stateMapping[68].online_field_mapping).replace('${index + 1}', index + 1);
                const firstNameSelector = this.extractFieldName(stateMapping[69].online_field_mapping).replace('${index + 1}', index + 1);
                const addr1Selector = this.extractFieldName(stateMapping[60].online_field_mapping).replace('${index + 1}', index + 1);
                const citySelector = this.extractFieldName(stateMapping[61].online_field_mapping).replace('${index + 1}', index + 1);
                const stateSelector = this.extractFieldName(stateMapping[62].online_field_mapping).replace('${index + 1}', index + 1);
                const zipSelector = this.extractFieldName(stateMapping[63].online_field_mapping).replace('${index + 1}', index + 1);

                await this.fillInputByName(page, titleSelector, title);
                
                if (member.keyPersonnelName) {
                    const [firstName, lastName] = await this.ra_split(member.keyPersonnelName);
                    await this.fillInputByName(page, lastNameSelector, lastName);
                    await this.fillInputByName(page, firstNameSelector, firstName);
                }

                if (member.Address) {
                    if (member.Address.Street_Address) {
                        await this.fillInputByName(page, addr1Selector, member.Address.Street_Address);
                    }
                    if (member.Address.City) {
                        await this.fillInputByName(page, citySelector, member.Address.City);
                    }
                    if (member.Address.State) {
                        await this.fillInputByName(page, stateSelector, member.Address.State);
                    }
                    if (member.Address.Zip_Code) {
                        await this.fillInputByName(page, zipSelector, String(member.Address.Zip_Code));
                    }
                }
            }

            index++;
        }
    }
}

module.exports = FloridaForLLC;


