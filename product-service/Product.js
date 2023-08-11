const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    description: String,
    price: String,
    created_at: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = User = mongoose.model("product", productSchema);