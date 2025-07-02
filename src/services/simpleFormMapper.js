const { Pool } = require('pg');
const logger = require('../utils/logger');

class SimpleFormMapper {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 5432,
        });
    }

    async getValue(key, formType = 'Entity_Formation', entityType = 'llc') {
        try {
            const query = `
                SELECT form_selector, static_value 
                FROM form_field_mappings 
                WHERE form_type = $1 AND entity_type = $2 
                AND (static_value = $3 OR payload_key = $3)
                LIMIT 1
            `;
            
            const result = await this.pool.query(query, [formType, entityType, key]);
            
            if (result.rows.length > 0) {
                const row = result.rows[0];
                // If it's a static value mapping, return the form_selector
                if (row.static_value === key) {
                    return row.form_selector;
                }
                // If it's a payload key mapping, return the form_selector
                if (row.payload_key === key) {
                    return row.form_selector;
                }
            }
            
            return key; // Return original key if not found
        } catch (error) {
            logger.error('Error fetching form mapping:', error);
            return this.getDefaultValue(key, entityType);
        }
    }

    getDefaultValue(key, entityType) {
        // Simple fallback values
        const defaults = {
            'llc': {
                'NJ Domestic Limited Liability Company (LLC)': '#BusinessType',
                'designator': '#BusinessNameDesignator',
                'Authorized Representative': '#Title',
                'payload.Name.Legal_Name': 'BusinessName',
                'payload.Name.Alternate_Legal_Name': 'BusinessName',
                'payload.Registered_Agent.keyPersonnelName': 'RegisteredAgentName',
                'payload.Registered_Agent.Address.Street_Address': 'OfficeAddress1',
                'payload.Registered_Agent.Address["Address_Line_2"]': 'OfficeAddress2',
                'payload.Registered_Agent.Address.City': 'OfficeCity',
                'payload.Registered_Agent.Address.Zip_Code': 'OfficeZip',
                'payload.Organizer_Information.keyPersonnelName': 'Name'
            },
            'corp': {
                'NJ Domestic For-Profit Corporation (DP)': '#BusinessType',
                'designator': '#BusinessNameDesignator',
                'Authorized Representative': '#Title',
                'payload.Name.Legal_Name': 'BusinessName',
                'payload.Name.Alternate_Legal_Name': 'BusinessName',
                'payload.Registered_Agent.keyPersonnelName': 'RegisteredAgentName',
                'payload.Registered_Agent.Address.Street_Address': 'OfficeAddress1',
                'payload.Registered_Agent.Address["Address_Line_2"]': 'OfficeAddress2',
                'payload.Registered_Agent.Address.City': 'OfficeCity',
                'payload.Registered_Agent.Address.Zip_Code': 'OfficeZip',
                'payload.Director_Information.Director_Details.Name': 'Name',
                'payload.Stock_Details.Number_Of_Shares': 'TotalShares'
            }
        };
        
        return defaults[entityType]?.[key] || key;
    }
}

module.exports = new SimpleFormMapper(); 