import { eventHandler } from 'h3';
import fetch from 'node-fetch';
import { CHEQD_FAUCET_SERVER, CHEQD_CURRENT_AMOUNT_GIVEN } from '../../constants/constants';

export default eventHandler(async (req, res) => {
	try {
		const ping = await fetch(`${CHEQD_FAUCET_SERVER}/status`);
		const info = await ping.json();

		const processed = {
			overall_balance: {
				holder: {
					address: info.holder.address,
					balance: info.holder.balance,
				},
				distributors: info.distributors,
			},
			refill_needed:
				!(Math.floor(Number(info.holder.balance[0].amount) / CHEQD_CURRENT_AMOUNT_GIVEN) > 1) &&
				info.distributors.filter((v) => {
					return Math.floor(Number(v.balance[0].amount) / CHEQD_CURRENT_AMOUNT_GIVEN) >= 1;
				}).length < 2,
		};

		return processed;
	} catch (error) {
		console.error('Error occurred:', error);
		return res.status(500).json({ error: 'Failed to fetch status' });
	}
});
