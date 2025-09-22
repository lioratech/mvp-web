-- WEBHOOKS SEED
-- PLEASE NOTE: These webhooks are only for development purposes. Leave them as they are or add new ones.

-- These webhooks are only for development purposes.
-- In production, you should manually create webhooks in the Supabase dashboard (or create a migration to do so).
-- We don't do it because you'll need to manually add your webhook URL and secret key.

-- this webhook will be triggered after deleting an account
create trigger "accounts_teardown"
    after delete
    on "public"."accounts"
    for each row
execute function "supabase_functions"."http_request"(
        'http://host.docker.internal:3000/api/db/webhook',
        'POST',
        '{"Content-Type":"application/json", "X-Supabase-Event-Signature":"WEBHOOKSECRET"}',
        '{}',
        '5000'
                 );

-- this webhook will be triggered after a delete on the subscriptions table
-- which should happen when a user deletes their account (and all their subscriptions)
create trigger "subscriptions_delete"
    after delete
    on "public"."subscriptions"
    for each row
execute function "supabase_functions"."http_request"(
        'http://host.docker.internal:3000/api/db/webhook',
        'POST',
        '{"Content-Type":"application/json", "X-Supabase-Event-Signature":"WEBHOOKSECRET"}',
        '{}',
        '5000'
                 );

-- this webhook will be triggered after every insert on the invitations table
-- which should happen when a user invites someone to their account
create trigger "invitations_insert"
    after insert
    on "public"."invitations"
    for each row
execute function "supabase_functions"."http_request"(
        'http://host.docker.internal:3000/api/db/webhook',
        'POST',
        '{"Content-Type":"application/json", "X-Supabase-Event-Signature":"WEBHOOKSECRET"}',
        '{}',
        '5000'
                 );


-- DATA SEED
-- This is a data dump for testing purposes. It should be used to seed the database with data for testing.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                            "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                            "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                            "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                            "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                            "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                            "email_change_confirm_status", "banned_until", "reauthentication_token",
                            "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
VALUES ('00000000-0000-0000-0000-000000000000', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'authenticated',
        'authenticated', 'custom@makerkit.dev', '$2a$10$b3ZPpU6TU3or30QzrXnZDuATPAx2pPq3JW.sNaneVY3aafMSuR4yi',
        '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
        '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}',
        '{"sub": "b73eb03e-fb7a-424d-84ff-18e2791ce0b4", "email": "custom@makerkit.dev", "email_verified": false, "phone_verified": false}',
        NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
        NULL, false, NULL, false),
       ('00000000-0000-0000-0000-000000000000', '31a03e74-1639-45b6-bfa7-77447f1a4762', 'authenticated',
        'authenticated', 'test@makerkit.dev', '$2a$10$NaMVRrI7NyfwP.AfAVWt6O/abulGnf9BBqwa6DqdMwXMvOCGpAnVO',
        '2024-04-20 08:20:38.165331+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-04-20 09:36:02.521776+00',
        '{"provider": "email", "providers": ["email"], "role": "super-admin"}',
        '{"sub": "31a03e74-1639-45b6-bfa7-77447f1a4762", "email": "test@makerkit.dev", "email_verified": false, "phone_verified": false}',
        NULL, '2024-04-20 08:20:34.459113+00', '2024-04-20 10:07:48.554125+00', NULL, NULL, '', '', NULL, '', 0, NULL,
        '', NULL, false, NULL, false),
       ('00000000-0000-0000-0000-000000000000', '5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf', 'authenticated',
        'authenticated', 'owner@makerkit.dev', '$2a$10$D6arGxWJShy8q4RTW18z7eW0vEm2hOxEUovUCj5f3NblyHfamm5/a',
        '2024-04-20 08:36:37.517993+00', NULL, '', '2024-04-20 08:36:27.639648+00', '', NULL, '', '', NULL,
        '2024-04-20 08:36:37.614337+00', '{"provider": "email", "providers": ["email"]}',
        '{"sub": "5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf", "email": "owner@makerkit.dev", "email_verified": false, "phone_verified": false}',
        NULL, '2024-04-20 08:36:27.630379+00', '2024-04-20 08:36:37.617955+00', NULL, NULL, '', '', NULL, '', 0, NULL,
        '', NULL, false, NULL, false),
       ('00000000-0000-0000-0000-000000000000', '6b83d656-e4ab-48e3-a062-c0c54a427368', 'authenticated',
        'authenticated', 'member@makerkit.dev', '$2a$10$6h/x.AX.6zzphTfDXIJMzuYx13hIYEi/Iods9FXH19J2VxhsLycfa',
        '2024-04-20 08:41:15.376778+00', NULL, '', '2024-04-20 08:41:08.689674+00', '', NULL, '', '', NULL,
        '2024-04-20 08:41:15.484606+00', '{"provider": "email", "providers": ["email"]}',
        '{"sub": "6b83d656-e4ab-48e3-a062-c0c54a427368", "email": "member@makerkit.dev", "email_verified": false, "phone_verified": false}',
        NULL, '2024-04-20 08:41:08.683395+00', '2024-04-20 08:41:15.485494+00', NULL, NULL, '', '', NULL, '', 0, NULL,
        '', NULL, false, NULL, false),
       ('00000000-0000-0000-0000-000000000000', 'c5b930c9-0a76-412e-a836-4bc4849a3270', 'authenticated',
        'authenticated', 'super-admin@makerkit.dev',
        '$2a$10$gzxQw3vaVni8Ke9UVcn6ueWh674.6xImf6/yWYNc23BSeYdE9wmki', '2025-02-24 13:25:11.176987+00', null, '',
        '2025-02-24 13:25:01.649714+00', '', null, '', '', null, '2025-02-24 13:25:11.17957+00',
        '{"provider": "email", "providers": ["email"], "role": "super-admin"}',
        '{"sub": "c5b930c9-0a76-412e-a836-4bc4849a3270", "email": "super-admin@makerkit.dev", "email_verified": true, "phone_verified": false}',
        null, '2025-02-24 13:25:01.646641+00', '2025-02-24 13:25:11.181332+00', null, null, '', '', null
           , '', '0', null, '', null, 'false', null, 'false');

--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                 "updated_at", "id")
VALUES ('31a03e74-1639-45b6-bfa7-77447f1a4762', '31a03e74-1639-45b6-bfa7-77447f1a4762',
        '{"sub": "31a03e74-1639-45b6-bfa7-77447f1a4762", "email": "test@makerkit.dev", "email_verified": false, "phone_verified": false}',
        'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
        '9bb58bad-24a4-41a8-9742-1b5b4e2d8abd'),
       ('5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf', '5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf',
        '{"sub": "5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf", "email": "owner@makerkit.dev", "email_verified": false, "phone_verified": false}',
        'email', '2024-04-20 08:36:27.637388+00', '2024-04-20 08:36:27.637409+00', '2024-04-20 08:36:27.637409+00',
        '090598a1-ebba-4879-bbe3-38d517d5066f'),
       ('b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        '{"sub": "b73eb03e-fb7a-424d-84ff-18e2791ce0b4", "email": "custom@makerkit.dev", "email_verified": false, "phone_verified": false}',
        'email', '2024-04-20 08:37:43.342194+00', '2024-04-20 08:37:43.342218+00', '2024-04-20 08:37:43.342218+00',
        '4392e228-a6d8-4295-a7d6-baed50c33e7c'),
       ('6b83d656-e4ab-48e3-a062-c0c54a427368', '6b83d656-e4ab-48e3-a062-c0c54a427368',
        '{"sub": "6b83d656-e4ab-48e3-a062-c0c54a427368", "email": "member@makerkit.dev", "email_verified": false, "phone_verified": false}',
        'email', '2024-04-20 08:41:08.687948+00', '2024-04-20 08:41:08.687982+00', '2024-04-20 08:41:08.687982+00',
        'd122aca5-4f29-43f0-b1b1-940b000638db'),
        ('c5b930c9-0a76-412e-a836-4bc4849a3270', 'c5b930c9-0a76-412e-a836-4bc4849a3270',
        '{"sub": "c5b930c9-0a76-412e-a836-4bc4849a3270", "email": "super-admin@makerkit.dev", "email_verified": true, "phone_verified": false}',
        'email', '2025-02-24 13:25:01.646641+00', '2025-02-24 13:25:11.181332+00', '2025-02-24 13:25:11.181332+00',
        'c5b930c9-0a76-412e-a836-4bc4849a3270');

--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."accounts" ("id", "primary_owner_user_id", "name", "slug", "email", "is_personal_account",
                                 "updated_at", "created_at", "created_by", "updated_by", "picture_url", "public_data")
VALUES ('5deaa894-2094-4da3-b4fd-1fada0809d1c', '31a03e74-1639-45b6-bfa7-77447f1a4762', 'Makerkit', 'makerkit', NULL,
        false, NULL, NULL, NULL, NULL, NULL, '{}');

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."roles" ("name", "hierarchy_level")
VALUES ('custom-role', 4);

--
-- Data for Name: accounts_memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."accounts_memberships" ("user_id", "account_id", "account_role", "created_at", "updated_at",
                                             "created_by", "updated_by")
VALUES ('31a03e74-1639-45b6-bfa7-77447f1a4762', '5deaa894-2094-4da3-b4fd-1fada0809d1c', 'owner',
        '2024-04-20 08:21:16.802867+00', '2024-04-20 08:21:16.802867+00', NULL, NULL),
       ('5c064f1b-78ee-4e1c-ac3b-e99aa97c99bf', '5deaa894-2094-4da3-b4fd-1fada0809d1c', 'owner',
        '2024-04-20 08:36:44.21028+00', '2024-04-20 08:36:44.21028+00', NULL, NULL),
       ('b73eb03e-fb7a-424d-84ff-18e2791ce0b4', '5deaa894-2094-4da3-b4fd-1fada0809d1c', 'custom-role',
        '2024-04-20 08:38:02.50993+00', '2024-04-20 08:38:02.50993+00', NULL, NULL),
       ('6b83d656-e4ab-48e3-a062-c0c54a427368', '5deaa894-2094-4da3-b4fd-1fada0809d1c', 'member',
        '2024-04-20 08:41:17.833709+00', '2024-04-20 08:41:17.833709+00', NULL, NULL);

-- MFA Factors
INSERT INTO "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at",
                                  "secret", "phone", "last_challenged_at")
VALUES ('659e3b57-1128-4d26-8757-f714fd073fc4', 'c5b930c9-0a76-412e-a836-4bc4849a3270', 'iPhone', 'totp', 'verified',
        '2025-02-24 13:23:55.5805+00', '2025-02-24 13:24:32.591999+00', 'NHOHJVGPO3R3LKVPRMNIYLCDMBHUM2SE', null,
        '2025-02-24 13:24:32.563314+00');



-- main events  seed
INSERT INTO "public"."main_events" ("id", "description", "type", "reference_days", "reference_hours", "reference_value", "incidence_inss", "incidence_irrf", "incidence_fgts", "created_at", "updated_at") VALUES ('1', 'SALARIO BASE MENSALISTA', 'provento', 'true', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('2', 'HORAS NORMAIS HORISTA', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('3', 'DSR', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('4', 'COMISSOES', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('5', 'DSR COMISSOES', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('6', 'HORAS EXTRAS 50%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('7', 'HORAS EXTRAS 60%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('8', 'HORAS EXTRAS 70%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('9', 'HORAS EXTRAS 75%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('10', 'HORAS EXTRAS 80%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('11', 'HORAS EXTRAS 85%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('12', 'HORAS EXTRAS 100%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('13', 'ADICIONAL NOTURNO 20%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('14', 'ADICIONAL NOTURNO 25%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('15', 'ADICIONAL NOTURNO 30%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('16', 'ADICIONAL NOTURNO 40%', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('17', 'D.S.R. S/ VARIÁVEIS', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('18', 'ADIC. INSALUBRIDADE', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('19', 'ADIC. PERICULOSIDADE', 'provento', 'true', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('20', 'SALARIO MATERNIDADE', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('21', 'SALARIO FAMILIA', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('22', '13º SALARIO - 1 ª PARCELA', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('23', 'MEDIA DE VARIÁVEIS 1ª PARCELA - 13º SALÁRIO', 'provento', 'false', 'false', 'false', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('24', '13º SALARIO - 2ª PARCELA', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('25', 'MEDIA DE VARIÁVEIS 2ª PARCELA - 13º SALÁRIO', 'provento', 'false', 'false', 'false', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('26', '13º SALARIO PROPORCIONAL ', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('27', 'MEDIA DO 13º SALARIO PROPORCIONAL', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('28', '13º SALARIO INDENIZADO RESCISÃO', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('29', 'MEDIAS 13º SALARIO INDENIZADO RESCISÃO', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('30', '13º SALARIO COMPLEMENTO', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('31', 'AVISO PREVIO TRABALHADO', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('32', 'AVISO PREVIO INDENIZADO', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('33', 'MÉDIAS DO AVISO PRÉVIO INDENIZADO', 'provento', 'false', 'false', 'true', 'true', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('34', 'FERIAS GOZADAS', 'provento', 'true', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('35', 'MEDIAS DE VARIAVEIS FERIAS GOZADAS', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('36', '1/3 FERIAS GOZADAS', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('37', 'ABONO PECUNIARIO DE FERIAS', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('38', 'MÉDIAS DE VARIAVEIS ABONO PECUNIÁRIO FÉRIAS', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('39', '1/3 ABONO PECUNIARIO DE FERIAS', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('40', 'FERIAS INDENIZADAS RESCISÃO', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('41', 'MEDIAS DE VARIAVEIS FERIAS INDENIZADAS RESCISÃO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('42', '1/3 FERIAS INDENIZADAS RESCISÃO', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('43', 'FERIAS PROPORCIONAIS RESCISAO', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('44', 'MÉDIAS DE VARIÁVEIS FÉRIAS PROPORCIONAIS RESCISÃO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('45', '1/3 FÉRIAS PROPORCIONAIS RESCISÃO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('46', 'FÉRIAS EM DOBRO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('47', 'MÉDIAS SOBRE VARIAVEIS FÉRIAS EM DOBRO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('48', '1/3 FÉRIAS EM DOBRO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('49', 'LICENCA REMUNERADA', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('50', 'FERIADO REMUNERADO', 'provento', 'true', 'false', 'false', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('51', 'DOMINGO REMUNERADO', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('52', 'GRATIFICACAO DE FUNCAO', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('53', 'RETIRADA PRO LABORE', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('54', 'ADICIONAL DE CAIXA', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('55', 'ABONO', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('56', 'PREMIO POR TEMPO SERVICO', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('57', 'ANUENIO', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('58', 'BIENIO', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('59', 'TRIENIO', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('60', 'QUINQUÊNIO', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('61', 'PARTICIPACAO NOS LUCROS', 'provento', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('62', 'INDENIZACAO ART.479 CLT', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('63', 'ABONO PIS-PASEP EMPRESA', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('64', 'ANTECIPAÇÃO 1ª PARCELA 13º SALÁRIO - FÉRIAS', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('65', 'INSUFICIENCIA MES ATUAL', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('66', 'ATESTADO', 'provento', 'true', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('67', 'ABONO PECUNIÁRIO EM DOBRO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('68', '1/3 ABONO PECUNIÁRIO EM DOBRO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('69', 'MEDIAS ABONO PEC FERIAS EM DOBRO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('70', '1/3 MEDIAS ABONO FÉRIAS EM DOBRO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('71', 'INDENIZAÇÃO ESTABILIDADE CIPA', 'provento', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('72', 'INDENIZAÇÃO ESTABILIDADE AUXÍLIO DOENÇA', 'provento', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('73', 'INDENIZAÇÃO ACIDENTE TRABALHO', 'provento', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('74', 'CESTA BASICA', 'provento', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('75', 'HORA AULA', 'provento', 'false', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('76', 'DIARIA DE VIAGENS', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('77', 'FERIAS SOBRE AVISO PREVIO INDENIZADO', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('78', '1/3 FERIAS SOBRE AVISO INDENIZADO', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('79', 'ADIANTAMENTO SALARIAL', 'provento', 'false', 'false', 'false', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('80', 'SALÁRIO MATERNIDADE 13º SALÁRIO', 'provento', 'false', 'false', 'false', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('81', 'BOLSA AUXÍLIO ESTAGIARIOS', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('82', 'RECESSO ESTAGIARIO', 'provento', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('83', 'RECESSO ESTAGIARIO VENCIDO', 'provento', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('84', 'RECESSO ESTAGIARIO PROPORCIONAL', 'provento', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('85', 'AJUDA CUSTO TELETRABALHO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('86', 'AJUDA DE CUSTO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('87', 'ASSISTENCIA AO FILHO', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('88', 'AUXÍLIO CRECHE', 'provento', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('89', 'DIFERENÇA DE FÉRIAS', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('90', 'DIFERENÇA DE SALARIO', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('91', 'AUXILIO-DOENÇA ACIDENTARIO', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('92', 'REEMBOLSO KM', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('93', 'REEMBOLSO PASSAGEM', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('94', 'REEMBOLSOS DIVERSOS', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('95', 'ABONO ', 'provento', 'false', 'false', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('96', 'PRÊMIO ', 'provento', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('97', 'AJUDA DE CUSTO PRÓ-LABORE', 'provento', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('300', 'FALTAS NAO ABONADAS', 'desconto', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('301', 'ATRASOS/SAÍDAS ANTECIPADAS INJUSTIFICADOS', 'desconto', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('302', 'DESCONTO DSR', 'desconto', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('303', 'AVISO PREVIO NÃO TRABALHADO', 'desconto', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('304', 'CONTRIBUIÇÃO CONFEDERATIVA ', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('305', 'CONTRIBUICAO SINDICAL', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('306', 'CONTRIBUICAO ASSISTENCIAL ', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('307', 'CONTRIBUIÇÃO NEGOCIAL', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('308', 'MENSALIDADE SINDICAL', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('309', 'PENSAO ALIMENTICIA', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('310', 'PENSAO LIQUIDO FERIAS', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('311', 'PENSAO ALIMENTICIA FERIAS', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('312', 'PENSAO ALIMENTICIA 13º SALÁRIO', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('313', 'PENSAO LIQUIDO 13º SALARIO', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('314', 'SEGURO DE VIDA', 'desconto', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('315', 'VALE TRANSPORTE', 'desconto', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('316', 'PLANO SAUDE', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('317', 'PLANO ODONTOLÓGICO', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('318', 'DESC.PLANO SAUDE DEPENDENTE', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('319', 'DESC. PLANO ODONTO DEPENDENTE', 'desconto', 'false', 'false', 'false', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('320', 'CO-PARTICIPAÇÃO PLANO SAÚDE', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('321', 'CO-PARTICIPAÇÃO PLANO SAÚDE DEPENDENTE', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('322', 'CO-PARTICIPAÇÃO VALE ALIMENTAÇÃO', 'desconto', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('323', 'CO-PARTICIPAÇÃO VALE REFEIÇÃO', 'desconto', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('324', 'CO-PARTICIPAÇÃO PREVIDÊNCIA PRIVADA', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('325', 'CO-PARTICIPAÇÃO CONVENIO ACADEMIA', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('326', 'CONVÊNIO FARMÁCIA', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('327', 'CONVÊNIO SUPERMERCADO', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('328', 'CONVÊNIO PAPELARIA', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('329', 'DESC 13º SALARIO ADTO. FERIAS', 'desconto', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('330', 'DESC. 13º SALARIO 1ª PARCELA ', 'desconto', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('331', 'DESC. 13º SALARIO PAGO PREVIDENCIA', 'desconto', 'true', 'true', 'true', 'true', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('332', 'DESC. MULTA ART. 479 CLT', 'desconto', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('333', 'PRÊMIO ', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('334', 'INSS S/ FOLHA', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('335', 'INSS S/ 13º SALARIO', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('336', 'INSS S/ FERIAS', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('337', 'INSS PRO-LABORE', 'desconto', 'false', 'false', 'true', 'false', 'true', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('338', 'IRRF S/FOLHA', 'desconto', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('339', 'IRRF S/ 13º SALARIO', 'desconto', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('340', 'IRRF S/ FERIAS', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('341', 'IRRF S/ PRO-LABORE', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('342', 'IRRF S/ ADIANTAMENTO', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('343', 'IRRF S/ PLR', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('344', 'INSUFICIENCIA MES ANTERIOR', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('345', 'EMPRESTIMO ', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('346', 'EMPRESTIMO CONSIGNADO', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('347', 'EMPRESTIMO GOV', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('348', 'LIQUIDO RECEBIDO', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('349', 'LIQUIDO FERIAS RECEBIDO', 'desconto', 'true', 'true', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('350', 'LIQUIDO RECESSO PAGO', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('351', 'LIQUIDO ENCERRAMENTO ESTÁGIO PAGO', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('352', 'LIQUIDO RECISÃO PAGO', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('353', 'DESCONTOS DIVERSOS', 'desconto', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('501', 'SEGURO DE VIDA EMPRESA', 'outro', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('502', 'VALE TRANSPORTE EMPRESA', 'outro', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('503', 'VALE ALIMENTAÇÃO EMPRESA', 'outro', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('504', 'VALE REFEIÇÃO EMPRESA', 'outro', 'true', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('505', 'PREVIDÊNCIA PRIVADA EMPRESA', 'outro', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('506', 'CONVÊNIO ACADEMIA EMPRESA', 'outro', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('507', 'PLANO ODONTO EMPRESA', 'outro', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572'), ('508', 'PLANO SAUDE EMPRESA', 'outro', 'false', 'false', 'true', 'false', 'false', 'false', '2025-09-08 22:22:11.474572', '2025-09-08 22:22:11.474572');
-- main events seed end
        

--
-- Data for Name: billing_customers; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: subscription_items; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 5, true);


--
-- Name: billing_customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."billing_customers_id_seq"', 1, false);


--
-- Name: invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."invitations_id_seq"', 19, true);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."role_permissions_id_seq"', 7, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 19, true);
