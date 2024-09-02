SET search_path TO $$SCHEMANAME$$;

CREATE TABLE IF NOT EXISTS $$SCHEMANAME$$.billing_details(
  id serial PRIMARY KEY,
  order_id integer NOT NULL,
  first_name VARCHAR (50) NOT NULL,
  company_name VARCHAR (50),
  address VARCHAR (50)  NOT NULL,
  apartment_add VARCHAR (50),
  city VARCHAR (50) NOT NULL,
  phone_no VARCHAR (50) NOT NULL,
  email VARCHAR (50)  NOT NULL,
  created_at TIMESTAMP  without time zone DEFAULT now(),
  updated_at TIMESTAMP  without time zone DEFAULT now(),
  FOREIGN KEY (order_id) REFERENCES orders (id)
);