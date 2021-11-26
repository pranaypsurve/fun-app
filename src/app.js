let express = require('express') , hbs = require('hbs'), path = require('path');
let app = express();
var address = require('address');
var url = require('url');
var os = require('os');
let mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
require('dotenv').config();
let currentTime = new Date().toLocaleTimeString("en-US",Intl.DateTimeFormat().resolvedOptions().timeZone);
app.use(express.static('public'));
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
let Collection = mongoose.model('users_dtls',userSchema)

// Set View Engine
app.set('view engine','hbs');

// middleware for form handling
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// register partials
let partialPath = path.join(__dirname,"../partials");
hbs.registerPartials(partialPath);

// routes
app.get('/',(req,res)=>{
    // Collection.deleteMany({},()=>{
        
    // });
    // console.log(req.connection.remoteAddress);
    res.render('index',{title:"Home"});
});
app.get('/view_all',(req,res)=>{
    res.render('view_all',{title:"View All",visible:"show",table:"hide"});
});
app.post('/view_all',(req,res)=>{
    Collection.findOne({username:req.body.username,password:req.body.pswd},(err,found)=>{
        if(err){
            res.send("Error Something Went Wrong");
        }
        if(found){
            Collection.findOne({_id:found._id},(err,get_all_data)=>{
                let filteredData = get_all_data.viewsSubmited.filter((item)=>{
                    return item;
                });
                res.render('view_all',{title:"View All",visible:"hide",data:filteredData});
            });
        }else{
            res.render('view_all',{title:"View All",message:"User Not Found",table:"hide"});   
        }
    })
});
app.get('/success',(req,res)=>{
    res.render('success',{title:"Success"});
});

app.get('/display/:id',(req,res)=>{
    let db_id = req.params.id;
    let isValid = mongoose.Types.ObjectId.isValid(db_id);
    if(isValid){
        Collection.findById(db_id,{name:true,options:true},(err,record)=>{
            // console.log(db_id.match("/^[0-9a-fA-f]{24}$"));
            if(err){
                res.render('display',{err});
            }
            if(record){
                let selectedData = record.options.filter((item)=>{
                    return item.flag == 1;
                })
                // console.log(selectedData);
                res.render('display',{data:selectedData,username:record.name,title:"Frienship Bond"});
            }else{
                res.render('index');
            }
            
        });
    }else{
        res.status(500).send();
    }
});
app.post('/display/:id',(req,res)=>{
    let get_id = req.params.id;
    let visterData = {
        name:req.body.visiterName,
        submitedOpt:[
            {
                label:"Friend",
                optionTitle:'friend',
                flag:req.body.friend || '0'
        },{
            label:"Best Friend",
            optionTitle:'bestfriend',
            flag:req.body.bestfriend  || '0'
        },{
            label:"Close Friend",
            optionTitle:'closefriend',
            flag:req.body.closefriend  || '0'
        },{
            label:"Bachpan Ka Yaar",
            optionTitle:'bachpnkayaar',
            flag:req.body.bachpnkayaar  || '0'
        },{
            label:"Bachpan Ki Dost",
            optionTitle:'bachpnkidost',
            flag:req.body.bachpnkidost  || '0'
        },{
            label:"Supportive Friend",
            optionTitle:'mylove',
            flag:req.body.mylove  || '0'
        },{
            label:"Lovely Friend",
            optionTitle:'crush',
            flag:req.body.crush  || '0'
        }]
    }
    var filtered_records = visterData.submitedOpt.filter((item)=>{
        return item.flag == 1;
    })
    let new_record = [
        {
            name:req.body.visiterName,
            submitedOpt:filtered_records,
            created_on: new Date().toLocaleDateString()
        }
    ];
    Collection.findByIdAndUpdate(get_id,{$push : { viewsSubmited:new_record}},(err,data)=>{
        res.redirect('/success');
    })
});


app.post('/',(req,res)=>{
    let dvs_hostname = os.hostname();
    let dvs_ip =  address.ip();
    let dvs_mac =  address.mac((err,macid)=>{
        return macid;
    });
    // console.log(dvs_ip,dvs_mac);
    Collection.findOne({username:req.body.lusername},{username:true},(err,record)=>{
        if(!record){
            
            let postData = new Collection({
                device_dtl:{deviceIP:dvs_ip,deviceMAC:dvs_mac,osHostName:dvs_hostname},
                username:req.body.lusername,
                password:req.body.pswd,
                name:req.body.yourname,
                age:req.body.age[0],
                options:[
                    {
                        label:"Friend",
                        optionTitle:'friend',
                        flag:req.body.friend || '0'
                },{
                    label:"Best Friend",
                    optionTitle:'bestfriend',
                    flag:req.body.bestfriend  || '0'
                },{
                    label:"Close Friend",
                    optionTitle:'closefriend',
                    flag:req.body.closefriend  || '0'
                },{
                    label:"Bachpan Ka Yaar",
                    optionTitle:'bachpnkayaar',
                    flag:req.body.bachpnkayaar  || '0'
                },{
                    label:"Bachpan Ki Dost",
                    optionTitle:'bachpnkidost',
                    flag:req.body.bachpnkidost  || '0'
                },{
                    label:"My Love",
                    optionTitle:'mylove',
                    flag:req.body.mylove  || '0'
                },{
                    label:"Crush",
                    optionTitle:'crush',
                    flag:req.body.crush  || '0'
                }]
            });
            postData.save((err,records)=>{
                res.render('linkGenerated',{title:"Generated Link",url:req.protocol+'://'+req.get('host')+'/display/'+records['_id']});
            });
        }else{
            res.send("Username Already Exists");
        }
    });
});
app.get('/view_all/*',(req,res)=>{
    res.render('404',{title:"Page Not Found | "});
});

app.get('/*',(req,res)=>{
    res.render('404',{title:"Page Not Found | "});
});
app.listen(PORT,()=>{
    console.log(`Sevrer Running on Port ${PORT}`);
});