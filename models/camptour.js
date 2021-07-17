const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const camptourSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
});

module.exports = moongoose.model('Camptour', camptourSchema);