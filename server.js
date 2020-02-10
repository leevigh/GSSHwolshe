const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");
const { mongoDB, port } = require("./config/configuration");

// ===============Requring Request=========================
const request = require("request");

// ===============Requring the Paystack Gateway===========================
const { Pay } = require("./models/pay");
const { initializePayment, verifyPayment } = require("./config/paystack")(
  request
);
const _ = require("lodash");

//Assign mongoose promise library and connect to db
mongoose.Promise = global.Promise;
const db = mongoose.connection;

//configure mongoose to connect to mongodb
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(response =>
    console.log(`Database connected successfully on: ${mongoDB}`)
  )
  .catch(err => console.log(`Database connection error: ${err}`));

//configure express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//configure other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//setup flash and session
app.use(
  session({
    secret: "asd;lk&*(ok",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 3600000 //1 hour expiration
    }
  })
);

//passport authentication configuration
app.use(passport.initialize());
app.use(passport.session());

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Morgan setup
app.use(logger());

//connect flash init
app.use(flash());

//make use of globalVariables
// app.use(globalVariables);

//=====Import Routes======
const defaultRoutes = require("./routes/defaultRoute");
app.use("/", defaultRoutes);

// importing payment routes========
app.use("/students", require("./routes/payapp"));

//=================== Paystack Configuration==============
app.get("/pay", (req, res) => {
  res.render("payer/pay");
});

app.post("/paystack/pay", (req, res) => {
  const form = _.pick(req.body, ["amount", "email", "fullName"]);
  console.log("Data", form);
  form.metadata = {
    full_name: form.fullName
  };
  form.amount *= 100;

  initializePayment(form, (error, body) => {
    if (error) {
      //=============handle errors================
      console.log(error);
      return res.redirect("/error");
      return;
    }
    response = JSON.parse(body);
    res.redirect(response.data.authorization_url);
  });
});

app.get("/paystack/callback", (req, res) => {
  const ref = req.query.reference;
  verifyPayment(ref, (error, body) => {
    if (error) {
      //============Handle Errors Appropriately================
      console.log(error);
      return res.redirect("/error");
    }
    response = JSON.parse(body);

    const data = _.at(response.data, [
      "reference",
      "amount",
      "customer.email",
      "metadata.fullName"
    ]);

    [reference, amount, email, fullName] = data;

    newPay = { reference, amount, email, fullName };

    const pay = new Pay(newPay);

    pay
      .save()
      .then(pay => {
        if (!pay) {
          return res.redirect("/error");
        }
        res.redirect("/receipt/" + pay._id);
      })
      .catch(e => {
        res.redirect("/error");
      });
    console.log(pay);
  });
});

app.get("/receipt/:id", (req, res) => {
  const id = req.params.id;
  Pay.findById(id)
    .then(pay => {
      if (!pay) {
        //===============handle error when the donor is not found==================
        res.redirect("/error");
      }

      let payAmount = pay.amount / 100;
      res.render("/success", { pay, payAmount });
    })
    .catch(e => {
      res.redirect("/error");
      console.log(e);
    });
});

//page not found error handler
app.use((req, res, next) => {
  res.render("error404");
  next();
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
