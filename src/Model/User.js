const mongoose = require('mongoose');
const validator = require('validator');
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

// userSchema.methods.generateAuthToken = async () => {
//     try{
//         const user = this;
//         const token = jwt.sign({_id: user.id},process.env.JWT_KEY);
//         user.tokens = user.tokens.concat({token});
//         await user.save();
//         console.log('after save');
//         return token;
//     }catch (e) {
//         throw new Error(e);
//     }
// };

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

const User = mongoose.model('User',userSchema);
module.exports = User;