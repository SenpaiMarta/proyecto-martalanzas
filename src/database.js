import mongoose from "mongoose";

mongoose.connect("mongodb+srv://soymartalanzas:7gJU7qWxfugem6fm@proyecto-backend.mnfpz.mongodb.net/?retryWrites=true&w=majority&appName=proyecto-backend")
    .then(() => console.log("Conexión esatblecida con éxito"))
    .catch(() => console.log("No se ha podido conectar así que estoy suspensa :)"))
    