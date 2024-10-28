import express from 'express';
import 'dotenv/config';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import database from './config/database.js';
import route from './routes/index.js';

const app = express();

database.connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	cors({
		origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
		credentials: true,
	})
);
app.use(express.static(path.join(import.meta.dirname, 'public')));

route(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send(err.message);
});

export default app;
