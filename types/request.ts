export interface CreateProduct {
  product_name: string;
  price: number;
  discount_percentage: number;
  discounted_price: number;
  img: string;
  review: string;
  rating: string;
}

export interface AddCart {
  user_id: string;
  product_id: string;
  qty: number;
  status: string;
}
