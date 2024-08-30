SET search_path TO $$SCHEMANAME$$;

CREATE TABLE IF NOT EXISTS $$SCHEMANAME$$.order_details(
  id serial PRIMARY KEY,
  order_id integer NOT NULL,
  cart_id integer NOT NULL,
  order_status SMALLINT NOT NULL,
  created_at TIMESTAMP  without time zone DEFAULT now(),
  updated_at TIMESTAMP  without time zone DEFAULT now(),
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (cart_id) REFERENCES cart (id)
);