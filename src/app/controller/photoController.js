import moment from 'moment';

import dbQuery from '../db/dev/dbQuery';

import {
	isNonEmptyString
} from '../helper/validation';

import {
	buildError,
	errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('photoController');

export const compose = async (req, res) => {
	const { week } = req.query;
	const weekQuery = `SELECT date_time FROM photo WHERE DATE_PART('week', TO_DATE(date_time, 'YYYY-MM-DD')) = $1`;
	const photoQuery = `SELECT data_uri FROM photo WHERE date_time like $1`;
	try {
		const { photoRows } = await dbQuery.query(weekQuery, [week]);
		const list = await Promise.all(rows.map(async row => {
			const { photoRow } = await dbQuery.query(photoQuery, [row.date_time]);
			return {
				dateTime: row.date_time,
				photo: sharp(photoRow[0].data_uri)
			};
		}));
		console.log(list);
		return res.status(status.success).send('test');
	} catch (error) {
		return buildError(log, 'get', error, res);
	}
};

export const get = async (req, res) => {
	const { dateTime } = req.query;
	const query = `SELECT date_time, data_uri FROM photo WHERE date_time like $1;`;
	try {
		const { rows } = await dbQuery.query(query, [dateTime]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'get', error, res);
	}
};

export const list = async (req, res) => {
	const query = `SELECT date_time, DATE_PART('week', TO_DATE(date_time, 'YYYY-MM-DD')) AS week FROM photo ORDER BY date_time;`;
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'list', error, res);
	}
};

export const put = async (req, res) => {
	const { dateTime, dataURI } = req.body;
	log('put', { dateTime, dataURI: dataURI ? `${dataURI.substring(0, 26)}...` : dataURI });
	if (!isNonEmptyString(dataURI)) {
		errorMessage.error = 'No content.';
		return res.status(status.bad).send(errorMessage);
	}
	const query = 'INSERT INTO photo (date_time, data_uri) VALUES ($1, $2) RETURNING *;';
	try {
		const result = await dbQuery.query(query, [dateTime, dataURI]);
		const rows = result.rows;
		log('put', { result });
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'put', error, res);
	}
};