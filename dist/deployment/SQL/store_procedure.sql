SET search_path TO $$SCHEMANAME$$;
--
-- Name: last_updated(); Type: FUNCTION; Schema: dev; Owner: postgres
--

CREATE OR REPLACE FUNCTION $$SCHEMANAME$$.last_updated() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END $$;

/*
ALTER FUNCTION $$SCHEMANAME$$.last_updated() OWNER TO postgres;
*/

DROP TRIGGER IF EXISTS last_updated ON $$SCHEMANAME$$.users;
CREATE TRIGGER last_updated BEFORE UPDATE ON $$SCHEMANAME$$.users FOR EACH ROW EXECUTE PROCEDURE $$SCHEMANAME$$.last_updated();

--
-- Name: product_in_stock(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION $$SCHEMANAME$$.product_in_stock(p_product_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_out     INTEGER;
BEGIN
    -- AN ITEM IS IN-STOCK IF THERE ARE EITHER NO ROWS IN THE rental TABLE
    -- FOR THE ITEM OR ALL ROWS HAVE return_date POPULATED

    SELECT total_quantity INTO v_out
    FROM $$SCHEMANAME$$.products 
    WHERE id = p_product_id;

    IF v_out > 0 THEN
      RETURN TRUE;
    ELSE
      RETURN FALSE;
    END IF;
END $$;

/*
ALTER FUNCTION $$SCHEMANAME$$.product_in_stock(p_product_id integer) OWNER TO postgres;
*/