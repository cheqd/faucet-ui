export async function onRequest(context) {
	const CHEQD_FAUCET_SERVER = context.env.CF_CHEQD_FAUCET_SERVER || '';
	const CHEQD_CURRENT_AMOUNT_GIVEN = context.env.CF_CHEQD_CURRENT_AMOUNT_GIVEN || 0;

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

	return new Response(JSON.stringify(processed));
}
