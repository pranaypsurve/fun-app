let express = require('express');
let app = express();
let router = express.Router();

router.get('/',(req,res)=>{
    if(req.get('Referer')){
        res.render('success',{title:"Success"});
    }else{
        res.render('index',{title:"Home"});
    }
    
});

module.exports = router;