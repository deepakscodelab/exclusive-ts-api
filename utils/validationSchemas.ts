export const createProductValidationSchema = {
  product_name: {
    notEmpty: {
      errorMessage: 'Product name cannot be empty'
    }
  },
  price: {
    notEmpty: {
      errorMessage: 'Price cannot be empty'
    }
  },
  discount_percentage: {
    notEmpty: {
      errorMessage: 'Discount percentage cannot be empty'
    }
  },
  discounted_price: {
    notEmpty: {
      errorMessage: 'Discounted price cannot be empty'
    }
  },
  img: {
    notEmpty: {
      errorMessage: 'Image cannot be empty'
    }
  }
};

export const createCartValidationSchema = {
  user_id: {
    notEmpty: {
      errorMessage: 'User Id cannot be empty'
    }
  },
  product_id: {
    notEmpty: {
      errorMessage: 'Product Id cannot be empty'
    }
  },
  qty: {
    notEmpty: {
      errorMessage: 'Quantity cannot be empty'
    }
  },
  status: {
    notEmpty: {
      errorMessage: 'Status cannot be empty'
    }
  }
};
