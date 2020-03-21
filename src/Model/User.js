const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
        password : {
        type: String,
        required: true
    },
    seq:{
        type:Number,
        default: 0,
        required: true
    }
},
{
    timestamps:{
        createdAt : 'created_at',
        updatedAt : 'updated_at'
    }
});
userSchema.pre('save',async function(next) {
    const user = this;
    if(user.isModified('password')){
        try{
            user.password = await bcrypt.hash(user.password,10);
        }catch(e){
            throw new Error(e);
        }
    }
    next();
});


userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email});
  if(!user){
      throw new Error('Invalid login credentials');
  }
  const isPasswordMatch = await bcrypt.compare(password,user.password);
  if(!isPasswordMatch){
      throw new Error('Invalid login credentials')
  }
  return user;
};

userSchema.statics.validate = async function (body) {
    if(("firstName" in body) && ("lastName" in body) && ("email" in body) && ("password" in body)){
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(body.email);
    }
    return false;
};

const User = mongoose.model('User',userSchema);
module.exports = User;