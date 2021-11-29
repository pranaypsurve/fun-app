let express = require('express');
let app = express();
let router = express.Router();

router.get('/',(req,res)=>{
    res.render('success',{title:"Success"});
});

module.exports = router;