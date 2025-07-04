-- Iowa State Handlers Insert Statements
-- =====================================

-- IOWA (State ID: 15)
-- ===================

-- Iowa CORP Form Handler Insert Statements
-- Login Fields
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'CORP', null, 'input[placeholder="UserName"]'),
(15, 'Entity Formation', 'CORP', null, 'input[placeholder="Password"]'),
(15, 'Entity Formation', 'CORP', null, '#btnLogin');

-- Navigation
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'CORP', null, 'a:contains("Form an Iowa corporation")'),
(15, 'Entity Formation', 'CORP', null, 'select[display-name="Chapter"]');

-- Corporation Name
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'CORP', 'payload.Name.Legal_Name', 'input[placeholder="Corporation Name"]'),
(15, 'Entity Formation', 'CORP', null, 'button[data-cmd="CheckName"]');

-- Shares and Type
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'CORP', 'payload.Stock_Details.Number_Of_Shares', 'input[placeholder="# of Shares"]'),
(15, 'Entity Formation', 'CORP', null, 'select.form-control[data-property="Type"]');

-- Registered Agent (Office Address)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.keyPersonnelName', 'label:contains("Full Name") in Registered Agent Section'),
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Address.Street_Address', 'label:contains("Address Line  1") in Registered Agent Section'),
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Address.Address_Line_2', 'label:contains("Address Line  2") in Registered Agent Section'),
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Address.City', 'label:contains("City") in Registered Agent Section'),
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Address.Zip_Code', 'label:contains("Zip") in Registered Agent Section');

-- Registered Agent (Mailing Address)
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Mailing_Information.Street_Address', 'label:contains("Address Line  1") in Mailing Section'),
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Mailing_Information.Address_Line_2', 'label:contains("Address Line  2") in Mailing Section'),
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Mailing_Information.City', 'label:contains("City") in Mailing Section'),
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Mailing_Information.State', 'label:contains("State") in Mailing Section'),
(15, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 'label:contains("Zip") in Mailing Section');

-- Incorporator
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'label:contains("Full Name") in Incorporator Section'),
(15, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.Street_Address', 'label:contains("Address Line  1") in Incorporator Section'),
(15, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.Address_Line_2', 'label:contains("Address Line  2") in Incorporator Section'),
(15, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.City', 'label:contains("City") in Incorporator Section'),
(15, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.State', 'label:contains("State") in Incorporator Section'),
(15, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.Zip_Code', 'label:contains("Zip") in Incorporator Section');

-- Final Certification
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'CORP', null, 'input[aria-label^="I certify under penalty of perjury"]'),
(15, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'input[placeholder="Full Legal Name"]'),
(15, 'Entity Formation', 'CORP', null, 'button.btn.btn-lg.btn-primary.centered');

-- Iowa LLC Form Handler Insert Statements
-- Login Fields
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'LLC', null, 'input[placeholder="UserName"]'),
(15, 'Entity Formation', 'LLC', null, 'input[placeholder="Password"]'),
(15, 'Entity Formation', 'LLC', null, '#btnLogin');

-- Navigation
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'LLC', null, 'a:contains("Form an Iowa limited liability company")'),
(15, 'Entity Formation', 'LLC', null, 'select[display-name="Chapter"]');

-- Corporation Name
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'LLC', 'payload.Name.Legal_Name', 'input[placeholder="Corporation Name"]'),
(15, 'Entity Formation', 'LLC', null, 'button[data-cmd="CheckName"]'),
(15, 'Entity Formation', 'LLC', null, '.btn.btn-primary');

-- File Upload
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'LLC', null, '[id$="_Upload"]');

-- Principal Office
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.Street_Address', 'label:contains("Address Line  1") in Principal office Section'),
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.Address_Line_2', 'label:contains("Address Line  2") in Principal office Section'),
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.City', 'label:contains("City") in Principal office Section'),
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.Zip_Code', 'label:contains("Zip") in Principal office Section'),
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.State', '[id$="_State"]');

-- Mailing Principal Office
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.Street_Address', 'label:contains("Address Line  1") in Mailing Section'),
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.Address_Line_2', 'label:contains("Address Line  2") in Mailing Section'),
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.City', 'label:contains("City") in Mailing Section'),
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.State', 'label:contains("State") in Mailing Section'),
(15, 'Entity Formation', 'LLC', 'payload.Principal_Address.Zip_Code', 'label:contains("Zip") in Mailing Section');

-- Registered Agent
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Street_Address', 'label:contains("Address Line  1") in Registered Agent Section'),
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Address_Line_2', 'label:contains("Address Line  2") in Registered Agent Section'),
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.City', 'label:contains("City") in Registered Agent Section'),
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Zip_Code', 'label:contains("Zip") in Registered Agent Section'),
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.keyPersonnelName', '[id$="_AgentName"]');

-- Mailing Registered Agent
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.Street_Address', 'label:contains("Address Line  1") in Mailing Registered Agent Section'),
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.Address_Line_2', 'label:contains("Address Line  2") in Mailing Registered Agent Section'),
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.City', 'label:contains("City") in Mailing Registered Agent Section'),
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.State', 'label:contains("State") in Mailing Registered Agent Section'),
(15, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 'label:contains("Zip") in Mailing Registered Agent Section');

-- Final Certification
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(15, 'Entity Formation', 'LLC', null, 'input[aria-label^="I certify under penalty of perjury"]'),
(15, 'Entity Formation', 'LLC', 'payload.Organizer_Information.keyPersonnelName', 'input[placeholder="Full Legal Name"]'); 