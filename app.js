const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
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
app.get('/camptours', async (req, res) => {
    const camptours = await Camptour.find({});
    res.render('camptours/index', { camptours})
});
//get a new camptour
app.get('/camptours/new', (req, res) => {
    res.render('camptours/new');
})

//create a camptour
app.post('/camptours', async (req, res) => {
    const camptour = new Camptour(req.body.camptour);
    await camptour.save();
    res.redirect(`/camptours/${camptour._id}`);
});


//get a camptours
app.get('/camptours/:id', async (req, res) => {
    const camptour = await Camptour.findById(req.params.id);
    res.render('camptours/show', { camptour })
})

//edit a camptour
app.get('/camptours/:id/edit', async (req, res) => {
    const camptour = await Camptour.findById(req.params.id)
    res.render('camptours/edit', { camptour });
})

//update a camptours
app.put('/camptours/:id', async (req, res) => {
    const { id } = req.params;
    const camptour = await Camptour.findByIdAndUpdate(id, { ...req.body.camptour });
    res.redirect(`/camptours/${camptour._id}`);
})

//delete
app.delete('/camptours/:id', async (req, res) => {
    const { id } = req.params;
    await Camptour.findByIdAndDelete(id);
    res.redirect('/camptours');
})














//create server
app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
})