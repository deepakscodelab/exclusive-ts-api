SET search_path TO $$SCHEMANAME$$;

CREATE TABLE IF NOT EXISTS $$SCHEMANAME$$.orders(
  id serial PRIMARY KEY,
  user_id integer NOT NULL,
  shipping_amount NUMERIC (4, 2) NOT NULL,
  total_price NUMERIC (10, 2)  NOT NULL,
  total_items	 integer NOT NULL,
  payment_status VARCHAR (50) NOT NULL,
  order_status VARCHAR (50) NOT NULL,
  cancel_reason VARCHAR (50) NULL,
  coupon_code VARCHAR (50),
  created_at TIMESTAMP  without time zone DEFAULT now(),
  updated_at TIMESTAMP  without time zone DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users (id)
);