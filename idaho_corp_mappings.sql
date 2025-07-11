-- Idaho CORP Form Field Mappings
-- This file contains the database mappings for Idaho Corporation form fields

INSERT INTO mapper (state_id, order_type, entity_type, online_field_mapping, json_key, mapping_index) VALUES
-- Navigation and UI Elements (0-14)
(13, 'CORP', 'Corporation', '.btn.btn-default.login-link', null, 0),
(13, 'CORP', 'Corporation', '.btn-raised.btn-light-primary.submit', null, 1),
(13, 'CORP', 'Corporation', 'span.title[text()="Articles of Incorporation (General Business Corporation)"]', null, 2),
(13, 'CORP', 'Corporation', 'button.btn.btn-primary.btn-text', null, 3),
(13, 'CORP', 'Corporation', 'button.btn.btn-raised.btn-primary.next.toolbar-button', null, 4),
(13, 'CORP', 'Corporation', '#field-addr-country-BkI2Dnk1ZM', null, 5),
(13, 'CORP', 'Corporation', 'label[for="field-H1dcEVxX8"]', null, 6),
(13, 'CORP', 'Corporation', 'button.btn.btn-medium-neutral.add', null, 7),
(13, 'CORP', 'Corporation', 'button[text()="Save"]', null, 8),
(13, 'CORP', 'Corporation', 'button.btn.btn-raised.btn-primary.form-button.add-row', null, 9),
(13, 'CORP', 'Corporation', 'button[text()="Save"]', null, 10),
(13, 'CORP', 'Corporation', '#field-addr-country-HJzMbzRIxm', null, 11),
(13, 'CORP', 'Corporation', 'button.btn.btn-raised.btn-primary.form-button.add-row (Director)', null, 12),
(13, 'CORP', 'Corporation', 'button[text()="Save"]', null, 13),
(13, 'CORP', 'Corporation', 'button.btn.btn-raised.btn-primary.next.toolbar-button', null, 14),

-- Company Name Fields (15-16)
(13, 'CORP', 'Corporation', 'field-field1-undefined', 'payload.Name.Legal_Name', 15),
(13, 'CORP', 'Corporation', 'field-field2-undefined', 'payload.Name.Legal_Name', 16),

-- Principal Address Fields (17-21)
(13, 'CORP', 'Corporation', 'field-address1-r1lfZGRIgX', 'payload.Principal_Address.Street_Address', 17),
(13, 'CORP', 'Corporation', 'field-addr-city-r1lfZGRIgX', 'payload.Principal_Address.City', 18),
(13, 'CORP', 'Corporation', 'field-addr-zip-r1lfZGRIgX', 'payload.Principal_Address.Zip_Code', 19),
(13, 'CORP', 'Corporation', '#field-addr-state-r1lfZGRIgX', 'payload.Principal_Address.State', 20),
(13, 'CORP', 'Corporation', '#field-addr-country-r1lfZGRIgX', null, 21),

-- Registered Agent Mailing Information (22-25)
(13, 'CORP', 'Corporation', 'field-address1-HJzMbzRIxm', 'payload.Registered_Agent.Mailing_Information.Street_Address', 22),
(13, 'CORP', 'Corporation', 'field-addr-city-HJzMbzRIxm', 'payload.Registered_Agent.Mailing_Information.City', 23),
(13, 'CORP', 'Corporation', 'field-addr-zip-HJzMbzRIxm', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 24),
(13, 'CORP', 'Corporation', '#field-addr-state-HJzMbzRIxm', 'payload.Registered_Agent.Mailing_Information.State', 25),

-- Director Information (26-28)
(13, 'CORP', 'Corporation', '#field-address1-ryDNpwaQVm', 'payload.Director_Information.Address.Street_Address', 26),
(13, 'CORP', 'Corporation', '#field-addr-city-ryDNpwaQVm', 'payload.Director_Information.Address.City', 27),
(13, 'CORP', 'Corporation', '#field-addr-zip-ryDNpwaQVm', 'payload.Director_Information.Address.Zip_Code', 28),

-- Registered Agent Primary Address (29-31)
(13, 'CORP', 'Corporation', '#field-address1-SJBKrsl8M_PRIMARY', 'payload.Registered_Agent.Address.Street_Address', 29),
(13, 'CORP', 'Corporation', '#field-addr-city-SJBKrsl8M_PRIMARY', 'payload.Registered_Agent.Address.City', 30),
(13, 'CORP', 'Corporation', '#field-addr-zip-SJBKrsl8M_PRIMARY', 'payload.Registered_Agent.Address.Zip_Code', 31),

-- Registered Agent Mailing Address (32-34)
(13, 'CORP', 'Corporation', '#field-address1-SJBKrsl8M_MAIL', 'payload.Registered_Agent.Mailing_Information.Street_Address', 32),
(13, 'CORP', 'Corporation', '#field-addr-city-SJBKrsl8M_MAIL', 'payload.Registered_Agent.Mailing_Information.City', 33),
(13, 'CORP', 'Corporation', '#field-addr-zip-SJBKrsl8M_MAIL', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 34),

-- Governor Information (35-40)
(13, 'CORP', 'Corporation', 'field-address1-ByOoRiT-f', 'payload.Governor_Information.Address.Street_Address', 35),
(13, 'CORP', 'Corporation', 'field-addr-city-ByOoRiT-f', 'payload.Governor_Information.Address.City', 36),
(13, 'CORP', 'Corporation', 'field-addr-state-ByOoRiT-f', 'payload.Governor_Information.Address.State', 37),
(13, 'CORP', 'Corporation', 'field-addr-zip-ByOoRiT-f', 'payload.Governor_Information.Address.Zip_Code', 38),
(13, 'CORP', 'Corporation', '#field-addr-state-ByOoRiT-f', null, 39),
(13, 'CORP', 'Corporation', '#field-addr-country-ByOoRiT-f', null, 40),

-- Login Credentials (41-42)
(13, 'CORP', 'Corporation', 'username', 'data.State.filingWebsiteUsername', 41),
(13, 'CORP', 'Corporation', 'password', 'data.State.filingWebsitePassword', 42),

-- Company Name (Duplicate for different sections) (43-44)
(13, 'CORP', 'Corporation', 'field-field1-undefined', 'payload.Name.Legal_Name', 43),
(13, 'CORP', 'Corporation', 'field-field2-undefined', 'payload.Name.Legal_Name', 44),

-- Stock Details (45)
(13, 'CORP', 'Corporation', 'field-S1L7R3kJ-G', 'payload.Stock_Details.Number_Of_Shares', 45),

-- Principal Address (46-49)
(13, 'CORP', 'Corporation', 'field-address1-BkI2Dnk1ZM', 'payload.Registered_Agent.Mailing_Information.Street_Address', 46),
(13, 'CORP', 'Corporation', 'field-addr-city-BkI2Dnk1ZM', 'payload.Registered_Agent.Mailing_Information.City', 47),
(13, 'CORP', 'Corporation', 'field-addr-zip-BkI2Dnk1ZM', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 48),
(13, 'CORP', 'Corporation', '#field-addr-state-BkI2Dnk1ZM', 'payload.Registered_Agent.Mailing_Information.State', 49),

-- Registered Agent Primary Address (50-52)
(13, 'CORP', 'Corporation', '#field-address1-ryIrEjxIf_PRIMARY', 'payload.Registered_Agent.Address.Street_Address', 50),
(13, 'CORP', 'Corporation', '#field-addr-city-ryIrEjxIf_PRIMARY', 'payload.Registered_Agent.Address.City', 51),
(13, 'CORP', 'Corporation', '#field-addr-zip-ryIrEjxIf_PRIMARY', 'payload.Registered_Agent.Address.Zip_Code', 52),

-- Registered Agent Mailing Address (53-55)
(13, 'CORP', 'Corporation', '#field-address1-ryIrEjxIf_MAIL', 'payload.Registered_Agent.Mailing_Information.Street_Address', 53),
(13, 'CORP', 'Corporation', '#field-addr-city-ryIrEjxIf_MAIL', 'payload.Registered_Agent.Mailing_Information.City', 54),
(13, 'CORP', 'Corporation', '#field-addr-zip-ryIrEjxIf_MAIL', 'payload.Registered_Agent.Mailing_Information.Zip_Code', 55),

-- Incorporator Information (56-58)
(13, 'CORP', 'Corporation', '#field-address1-B1zN6wp7EQ', 'payload.Incorporator_Information.Address.Street_Address', 56),
(13, 'CORP', 'Corporation', '#field-addr-city-B1zN6wp7EQ', 'payload.Incorporator_Information.Address.City', 57),
(13, 'CORP', 'Corporation', '#field-addr-zip-B1zN6wp7EQ', 'payload.Incorporator_Information.Address.Zip_Code', 58),

-- Name Fields (59-60)
(13, 'CORP', 'Corporation', 'LAST_NAME', null, 59),
(13, 'CORP', 'Corporation', 'FIRST_NAME', null, 60); 