const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    content: {
        type:String,
        required: true
    },
   user:mongoose.Schema.Types.ObjectId
},
{
    timestamps: true
});

const Users = mongoose.model("user_notes", Schema);

module.exports = Users