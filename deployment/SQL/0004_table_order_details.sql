SET search_path TO $$SCHEMANAME$$;

CREATE TABLE IF NOT EXISTS $$SCHEMANAME$$.order_details(
  id serial PRIMARY KEY,
  order_id integer NOT NULL,
  cart_id integer NOT NULL,
  product_id integer NOT NULL,
  product_price NUMERIC (10, 2)  NOT NULL,
  discount_percentage	 NUMERIC (5, 2) NOT NULL,
  discounted_price NUMERIC (5, 2) NOT NULL,
  qty integer NOT NULL,
  created_at TIMESTAMP  without time zone DEFAULT now(),
  updated_at TIMESTAMP  without time zone DEFAULT now(),
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (product_id) REFERENCES products (id),
  FOREIGN KEY (cart_id) REFERENCES cart (id)
);