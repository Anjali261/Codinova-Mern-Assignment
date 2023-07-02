import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import pgp from 'pg-promise';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();

const exchangeSchema = new mongoose.Schema({
  exchange_id: String,
  name: String,
  website: String,
  icon: String,
});

const Exchange = mongoose.model('Exchange', exchangeSchema);





// Fetch and store exchange data
app.get('/fetch-exchanges', async (req, res) => {
  try {
    const apiKey = `0D690090-8231-403E-BC3D-700E500A7034`; 

    // Fetch exchange data from CoinAPI.io
    const exchangesResponse = await fetch(`https://rest.coinapi.io/v1/exchanges/apikey-${apiKey}`);

    const exchangesData = await exchangesResponse.json();

    // Ensure exchangesData is an array
    const exchanges = Array.isArray(exchangesData) ? exchangesData : [];

    // Fetch exchange icons and map them to exchanges
    const iconsResponse = await fetch(`https://rest.coinapi.io/v1/exchanges/icons/32/apikey-${apiKey}`);

    const iconsData = await iconsResponse.json();

    // Ensure iconsData is an array
    const icons = Array.isArray(iconsData) ? iconsData : [];

    const exchangesWithIcons = exchanges.map((exchange) => {
      const icon = icons.find((icon) => icon.exchange_id === exchange.exchange_id);
      return {
        exchange_id: exchange.exchange_id,
        name: exchange.name,
        website: exchange.website,
        icon: icon ? icon.url : null,
      };
    });

    // Store exchange data in the database
    await Exchange.deleteMany();
    await Exchange.insertMany(exchangesWithIcons);

    console.log('Fetched and stored exchange data:');
    console.log(exchangesWithIcons);

    res.status(200).json({ message: 'Exchange data fetched and stored successfully.' });
  } catch (error) {
    console.error('Error fetching and storing exchange data:', error);
    res.status(500).json({ error: 'Failed to fetch and store exchange data.' });
  }
});

// ExchangeList API to fetch exchange data from the database
app.get('/exchange-list', async (req, res) => {
  try {
    const exchanges = await Exchange.find();
    res.status(200).json(exchanges);
  } catch (error) {
    console.error('Error fetching exchange data:', error);
    res.status(500).json({ error: 'Failed to fetch exchange data.' });
  }
});



// // Fetch and store exchange data
// app.get('/fetch-exchanges', async (req, res) => {
//   try {
//     const apiKey = 'process.env.CRYPTO_API'; 

//     // Fetch exchange data from Coinapi.io
//     const exchangesResponse = await fetch('https://rest.coinapi.io/v1/exchanges', {
//       headers: {
//         'X-CoinAPI-Key': apiKey,
//       },
//     });

//     const exchanges = await exchangesResponse.json();

//     // Fetch exchange icons and map them to exchanges
//     const iconsResponse = await fetch('https://rest.coinapi.io/v1/exchanges/icons/32', {
//       headers: {
//         'X-CoinAPI-Key': apiKey,
//       },
//     });

//     const icons = await iconsResponse.json();

//     const exchangesWithIcons = exchanges.map((exchange) => {
//       const icon = icons.find((icon) => icon.exchange_id === exchange.exchange_id);
//       return {
//         exchange_id: exchange.exchange_id,
//         name: exchange.name,
//         website: exchange.website,
//         icon: icon ? icon.url : null,
//       };
//     });

//     // Store exchange data in the database
//     await Exchange.deleteMany();

//     for (const exchange of exchangesWithIcons) {
//       const newExchange = new Exchange(exchange);
//       await newExchange.save();
//     }

//     console.log('Fetched and stored exchange data:');
//     console.log(exchangesWithIcons);

//     res.status(200).json({ message: 'Exchange data fetched and stored successfully.' });
//   } catch (error) {
//     console.error('Error fetching and storing exchange data:', error);
//     res.status(500).json({ error: 'Failed to fetch and store exchange data.' });
//   }
// });

// // ExchangeList API to fetch exchange data from the database
// app.get('/exchange-list', async (req, res) => {
//   try {
//     const exchanges = await Exchange.find();
//     res.status(200).json(exchanges);
//   } catch (error) {
//     console.error('Error fetching exchange data:', error);
//     res.status(500).json({ error: 'Failed to fetch exchange data.' });
//   }
// });

    


      





const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
