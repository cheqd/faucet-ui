import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
	const { token } = await readBody(event);

	if (!token) {
		throw createError({
			statusCode: 422,
			statusMessage: 'Token not provided.',
		});
	}

	return await verifyTurnstileToken(token);
});
