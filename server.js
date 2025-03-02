import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/User.js';
import bcrypt from 'bcrypt';
const app = express();
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to the MERN Stack Application");
});

//registration page api
app.post('/register', async(req, res) => {
    const { username, email, password } = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        res.json({message: "User registered successfully"});
        console.log("User registered successfully");
    }
    catch(err){
        console.log(err);
    }
});

//login page api
app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        if(!user || !(await bcrypt.compare(password, user.password))){
           return res.status(400).json({message: "Invalid Credentials"});
        }     
        res.json({message: "User logged in successfully"});
        console.log("User logged in successfully");
    }
    catch(err){
        console.log(err);
    }
}
);



mongoose.connect(process.env.MONGO_URL).then(
    () => console.log("DB connected successfully------------")
).catch((err) => {
    console.log(err);
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("server is running on port ::" + PORT);
});