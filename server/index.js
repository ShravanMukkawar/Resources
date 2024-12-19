const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const resourseRouter = require('./routes/resourceRoutes');

dotenv.config({ path: './config.env' });    //use it in this order read path first
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL, // Ensure this is the correct frontend URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json()); // To parse JSON data from POST requests
app.use(cookieParser()); // To parse cookies


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));     //=>   //GET /api/v1/tours/ 200 12.099 ms - 8895
}

app.use((req, res, next) => {
    console.log("HI i am middleware 😀");
    next()
})
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/resources', resourseRouter);

app.get('/', (request, response) => {
    response.json({
        message: "server running fine"
    });
});
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
console.log(process.env.MONGO_URL);
const PORT = process.env.PORT || 8001;
mongoose
    .connect(process.env.MONGO_URL, {

    })
    .then(() => {
        console.log("connection success👌");

    })
    .catch((error) => console.log(`${error} ${process.env.PORT} did not connect`));



app.listen(PORT, () => {
    console.log(`Server Port: ${PORT}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    app.close(() => {
        process.exit(1);
    });
});