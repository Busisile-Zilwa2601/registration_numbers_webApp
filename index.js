//module constants
const flash = require('express-flash');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const myReg = require('./Registration-Numbers');
const routes = require('./myRoutes');
const pg = require("pg");
const Pool = pg.Pool;
let app = express();

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// connection to database
let connectionString = process.env.DATABASE_URL || 'postgres://busisile:pg123@localhost/registration_numbers';
//pool constructor
const pool = new Pool({
    connectionString,
    ssl: useSSL
});
// initialise session middleware - flash-express depends on it
app.use(session({
    secret: "Adding towns",
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());
//default settings
app.use(express.static('public'));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: 'helpers'
}));
app.set('view engine', 'handlebars');
//instances
let cityRegNum = myReg(pool);
let myRoutes = routes(cityRegNum);

//using body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//routes
app.get('/', myRoutes.index);
app.post('/city', myRoutes.displayReg);
app.post('/reg_numbers', myRoutes.add);
// app.get('/city', myRoutes.add);
app.post('/add', myRoutes.addCity);
app.get('/delete', myRoutes.deleteAll);
app.post('/delete_city', myRoutes.deleteTown);

//add the PORT
let PORT = process.env.PORT || 3080;
app.listen(PORT, function () {
    console.log("started on: ", this.address().port);
});