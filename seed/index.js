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
    const price = Math.floor(Math.random() * 20) + 10;
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const camp = new Camptour({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/190727',
            author: '610dfe59df21d53f0c27114a',
            description: 'Using any of the above formats, you can narrow the selection of a random photo even further by supplying a list of comma-separated search terms at the end of the URL.',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})