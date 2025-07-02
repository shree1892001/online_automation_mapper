// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'mapper',
//   password: 'postgres',
//   port: 5432
// });

// async function insertMapping(stateId, orderType, entityType, jsonKey, onlineFieldMapping) {
//   const query = `
//     INSERT INTO mapper (state_id, order_type, entity_type, json_key, online_field_mapping)
//     VALUES ($1, $2, $3, $4, $5)
//     ON CONFLICT DO NOTHING
//   `;
//   await pool.query(query, [stateId, orderType, entityType, jsonKey, onlineFieldMapping]);
// }

// module.exports = {
//   insertMapping
// };

// // In your NewJersyForCORP.js
// const dbService = require('../services/dbService');

// // Add this before return res:
// const mappingsToInsert = [
//   [30, 'Entity_Formation', 'CORP', 'NJ Domestic For-Profit Corporation (DP)', '#BusinessType'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Stock_Details.Number_Of_Shares', 'TotalShares'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Name.Legal_Name', 'BusinessName'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Name.Alternate_Legal_Name', 'BusinessName'],
//   [30, 'Entity_Formation', 'CORP', 'designator', '#BusinessNameDesignator'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Registered_Agent.keyPersonnelName', 'RegisteredAgentName'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Registered_Agent.Address.Street_Address', 'OfficeAddress1'],
//   [30, 'Entity_Formation', 'CORP', "payload.Registered_Agent.Address['Address_Line_2']", 'OfficeAddress2'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Registered_Agent.Address.City', 'OfficeCity'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Registered_Agent.Address.Zip_Code', 'OfficeZip'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Director_Information.Director_Details.Name', 'Name'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Director_Information.Address.Dir_Address_Line_1', 'StreetAddress1'],
//   [30, 'Entity_Formation', 'CORP', "payload.Director_Information.Address['Dir_Address_Line_2']", 'StreetAddress2'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Director_Information.Address.Dir_City', 'City'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Director_Information.Address.Dir_State', '#State'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Director_Information.Address.Dir_Zip_Code', 'Zip'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'Name'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Incorporator_Information.Address.Street_Address', 'StreetAddress1'],
//   [30, 'Entity_Formation', 'CORP', "payload.Incorporator_Information.Address['Address_Line_2']", 'StreetAddress2'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Incorporator_Information.Address.City', 'City'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Incorporator_Information.Address.State', '#State'],
//   [30, 'Entity_Formation', 'CORP', 'payload.Incorporator_Information.Address.Zip_Code', 'Zip'], 
//     [30, 'Entity_Formation', 'CORP', null, 'label[for="signing"]'], 
//         [30, 'Entity_Formation', 'CORP', null, '#signing'], 



// ];

// for (const [stateId, orderType, entityType, jsonKey, field] of mappingsToInsert) {
//   await dbService.insertMapping(stateId, orderType, entityType, jsonKey, field);
// }
