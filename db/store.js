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

exports.createNewStoreItem = function (newItem, cb) {
  console.log("running createNewStoreItem");
  process.nextTick(function () {
    MongoClient.connect(mongoAddress, function (err, db) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log("about to add NEW STORE ITEM");

        console.log(typeof newItem);

        let serverObject = JSON.parse(newItem);

        let dbObject = Object.assign(serverObject, {
          locator: Number(Date.now()) + Math.floor(Math.random() * locatorScale + 1),
          created_at_time: Date.now(),
          hidden: `no`
        });

        console.log("tuple to be saved [store]");

        try {
          //  add this account to the database
          db.collection(`store_items`).insertOne(dbObject);

        }
        catch (err) {
          console.log("error in store item");
          return cb(new Error(err));
        }

        return cb(null, newItem);
      }
    });
  });
}

exports.createNewItem = function (table, newItem, cb) {
  console.log("running createNewItem");
  process.nextTick(function () {
    MongoClient.connect(mongoAddress, function (err, db) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log("about to add NEW STORE ITEM");

        console.log(typeof newItem);

        let serverObject = JSON.parse(newItem);

        let dbObject = Object.assign(serverObject, {
          locator: Number(Date.now()) + Math.floor(Math.random() * locatorScale + 1),
          created_at_time: Date.now()
        });

        console.log("tuple to be saved [store: createNewItem]");


        try {
          //  add this account to the database
          db.collection(table).insertOne(dbObject);

        }
        catch (err) {
          console.log("error in store item");
          return cb(new Error(err));
        }

        return cb(null, newItem);
      }
    });
  });
}
