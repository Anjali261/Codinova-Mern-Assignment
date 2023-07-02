const express  = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());


mongoose.set('strictQuery', false);
const connectDB = async() =>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,

        })
        console.log(`MongoDB connected: ${con.connection.host}`);
        
    }catch(error){
        console.log(error);
        process.exit(1);

    }
}
connectDB();

const exchangeSchema = new mongoose.Schema({
    name: String,
    symbol: String,
    iconUrl: String,
  });
  
  const Exchange = mongoose.model('Exchange', exchangeSchema);
  




app.listen(process.env.PORT, () =>{
    console.log(`Server is listening at http://localhost:${process.env.PORT}`);
})
