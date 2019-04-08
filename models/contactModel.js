const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const contactModel = new Schema({
    bedrijf: {
        type: String
    },
    telefoonnummer: {
        type: String
    }
});

module.exports = mongoose.model('Contact', contactModel);
