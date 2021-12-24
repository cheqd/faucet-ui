<template>
  <v-stepper v-model="step" alt-labels>
    <v-stepper-step
      step="1"
      :complete="step > 1"
      editable
    >
      Add your cheqd Address
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
          height="200px"
        >
          <v-text-field
            v-model="address"
            label="cheqd Address"
            hint="Example: cheqd1d7f9d6s4a5s8d01j293jd7392j1820jd021g1h"
            required
            class="col-4"
            :rules="address_rules"
          />
        </v-card>
        <v-btn
          :disabled="!valid"
          @click="validate"
          depressed
          color="primary"
        >Continue
      </v-btn>
      </v-col>
      </v-form>
    </v-stepper-content>

    <v-divider></v-divider>

    <v-stepper-step
      step="2"
      :complete="step > 2"
    >
      Verification Challenge
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
        >Continue
        </v-btn>
      </v-form>
    </v-stepper-content>
  </v-stepper>
</template>

<script>

export default {
  data: () => {
    return {
      step: 1,
      address: null,
      valid: false,
      address_rules: [
        value => !!value||"Required.\n Example: cheqd1d7f9d6s4a5s8d01j293jd7392j1820jd021g1h",
        value => /^(cheqd)1[a-z0-9]{38}$/.test(value)||'Invalid cheqd address format.'
      ]
    }
  },

  methods: {
    validate () {
      this.$refs.form.validate()
      return this.valid
              ? this.step++
              : false
    },

    async handle_submit () {
      try {
        const recaptcha_token = await this.$recaptcha.getResponse()
        console.warn(`Recaptcha token: ${recaptcha_token}`)
        await this.$recaptcha.reset()

        const status = await this.handle_fetch()
        console.warn(status)

      } catch (error) {
        console.error(error)
      }
    },

    async handle_fetch () {
      try {
        const response = await this.$axios.post(
          `http://34.65.45.226`,
          {
            address: this.address
          }
        )
        return response
      } catch (error) {
        console.error(error)
      }
      return {}
    }
  }
}

</script>
