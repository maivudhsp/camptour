if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log(process.env.Cloudinary_name);


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const AppError = require('./utils/AppError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



const camptoursRoutes = require('./routes/camptours');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');



//connection to mongoDB
mongoose.connect('mongodb://localhost:27017/CampApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})



const app = express();

//view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.port || 3000



//session option
const sessionConfig = {
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 10 * 24 * 7,
        maxAge: 1000 * 60 * 10 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

//config passport local
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






//middleware flash
app.use((req, res, next) => {
    //console.log(req.user)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//test passport
app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'maivu@gmail.com', username: 'maivu' });
    const newUser = await User.register(user, '123456');
    res.send(newUser);
})


app.use('/camptours', camptoursRoutes);
app.use('/camptours/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);
//route not found

//get home page
app.get('/', (req, res) => {
    res.render('home');
})


app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404))
});


//error middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Sorry!!! something went wrong' } = err;
    res.status(statusCode).render('error', { err });

})


//create server
app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
})