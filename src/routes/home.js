let express = require('express');
var address = require('address');
var os = require('os');
let {Collection , mongoose} = require('./../config/database');
let router = express.Router();

router.get('/',(req,res)=>{
    // Collection.deleteMany({},()=>{
        
    // });
    // console.log(req.connection.remoteAddress);
    res.render('index',{title:"Home"});
})
router.post('/',(req,res)=>{
    let dvs_hostname = os.hostname();
    let dvs_ip =  address.ip();
    let dvs_mac =  address.mac((err,macid)=>{
        return macid;
    });
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
                    label:"Supportive Friend",
                    optionTitle:'mylove',
                    flag:req.body.mylove  || '0'
                },{
                    label:"Lovely Friend",
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
router.get('*',(req,res)=>{
    res.render('404',{title:"Page Not Found | "});
});
module.exports = router; 