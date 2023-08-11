const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const amqp = require('amqplib')
app.use(express.json());
const Product = require('./Product')
const { isAuthenticated } = require('../isAuthenticated');
var order;

mongoose.connect("mongodb+srv://prabinlamsal:mKVIj2ehxVoKQqhB@cluster0.92rvbxj.mongodb.net/?retryWrites=true&w=majority", {
})

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT"); //creates product queue if it doesn't exist in the channel
}
connect();

//new product route 
app.post('/product/create', isAuthenticated, (req, res) => {
    const { name, description, price } = req.body;
    const newProduct = new Product({
        name,
        description,
        price
    })
    newProduct.save();
    res.json(newProduct);
})
// user sends list of product ids in an array
// product arrays => order object 

app.post('/product/buy', isAuthenticated, async (req, res) => {
    const { ids } = req.body;
    const products = await Product.findById({ _id: { $in: ids } })

    //place an order based on the product
    channel.sendToQueue("ORDER", Buffer.from(JSON.stringify({
        products,
        userEmail: req.user.email
    })));

    channel.consume("PRODUCT", data => {
        console.log("consuming PrODUCT queue");
        var order = JSON.parse(data);
        channel.ack(data);
    });
    return res.json(order);
})

app.listen(PORT, () => {
    console.log("Auth service running. PORT 8080")
})









































































































































































































