let express = require('express');
let app = express();
let router = express.Router();
let {Collection , mongoose} = require('./../config/database');
router.get('/:id',(req,res)=>{
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
router.post('/:id',(req,res)=>{
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


module.exports = router;