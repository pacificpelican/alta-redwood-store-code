import { store } from 'react-easy-state'

function findObjectsWithProductID(objArray, productID) {
  let futureReturn = false;
  objArray.map(function(iVal) {
    console.log("running findObjectsWithProductID; current row:");
    console.log(iVal);
    console.log("product ID via param " + productID + " |  product ID via map: " + iVal.productID);
    if (Number(iVal.productID) === Number(productID)) {
      console.log("returning true");
      //  return true;
      futureReturn = true;
    }
    else {
      // do nothing
    }
  })
  console.log("returning " + futureReturn);
  return futureReturn;
}

// a complex global store with a lot of derived data (getters and setters)
// use 'todos' instead of 'this' in the store methods to make them passable as callbacks
const cartstore = store({
  cart: [],
  addItemToCart(newlastObj) {
    console.log("about to add to cart: ");
    console.log(newlastObj);
    cartstore.cart.push(newlastObj);
    cartstore.getCart();
  },
  upsertItemToCart(newlastObj) {
    console.log("about to upsert to cart: ");
    console.log(newlastObj);
    let resu = findObjectsWithProductID(cartstore.cart, newlastObj.productID);
    console.log("resu: " + resu);
    if ((findObjectsWithProductID(cartstore.cart, newlastObj.productID)) !== true) {
      this.addItemToCart(newlastObj);
    }
    else {
      this.tickUpQuantity(newlastObj.quantity, newlastObj.productID);
    }
  },
  tickUpQuantity(addedAmount, productID) {
    console.log("running tickUpQunatity with " + addedAmount + " more quantity for product " + productID);
    let retArray = [];
    cartstore.cart.map(function(inVal) {
      if (Number(inVal.productID) === Number(productID)) {
        retArray.push({productID: inVal.productID, quantity: Number(inVal.quantity) + Number(addedAmount), productName: inVal.productName, addedToCartDateTime: inVal.addedToCartDateTime, updatedDateTime: Date.now()})
      }
      else {
        retArray.push(inVal);
      }
    })
    console.log("tick up qunatity function ran: ");
    console.log(retArray);
    cartstore.cart = retArray;
  },
  getCart() {
    console.log("about to return");
    console.log(cartstore.cart);
    return cartstore.cart;
  },
  deleteProductFromCart(productID) {
    console.log("about to delete product ID#" + productID + " from the cart");
    const resu = cartstore.cart.filter(word => Number(word.productID) !== Number(productID));
    cartstore.cart = resu;
  },
  resetCart() {
    cartstore.cart = [];
  },
  saveCartToLocalStorage() {
    console.log("running saveCartToLocalStorage() ");
    let setItem = JSON.stringify(cartstore.cart);
    console.log(setItem);
    localStorage.setItem('cart', setItem);
  },
  getCartFromLocalStorage() {
    console.log("running getCartFromLocalStorage() ");
    let rawStorageItem = localStorage.getItem('cart');
    console.log(rawStorageItem);
    if ((typeof rawStorageItem !== 'undefined') && (rawStorageItem !== null)) {
      cartstore.cart = JSON.parse(rawStorageItem);
    }
  }
})

export default cartstore;
