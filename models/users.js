const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type:String,
        unique:[true,"email already exist"],
        required: true
    },
    password:{
        type:String,
        required:true
    },
    notes:[mongoose.Schema.Types.ObjectId]
},
{
    timestamps: true
});

const Users = mongoose.model("skillStreet_user", Schema);

module.exports = Users