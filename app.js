const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const Joi = require('joi');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Camptour = require('./models/Camptour');

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

//get all Camptour
app.get('/camptours', catchAsync(async (req, res, next) => {
    const camptours = await Camptour.find({});
    res.render('camptours/index', { camptours})
}));

//get a new camptour
app.get('/camptours/new', (req, res) => {
    res.render('camptours/new');
})

//create a camptour
app.post('/camptours', catchAsync(async (req, res) => {

    if (!req.body.camptour) throw new AppError('Invalid camptour Data', 404);
    const camptourSchema = Joi.object({
        camptour: Joi.object({
            title: Joi
                .string()
                .alphanum()
                .min(3)
                .max(30)
                .required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    });

    const { error } = camptourSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new AppError(message, 400)
    }
    const camptour = new Camptour(req.body.camptour);
    await camptour.save();
    res.redirect(`/camptours/${camptour._id}`);
}));


//get a camptours
app.get('/camptours/:id', catchAsync(async (req, res) => {
    const camptour = await Camptour.findById(req.params.id);
    if (!camptour) {
        return new AppError('Camptour not found', 404);
    }
    res.render('camptours/show', { camptour })
}))

//edit a camptour
app.get('/camptours/:id/edit', catchAsync(async (req, res) => {
    const camptour = await Camptour.findById(req.params.id);
    if (!camptour) {
        return new AppError('Camptour not found', 404);
    }
    res.render('camptours/edit', { camptour });
}))

//update a camptours
app.put('/camptours/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camptour = await Camptour.findByIdAndUpdate(id, { ...req.body.camptour });
    res.redirect(`/camptours/${camptour._id}`);
}))

//delete
app.delete('/camptours/:id', async (req, res) => {
    const { id } = req.params;
    await Camptour.findByIdAndDelete(id);
    res.redirect('/camptours');
})




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