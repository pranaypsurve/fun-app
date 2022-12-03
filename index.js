let express = require('express') , hbs = require('hbs'), path = require('path');
let home = require('./routes/home'); 
let view_all = require('./routes/view_all'); 
let success = require('./routes/success');
let display = require('./routes/display');
let app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
// Set View Engine
app.set('view engine','hbs');
app.set('views','./views');
// middleware for form handling
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// register partials
let partialPath = path.join(__dirname,"../partials");
hbs.registerPartials(partialPath);
// routes
app.use('/view_all',view_all);
app.use('/success',success);
app.use('/display',display);
app.use('/',home);
app.listen(PORT,()=>{
    console.log(`Sevrer Running on Port ${PORT}`);
});