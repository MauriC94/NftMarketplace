const express = require('express');
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mauriziocapone:Mauricap94@nftauction.wj0by.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(MONGODB_URI || 'mongodb://localhost/NftAuction', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected',() => {
    console.log('Mongoose is connected');
});

// Data Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, console.log('Server is starting at 8080'));