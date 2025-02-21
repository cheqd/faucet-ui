import axios from 'axios';
import { CHEQD_FAUCET_SERVER } from '../../constants/constants';

// Configure Axios interceptor for Cloudflare authentication
axios.interceptors.request.use((config) => {
	// Only add headers for requests to our faucet API
	if (config.url?.includes(CHEQD_FAUCET_SERVER)) {
		config.headers['CF-Access-Client-Id'] = process.env.CF_ACCESS_CLIENT_ID;
		config.headers['CF-Access-Client-Secret'] = process.env.CF_ACCESS_CLIENT_SECRET;
	}
	return config;
});

// Export configured axios instance if needed
export default axios;
