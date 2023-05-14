const dev = process.env.NODE_ENV !== "production";

let mongoUrl;
let locatorScale = parseInt(1000000000000);

let mongoName;

if (process.env.NODE_ENV !== "production") {
  mongoUrl = "mongodb://localhost:27017/"; //  dev database server
  mongoName = process.env.DEV_MONGO;
  keySecret = process.env.TEST_SECRET_KEY;

} else {
  mongoUrl = process.env.MONGODB_URL; //  production database server
  mongoName = process.env.MONGO_NAME || '';
  keySecret = process.env.SECRET_KEY;
}

const mongoAddress = mongoUrl + mongoName;

var MongoClient = require("mongodb").MongoClient;

exports.createNewStoreItem = async function write_to_db(newItem) {
  console.log("\x1b[35m running createNewStoreItem in store.js \x1b[0m");
  console.log(newItem);
  // add the newItem to the database collection store_items
  const client = await MongoClient.connect(mongoAddress, {});

  const db = client.db(mongoName);
  const collection = db.collection('store_items');

  let serverObject = JSON.parse(newItem);

  let intermediateObject = Object.assign({locator: Number(Date.now()) + Math.floor(Math.random() * locatorScale + 1), created_at_time: Date.now()}, serverObject);

  try {
    const result = await collection.insertOne(intermediateObject);
    console.log(`New item added with ID: ${result.insertedId} and locator ${intermediateObject.locator}`);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
}

exports.createNewItem = async function (table, newItem, cb) {
  console.log("\x1b[94m running createNewItem \x1b[0m");
  console.log(newItem);

  try {
    const client = await MongoClient.connect(mongoAddress, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(mongoName);

    console.log("about to add NEW STORE ITEM");

    console.log(typeof newItem);

    let serverObject = JSON.parse(newItem);

    let dbObject = Object.assign(serverObject, {
      locator: Number(Date.now()) + Math.floor(Math.random() * locatorScale + 1),
      created_at_time: Date.now()
    });

    console.log("tuple to be saved [store: createNewItem]");

    const result = await db.collection(table).insertOne(dbObject);

    console.log(`New item added to '${table}' collection with ID: ${result.insertedId}`);

    cb(null, newItem);

    client.close();
  } catch (error) {
    console.error(error);
    cb(new Error('Internal server error'));
  }
}
