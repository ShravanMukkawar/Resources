const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const resourseRouter = require('./routes/resourceRoutes');
const dropRouter = require('./routes/dropRoutes')
const eventRouter = require('./routes/eventRoutes');
const visitorRoutes = require('./routes/visitorCountRoutes');

const AppError = require('./utils/appError'); // Import AppError

dotenv.config({ path: './.env' });
const app = express();


app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(cors());

app.use((req, res, next) => {
    console.log("HI i am middleware 😀");
    next();
});

console.log(process.env.FRONTEND_URL);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api/v1/resources', resourseRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api', dropRouter)
app.use('/api', visitorRoutes);
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
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connection success👌");
    })
    .catch((error) => console.log(`${error} ${process.env.PORT} did not connect`));

app.listen(PORT, () => {
    console.log(`Server Port: ${PORT}`);
});


process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    app.close(() => {
        process.exit(1);
    });
});
