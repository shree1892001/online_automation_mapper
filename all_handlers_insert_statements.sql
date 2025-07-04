-- Complete Insert Statements for All State Handlers
-- =================================================

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

-- ALABAMA (State ID: 1)
-- =====================

-- Alabama CORP Form Handler Insert Statements
-- Navigation
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'CORP', null, 'a[href="introduction_input.action"]'),
(1, 'Entity Formation', 'CORP', null, 'a:contains("Continue to application")');

-- Contact Information
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'CORP', 'payload.Contact_Information.Name', 'input[name="contact.contactName"]'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Incorporator_Details.Inc_Contact_No', 'input[name="contact.primaryPhone"]'),
(1, 'Entity Formation', 'CORP', 'payload.Contact_Information.Email_Address', 'input[name="contact.emailAddress"]'),
(1, 'Entity Formation', 'CORP', 'payload.Contact_Information.Email_Address', 'input[name="contact.confirmEmailAddress"]'),
(1, 'Entity Formation', 'CORP', 'payload.Contact_Information.Address.Street_Address', 'input[name="contact.streetAddress"]'),
(1, 'Entity Formation', 'CORP', 'payload.Contact_Information.Address.City', 'input[name="contact.city"]'),
(1, 'Entity Formation', 'CORP', 'payload.Contact_Information.Address.Zip_Code', 'input[name="contact.zipCode"]'),
(1, 'Entity Formation', 'CORP', null, '#contactInformation_action_0');

-- Business Name
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'CORP', 'payload.Name.Legal_Name', 'input[name="businessName"]'),
(1, 'Entity Formation', 'CORP', null, '#reservation_action_0');

-- Entity Type Selection
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'CORP', null, '#reservationTypeDOMESTIC'),
(1, 'Entity Formation', 'CORP', null, '#entityTypeCORPORATION'),
(1, 'Entity Formation', 'CORP', null, '#entityInformation_action_0');

-- Requestor Information
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'CORP', null, 'a:contains("File of Formation Data")'),
(1, 'Entity Formation', 'CORP', null, '#requestorTypeINDIVIDUAL'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'input[name="requestor.issueName"]'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.Street_Address', 'input[name="requestor.issueStreetAddress"]'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.City', 'input[name="requestor.issueCity"]'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.Zip_Code', 'input[name="requestor.issueZip"]'),
(1, 'Entity Formation', 'CORP', null, '#requestorInformation_action_0');

-- Review and Filing Options
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'CORP', null, '#review'),
(1, 'Entity Formation', 'CORP', null, '#reviewReservation_action_0'),
(1, 'Entity Formation', 'CORP', 'data.County.countyName', '#countyOfFormation'),
(1, 'Entity Formation', 'CORP', null, 'input[name="options.purpose"]'),
(1, 'Entity Formation', 'CORP', 'payload.Stock_Details.Number_Of_Shares', 'input[name="options.numberOfShares"]'),
(1, 'Entity Formation', 'CORP', null, '#certifyPeriodOfDuration'),
(1, 'Entity Formation', 'CORP', null, '#filingOptions_action_0');

-- Principal Address
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'CORP', 'payload.Principal_Address.Street_Address', 'input[name="principalAddress.principalAddressStreet"]'),
(1, 'Entity Formation', 'CORP', 'payload.Principal_Address.City', 'input[name="principalAddress.principalAddressCity"]'),
(1, 'Entity Formation', 'CORP', 'payload.Principal_Address.Zip_Code', 'input[name="principalAddress.principalAddressZipCode"]'),
(1, 'Entity Formation', 'CORP', null, 'a:contains("Copy Principal Address to Mailing Address")'),
(1, 'Entity Formation', 'CORP', null, '#principalAddress_action_0');

-- Registered Agent
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'CORP', null, '#registeredAgentTypeINDIVIDUAL'),
(1, 'Entity Formation', 'CORP', 'payload.Registered_Agent.keyPersonnelName', 'input[name="agent.lastName"]'),
(1, 'Entity Formation', 'CORP', 'payload.Registered_Agent.keyPersonnelName', 'input[name="agent.firstName"]'),
(1, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Address.Street_Address', 'input[name="agent.officeAddressStreet"]'),
(1, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Address.City', 'input[name="agent.officeAddressCity"]'),
(1, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Address.Zip_Code', 'input[name="agent.officeAddressZipCode"]'),
(1, 'Entity Formation', 'CORP', null, '#certifyPhysicalAddress'),
(1, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Mailing_Information.Street_Address', 'input[name="agent.mailingAddressStreet"]'),
(1, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Mailing_Information.City', 'input[name="agent.mailingAddressCity"]'),
(1, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 'input[name="agent.mailingAddressZipCode"]'),
(1, 'Entity Formation', 'CORP', 'data.County.countyName', '#mailingAddressCounty'),
(1, 'Entity Formation', 'CORP', null, '#certifyRegisteredAgent'),
(1, 'Entity Formation', 'CORP', null, '#registeredAgent_action_0');

-- Incorporator
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'CORP', null, '#registeredAgentTypeINDIVIDUAL'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'input[name="incorporator.lastName"]'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'input[name="incorporator.firstName"]'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.Street_Address', 'input[name="incorporator.officeAddressStreet"]'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.City', 'input[name="incorporator.officeAddressCity"]'),
(1, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.Zip_Code', 'input[name="incorporator.officeAddressZipCode"]'),
(1, 'Entity Formation', 'CORP', null, 'a:contains("Copy Street Address to Mailing Address")'),
(1, 'Entity Formation', 'CORP', null, '#incorporators_action_0'),
(1, 'Entity Formation', 'CORP', null, 'a:contains("Continue")'),
(1, 'Entity Formation', 'CORP', null, '#certify'),
(1, 'Entity Formation', 'CORP', null, '#directors_action_0'),
(1, 'Entity Formation', 'CORP', null, '#documentUploads_action_0'),
(1, 'Entity Formation', 'CORP', null, '#other'),
(1, 'Entity Formation', 'CORP', null, '#cpoQuestions_action_0');

-- Alabama LLC Form Handler Insert Statements
-- Navigation
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'LLC', null, 'a[href="introduction_input.action"]'),
(1, 'Entity Formation', 'LLC', null, 'a:contains("Continue to application")');

-- Contact Information
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'LLC', 'payload.Contact_Information.Name', 'input[name="contact.contactName"]'),
(1, 'Entity Formation', 'LLC', 'payload.Contact_Information.CI_Contact_No', 'input[name="contact.primaryPhone"]'),
(1, 'Entity Formation', 'LLC', 'payload.Contact_Information.Email_Address', 'input[name="contact.emailAddress"]'),
(1, 'Entity Formation', 'LLC', 'payload.Contact_Information.Email_Address', 'input[name="contact.confirmEmailAddress"]'),
(1, 'Entity Formation', 'LLC', 'payload.Contact_Information.Address.Street_Address', 'input[name="contact.streetAddress"]'),
(1, 'Entity Formation', 'LLC', 'payload.Contact_Information.Address.City', 'input[name="contact.city"]'),
(1, 'Entity Formation', 'LLC', 'payload.Contact_Information.Address.Zip_Code', 'input[name="contact.zipCode"]'),
(1, 'Entity Formation', 'LLC', null, '#contactInformation_action_0');

-- Business Name
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'LLC', 'payload.Name.Legal_Name', 'input[name="businessName"]'),
(1, 'Entity Formation', 'LLC', null, '#reservation_action_0');

-- Entity Type Selection
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'LLC', null, '#reservationTypeDOMESTIC'),
(1, 'Entity Formation', 'LLC', null, '#entityTypeLLC'),
(1, 'Entity Formation', 'LLC', null, '#entityInformation_action_0');

-- Requestor Information
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'LLC', null, 'a:contains("File of Formation Data")'),
(1, 'Entity Formation', 'LLC', null, '#requestorTypeORGANIZATION'),
(1, 'Entity Formation', 'LLC', 'payload.Organizer_Information.keyPersonnelName', 'input[name="requestor.issueName"]'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.City', 'input[name="requestor.issueStreetAddress"]'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.City', 'input[name="requestor.issueCity"]'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Zip_Code', 'input[name="requestor.issueZip"]'),
(1, 'Entity Formation', 'LLC', null, '#requestorInformation_action_0');

-- Review and Filing Options
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'LLC', null, '#review'),
(1, 'Entity Formation', 'LLC', null, '#reviewReservation_action_0'),
(1, 'Entity Formation', 'LLC', 'data.County.countyName', '#countyOfFormation'),
(1, 'Entity Formation', 'LLC', null, '#llcTypeLL'),
(1, 'Entity Formation', 'LLC', null, '#filingOptions_action_0');

-- Registered Agent
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'LLC', null, '#registeredAgentTypeINDIVIDUAL'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.keyPersonnelName', 'input[name="agent.lastName"]'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.keyPersonnelName', 'input[name="agent.firstName"]'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Street_Address', 'input[name="agent.officeAddressStreet"]'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.City', 'input[name="agent.officeAddressCity"]'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Zip_Code', 'input[name="agent.officeAddressZipCode"]'),
(1, 'Entity Formation', 'LLC', null, '#certifyPhysicalAddress'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.Street_Address', 'input[name="agent.mailingAddressStreet"]'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.City', 'input[name="agent.mailingAddressCity"]'),
(1, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 'input[name="agent.mailingAddressZipCode"]'),
(1, 'Entity Formation', 'LLC', 'data.County.countyName', '#mailingAddressCounty'),
(1, 'Entity Formation', 'LLC', null, '#certifyRegisteredAgent'),
(1, 'Entity Formation', 'LLC', null, '#registeredAgent_action_0');

-- Final Steps
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(1, 'Entity Formation', 'LLC', null, 'a:contains("Continue")'),
(1, 'Entity Formation', 'LLC', null, '#documentUploads_action_0'),
(1, 'Entity Formation', 'LLC', null, '#other'),
(1, 'Entity Formation', 'LLC', null, '#cpoQuestions_action_0');

-- INDIANA (State ID: 14)
-- ======================

-- Indiana CORP Form Handler Insert Statements
-- Login Fields
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'CORP', 'data.State.filingWebsiteUsername', 'input[name="username"]'),
(14, 'Entity Formation', 'CORP', 'data.State.filingWebsitePassword', 'input[name="password"]');

-- Navigation buttons
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'CORP', null, 'span.icon-button__text.icon-button__text--transform-right'),
(14, 'Entity Formation', 'CORP', null, 'a[href="/portal/services"]'),
(14, 'Entity Formation', 'CORP', null, '[aria-label="Go to INBiz"]');

-- New tab navigation
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'CORP', null, 'a[title="START A NEW BUSINESS"]'),
(14, 'Entity Formation', 'CORP', null, 'input[type="button"][value="Next"]'),
(14, 'Entity Formation', 'CORP', null, 'input[type="button"][value="Frequent User"]'),
(14, 'Entity Formation', 'CORP', null, '#5'),
(14, 'Entity Formation', 'CORP', null, 'input[type="submit"][value="Continue"]');

-- Business Info
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'CORP', null, 'input[name="BusinessInfo.IsBusinessNameReserved"][value="false"]'),
(14, 'Entity Formation', 'CORP', 'payload.Name.Legal_Name', 'input[name="BusinessInfo.BusinessName"]'),
(14, 'Entity Formation', 'CORP', null, '#btnCheckAvailability'),
(14, 'Entity Formation', 'CORP', null, '#btnNextButton');

-- Email
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'CORP', 'payload.Registered_Agent.EmailId', 'input[name="BusinessInfo.BusinessEmail"]'),
(14, 'Entity Formation', 'CORP', 'payload.Registered_Agent.EmailId', 'input[name="BusinessInfo.ConfirmBusinessEmail"]');

-- Principal Address
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'CORP', 'payload.Principal_Address.Zip_Code', 'input[name="BusinessInfo.PrincipalOfficeAddress.Zip5"]'),
(14, 'Entity Formation', 'CORP', null, 'input[name="BusinessInfo.PrincipalOfficeAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'CORP', 'payload.Principal_Address.Street_Address', 'input[name="BusinessInfo.PrincipalOfficeAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'CORP', 'payload.Principal_Address.Address_Line_2', 'input[name="BusinessInfo.PrincipalOfficeAddress.StreetAddress2"]'),
(14, 'Entity Formation', 'CORP', null, 'input[type="button"][value="Next"]');

-- Shares
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'CORP', 'payload.Stock_Details.Number_Of_Shares', 'input[name="BusinessInfo.AuthorizedShares"]');

-- Registered Agent
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'CORP', null, 'input[name="rbtnAgentType"][value="Individual"]'),
(14, 'Entity Formation', 'CORP', null, '#btnCreate'),
(14, 'Entity Formation', 'CORP', 'payload.Registered_Agent.keyPersonnelName', 'input[name="RegisteredAgent.AgentName"]'),
(14, 'Entity Formation', 'CORP', 'payload.Registered_Agent.EmailId', 'input[name="RegisteredAgent.EmailAddress"]'),
(14, 'Entity Formation', 'CORP', 'payload.Registered_Agent.EmailId', 'input[name="RegisteredAgent.ConfirmEmailAddress"]'),
(14, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Address.Zip_Code', 'input[name="RegisteredAgent.PrincipalAddress.Zip5"]'),
(14, 'Entity Formation', 'CORP', null, 'input[name="RegisteredAgent.PrincipalAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'CORP', 'payload.Registered_Agent.Address.Street_Address', 'input[name="RegisteredAgent.PrincipalAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'CORP', null, '#btnSaveNewAgent'),
(14, 'Entity Formation', 'CORP', null, 'input[type="submit"][value="Next"]');

-- Incorporator
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'input[name="IncorporatorInfo.FirstName"]'),
(14, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Incorporator_Details.keyPersonnelName', 'input[name="IncorporatorInfo.LastName"]'),
(14, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.Zip_Code', 'input[name="IncorporatorInfo.PrincipalAddress.Zip5"]'),
(14, 'Entity Formation', 'CORP', null, 'input[name="IncorporatorInfo.PrincipalAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'CORP', 'payload.Incorporator_Information.Address.Street_Address', 'input[name="IncorporatorInfo.PrincipalAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'CORP', null, '#btnAdd'),
(14, 'Entity Formation', 'CORP', null, 'input[type="submit"][value="Next"]'),
(14, 'Entity Formation', 'CORP', null, '#Next');

-- Indiana LLC Form Handler Insert Statements
-- Login Fields
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'LLC', 'data.State.filingWebsiteUsername', 'input[name="username"]'),
(14, 'Entity Formation', 'LLC', 'data.State.filingWebsitePassword', 'input[name="password"]');

-- Navigation buttons
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'LLC', null, 'span.icon-button__text.icon-button__text--transform-right'),
(14, 'Entity Formation', 'LLC', null, 'a[href="/portal/services"]'),
(14, 'Entity Formation', 'LLC', null, '[aria-label="Go to INBiz"]');

-- New tab navigation
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'LLC', null, 'a[title="START A NEW BUSINESS"]'),
(14, 'Entity Formation', 'LLC', null, 'input[type="button"][value="Next"]'),
(14, 'Entity Formation', 'LLC', null, 'input[type="button"][value="Frequent User"]'),
(14, 'Entity Formation', 'LLC', null, '#7'),
(14, 'Entity Formation', 'LLC', null, 'input[type="submit"][value="Continue"]');

-- Business Info
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'LLC', null, 'input[name="BusinessInfo.IsBusinessNameReserved"][value="false"]'),
(14, 'Entity Formation', 'LLC', 'payload.Name.Legal_Name', 'input[name="BusinessInfo.BusinessName"]'),
(14, 'Entity Formation', 'LLC', null, '#btnCheckAvailability'),
(14, 'Entity Formation', 'LLC', null, '#btnNextButton');

-- Email
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'LLC', 'payload.Registered_Agent.EmailId', 'input[name="BusinessInfo.BusinessEmail"]'),
(14, 'Entity Formation', 'LLC', 'payload.Registered_Agent.EmailId', 'input[name="BusinessInfo.ConfirmBusinessEmail"]');

-- Principal Address
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'LLC', 'payload.Principal_Address.Zip_Code', 'input[name="BusinessInfo.PrincipalOfficeAddress.Zip5"]'),
(14, 'Entity Formation', 'LLC', null, 'input[name="BusinessInfo.PrincipalOfficeAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'LLC', 'payload.Principal_Address.Street_Address', 'input[name="BusinessInfo.PrincipalOfficeAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'LLC', 'payload.Principal_Address.Address_Line_2', 'input[name="BusinessInfo.PrincipalOfficeAddress.StreetAddress2"]'),
(14, 'Entity Formation', 'LLC', null, 'input[type="button"][value="Next"]');

-- Registered Agent
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'LLC', null, 'input[name="rbtnAgentType"][value="Individual"]'),
(14, 'Entity Formation', 'LLC', null, '#btnCreate'),
(14, 'Entity Formation', 'LLC', 'payload.Registered_Agent.keyPersonnelName', 'input[name="RegisteredAgent.AgentName"]'),
(14, 'Entity Formation', 'LLC', 'payload.Registered_Agent.EmailId', 'input[name="RegisteredAgent.EmailAddress"]'),
(14, 'Entity Formation', 'LLC', 'payload.Registered_Agent.EmailId', 'input[name="RegisteredAgent.ConfirmEmailAddress"]'),
(14, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Zip_Code', 'input[name="RegisteredAgent.PrincipalAddress.Zip5"]'),
(14, 'Entity Formation', 'LLC', null, 'input[name="RegisteredAgent.PrincipalAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'LLC', 'payload.Registered_Agent.Address.Street_Address', 'input[name="RegisteredAgent.PrincipalAddress.StreetAddress1"]'),
(14, 'Entity Formation', 'LLC', null, '#btnSaveNewAgent'),
(14, 'Entity Formation', 'LLC', null, 'input[type="submit"][value="Next"]');

-- Member Management
INSERT INTO public.mapper(state_id, order_type, entity_type, json_key, online_field_mapping)
VALUES 
(14, 'Entity Formation', 'LLC', null, 'input[name="PrincipalManagementInfo.IsManagerManaged"][value="false"]'),
(14, 'Entity Formation', 'LLC', null, '#btnNext'),
(14, 'Entity Formation', 'LLC', null, 'input[type="submit"][value="Next"]');

-- NOTE: This file contains insert statements for Iowa, Alabama, and Indiana handlers.
-- To complete all handlers, continue with the same pattern for remaining states:
-- - Alaska (State ID: 2)
-- - Arizona (State ID: 3)
-- - Arkansas (State ID: 4)
-- - California (State ID: 5)
-- - Colorado (State ID: 6)
-- - Connecticut (State ID: 7)
-- - Delaware (State ID: 8)
-- - District of Columbia (State ID: 9)
-- - Florida (State ID: 10)
-- - Georgia (State ID: 11)
-- - Hawaii (State ID: 12)
-- - Idaho (State ID: 13)
-- - Illinois (State ID: 16)
-- - Kansas (State ID: 17)
-- - Kentucky (State ID: 18)
-- - Louisiana (State ID: 19)
-- - Maine (State ID: 20)
-- - Maryland (State ID: 21)
-- - Massachusetts (State ID: 22)
-- - Michigan (State ID: 23)
-- - Minnesota (State ID: 24)
-- - Mississippi (State ID: 25)
-- - Missouri (State ID: 26)
-- - Montana (State ID: 27)
-- - Nebraska (State ID: 28)
-- - Nevada (State ID: 29)
-- - New Hampshire (State ID: 30)
-- - New Jersey (State ID: 31)
-- - New Mexico (State ID: 32)
-- - New York (State ID: 33)
-- - North Carolina (State ID: 34)
-- - North Dakota (State ID: 35)
-- - Ohio (State ID: 36)
-- - Oklahoma (State ID: 37)
-- - Oregon (State ID: 38)
-- - Pennsylvania (State ID: 39)
-- - Rhode Island (State ID: 40)
-- - South Carolina (State ID: 41)
-- - South Dakota (State ID: 42)
-- - Tennessee (State ID: 43)
-- - Texas (State ID: 44)
-- - Utah (State ID: 45)
-- - Vermont (State ID: 46)
-- - Virginia (State ID: 47)
-- - Washington (State ID: 48)
-- - West Virginia (State ID: 49)
-- - Wisconsin (State ID: 50)
-- - Wyoming (State ID: 51) 