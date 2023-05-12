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

function get_user_data() {
  //  get the data from users_collection and store it in usersCollection as an array
  MongoClient.connect(mongoAddress, function (err, db) {
    if (err) {
      console.log(err);
      throw err;
    }
    db.collection(users_collection)
      .find()
      .toArray(function (err, result) {
        usersCollection = result;
        if (err) {
          console.log(err);
        }
      });
  }
  );

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

exports.findByUsername = function (username, cb) {
  console.log("running findByUsername for username " + username);
  //  check if username exists
  //  if username exists, return the user record in this format: var record = Object.assign({ "id": Number(i + 1) }, usersCollection[i]);
  // if username does not exist, return null in this way: return cb(null, null);
  
  process.nextTick(function () {
    for (var i = 0, len = usersCollection.length; i < len; i++) {
      var record = Object.assign({ "id": Number(i + 1) }, usersCollection[i]);
      if (record.username === username) {
        console.log("Found Username");
        return cb(null, record);
      }
    }
    cb(null, null);
  }
  );
}

exports.createNewUser = function (username, password, email, cb) {
  console.log("running createNewUser");
  //  create new user based on the username, password, and email and this object: var newUser = {"id": newId,"username": username,"password": getHash(password),"email": email,"locator": newId * locatorScale}; 
  //  return cb(null, newUser);

  process.nextTick(function () {
    var newId = usersCollection.length + 1;
    var newUser = { "id": newId, "username": username, "password": getHash(password), "email": email, "locator": newId * locatorScale };
    usersCollection.push(newUser);
    return cb(null, newUser);
  }
  );
    
}
