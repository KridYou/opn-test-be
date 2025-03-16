class CartService {
  private readonly carts: Map<string, Map<string, number>>;
  private readonly discounts: Map<
    string,
    {
      name: string;
      type: 'fixed' | 'percentage';
      amount: number;
      maxAmount?: number;
    }
  >;
  private readonly freebies: Map<
    string,
    { freeProductId: string; freeQuantity: number }
  >;

  constructor() {
    this.carts = new Map();
    this.discounts = new Map();
    this.freebies = new Map();
  }

  createCart(cartId: string): void {
    if (this.carts.has(cartId)) {
      throw new Error('Cart already exists');
    }
    this.carts.set(cartId, new Map());
  }

  addProduct(cartId: string, productId: string, quantity: number): void {
    if (!this.carts.has(cartId)) {
      throw new Error('Cart not found');
    }
    const cart = this.carts.get(cartId)!;
    cart.set(productId, (cart.get(productId) ?? 0) + quantity);

    if (this.freebies.has(productId)) {
      const { freeProductId, freeQuantity } = this.freebies.get(productId)!;
      cart.set(freeProductId, (cart.get(freeProductId) ?? 0) + freeQuantity);
    }
  }

  updateProduct(cartId: string, productId: string, quantity: number): void {
    if (!this.carts.has(cartId)) {
      throw new Error('Cart not found');
    }
    const cart = this.carts.get(cartId)!;
    if (!cart.has(productId)) {
      throw new Error('Product not found in cart');
    }
    cart.set(productId, quantity);
  }

  removeProduct(cartId: string, productId: string): void {
    if (!this.carts.has(cartId)) {
      throw new Error('Cart not found');
    }
    const cart = this.carts.get(cartId)!;
    cart.delete(productId);
  }

  destroyCart(cartId: string): void {
    if (!this.carts.has(cartId)) {
      throw new Error('Cart not found');
    }
    this.carts.delete(cartId);
    this.discounts.delete(cartId);
  }

  getCart(cartId: string): Record<string, number> {
    if (!this.carts.has(cartId)) {
      throw new Error('Cart not found');
    }
    return Object.fromEntries(this.carts.get(cartId)!);
  }

  productExists(cartId: string, productId: string): boolean {
    if (!this.carts.has(cartId)) {
      throw new Error('Cart not found');
    }
    return this.carts.get(cartId)!.has(productId);
  }

  isCartEmpty(cartId: string): boolean {
    if (!this.carts.has(cartId)) {
      throw new Error('Cart not found');
    }
    return this.carts.get(cartId)!.size === 0;
  }

  listItems(cartId: string): Record<string, number> {
    return this.getCart(cartId);
  }

  countUniqueItems(cartId: string): number {
    return this.getCart(cartId) ? Object.keys(this.getCart(cartId)).length : 0;
  }

  totalItems(cartId: string): number {
    return Object.values(this.getCart(cartId)).reduce(
      (sum, qty) => sum + qty,
      0,
    );
  }

  applyDiscount(
    cartId: string,
    name: string,
    type: 'fixed' | 'percentage',
    amount: number,
    maxAmount?: number,
  ): void {
    if (!this.carts.has(cartId)) {
      throw new Error('Cart not found');
    }
    this.discounts.set(cartId, { name, type, amount, maxAmount });
  }

  removeDiscount(cartId: string, name: string): void {
    if (
      this.discounts.has(cartId) &&
      this.discounts.get(cartId)!.name === name
    ) {
      this.discounts.delete(cartId);
    }
  }

  calculateTotal(cartId: string): number {
    let total = Object.values(this.getCart(cartId)).reduce(
      (sum, qty) => sum + qty * 100,
      0,
    );

    if (this.discounts.has(cartId)) {
      const { type, amount, maxAmount } = this.discounts.get(cartId)!;
      if (type === 'fixed') {
        total -= amount;
      } else if (type === 'percentage') {
        total -= Math.min((total * amount) / 100, maxAmount ?? total);
      }
    }
    return total;
  }

  addFreebie(
    triggerProductId: string,
    freeProductId: string,
    freeQuantity: number,
  ): void {
    this.freebies.set(triggerProductId, { freeProductId, freeQuantity });
  }
}

export default CartService;

// Example Usage
const cartService = new CartService();
cartService.createCart('cart1');
cartService.addProduct('cart1', 'product1', 5);
cartService.applyDiscount('cart1', 'SUMMER10', 'percentage', 10, 100);
cartService.addFreebie('product1', 'product2', 1);
console.log(cartService.calculateTotal('cart1'));
