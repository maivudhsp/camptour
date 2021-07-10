const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Camptour = require('../models/camptour');


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


const seedDB = async () => {
    await Camptour.deleteMany({});

    const sample = array => array[Math.floor(Math.random() * array.length)];

    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const camp = new Camptour({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})