var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

const next = require("next");

require('dotenv').config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

//  var nodemailer = require('nodemailer');

let mongoUrl;
let locatorScale = parseInt(1000000000000);

let userLogin = '';

let keySecret;

let mongoName;

let mailgunAddress;

let mailgunAPIkey;

let fromEmail;

if (process.env.NODE_ENV !== "production") {
  mongoUrl = "mongodb://localhost:27017/"; //  dev database server
  mongoName = process.env.DEV_MONGO;
  keySecret = process.env.TEST_SECRET_KEY;

  mailgunAPIkey = process.env.MAILGUN_TEST_API_KEY;
  mailgunAddress = process.env.MAILGUN_TEST_ADDRESS;
  fromEmail = process.env.MAILGUN_TEST_FROM_EMAIL;

} else {
  mongoUrl = process.env.MONGODB_URL; //  production database server
  mongoName = process.env.MONGO_NAME || '';
  keySecret = process.env.SECRET_KEY;

  mailgunAPIkey = process.env.MAILGUN_API_KEY;
  mailgunAddress = process.env.MAILGUN_ADDRESS;
  fromEmail = process.env.MAILGUN_FROM_EMAIL;
}

console.log('\x1b[33m Welcome to the Alta Redwood store app! \x1b[0m');
console.log('\x1b[33m https://github.com/pacificpelican/alta-redwood-store-code/ \x1b[0m');

const mailgun = require('mailgun-js')({
  apiKey: mailgunAPIkey,
  domain: mailgunAddress
});

const crypto = require('crypto');

const stripe = require("stripe")(keySecret);

function isUserAdmin(user = userLogin) {
  console.log(user);
  if (user === '') {
    return false;
  }
  if ((user === process.env.ADMIN_EXEC) || (user === process.env.ADMIN_CORE) || (user === process.env.ADMIN_AUX) || (user === process.env.ADMIN_4)) {
    console.log('user ' + user + " verified as admin");
    return true;
  }
  else {
    console.log('user ' + user + " is not an admin");
    return false;
  }
}

let x = mungeInventory;

console.log("PORT: " + port);

async function insertStoreOrder(dbObject0) {
  try {
    const client = await MongoClient.connect(mongoAddress);
    const collection = client.db().collection('store_orders');
    await collection.insertOne(dbObject0);
    await client.close();
  } catch (err) {
    console.log("error in store orders DB entry creation: " + err.toString());
    throw new Error(err);
  }
}

async function createNewOrder(stripeToken, cartObject, shipObject, transactionObject) {
  let dbObject = Object.assign({}, {
    token: stripeToken,
    username: userLogin ? userLogin : 'unregistered',
    // processed: 'no',
    shipped: 'no',
    shipping: JSON.parse(shipObject),
    cart: JSON.parse(decodeURIComponent(cartObject)),
    transaction: JSON.parse(transactionObject)
  });
  let dbObject0 = Object.assign(dbObject, {
    locator: Number(Date.now()) + Math.floor(Math.random() * locatorScale + 1),
    created_at_time: Date.now()
  });

  let letsWait = await insertStoreOrder(dbObject0);

  if (userLogin !== '') {
    db.users.findByUsername(userLogin, function (err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }

      let sendEmailTo = user.email;
      console.log("ORDER IN PROGRESS: planning to send email to " + sendEmailTo);
      let emailCopy = `Hello ${userLogin}!  Thank you for making a purchase at the ${process.env.NEXT_PUBLIC_WEBSITE_NAME} online store.  You can log in to your account at ${process.env.NEXT_PUBLIC_WEBSITE_URL} and your profile page will have more information about the order, and as soon as it is sent out you will be able to see the shipping status updated.  Please reply to this email: ${process.env.NEXT_PUBLIC_SUPPORT_EMAIL} if you have any feedback.  Thanks for your business!`
      sendEmail(sendEmailTo, emailCopy);
    });
  }

  return dbObject;
}

function sendEmail(recipient, bodyText, subjectText = 'store update') {

  let dataForMailgun = {
    from: process.env.NEXT_PUBLIC_BILLING_NAME + ' <' + fromEmail + '>',
    to: recipient,
    subject: subjectText,
    text: bodyText
  };
  
  mailgun.messages().send(dataForMailgun, (error, body) => {
    if(error) {
      console.error('Error sending email');
      console.error(error);
    } else {
      console.log(body);
      console.log('Email sent successfully');
    }
  });
  
}

async function postDataWildcard(db, collectionName, tuple, objval, objkey = "description", newVal = "__") {
  const someStr = decodeURIComponent(objval);
  const val = someStr.replace(/['"]+/g, '');
  const tupleNumber = Number(tuple);
  const replaceVal = newVal.toString();

  const client = await MongoClient.connect(mongoAddress);
  const collection = client.db(mongoName).collection(collectionName);

  const result = await collection.updateOne({ [objkey]: val, locator: tupleNumber }, { $set: { [objkey]: replaceVal } });

  console.log("Updated the document");
  console.log(result);

  await client.close();
}

async function decrementFromInventory(cartObject) {
  console.log('\x1b[33m running decrementFromInventory \x1b[0m');
  const newCart = JSON.parse(cartObject);
  const newerCart = Object.keys(newCart).map((key) => newCart[key]);

  try {
    const client = await MongoClient.connect(mongoAddress);
    const db = client.db(mongoName);
    const storeItemsCollection = db.collection('store_items');
    const storeInventoryCollection = db.collection('store_inventory');

    const products = await storeItemsCollection.find().toArray();
    const inventory = await storeInventoryCollection.find().toArray();

    const mungedInventory = mungeInventory(products, inventory);
    console.log('inventory has been munged');

    for (const mo of newerCart) {
      if (mo.quantity && mo.productID && Number(mo.quantity) > 0) {
        console.log(`to decrement from inventory: ${Number(mo.quantity)} of #${mo.productID}`);

        for (const mi of mungedInventory) {
          if (Number(mi.productID) === Number(mo.productID)) {
            const newAmount = Number(mi.totalInventory) - Number(mo.quantity);
            console.log(`updating for ID ${Number(mo.productID)}, current val: ${mi.totalInventory}`);

            const storeItemObject = {
              itemLocator: mo.productID.toString(),
              total: Number(newAmount).toString(),
              created_at_time: Date.now(),
              locator: Number(Date.now()) + Math.floor(Math.random() * locatorScale + 1)
            };

            await storeInventoryCollection.insertOne(storeItemObject);
            console.log('item created (new inventory entry)');
          }
        }
      }
    }

    client.close();
  } catch (err) {
    console.error(err);
  }
}

async function deleteDataWildcard(db, collectionName, tuple) {
  console.log(collectionName, tuple);
  console.log("to delete: " + tuple);
  console.log("from " + collectionName);
  const client = await MongoClient.connect(mongoAddress);
  const collection = client.db(db).collection(collectionName);
  const result = await collection.deleteOne({ locator: parseInt(tuple) });
  console.log("Updated the document - deleted");
  console.log(result);
  console.log("record removed (💣🤷)");
  await client.close();
}

function mungeInventory(productsArray, inventoryArray) {  //  intersection algorithm: looking for items that exist as products and have nonzero inventory
  console.log("\x1b[36m about to munge inventory \x1b[0m");
  console.log("productsArray");
  console.log(productsArray);
  console.log("inventoryArray");
  console.log(inventoryArray);
  //  return a JSON object of this shape: [{productID: 3, inventoryCount: 88}, {productID: 8, inventoryCount: 28}, {productID: 34, inventoryCount: 5}]

  //  This algorithm is based on LIFO data: the first records encuntered are considered to be definitive (they are assumed to be most recent)
  inventoryArray.reverse();

  let returnJSON = [];
  let collectedIDs = [];

  productsArray.map(function (interVal) {
    console.log("iterating on products");
    console.log(interVal);

    let innerReturnObj = [];

    if (interVal !== null) {
      let newestDate = 0;

      inventoryArray.some(function (newVal) {
        console.log("product ID: " + interVal.locator);
        console.log("poduct ID via inventory: " + newVal.itemLocator);
        if ((newVal.created_at_time > newestDate) && (Number(newVal.itemLocator) === Number(interVal.locator))) {
          console.log("inventory ID match found");
          let hiddenVal;
          if (interVal.hidden) {
            hiddenVal = interVal.hidden.toString();
          }
          else {
            hiddenVal = `no`;
          }

          innerReturnObj = { productTitle: interVal.title, productID: interVal.locator, totalInventory: newVal.total, productImage: interVal.image, price: interVal.price, description: interVal.description, supplier: interVal.supplier, locator: newVal.locator, hidden: hiddenVal };
          console.log("updating newestDate to " + newVal.created_at_time);
          newestDate = newVal.created_at_time;

          collectedIDs.push(interVal.locator);
          //  break;
        }
      })

    }

    returnJSON.push(innerReturnObj);

  });

  console.log("returning JSON from mungeInventory");
  console.log(returnJSON);
  return returnJSON;
}

const mongoAddress = mongoUrl + mongoName;

const users_collection = "users_collection";
let subscriptions_collection = "okconceptdevcollection";

var MongoClient = require("mongodb").MongoClient;

var db = require('./db'); //  this requires a directory with multiple files (index, store, users)

function getHash(src) {
  const hash = crypto
    .createHmac("sha256", src)
    .update("I love cupcakes!") // via https://nodejs.org/api/crypto.html
    .digest("hex");
  return hash;
}

createNewItem = function (table, newItem, cb) {
  console.log("running createNewStoreItem");
  process.nextTick(function () {
    MongoClient.connect(mongoAddress, function (err, db) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log("about to add NEW STORE ITEM");
        console.log(newItem);

        console.log(typeof newItem);

        let serverObject = newItem;
        console.log(serverObject);

        let dbObject = Object.assign(serverObject, {
          locator: Number(Date.now()) + Math.floor(Math.random() * locatorScale + 1),
          created_at_time: Date.now()
        });

        console.log("tuple to save");
        console.log(dbObject);

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

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function (username, password, cb) {
    console.log("\x1b[34m running passport strategy \x1b[0m for " + username + " and " + password);
    db.users.findByUsername(username, function (err, user) {
      if (err) {
        console.log("error in passport strategy : " + err);
        return cb(err);
      }
      if (!user) {
        console.log("no user found");
        return cb(null, false);
      }
      if (user.password !== getHash(password)) {
        console.error("passwords don't match");
        return cb(null, false);
      }
      else
        console.log("\x1b[34m passwords match \x1b[0m");
      return cb(null, user);
    });
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(async function (user, cb) {
  console.log("session to start with " + user.id);
  userLogin = user.username;
  cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
  await db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


app.prepare().then(() => {
  const server = express();

  server.use(require("body-parser").text());

  server.use(require('morgan')('combined'));
  server.use(require('body-parser').urlencoded({ extended: true }));
  server.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  server.use(passport.initialize());
  server.use(passport.session());

  // Define routes.
  server.get('/',
    function (req, res) {

      return app.render(req, res, '/', req.query)
    });

  server.get('/login',
    function (req, res) {
      app.render(req, res, '/login', req.query)
    });

  server.get('/register',
    function (req, res) {
      app.render(req, res, '/register', req.query)
    });

  server.post('/login',
    passport.authenticate('local', { failureRedirect: '/error' }),
    function (req, res) {
      res.redirect('/');
    });

  server.post('/register',
    function (req, res) {
      let msg = '';
      console.log("registering: ");
      console.log(req.body);

      db.users.createNewUser(req.body.username, req.body.password, req.body.email, function (err, user) {
        if (err) {
          console.log(err);
          msg = err
          res.redirect('/error');
        }
        else if (!user) {
          console.log('error');
          msg = "registration failed"
        }
        else {
          msg = 'registration done'
          res.redirect('/registered');
        }
      });
    }
  )

  server.post('/register/2/:registrationObject',
    function (req, res) {
      let msg = '';
      console.log("registering: ");
      let decodedObject = decodeURIComponent(req.params.registrationObject);
      console.log(decodedObject);

      // create a new user with the username and password from the decoded object

      db.users.createNewUser(decodedObject.username, decodedObject.password, decodedObject.email, function (err, user) {
        if (err) {
          console.log(err);
          msg = err

          res.redirect('/error');
        }
        else if (!user) {
          console.log('error');
          msg = "registration failed"
        }
        else {
          msg = 'registration done'
          res.redirect('/registered');
        }
      });
    }
  )

  server.post('/register/username/:username/password/:password',
    function (req, res) {
      console.log("registering: (long route) ");
      console.log(req.params);
      db.users.createNewUser(req.params.username, req.params.password, req.params.email);
      res.redirect('/registered');
    }
  )

  server.get('/getprofile/:username',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      db.users.findByUsername(req.params.username, function () { console.log('found username on server side') });
      res.send(Object.assign({}, { "username": req.params.username }));
    }
  ) //  deprecated in favor of /profile and /getprofile

  server.get('/logout', function (req, res, next) {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  server.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      app.render(req, res, '/profile', req.query)
    });

  server.get('/getprofile',
    require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
      console.log("\x1b[32m getprofile route \x1b[0m - logged in");
      res.send(Object.assign({}, [{ "username": userLogin }]));

    }); //  This route returns JSON info about the user who is logged in (userLogin)

  server.get('/getorders', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    try {
      const client = await MongoClient.connect(mongoAddress);
      const collection = client.db().collection('store_orders');
      const result = await collection.find({ username: userLogin }).toArray();
      console.log(result);
      res.send(result);
      await client.close();
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

  // e.g.  http://localhost:3000/api/1/getdbdata/db/db/object/users_collection
  server.get('/api/1/getdbdata/db/:db/object/:obj', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    if (isUserAdmin()) {
      try {
        const client = await MongoClient.connect(mongoAddress, {});
        const db = client.db(mongoName);
        const collection = db.collection(req.params.obj);

        const result = await collection.find().toArray();

        console.log(`Looking up data for table '${req.params.obj}' by ${userLogin}`);
        console.log(result);

        res.json(result);

        client.close();
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  });

  server.get('/api/1/getdbdata/db/:db/object/:obj/tuple/:tuple', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    if (isUserAdmin()) {
      try {
        const client = await MongoClient.connect(mongoAddress, {});
        const db = client.db(mongoName);
        const collection = db.collection(req.params.obj);

        const result = await collection.findOne({ locator: parseInt(req.params.tuple) });

        console.log(`Looking up data for tuple ${req.params.tuple} in '${req.params.db}' | '${req.params.obj}' collection by ${userLogin}`);
        console.log(result);

        res.json(result);

        client.close();
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  });

  server.get('/api/1/getstoreitems/limit/:limit', require('connect-ensure-login').ensureLoggedIn(), async (req, res) => {
    if (isUserAdmin()) {
      try {
        const client = await MongoClient.connect(mongoAddress, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(mongoName);
        const collection = db.collection('store_items');

        const result = await collection.find().limit(parseInt(req.params.limit)).toArray();

        console.log(`Result of query for 'store_items' by ${userLogin}:`, result);
        res.json(result);

        client.close();
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  });

  server.post('/create/store-item/:storeItemObject',
    require('connect-ensure-login').ensureLoggedIn(), //  should also be an admin though
    function (req, res) {
      if (isUserAdmin()) {
        console.log("\x1b[33m creating store-item \x1b[0m");
        //  console.log(req.params);
        db.store.createNewStoreItem(req.params.storeItemObject, function () { console.log("item created") });
        res.send({ "result": "success" });
      }
      else {
        console.log("user does not appear to be admin: cannot create this data");
        console.log(req.params);
      }
    }
  )

  //  http://localhost:3000/create/store-item/%7B%22title%22%3A%22ladder%22%2C%22price%22%3A10%2C%22supplier%22%3A%22local%20supplier%22%2C%22description%22%3A%22wooden%20ladder%20for%20birds%22%7D
  server.get('/create/store-item/:storeItemObject',
    require('connect-ensure-login').ensureLoggedIn(),
    // require(true),
    function (req, res) {
      if (isUserAdmin()) {  //  should be an admin
        console.log("creating store-item");
        //  console.log(req.params);
        db.store.createNewStoreItem(req.params.storeItemObject, function () { console.log("item created") });
        res.redirect('/success?created=storeItem');
      }
      else {
        console.log("user does not appear to be admin: cannot create this data");
        console.log(req.params);
      }
    }
  ) //  deprecated at v0.8.13: (unnucesssary to maintain this GET route past dev; all in-app uses should be via POST)

  server.post('/create/new-item/:storeItemObject/:table',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      if (isUserAdmin()) {
        console.log("creating new DB entry");

        db.store.createNewItem(req.params.table, req.params.storeItemObject, function () { console.log("item created") });
        res.send({ "result": "success" });
      }
      else {
        console.log("user does not appear to be admin: cannot create this data");
        console.log(req.params);
        res.send({ "result": "failure" });
      }
    }
  )

  // localhost:3000/create/new-item/{"title"%3A"ladder"%2C"price"%3A10%2C"supplier"%3A"local supplier"%2C"description"%3A"wooden ladder for birds"}/store_items
  server.get('/create/new-item/:storeItemObject/:table',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      if (isUserAdmin()) {   // Admin only route
        console.log("creating new DB entry");

        db.store.createNewItem(req.params.table, req.params.storeItemObject, function () { console.log("item created") });
        res.send({ "result": "success" });
      }
      else {
        console.log("user does not appear to be admin: cannot create this data");
        console.log(req.params);
        res.send({ "result": "failure" });
      }
    }
  ) //  deprecated at v0.8.13: (unnucesssary to maintain this GET route past dev; all in-app uses should be via POST)

  server.post(
    "/api/1/deletedata/db/:db/object/:obj/tuple/:tuple",
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {
      console.log("running (simple) \x1b[91m delete POST route \x1b[0m");

      if (isUserAdmin()) {  // Admin only route
        deleteDataWildcard(
          mongoName,
          req.params.obj,
          req.params.tuple
        );
      }
      else {
        // do nothing
      }
      res.send(Object.assign({}, { Response: "ok - POST update (remove)" }));
    }
  );

  server.post(
    "/api/one-point-five/updatedata/db/:db/object/:obj/objprop/:objprop/objkey/:objkey/newval/:newval/tuple/:tuple",
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {
      console.log("running update POST route");

      var someStr = decodeURIComponent(req.params.objprop);
      let oldVal = someStr.replace(/['"]+/g, '');

      var someOtherStr = decodeURIComponent(req.params.newval);
      let newVal = someOtherStr.replace(/['"]+/g, '');

      console.log("\x1b[33m seeking to update data based on these params: \x1b[0m")
      console.log("oldVal: ", oldVal);
      console.log("newVal: ", newVal);
      console.log("tuple: ", req.params.tuple);
      console.log("objkey: ", req.params.objkey);
      console.log("obj: ", req.params.obj);

      if (isUserAdmin()) {  // Admin only route
        postDataWildcard(
          req.params.db,
          req.params.obj,
          req.params.tuple,
          oldVal,
          req.params.objkey,
          newVal
        );
      }
      res.send(Object.assign({}, { Response: "ok - POST update" }));
    }
  );

  server.get('/api/1/getstore', async (req, res) => {
    try {
      const client = await MongoClient.connect(mongoAddress, {});
      const db = client.db(mongoName); // Replace with your database name

      const productsPromise = db.collection('store_items').find().toArray();
      const inventoryPromise = db.collection('store_inventory').find().toArray();

      const [products, inventory] = await Promise.all([productsPromise, inventoryPromise]);

      console.log('\x1b[32m products: \x1b[0m', products);
      console.log('\x1b[33m inventory: \x1b[0m', inventory);

      const mungedInventory = mungeInventory(products, inventory);
      console.log('munged inventory:', mungedInventory);

      res.send(mungedInventory);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal server error');
    }
  });

  server.get("/api/1/getstoreitem/:item",
    (req, res) => {

      let products;
      let inventory = [];

      MongoClient.connect(mongoAddress, function (err, db) {
        if (err) {
          console.log(err);
          throw err;
        }

        db.collection("store_items")
          .findOne(
            {
              $or: [
                { locator: Number(req.params.item) },
                { locator: req.params.item }
              ]
            },
            (function (err, result) {
              console.log(
                "result of query for: " + "store_items " + Number(req.params.item) + " for getstoreitem (v1) "
              );
              console.log(result);
              products = result;
            })
          )
        db.collection("store_inventory")
          .find()
          .toArray(function (err, result) {
            console.log(
              "result of query for: " + "store_inventory" + " for getstoreitem (v1) "
            );
            console.log(result);
            inventory = result;
          });
      });
      setTimeout(function () {
        let mungedInventory = mungeInventory([products], inventory);
        console.log("munged inventory:");
        console.log(mungedInventory);
        res.send(mungedInventory);
      }, 270);
    });

  server.post("/charge/order/:cartObject/shipping/:shippingObject/transaction/:transactionObject", async (req, res) => {
    console.log("\x1b[33m received /charge POST request \x1b[0m");
    console.log(req.body);
    console.log(req.params);

    let cartObject = decodeURIComponent(req.params.cartObject);
    console.log(cartObject);
    let cartObjectJSON = JSON.parse(cartObject);
    console.log(cartObjectJSON[0].productID);

    let shipObject = decodeURIComponent(req.params.shippingObject);
    console.log(shipObject);
    let shipObjectJSON = JSON.parse(shipObject);
    console.log(shipObjectJSON);

    let transactionObject = decodeURIComponent(req.params.transactionObject);
    console.log(transactionObject);
    let transactionObjectJSON = JSON.parse(transactionObject);
    console.log(transactionObjectJSON);
    console.log(transactionObjectJSON.total);

    try {
      let { status } = await stripe.charges.create({
        amount: parseInt(transactionObjectJSON.total * 100),
        currency: "usd",
        description: process.env.NEXT_PUBLIC_BILLING_NAME + " store charge",
        source: req.body
      });

      createNewOrder(req.body, cartObject, shipObject, transactionObject);

      decrementFromInventory(cartObject);

      setTimeout(function () {
        res.json({ status });
      }, 2000)

    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  });

  server.post('/updateorder/locator/:locator/status/:status',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      if (isUserAdmin()) {   // Admin only route
        try {
          postDataWildcard('default', 'store_orders', req.params.locator, encodeURIComponent('no'), 'shipped', req.params.status.toString());
        }
        catch (err) {
          console.log(err);
          res.send(Object.assign({}, { Response: "ERROR - POST update - shipping " + err.toString() }));
        }
      }
      res.send(Object.assign({}, { Response: "ok - POST update - shipping" }));
    }
  );

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port);
});
