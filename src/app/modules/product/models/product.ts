export interface Product {
  productId: string;
  title: string;
  productName: string;
  description: string;
  price: number;
  discountedPrice: number;
  isFavoriteProduct?: boolean;
  isAddedToCart: boolean;
  productRating: number;
  productTotalReviews: number;
  productImages: string[];
  productProperty: any[];
  userId: string;
}
export interface Seller {
  name: string;
  photo: string;
  totalProducts: number;
}
