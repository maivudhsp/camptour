const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const { camptourSchema, reviewSchema } = require('./schema');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Camptour = require('./models/Camptour');
const Review = require('./models/review');


const camptourRoutes = require('./routes/camptour');
const reviewRoutes = require('./routes/camptour');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
     if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new AppError(message, 400)
    } else {
        next();
    }
}


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

const port = process.env.port || 3000

//get home page
app.get('/', (req, res) => {
    res.render('home');
})








app.use('/camptours', camptourRoutes);
app.use('/camptours/:id/reviews', reviewRoutes);

//route not found

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