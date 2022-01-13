
<template>
  <div>
    <div class="txtdts text-center">
      <h1 class="welcometitle">Welcome to the cheqd Testnet self-serve faucet
        <v-tooltip
          top
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              small
              color="green"
              >
              mdi-circle
            </v-icon>
          </template>
          <span>{{ faucet_status }}</span>
        </v-tooltip>
      </h1>
      <p>If you are setting up a node on the cheqd test network here you can provide details required in order to receive tokens. This will enable you to promote your node to validator. start validating the cheqd test network and test out the identity functionalities available.</p>
    </div>
    <v-stepper v-model="step" alt-labels class="bgdarkopacity">

      <v-stepper-step
        class="stepiconfont"
        step="1"
        :complete="step > 1"
        editable
      >
        Add your cheqd Address
        <v-tooltip
        top
        close-delay="2000"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              small
              >
              mdi-information-outline
            </v-icon>
          </template>
          <span>Please enter your cheqd testnet wallet address which we'll use to transfer your test tokens.<br> To show the wallet address, follow the <a class="font-weight-bold" href="https://github.com/cheqd/cheqd-node/blob/main/docs/cheqd-cli/cheqd-cli-accounts.md" target="_blank">cheqd CLI guide on managing accounts (cheqd-noded keys list).</a><br> It should begin with "cheqd1".</span>
        </v-tooltip>
      </v-stepper-step>

      <v-stepper-content
        :step="1"
      >
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-col
            cols="12"
          >
          <v-card
            class="mb-12 col-auto"
            color="lighten-1"

          >
            <v-text-field
              v-model="address"
              label="cheqd Address"
              :hint="`Example: ${DEFAULT_TESTING_ADDRESS}`"
              required
              class="col-12"
              :rules="address_rules"
            />
          </v-card>
          <v-btn
            :disabled="!valid"
            @click="validate"
            depressed
            color="primary"
            class="d-block mx-auto"
          >Continue
        </v-btn>
        </v-col>
        </v-form>
      </v-stepper-content>

      <v-divider></v-divider>

      <v-stepper-step
        step="2"
        :complete="step > 2"
        class="stepiconfont"
      >
        Verification Challenge
        <v-tooltip
        top
        close-delay="2000"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              small
              >
              mdi-information-outline
            </v-icon>
          </template>
          <span>Complete the reCaptcha.<br> Once you have completed this we'll send you a notification with confirmation your tokens have been sent.</span>
        </v-tooltip>
      </v-stepper-step>

      <v-stepper-content
        :step="2"
      >
        <v-form
          @submit.prevent="handle_submit"
        >
          <recaptcha />
          <v-btn
            type="submit"
            depressed
            color="primary"
            class="d-block mx-auto"
            :loading="loading"
          >Continue
          </v-btn>
        </v-form>
      </v-stepper-content>
    </v-stepper>
    <v-alert
      icon="mdi-shield-lock-outline"
      prominent
      dismissible
      text
      type="success"
      v-model="success"
      transition="scale-transition"
      class="mt-3"
      outlined
    >
      <b>Done! Your requests tokens should have arrived at your provided address ({{ CHEQD_CURRENT_AMOUNT_GIVEN }} {{ CHEQD_MINIMAL_DENOM }}).</b>
    </v-alert>
    <v-alert
      icon="mdi-shield-lock-outline"
      prominent
      dismissible
      text
      type="error"
      v-model="error"
      transition="scale-transition"
      class="mt-3"
      outlined
    >
      <b>Server is unreachable at the moment. Kindly, try again later.</b>
    </v-alert>
    <v-alert
      icon="mdi-shield-lock-outline"
      prominent
      dismissible
      text
      type="info"
      v-model="error_non_existing_address"
      transition="scale-transition"
      class="mt-3"
      outlined
    >
      <b>Address is not in the expected format for this chain or does not exist.</b>
    </v-alert>
    <v-alert
      icon="mdi-shield-lock-outline"
      prominent
      dismissible
      text
      type="warning"
      v-model="error_recaptcha"
      transition="scale-transition"
      class="mt-3"
      outlined
    >
      <b>You haven't passed the reCaptcha Verification challenge yet.</b>
    </v-alert>
  </div>
</template>

<script>

import { CHEQD_FAUCET_SERVER, CHEQD_MINIMAL_DENOM, CHEQD_CURRENT_AMOUNT_GIVEN, DEFAULT_TESTING_ADDRESS } from '../constants/constants'

export default {
  data: () => {
    return {
      step: 1,
      address: null,
      valid: false,
      loading: false,
      success: false,
      error: false,
      error_non_existing_address: false,
      error_recaptcha: false,
      faucet_status: '',
      faucet_status_color: 'green',
      address_rules: [
        value => !!value||`Required.\n Example: ${DEFAULT_TESTING_ADDRESS}`,
        value => /^(cheqd)1[a-z0-9]{38}$/.test(value)||'Invalid cheqd address format.'
      ],
      CHEQD_MINIMAL_DENOM,
      CHEQD_CURRENT_AMOUNT_GIVEN,
      DEFAULT_TESTING_ADDRESS
    }
  },

  async mounted () {
    await this.handle_interval(this.handle_faucet_status(), 30000)
  },

  methods: {
    validate () {
      this.$refs.form.validate()
      return this.valid
              ? this.step++
              : false
    },

    async handle_auto_dismiss (prop, interval=4000) {
      return setTimeout(() => {return this[prop] = !this[prop]}, interval)
    },

    async handle_interval (promise, interval) {
      while(true) {
        await new Promise(resolve => setTimeout(resolve, interval))
        await promise
      }
    },

    async handle_faucet_status () {
      try {
        const status = await this.$axios.get(
          `${CHEQD_FAUCET_SERVER}/status`
        )
        if(status.data.status === 'ok') {
          this.faucet_status_color = 'green'
          this.faucet_status = 'Online'
          return
        }
      } catch (error) {
        this.faucet_status_color = 'red'
        this.faucet_status = 'Offline'
        return
      }

      this.faucet_status_color = 'red'
      this.faucet_status = 'Offline'
      return
    },

    async handle_submit () {

      this.loading = !this.loading

      try {
        await this.$recaptcha.getResponse()
        await this.$recaptcha.reset()
      } catch (error) {
        this.loading = !this.loading
        this.error_recaptcha = true
        return this.handle_auto_dismiss('error_recaptcha')
      }

      const status = await this.handle_fetch()

      this.loading = !this.loading

      if(!status) return this.error_non_existing_address = true

      if(status.data === 'ok'){
        this.success = true
        return this.handle_auto_dismiss('success')
      }

      this.error = true
      return this.handle_auto_dismiss('error')
    },

    async handle_fetch () {
      try {
        const response = await this.$axios.post(
          `${CHEQD_FAUCET_SERVER}/credit`,
          {
            denom: CHEQD_MINIMAL_DENOM,
            address: this.address || DEFAULT_TESTING_ADDRESS
          }
        )
        return response
      } catch (error) {
        return false
      }
    }
  }
}

</script>
<style scoped>
  div.g-recaptcha {
    margin: 0 auto 20px auto;
    width: 304px;
  }
  .bgdarkopacity {
    background: rgba(48,48,48,0.9) !important;
    min-width: 300px;
    width: 60%;
    display: block;
    margin: 0 auto;
  }
  .txtdts {
    text-align: center;
  }
  .txtdts h1 {
    font-style: normal;
    font-weight: 300;
    text-decoration: none;
    /* color: #003b5c; */
    font-size: 62px;
    letter-spacing: 0px;
    text-transform: none;
  }
  .v-tooltip__content {
    pointer-events: initial;
  }
  ::v-deep .stepiconfont .v-stepper__step__step {
    font-size: 1.25rem;
    height: 35px;
    min-width: 35px;
    width: 28px;
  }
  ::v-deep .v-stepper:not(.v-stepper--vertical) .v-stepper__label {
    display: block !important;
  }
  ::v-deep .statusbadge .v-badge__badge {
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
  .welcometitle {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  @media only screen and (max-width: 992px) {
    .bgdarkopacity {
      width: 85%;
    }
    .txtdts h1 {
      font-size: 42px;
    }
  }
  @media only screen and (max-width: 756px) {
    .txtdts h1 {
      font-size: 36px;
    }
  }
  @media only screen and (max-width: 576px) {
    .bgdarkopacity {
      width: 100%;
      min-width: auto;
    }
    .txtdts h1 {
      font-size: 32px;
    }
  }
  @media only screen and (max-width: 500px) {
    .txtdts h1 {
      font-size: 26px;
    }
  }
</style>
