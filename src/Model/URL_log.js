const mongoose = require('mongoose');

const URL_log = new mongoose.Schema({
    short_url:{
        type: String,
        required: true
    },
    platform: {
        type: String,
        trim: true
    },
    browser: {
        type: String,
        trim: true
    },
    os: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    ip: String
},
{
    timestamps:{
        createdAt : 'created_at',
        updatedAt : 'updated_at'
    }
});
module.exports = User = mongoose.model('URL_log',URL_log);