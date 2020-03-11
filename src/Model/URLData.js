const mongoose = require('mongoose');

const URLData = new mongoose.Schema({
    short_url:{
        type: String,
        unique: true,
        required: true
    },
    long_url: {
        type: String,
        unique: true,
        required: true
    },
    user_id:{
        type: String,
        required: true
    }
},
{
    timestamps:{
        createdAt : 'created_at',
        updatedAt : 'updated_at'
    }
}
);
module.exports = User = mongoose.model('URLData',URLData);