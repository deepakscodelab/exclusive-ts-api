SET search_path TO $$SCHEMANAME$$;

CREATE TABLE IF NOT EXISTS $$SCHEMANAME$$.products(
  id serial PRIMARY KEY,
  product_name VARCHAR (50) NOT NULL,
  price	 NUMERIC (5, 2) NOT NULL,
  discount_percentage	 NUMERIC (5, 2) NOT NULL,
  discounted_price NUMERIC (5, 2) NOT NULL,
  img	VARCHAR (50) ,
  review VARCHAR (50) ,
  rating VARCHAR (50) ,
  created_at TIMESTAMP  without time zone DEFAULT now(),
  updated_at TIMESTAMP  without time zone DEFAULT now()
);