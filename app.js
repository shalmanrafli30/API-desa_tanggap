require('dotenv').config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT;
const morgan = require('morgan');
const middlewareLogReq = require('./middleware/logs');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/laporanRoutes');
// const authenticated = require('./middleware/authMiddleware');

app.use(morgan('dev'))
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(middlewareLogReq);
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/laporan', reportRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});