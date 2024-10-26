import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    products: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true 
        },
        cantidad: { 
            type: Number, 
            required: true,
            default: 1
        }
    }]
})

cartSchema.pre('findOne', function(next) {
    this.populate('products.product', '_id titulo precio')
    next()
})

const CartModel = mongoose.model('Cart', cartSchema)

export default CartModel