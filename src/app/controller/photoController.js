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

const sharp = require('sharp');

const log = getLog('photoController');

export const compose = async (req, res) => {
	const { week } = req.query;
	log('compose', { week });
	const weekQuery = `SELECT date_time FROM photo WHERE DATE_PART('week', TO_DATE(date_time, 'YYYY-MM-DD')) = $1;`;
	const photoQuery = `SELECT data_uri FROM photo WHERE date_time like $1;`;
	try {
		const { rows: photoRows } = await dbQuery.query(weekQuery, [week]);
		log('compose', { photoRows });
		const list = await Promise.all(photoRows.map(async row => {
			const { rows: photoRow } = await dbQuery.query(photoQuery, [row.date_time]);
			log('compose', { data_uri: photoRow[0].data_uri.length });
			return {
				dateTime: row.date_time,
				photo: sharp(Buffer.from(photoRow[0].data_uri.substring(22), 'base64'))
			};
		}));
		log('compose', { list });

		const calendar = await list.reduce(async (previousCalendar, currentPhoto) => {
			log('compose', { currentPhoto });
			const metadata = await currentPhoto.photo.metadata();
			log('compose', { metadata });
			const day = moment(currentPhoto.dateTime).date();
			previousCalendar = await previousCalendar;
			const dateList = previousCalendar.dateList;
			let date = dateList[day];
			if (!date) {
				date = {};
				dateList[day] = date;
			}
			let photo = date[currentPhoto.dateTime];
			if (!photo) {
				date[currentPhoto.dateTime] = currentPhoto.photo;
			}
			let maxCount = previousCalendar.maxCount;
			maxCount = (!maxCount) ? 0 : maxCount;
			maxCount = Math.max(maxCount, Object.keys(date).length);
			let width = Math.max(previousCalendar.width, metadata.width);
			let height = Math.max(previousCalendar.height, metadata.height);
			return { dateList, maxCount, width, height };
		}, {
			dateList: {},
			maxCount: 0,
			width: 0,
			height: 0
		});

		const numberOfDays = Object.keys(calendar.dateList).length;
		const maxPerDay = calendar.maxCount;

		const composite = await sharp({
			create: {
				width: numberOfDays * calendar.width,
				height: maxPerDay * calendar.height,
				channels: 3,
				background: { r: 0, g: 0, b: 0 }
			}
		}).composite(
			(await Promise.all(Object.values(calendar.dateList).map(
				async (dateValue, dateIndex) => await Promise.all(Object.values(dateValue).map(
					async (photoValue, photoIndex) => ({
						input: await (async () => {
							log('compose', { photoValue });
							log('compose', { 'photoValue.png': photoValue.png() });
							log('compose', { 'photoValue.png.toBuffer': photoValue.png().toBuffer() });
							log('compose', { 'await photoValue.png.toBuffer': await photoValue.png().toBuffer() });
							return await photoValue.png().toBuffer();
						})(),
						top: photoIndex * calendar.height,
						left: dateIndex * calendar.width
					})
				))
			))).flat()
		).toString('base64');

		return res.status(status.success).send('test');
	} catch (error) {
		return buildError(log, 'compose', error, res);
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