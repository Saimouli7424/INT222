require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT;


app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const mongoURI = process.env.MONGO_URI;

//connection to MongoDB
mongoose.connect(mongoURI)
.then(()=>{
    console.log('Connected to MongoDB');
}).catch(()=>{
    console.error('Error connecting to MongoDB: ',err);
})

//Define user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User",userSchema);

app.get('/users',(req,res)=>{
    User.find({})
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: err.message }));
});

app.post("/users", (req, res) => {
    //create a new user based on the provided data in the request body
    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    });
    
    //save the user to the database
    user.save()
    .then(() => {
          //return the newly created user
        res.json(user);
    })
    .catch(err => {
          //if an error occurs, send it back as a HTTP response with status code and message
        res.status(400).send(err);
    });
});

app.put("/users/:id", (req,res)=> {
    const id = req.params.id;
    const updateData = {
        name : req.body.name,
        email: req.body.email,
        passowrd: req.body.password
    };
    User.findByIdAndUpdate(userId, updateData, { new: true})
    .then((updatedUser) => {
       //give the updated user info as the result of this PUT request
    return res.json(updatedUser);
    })
    .catch((err) => {
    console.log(err);
    res.status(400).send("Unable to update user");
    });
});

app.delete('/users/:id',  (req, res)=>{
    const userId = req.params.id;

    User.findByIdAndDelete(userId).then(deletedUser=>{
        if(!deletedUser)
        {
            return res.status(400).json({ message: 'user not found'});
        }
        res.json({message:'Deletion was successful!'});
    }).catch(err => res.status(400).json({message: err.message}));
});


app.listen(PORT,()=>console.log(`server started in ${PORT}`));