const express = require('express');
const nedb = require('nedb');
const rest = require('express-nedb-rest');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult} = require('express-validator')
require('dotenv').config()
const app = express();
const key = process.env.JWT_KEY;
const withAuth = require('./middleware')


const coffeestore = new nedb({
    filename: "mycoffeeapp.db",
    autoload: true
});

const userstore = new nedb({
    filename: "users.db",
    autoload: true
})

userstore.ensureIndex({fieldName: 'username', unique: true}, (err) => {
    if (err){
        console.log(`Error creating unique index for username: ${err}`)
    }else{
        console.log('Unique index for username successfully created')
    }
})
 
const restAPI = rest();
restAPI.addDatastore("coffees", coffeestore);

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/coffee", restAPI);
app.get("/users", (req, res) => {
    userstore.find({}, (err, users) => {
        if (err){
            res.status(500).json({
                message: err
            })
        }else if (users){
            res.status(201).json({message: users})
        }else{
            res.sendStatus(500);
        }})
});

app.get("/userCoffees", (req, res) => {
    const { userId } = req.query;
    coffeestore.find({userId}, (err, coffees) => {
        if (err){
            res.status(500).json({
                message: err
            })
        }else if (coffees){
            res.status(201).json({ message: coffees })
        }else{
            res.status(400).json({message: 'No coffees found'})
        }
    })
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    userstore.findOne({username}, (err, user) => {
        if (err){
            res.status(500).json({
                message: err
            })
        }else if (user){
            res.status(400).json({message: 'User already exists'})
        }else{
            bcrypt.hash(password, 10, (error, hash) => {
                if (error){
                    res.status(500).json({
                        message: error
                    })
                }else{
                    userstore.insert({ username, password: hash }, (err, user) => {
                        if (err){
                            res.sendStatus(500);
                        }else{
                            res.status(201).json({ message: 'Successfully registered', data: user.username });
                        }
                    })
                }
            })
        }
    })
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    userstore.findOne({username}, (err, user) => {
        if (err){
            res.sendStatus(500)
        }else if(user){
            bcrypt.compare(password, user.password, (error, success) => {
                if (err){
                    res.sendStatus(500)
                }else if(success){
                    const token = jwt.sign({ id: user._id }, key, {
                        expiresIn: "1m"
                    });
        
                    res.cookie('token', token, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: process.env.NODE_ENV === 'production'
                    })
                    res.status(200).json({
                        id: user._id,
                        username: user.username
                    })
                }else if (!success){
                    res.status(400).json({message: "Passwords don't match"})
                }else{
                    res.status(400).json({message: err})
                }
            })
           
        }else if (user === null){
            res.status(400).json({message: 'User not found'})
        }
    })
});

app.post('/check', withAuth, (req, res) => {
    const { _id } = req.body;
    userstore.findOne({ _id }, (err, user) => {
        if (err){
            res.sendStatus(500);
        }else if (user){
            res.status(200).json({message: 'User found', user: user.username})
        }
    })
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.sendStatus(200);
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
});

