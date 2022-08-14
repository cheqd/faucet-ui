const app = require('express')()
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
import { FAUCET_SERVER, CURRENT_AMOUNT_GIVEN } from '../../constants/constants'

app.use(bodyParser.json())

app.all('/', async (req, res) => {
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

  return res.json( processed )
})

module.exports = app
