DROP ROLE IF EXISTS admin;
CREATE ROLE admin nologin;

GRANT admin TO authenticator;
GRANT usage ON SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

DROP ROLE IF EXISTS superadmin;
CREATE ROLE superadmin nologin;

GRANT superadmin TO authenticator;
GRANT usage ON SCHEMA public TO superadmin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO superadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO superadmin;
GRANT usage ON SCHEMA auth TO superadmin;

GRANT SELECT, UPDATE ON auth.users TO superadmin;

