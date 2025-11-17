import { eventHandler, readBody, setResponseStatus } from 'h3';
import fetch from 'node-fetch';
import { CHEQD_FAUCET_SERVER } from '../constants/constants';

export default eventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const apiKey = process.env.CF_CHEQD_FAUCET_API_KEY;

		const response = await fetch(`${CHEQD_FAUCET_SERVER}/credit`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-API-KEY': apiKey,
				...(process.env.CF_ACCESS_CLIENT_ID && {
					'CF-Access-Client-Id': process.env.CF_ACCESS_CLIENT_ID,
					'CF-Access-Client-Secret': process.env.CF_ACCESS_CLIENT_SECRET,
				}),
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			setResponseStatus(event, response.status);
		}

		return data;
	} catch (error) {
		console.error('Error crediting account:', error);
		setResponseStatus(event, 500);
		return { error: 'Failed to credit account' };
	}
});
