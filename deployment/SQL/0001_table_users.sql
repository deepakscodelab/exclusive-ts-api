SET search_path TO $$SCHEMANAME$$;

CREATE TABLE IF NOT EXISTS $$SCHEMANAME$$.users(
  id serial PRIMARY KEY,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  email VARCHAR (355) UNIQUE NOT NULL,
  phone_number	 VARCHAR (50) NOT NULL,
  password VARCHAR (50) NOT NULL,
  address1 VARCHAR (50) NOT NULL,
  address2 VARCHAR (50) NOT NULL,
  city VARCHAR (50) NOT NULL,
  postcode VARCHAR (50) NOT NULL,
  created_at TIMESTAMP  without time zone DEFAULT now(),
  updated_at TIMESTAMP  without time zone DEFAULT now()
);