import mongoose from "mongoose";
// User table ki Schema define...
const UserSchema=new mongoose.Schema({
    firstName:{
        type: String,
        required: true,  // is field ka hona mandatory hai
    },
    lastName:{
         type: String,
       
    },
    email:{
        type: String,
        default: true
    },
    password:{
        type: String,
        default: true
    },
   
    registration_date:{ 
    type:Date,
    default:Date.now
    },
 fcmtoken:{
        type: String,
     
    },
     phone:{
        type: String,
        default: true
    },
   isVerified: { 
    type: Boolean,
     default: false },
      // Login attempt tracking
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date }
}, 
{ timestamps: true 
 });


 UserSchema.index({ email: 1 }, { unique: true }); // safety
 // Model create karo (collection name = 'students')
 const User = mongoose.model("User", UserSchema);
 
 export default User;