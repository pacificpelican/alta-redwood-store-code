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
  //  get the user data
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
  });
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
  process.nextTick(function () {
    for (var i = 0, len = usersCollection.length; i < len; i++) {
      var record = Object.assign({ "id": Number(i + 1) }, usersCollection[i]);
      if (record.id === id) {
        console.log("Found id");
        return cb(null, record);
      }
    }
    cb(new Error('User ' + id + ' does not exist'));
  });
}

exports.findByUsername = function (username, cb) {
  console.log("running findByUsername for username " + username);
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
  });
  process.nextTick(function () {
  
    for (var i = 0, len = usersCollection.length; i < len; i++) {
      var record = Object.assign({ "id": Number(i + 1) }, usersCollection[i]);
      if (record.username === username) {
        console.log("Found Username");
        return cb(null, record);
      }
    }
    console.log("Username NOT FOUND");
    return cb(null, null);
  });
}

exports.createNewUser = function (username, password, email, cb) {
  console.log("running createNewUser");
  process.nextTick(function () {
    MongoClient.connect(mongoAddress, function (err, db) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log("about to add NEW USER");

        let culledLogins = usersCollection.filter(word => word.username === username);

        console.log("checked for existence of login " + username + " already in database: " + culledLogins);
        console.log(typeof culledLogins);

        let IsNewUsername = true;

        culledLogins.map(word => {
          console.log("1 match found:");
          console.log(word);
          IsNewUsername = false;
        });

        if (username === 'unregistered') {
          IsNewUsername = false;
        }

        try {
          if (IsNewUsername) {
            let hashedPassword = getHash(password);
            let newdata = Object.assign({}, { "username": username, "password": hashedPassword, "email": email });
            console.log("newdata: " + newdata);
            console.log("newdata is a: " + typeof newdata);
            let serverObject = newdata;
  
            let dbObject = Object.assign(serverObject, {
              locator: Number(Date.now()) + Math.floor(Math.random() * locatorScale + 1),
              created_at_time: Date.now()
            });
  
            console.log("tuple to be saved");
            //  console.log(dbObject);
  
            //  add this account to the database
            db.collection(`users_collection`).insertOne(dbObject);
          }
          else {
            throw new Error('ERROR: Username already registered') // Express will catch this on its own.
          }
        }
        catch(err) {
          console.log("error in creating account");
          return cb(new Error(err));
        }

        //  add this account to the usersCollection so the user can log in with the app needing a restart
        get_user_data();
        return cb(null, username);
      }
    });
  });
}
