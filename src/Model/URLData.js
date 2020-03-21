const mongoose = require('mongoose');

const URLSchema = new mongoose.Schema({
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
    },
    status:{
        type: String,
        required: true
    },
    exp_date:{
        type: Date,
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

module.exports = User = mongoose.model('URLData',URLSchema);