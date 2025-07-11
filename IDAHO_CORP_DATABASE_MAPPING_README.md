# Idaho CORP Database-Driven Mapping Implementation

## Overview
The IdahoForCORP form handler has been converted to use database-driven mapping similar to the NewJerseyForLLC pattern. This implementation replaces hardcoded selectors with dynamic mappings fetched from the database, making the handler more maintainable and flexible.

## Key Changes Made

### 1. Database Integration
- Added `fetchByState` import from `../utils/getByState`
- Implemented state mapping retrieval using `fetchByState(data.State.id)`
- Added mapping logging for debugging purposes

### 2. Dynamic Selector Replacement
All hardcoded selectors have been replaced with database mappings:

#### Navigation Elements
- Login button: `stateMapping[0].online_field_mapping`
- Submit button: `stateMapping[1].online_field_mapping`
- Articles of Incorporation navigation: `stateMapping[2].online_field_mapping`
- Continue buttons: `stateMapping[4].online_field_mapping`
- Save buttons: `stateMapping[8].online_field_mapping`, `stateMapping[10].online_field_mapping`, `stateMapping[13].online_field_mapping`
- Add row buttons: `stateMapping[9].online_field_mapping`, `stateMapping[12].online_field_mapping`

#### Form Fields
- Company name fields: `stateMapping[15].online_field_mapping`, `stateMapping[16].online_field_mapping`
- Stock shares: `stateMapping[45].online_field_mapping`
- Principal address: `stateMapping[46-49].online_field_mapping`
- Registered Agent fields: `stateMapping[50-55].online_field_mapping`
- Incorporator fields: `stateMapping[56-58].online_field_mapping`
- Director fields: `stateMapping[26-28].online_field_mapping`

### 3. Payload Value Extraction
- Implemented `getValueFromPayload` method calls for all field values
- Added proper error handling for missing payload values
- Maintained type conversion for numeric fields (e.g., zip codes)

### 4. Enhanced Error Handling
- Added try-catch blocks around critical operations
- Improved logging for debugging purposes
- Better error messages for failed operations

### 5. Null Safety for Name Splitting
- Added null checks before calling `ra_split` method
- Prevents "text is not iterable" errors when payload values are null
- Graceful fallback to empty strings when names are missing

## Database Mappings

The handler uses 59 mappings (indexes 0-58) covering:

### Navigation Mappings (0-14)
- Login and authentication elements
- Form navigation buttons
- Save and continue buttons
- Add row buttons for different sections

### Form Field Mappings (15-58)
- Company information (name, stock details)
- Address information (principal, registered agent, incorporator, director)
- Login credentials
- State and country dropdowns

## Usage

### Prerequisites
1. Ensure the database contains the Idaho CORP mappings (see `idaho_corp_mappings.sql`)
2. Verify the `fetchByState` utility is properly configured
3. Ensure the payload structure matches the expected format

### Running the Handler
```javascript
const IdahoForCORP = require('./handlers/IdahoForCORPFormHandler');
const handler = new IdahoForCORP();
const result = await handler.IdahoForCORP(page, jsonData, payload);
```

## Benefits

### 1. Maintainability
- Selectors can be updated in the database without code changes
- Centralized mapping management
- Easier debugging and troubleshooting

### 2. Flexibility
- Support for multiple form variations
- Easy addition of new fields
- Dynamic form handling

### 3. Consistency
- Follows the same pattern as other handlers (NewJerseyForLLC, FloridaForLLC)
- Standardized error handling
- Consistent logging approach

### 4. Robustness
- Null-safe operations prevent runtime errors
- Graceful handling of missing payload data
- Better error recovery and logging

## Troubleshooting

### Common Issues

1. **Mapping Not Found**
   - Verify the database contains Idaho CORP mappings
   - Check the state ID (should be 13 for Idaho)
   - Ensure order_type is 'CORP' and entity_type is 'Corporation'

2. **Payload Value Errors**
   - Verify payload structure matches expected format
   - Check for missing or null values
   - Ensure proper type conversion for numeric fields

3. **Selector Issues**
   - Verify selectors in the database are correct
   - Check for dynamic selectors that may change
   - Ensure proper waiting for elements to load

4. **"Text is not iterable" Error (FIXED)**
   - This error was caused by passing null values to `ra_split`
   - Fixed by adding null checks before calling `ra_split`
   - Handler now gracefully handles missing name data

### Debugging
- Enable mapping logging by checking the console output
- Use browser developer tools to verify selectors
- Check the application logs for detailed error messages
- Look for warning messages about null name values

## Recent Fixes

### Null Safety for Name Splitting
**Problem**: The handler was throwing "text is not iterable" errors when `getValueFromPayload` returned null for name fields.

**Solution**: Added comprehensive null checks before calling `ra_split`:

```javascript
// Before (causing errors)
const [firstName, lastName] = await this.ra_split(raFullName);

// After (null-safe)
if (raFullName && typeof raFullName === 'string') {
    const [firstName, lastName] = await this.ra_split(raFullName);
    await this.fillInputByName(page, 'FIRST_NAME', firstName);
    await this.fillInputByName(page, 'LAST_NAME', lastName);
} else {
    logger.warn('Registered Agent name is null or not a string, skipping name split');
    await this.fillInputByName(page, 'FIRST_NAME', '');
    await this.fillInputByName(page, 'LAST_NAME', '');
}
```

This fix applies to:
- Registered Agent name splitting
- Incorporator name splitting  
- Director name splitting

## Future Enhancements

1. **Additional Field Support**
   - Add support for more complex form sections
   - Implement conditional field handling
   - Add validation for required fields

2. **Performance Optimization**
   - Implement caching for database mappings
   - Optimize payload value extraction
   - Add parallel processing where possible

3. **Error Recovery**
   - Implement retry mechanisms for failed operations
   - Add fallback selectors for dynamic elements
   - Improve error reporting and recovery

## Related Files

- `src/handlers/IdahoForCORPFormHandler.js` - Main handler implementation
- `idaho_corp_mappings.sql` - Database mappings
- `src/utils/getByState.js` - Database utility for fetching mappings
- `src/handlers/BaseFormHandler.js` - Base class with common functionality

## Migration Notes

This implementation maintains backward compatibility while adding database-driven functionality. The handler will continue to work with existing payload structures and form layouts, but now benefits from the flexibility of database-driven mappings and robust error handling. 