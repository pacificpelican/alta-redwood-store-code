export default function mungeInventory2000(productsArray, inventoryArray) { //  union algorithm: looking for items that exist as products whether or not they are in inventory
  console.log("about to munge inventory");
  console.log("productsArray");
  console.log(productsArray);
  console.log("inventoryArray");
  console.log(inventoryArray);
  //  return a JSON object of this shape: [{productID: 3, inventoryCount: 88}, {productID: 8, inventoryCount: 28}, {productID: 34, inventoryCount: 5}]

  //  This algorithm is based on LIFO data: the first records encuntered are considered to be definitive (they are assumed to be most recent)
  
  // THIS VERSION ('mungeInventory2000.js') is an updated version that is inclusive of all products even if they have no inventory (for the server side [to see everything for admin purposes] rather than the client [for seeing what is in inventory] and so it is the `union` algorithm while the older/client one ('mungeInventory.js') is the `intersection`)
  
  inventoryArray.reverse();

  let returnJSON = [];
  let collectedIDs = [];

  productsArray.map(function (interVal) {
    console.log("iterating on products");
    console.log(interVal);
    let pID = interVal.locator;

    let newestDate = 0;

    let innerReturnObj = [];

    inventoryArray.some(function (newVal) {
      console.log("product ID: " + interVal.locator);
      console.log("poduct ID via inventory: " + newVal.itemLocator);
      if ((newVal.created_at_time > newestDate) && (Number(newVal.itemLocator) === Number(interVal.locator))) {
        console.log("invenory ID match found");
        innerReturnObj = { productID: interVal.locator, total: newVal.total, productTitle: interVal.title, locator: newVal.locator };
        console.log("updating newestDate to " + newVal.created_at_time);
        newestDate = newVal.created_at_time;

        collectedIDs.push(interVal.locator);
        //  break;
      }
    })

    console.log("interVal.locator " + interVal.locator);
    console.log("innerReturnObj.locator " + innerReturnObj.locator);

    if (typeof innerReturnObj.locator === 'undefined') {
      console.log("typeof innerReturnObj.locator === 'undefined'");
      console.log(interVal);
      innerReturnObj.productID = Number(interVal.locator);
      innerReturnObj.productTitle = interVal.title;
    }

    returnJSON.push(innerReturnObj);
  });
  console.log("returning JSON from mungeInventory");
  console.log(returnJSON);
  return returnJSON;
}
