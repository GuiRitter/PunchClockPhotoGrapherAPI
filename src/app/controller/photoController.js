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

export const get = async (req, res) => {
	const query = 'SELECT date_time, data_uri FROM photo ORDER BY date_time;';
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'get', error, res);
	}
};

export const put = async (req, res) => {
	const { dateTime, dataURI } = req.body;
	log('put', { dateTime, dataURI });
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