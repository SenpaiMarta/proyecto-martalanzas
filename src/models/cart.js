import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        cantidad: { type: Number, required: true }
    }]
})

const Cart = mongoose.model('part', cartSchema)

export default Cart