import CartService from './cart.service';

function runCartServiceTests() {
  const cartService = new CartService();

  console.log('Creating cart...');
  cartService.createCart('cart1');

  console.log('Adding product...');
  cartService.addProduct('cart1', 'product1', 5);

  console.log('Applying discount...');
  cartService.applyDiscount('cart1', 'SUMMER10', 'percentage', 10, 100);

  console.log('Adding freebie...');
  cartService.addFreebie('product1', 'product2', 1);

  console.log('Final Cart:', cartService.getCart('cart1'));
  console.log('Total Price:', cartService.calculateTotal('cart1'));
}

runCartServiceTests();
