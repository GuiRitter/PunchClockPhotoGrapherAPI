import 'dotenv/config'; // always first import
import express from 'express';
import 'babel-polyfill';
import cors from 'cors';

import photoRoute from './app/route/photoRoute';
import userRoute from './app/route/userRoute';
import weekRoute from './app/route/weekRoute';

const app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(express.json({ limit: '50mb' }));

app.use('/punch_clock_photo_grapher/api/photo', photoRoute);
app.use('/punch_clock_photo_grapher/api/user', userRoute);
app.use('/punch_clock_photo_grapher/api/week', weekRoute);

app.listen(process.env.PORT, '127.0.0.1').on('listening', () => {
	console.log(`${(new Date()).toISOString()} are live on ${process.env.PORT}`);
});

export default app;
