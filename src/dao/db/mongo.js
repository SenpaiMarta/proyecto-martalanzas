import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://soymartalanzas:7gJU7qWxfugem6fm@proyecto-backend.mnfpz.mongodb.net/?retryWrites=true&w=majority&appName=proyecto-backend', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
};
export default connectDB
