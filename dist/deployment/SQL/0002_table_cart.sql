SET search_path TO $$SCHEMANAME$$;

CREATE TABLE IF NOT EXISTS $$SCHEMANAME$$.cart(
  id serial PRIMARY KEY,
  user_id integer NOT NULL,
  product_id integer NOT NULL,
  qty integer NOT NULL,
  status	BOOLEAN  NOT NULL,
  created_at TIMESTAMP  without time zone DEFAULT now(),
  updated_at TIMESTAMP  without time zone DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);