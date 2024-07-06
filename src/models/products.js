const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, required: true },
    codigo: { type: String, required: true },
    stock: { type: Number, required: true }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
