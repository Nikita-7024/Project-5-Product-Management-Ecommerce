const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true} ));
const mongoose = require('mongoose');
const route = require('./routes/route')


app.use('/', route);

try {
    //Insert your MongoDB Atlas String here:
    mongoose.connect("mongodb+srv://vpandey:qVLIgv7EqMycOrmr@cluster0.lvp0c.mongodb.net/group13Database?retryWrites=true&w=majority", {useNewUrlParser:true});
    console.log(`MongoDB Connection Successful`);
} catch (error) {
    console.log(error);
}




const port = process.env.PORT || 3000;
app.listen(port, console.log(`Express App running on ${port} 🚀`));