require('dotenv').config()
const exp = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = exp();

app.set('view engine','ejs');
app.use(exp.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password']});

const User = mongoose.model('User',userSchema);



app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password:req.body.password
    });

    newUser.save()
           .then(()=>{
            res.render('secrets');
           })
           .catch((err)=>{
            console.log(err);
           });
});

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email:username})
        .then((foundUser)=>{
            if(foundUser.password===password){
                res.render('secrets');
            }
        })
        .catch((err)=>{
            console.log(err);
        });

});


app.listen(3000,(req,res)=>{
    console.log("Server listening on 3000");
});
