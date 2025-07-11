-- Florida LLC Form Field Mappings (State ID: 10)
-- ==============================================
-- Using the same pattern as FloridaForCORP with array indexing
-- Complete mapping table based on provided mapping table

-- Business Name (Index 0)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Name.Legal_Name', 'input[name="corp_name"]');

-- Stock Shares (Index 1)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Stock_Details.Number_Of_Shares', 'input[name="stock_shares"]');

-- Principal Address (Index 2-5)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Principal_Address.Street_Address', 'input[name="princ_addr1"]'),
(10, 'Entity Formation', 'LLC', 'payload.Principal_Address.City', 'input[name="princ_city"]'),
(10, 'Entity Formation', 'LLC', 'payload.Principal_Address.State', 'input[name="princ_st"]'),
(10, 'Entity Formation', 'LLC', 'payload.Principal_Address.Zip_Code', 'input[name="princ_zip"]');

-- Mailing Address (Index 6-9)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.Street_Address', 'input[name="mail_addr1"]'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.City', 'input[name="mail_city"]'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.State', 'input[name="mail_st"]'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 'input[name="mail_zip"]');

-- Registered Agent Information (Index 10-13)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.keyPersonnelName', 'input[name="ra_signature"]'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Street_Address', 'input[name="ra_addr1"]'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.City', 'input[name="ra_city"]'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Zip_Code', 'input[name="ra_zip"]');

-- Incorporator Information (Index 14-19)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'input[name="incorporator1"]'),
(10, 'Entity Formation', 'LLC', 'payload.Incorporator_Information.Address.Street_Address', 'input[name="incorporator2"]'),
(10, 'Entity Formation', 'LLC', 'payload.Incorporator_Information.Address.City', 'input[name="incorporator4"]'),
(10, 'Entity Formation', 'LLC', 'payload.Incorporator_Information.Address.State', 'input[name="incorporator4"]'),
(10, 'Entity Formation', 'LLC', 'payload.Incorporator_Information.Address.Zip_Code', 'input[name="incorporator4"]'),
(10, 'Entity Formation', 'LLC', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'input[name="signature"]');

-- Purpose (Index 20)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Purpose.Purpose_Details', '#purpose');

-- Return Information (Index 21-23)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'input[name="ret_name"]'),
(10, 'Entity Formation', 'LLC', 'payload.Incorporator_Information.Email_Address', 'input[name="ret_email_addr"]'),
(10, 'Entity Formation', 'LLC', 'payload.Incorporator_Information.Email_Address', 'input[name="email_addr_verify"]');

-- Officer Information (Index 24-28)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Officer_Information.Officer_Details.keyPersonnelName', null),
(10, 'Entity Formation', 'LLC', 'payload.Officer_Information.Address.Street_Address', 'input[name="off1_name_addr1"]'),
(10, 'Entity Formation', 'LLC', 'payload.Officer_Information.Address.City', 'input[name="off1_name_city"]'),
(10, 'Entity Formation', 'LLC', 'payload.Officer_Information.Address.State', 'input[name="off1_name_st"]'),
(10, 'Entity Formation', 'LLC', 'payload.Officer_Information.Address.Zip_Code', 'input[name="off1_name_zip"]');

-- Country Field (Index 29)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', null, 'input[name="princ_cntry"]');

-- Navigation and Buttons (Index 30-34)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', null, 'a.btn.btn-lg.btn-special'),
(10, 'Entity Formation', 'LLC', null, 'input[name="submit"][value="Start New Filing"]'),
(10, 'Entity Formation', 'LLC', null, 'input[name="off1_name_title"]'),
(10, 'Entity Formation', 'LLC', null, 'input[type="submit"][value="Continue"]'),
(10, 'Entity Formation', 'LLC', null, 'label:contains("Disclaimer")');

-- Additional Business Name mapping (Index 35)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Name.Legal_Name', 'corp_name');

-- Additional Principal Address mappings (Index 36-40)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Principal_Address.Street_Address', 'princ_addr1'),
(10, 'Entity Formation', 'LLC', 'payload.Principal_Address.City', 'princ_city'),
(10, 'Entity Formation', 'LLC', 'payload.Principal_Address.State', 'princ_st'),
(10, 'Entity Formation', 'LLC', 'payload.Principal_Address.Zip_Code', 'princ_zip'),
(10, 'Entity Formation', 'LLC', null, 'princ_cntry');

-- Additional Mailing Address mappings (Index 41-44)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.Street_Address', 'mail_addr1'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.City', 'mail_city'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.State', 'mail_st'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 'mail_zip');

-- Additional Registered Agent mappings (Index 45-50)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.keyPersonnelName', null),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.keyPersonnelName', 'ra_name_first_name'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Street_Address', 'ra_addr1'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.City', 'ra_city'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Zip_Code', 'ra_zip'),
(10, 'Entity Formation', 'LLC', 'payload.Registered_Agent.keyPersonnelName', 'ra_signature');

-- Organizer Information (Index 51-54)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Organizer_Information.keyPersonnelName', 'ret_name'),
(10, 'Entity Formation', 'LLC', 'payload.Organizer_Information.EmailId', 'ret_email_addr'),
(10, 'Entity Formation', 'LLC', 'payload.Organizer_Information.EmailId', 'email_addr_verify'),
(10, 'Entity Formation', 'LLC', 'payload.Organizer_Information.keyPersonnelName', 'signature');

-- Additional Continue Button (Index 55)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', null, 'input[type="submit"][value="Continue"]');

-- Member/Manager Details (Index 56-67) - These are handled dynamically in the code
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Member_Or_Manager_Details[0].Mom_Name', null),
(10, 'Entity Formation', 'LLC', 'payload.Member_Or_Manager_Details', null),
(10, 'Entity Formation', 'LLC', 'payload.Member_Or_Manager_Details[index]', null),
(10, 'Entity Formation', 'LLC', 'memberDetails.Mom_Member_Or_Manager', null),
(10, 'Entity Formation', 'LLC', 'memberDetails.Mom_Name', null),
(10, 'Entity Formation', 'LLC', 'memberDetails.Mom_Member_Or_Manager', 'off${index + 1}_name_title'),
(10, 'Entity Formation', 'LLC', 'memberDetails.Mom_Name', 'off${index + 1}_name_last_name'),
(10, 'Entity Formation', 'LLC', 'memberDetails.Mom_Name', 'off${index + 1}_name_first_name'),
(10, 'Entity Formation', 'LLC', 'memberDetails.Address?.Street_Address', 'off${index + 1}_name_addr1'),
(10, 'Entity Formation', 'LLC', 'memberDetails.Address?.City', 'off${index + 1}_name_city'),
(10, 'Entity Formation', 'LLC', 'memberDetails.Address?.State', 'off${index + 1}_name_st'),
(10, 'Entity Formation', 'LLC', 'memberDetails.Address?.Zip_Code', 'off${index + 1}_name_zip');

-- Navigation Links (Index 68-70)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', null, 'Start a Business'),
(10, 'Entity Formation', 'LLC', null, 'Articles of Organization'),
(10, 'Entity Formation', 'LLC', null, 'File or Correct Florida LLC Articles of Organization');

-- Country Value (Index 71)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Principal_Address.Country', null);

-- Officer Title Value (Index 72)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Officer_Information.Officer_Details.Title', null);

-- Member/Manager Title Values (Index 73-74)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(10, 'Entity Formation', 'LLC', 'payload.Member_Or_Manager_Details.Member_Title', null),
(10, 'Entity Formation', 'LLC', 'payload.Member_Or_Manager_Details.Manager_Title', null); 