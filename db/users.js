const dev = process.env.NODE_ENV !== "production";

let mongoUrl;
let locatorScale = parseInt(1000000000000);

let mongoName;

if (process.env.NODE_ENV !== "production") {
  mongoUrl = "mongodb://localhost:27017/"; //  dev database server
  mongoName = process.env.DEV_MONGO;

} else {
  mongoUrl = process.env.MONGODB_URL; //  production database server
  mongoName = process.env.MONGO_NAME || '';
}


const mongoAddress = mongoUrl + mongoName;

const users_collection = "users_collection";

var MongoClient = require("mongodb").MongoClient;

let usersCollection = [];

const crypto = require('crypto');
const { users } = require(".");

async function get_user_data() {
  const client = await MongoClient.connect(mongoAddress, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(mongoName);
  const usersCollection = await db.collection('users_collection').find({}).toArray();

  console.log("usersCollection at source");
  console.log(usersCollection);

  client.close();

  return usersCollection;
}

get_user_data();

function getHash(src) {
  const hash = crypto
    .createHmac("sha256", src)
    .update("I love cupcakes!") // via https://nodejs.org/api/crypto.html
    .digest("hex");
  return hash;
}

const records = usersCollection;
console.log("records - usersCollection collection");
console.log(usersCollection);

exports.findById = function (id, cb) {
  //  check if id exists, if so return cb(null, record); otherwise return cb(new Error('User ' + id + ' does not exist'));
  console.log("running findById for id " + id);
  process.nextTick(function () {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error("User " + id + " does not exist"));
    }
  }
  );

}

exports.findByUsername = async function (username, cb) {
  console.log("\x1b[33m running findByUsername for username \x1b[0m" + username);
  usersCollection = await get_user_data();
  console.log("usersCollection at source");
  console.log(usersCollection);
  //  check if username exists
  //  if username exists, return the user record in this format: var record = Object.assign({ "id": Number(i + 1) }, usersCollection[i]);
  // if username does not exist, return null in this way: return cb(null, null);
  process.nextTick(function () {
    for (var i = 0, len = usersCollection.length; i < len; i++) {
      if (usersCollection[i].username === username) {
        var record = Object.assign({ "id": Number(i + 1) }, usersCollection[i]);
        return cb(null, record);
      }
    }
    return cb(null, null);
  } 
  );


}

// Function to create a new user
exports.createNewUser = async function (username, password, email, cb) {
  let usersCollection = await get_user_data();
  console.log('\x1b[33m running createNewUser \x1b[0m');
  console.log("usersCollection at source");
  console.log(usersCollection);
  console.log("usersCollection.length");
  console.log(usersCollection.length);

  let innerLength = usersCollection.length;

  // Connect to the database
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    console.log('Connected to the database');

    const db = client.db(mongoName);
    const usersCollection = db.collection('users_collection');

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      console.log('User already exists');
      return cb(new Error('User already exists'), null);
    }

    // Create a new user based on this object: var newUser = { "id": newId, "username": username, "password": getHash(password), "email": email, "locator": newId * locatorScale };
    var newId = Number(innerLength) + 1;
    console.log("newId: " + newId);
    //  if newId is NaN, set it to 1
    if (isNaN(newId)) {
      newId = 1;
    }

    var newUser = { "id": newId, "username": username, "password": getHash(password), "email": email, "locator": Number(Date.now()) + Math.floor(Math.random() * locatorScale + 1) };

    // Insert the new user into the collection
    const result = await usersCollection.insertOne(newUser);
    console.log('User created successfully');
    return cb(null, newUser);


  } catch (err) {
    console.error('Failed to create a new user', err);
    return cb(err, null);
  } finally {
    // Close the connection after completing the operation
    client.close();
  }
};
