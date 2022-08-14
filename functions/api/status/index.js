export async function onRequest(context) {

  const FAUCET_SERVER = context.env.FAUCET_SERVER || ''
  const CURRENT_AMOUNT_GIVEN = context.env.CURRENT_AMOUNT_GIVEN || 0

  const ping = await fetch( `${FAUCET_SERVER}/status` )
  const info = await ping.json()

  const processed = {
    overall_balance: {
      holder: {
        address: info.holder.address,
        balance: info.holder.balance,
      },
      distributors: info.distributors
    },
    refill_needed: !( Math.floor( Number( info.holder.balance[0].amount ) / CURRENT_AMOUNT_GIVEN ) > 1 ) && info.distributors.filter( (v) => { return Math.floor( Number( v.balance[0].amount ) / CURRENT_AMOUNT_GIVEN ) >= 1 } ).length < 2 ,
  }

  return new Response( JSON.stringify( processed ) )
}
