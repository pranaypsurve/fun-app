let mongoose = require('mongoose');
require('dotenv').config();
// Connect To DB
mongoose.connect('mongodb+srv://pranay97:'+process.env.PASS+'@cluster0.xwfv9.mongodb.net/funApp?retryWrites=true&w=majority')
.then((res)=>{
    console.log('Db Connected');
})
.catch((err)=>{
    console.log(err);
});
// schema
let userSchema = mongoose.Schema({
    device_dtl:Object,
    username:String,
    password:String,
    name:String,
    age:Number,
    question:String,
    options:Array,
    viewsSubmited:Array
});
// mongoose Model
let Collection = mongoose.model('users_dtls',userSchema);

module.exports = {Collection,mongoose};