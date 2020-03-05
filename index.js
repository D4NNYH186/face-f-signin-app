const hbs = require('express-handlebars');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UserSchema = require('./models/user')
const app = express();

const getUsers = require('./lib/getUsers');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.engine('.hbs', hbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

mongoose.connect('mongodb+srv://dannyh186:codenation@clusterduck-cpzou.mongodb.net/userdb?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/signUp',(req,res)=>{
    res.render('signUp')
})

app.post('/', async(req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    let docs = await getUsers(email);

    if (docs.length > 0){
        res.render('signUp',{err: "This User already exists, please try again..."})
        return;
    } 

    const user = new UserSchema({
    name: name,
    email: email,
    password:password,
});
user.save()
console.log(user)
let profile_name = user.toObject().name;
res.render('profile', {profile_name})
});

app.post('/login', async (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    let docs = await getUsers(email)

    if (docs.length == 0){
        res.render('login', {err: 'no user was found'})
        return
    } 

    if (docs[0].password != password){
        res.render('login', {err:'Password was not correct'})
        return
    }
    res.render('profile')

    

})



app.listen(3001, () => {
console.log()
});