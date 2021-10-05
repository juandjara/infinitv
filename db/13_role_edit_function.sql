CREATE OR REPLACE FUNCTION edit_role (uuid uuid, new_role text)
  RETURNS text
  AS $$
DECLARE
  updated_role text;
BEGIN
  UPDATE
    auth.users
  SET
    ROLE = new_role
  WHERE
    id = uuid;
  SELECT
    ROLE INTO updated_role
  FROM
    auth.users
  WHERE
    id = uuid;
  RETURN updated_role;
END;
$$
LANGUAGE plpgsql;

