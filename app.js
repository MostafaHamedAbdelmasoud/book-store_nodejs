var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mixins = require('./mixins/mixins');

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const User = require('./models/user')
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose')

require('./db/mongoose')


var app = express();

const port = process.env.PORT | 3000
app.listen((port), () => {
    console.log('listen to port ' + port)
})


// view engine setup
// app.set('public', path.join(__dirname, 'public'));
// app.engine('ejs', engine);


app.set('views', path.join(__dirname, '/views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'pug');
// app.set('layout',['./layouts/layout','./layouts/Auth_layout']);
app.set('view options', {layout: false});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));
// app.use('css',express.static(path.join(__dirname, 'public/assets')));

app.use(session({
    name: 'sessionId',
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store:  MongoStore.create({
        // mongooseConnection: mongoose.connection,
        mongoUrl: process.env.MONGODB_URL,
        ttl: 24 * 60 * 60
    })
}))
// Passport Config
// Passport init (must be after establishing the session above)
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport-config')(passport); // pass passport for configuration

// Pass 'req.user' as 'user' to ejs templates
// Just a custom middleware
app.use(function(req, res, next) {
    res.locals.user = req.user || null;
    // res.locals is an object available to ejs templates. for example: <%= user %>
    next();
})

// app.use(methodOverride(function (req, res) {
//     if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//         // look in urlencoded POST bodies and delete it
//         var method = req.body._method
//         delete req.body._method
//         return method
//     }
// }))

app.use(flash())

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        return req.body._method;
    }
}));
// app.use(methodOverride('_method'))


var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', authRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
