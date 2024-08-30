SET search_path TO $$SCHEMANAME$$;

CREATE TABLE IF NOT EXISTS $$SCHEMANAME$$.shipping_details(
  id serial PRIMARY KEY,
  order_id integer NOT NULL,
  address1 VARCHAR (50) NOT NULL,
  address2 VARCHAR (50)  NOT NULL,
  city VARCHAR (50) NOT NULL,
  postal_code VARCHAR (50)  NOT NULL,
  state VARCHAR (50) NOT NULL,
  country VARCHAR (50)  NOT NULL,
  created_at TIMESTAMP  without time zone DEFAULT now(),
  updated_at TIMESTAMP  without time zone DEFAULT now(),
  FOREIGN KEY (order_id) REFERENCES orders (id)
);