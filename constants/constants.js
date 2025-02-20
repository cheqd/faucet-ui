import axios from 'axios';

export const CHEQD_FAUCET_SERVER = process.env.CF_CHEQD_FAUCET_SERVER || 'https://faucet-api.cheqd.network';
export const CHEQD_MINIMAL_DENOM = process.env.CF_CHEQD_MINIMAL_DENOM || 'ncheq';
export const CHEQD_CURRENT_AMOUNT_GIVEN = process.env.CF_CHEQD_CURRENT_AMOUNT_GIVEN || 1000000000000;
export const DEFAULT_TESTING_ADDRESS =
	process.env.CF_DEFAULT_TESTING_ADDRESS || 'cheqd12248whff96tpfyqm2vyvf9k4wda9h2dhdkf2e4';

// Add request interceptor
axios.interceptors.request.use((config) => {
	// Only add headers for requests to our faucet API
	if (config.url?.includes(CHEQD_FAUCET_SERVER)) {
		config.headers['CF-Access-Client-Id'] = process.env.CF_ACCESS_CLIENT_ID;
		config.headers['CF-Access-Client-Secret'] = process.env.CF_ACCESS_CLIENT_SECRET;
	}
	return config;
});
