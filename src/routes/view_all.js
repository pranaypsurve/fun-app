let express = require('express');
let {Collection , mongoose} = require('./../config/database');
let app = express();
let router = express.Router();

router.get('/',(req,res)=>{
    res.render('view_all',{title:"View All",visible:"show",table:"hide"});
});
router.post('/',(req,res)=>{
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
router.get('/*',(req,res)=>{
    res.render('404',{title:"Page Not Found | "});
});
module.exports = router;