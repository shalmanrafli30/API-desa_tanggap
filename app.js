const express = require("express");
const app = express();
const port = 3000;
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');

app.use(morgan('dev'))

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});