const express = require("express");
const app = express();
const PORT = process.env.PORT || 9090
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const amqp = require('amqplib')
app.use(express.json());
const Product = require('./Order')
const { isAuthenticated } = require('../isAuthenticated');

mongoose.connect("mongodb+srv://prabinlamsal:mKVIj2ehxVoKQqhB@cluster0.92rvbxj.mongodb.net/?retryWrites=true&w=majority", {
})

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
}

function createOrder(products, userEmail) {
    let total = 0;
    for (let t = 0; t < products; ++t) {
        total += products[t].price;
    }
    const newOrder = new Order({
        products,
        user: userEmail,
        toatl_price: total
    });
    newOrder.save();
    return newOrder;
}

connect().then(() => {
    channel.consume("ORDER", data => {
        console.log("Consuming ORDER queue");
        const { products, userEmail } = JSON.parse(data.content);
        const newOrder = createOrder(products, userEmail);
        channel.ack(data);
        console.log(products);
        channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify(newOrder)));

        channel.consume("PRODUCT", data => {
            var order = JSON.parse(data);
        });
        return res.json(order);
    });
});

//buy a product
app.listen(PORT, () => {
    console.log("Auth service running. PORT 9090")
})

