const { Pool } = require('pg');
const logger = require('../utils/logger');

class SimpleMapperService {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'mapper',
            password: process.env.DB_PASSWORD || 'postgres',
            port: process.env.DB_PORT || 5432,
        });
    }

    /**
     * Get a single mapping from the mapper table
     * @param {number} stateId - State ID (e.g., 50 for Wyoming)
     * @param {string} orderType - Order type (e.g., 'Entity_Formation')
     * @param {string} entityType - Entity type (e.g., 'LLC')
     * @param {string} jsonKey - The JSON key to look for
     * @returns {Promise<string|null>} The online field mapping or null
     */
    async getMapping(stateId, orderType, entityType, jsonKey) {
        try {
            const query = `
                SELECT online_field_mapping 
                FROM mapper 
                WHERE state_id = $1 
                AND order_type = $2 
                AND entity_type = $3 
                AND json_key = $4
            `;
            
            const result = await this.pool.query(query, [stateId, orderType, entityType, jsonKey]);
            
            if (result.rows.length > 0) {
                logger.info(`Found mapping: ${jsonKey} → ${result.rows[0].online_field_mapping}`);
                return result.rows[0].online_field_mapping;
            } else {
                logger.warn(`No mapping found for: state_id=${stateId}, order_type=${orderType}, entity_type=${entityType}, json_key=${jsonKey}`);
                return null;
            }
        } catch (error) {
            logger.error('Error getting mapping:', error);
            return null;
        }
    }

    /**
     * Get multiple mappings for a state/order/entity combination
     * @param {number} stateId - State ID
     * @param {string} orderType - Order type
     * @param {string} entityType - Entity type
     * @returns {Promise<Object>} Object with json_key as keys and online_field_mapping as values
     */
    async getMappings(stateId, orderType, entityType) {
        try {
            const query = `
                SELECT json_key, online_field_mapping 
                FROM mapper 
                WHERE state_id = $1 
                AND order_type = $2 
                AND entity_type = $3
                ORDER BY json_key
            `;
            
            const result = await this.pool.query(query, [stateId, orderType, entityType]);
            
            const mappings = {};
            result.rows.forEach(row => {
                mappings[row.json_key] = row.online_field_mapping;
            });
            
            logger.info(`Found ${Object.keys(mappings).length} mappings for state_id=${stateId}, order_type=${orderType}, entity_type=${entityType}`);
            return mappings;
        } catch (error) {
            logger.error('Error getting mappings:', error);
            return {};
        }
    }

    /**
     * Get business type mapping specifically
     * @param {number} stateId - State ID
     * @param {string} entityType - Entity type
     * @returns {Promise<Object>} Object with selector and value
     */
    async getBusinessTypeMapping(stateId, entityType) {
        const businessTypeValue = entityType === 'LLC' ? 'Limited Liability Company (Domestic)' : 'Profit Corporation (Domestic)';
        const selector = await this.getMapping(stateId, 'Entity_Formation', entityType, businessTypeValue);
        
        return {
            selector: selector,
            value: businessTypeValue
        };
    }

    /**
     * Close the database connection
     */
    async close() {
        await this.pool.end();
    }
}

module.exports = SimpleMapperService; 