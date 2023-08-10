const express = require("express");
const app = express();
const PORT = process.env.PORT || 7070
const mongoose = require("mongoose")
const User = require("./User")
const jwt = require('jsonwebtoken')
mongoose.connect("mongodb+srv://prabinlamsal:mKVIj2ehxVoKQqhB@cluster0.92rvbxj.mongodb.net/?retryWrites=true&w=majority", {
})

app.use(express.json());

app.post("/auth/login", async (req, res) => {
    const { email, password, name } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ message: "User doesn't exist" });
    } else {
        //check if the entered password is vallid 
        if (password !== user.password) {
            return res.json({ message: "Password incorrect" });
        }
        const payload = {
            email,
            name: user.name
        };
        jwt.sign(payload, "secret", (err, token) => {
            if (err) console.log(err);
            else {
                return res.json({
                    token: token
                });
            }
        })
    }
})

app.post("/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.json({ message: "User already exists" })
    } else {
        const newUser = new User({
            name,
            email,
            password
        });
        newUser.save();
        return res.json(newUser);
    }
})

app.listen(PORT, () => {
    console.log("Auth service running. PORT 7070")
})