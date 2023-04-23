export default function findProductNameFromID(productID, inventoryArray) {
  let productTitle = '';
  console.log("running findProductNameFromID");
  console.log(productID);
  console.log(inventoryArray);
  inventoryArray.map(function (ev) {
    if (Number(ev.productID) === Number(productID)) {
      console.log("matched product ID #" + productID);
      console.log(ev.productTitle);
      productTitle = ev.productTitle;
    }
  })
  return productTitle;
}
