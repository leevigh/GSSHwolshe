const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const {mongoDB, port} = require('./config/configuration');


//Assign mongoose promise library and connect to db
mongoose.Promise = global.Promise;
const db = mongoose.connection;


//configure mongoose to connect to mongodb
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(response => console.log(`Database connected successfully on: ${mongoDB}`)).catch(err => console.log(`Database connection error: ${err}`));

//configure express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//configure other middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//setup flash and session
app.use(session({
    secret: 'asd;lk&*(ok',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 3600000 //1 hour expiration
    }
}))

//passport authentication configuration
app.use(passport.initialize());
app.use(passport.session());

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Morgan setup
app.use(logger());

//connect flash init
app.use(flash());

//make use of globalVariables
// app.use(globalVariables);

//=====Import Routes======
const defaultRoutes = require('./routes/defaultRoute');
app.use('/', defaultRoutes);

//page not found error handler
app.use((req, res, next) => {
    res.render('error404');
    next();
})


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})