<template>
	<div>
		<v-stepper v-model="step" alt-labels class="bgdarkopacity" vertical linear>
			<!-- Step 1: Instructions -->
			<v-stepper-header>
				<v-stepper-item class="stepiconfont" title="Instructions" :value="1" editable />
			</v-stepper-header>

			<v-stepper-window v-if="step === 1">
				<v-stepper-window-item :value="1" class="d-flex flex-column align-center">
					<div class="txtdts text-center mb-4">
						<p>
							If you are a developer looking to test the functionality of cheqd network or setting up a
							node on testnet, setting up a node on the cheqd test network, you can acquire
							<b>test</b> CHEQ tokens through this faucet.
						</p>
					</div>
					<v-btn @click="step++" depressed color="#FE5000" class="d-block mx-auto centered">Start</v-btn>
				</v-stepper-window-item>
			</v-stepper-window>

			<!-- Step 2: Add cheqd Testnet Address -->
			<v-stepper-header>
				<v-stepper-item :value="2" editable>
					<template v-slot:title>
						<span class="d-flex align-center">
							Add your cheqd testnet Address
							<v-tooltip location="top" close-delay="2000">
								<template v-slot:activator="{ props }">
									<v-icon v-bind="props" small>mdi-information-outline</v-icon>
								</template>
								<span style="pointer-events: auto">
									Please enter your cheqd testnet wallet address which we'll use to transfer your test
									tokens.<br />
									To show the wallet address, follow the
									<a
										class="font-weight-bold"
										href="https://docs.cheqd.io/node/getting-started/cheqd-cli/cheqd-cli-key-management#listing-available-keys-on-a-node"
									>
										cheqd CLI guide on managing accounts (cheqd-noded keys list). </a
									><br />
									It should begin with "cheqd1".
								</span>
							</v-tooltip>
						</span>
					</template>
				</v-stepper-item>
			</v-stepper-header>

			<v-stepper-window v-if="step === 2">
				<v-stepper-window-item :value="2">
					<v-form ref="form" v-model="valid">
						<v-col cols="12">
							<v-card class="mb-12 col-auto" color="lighten-1">
								<v-text-field
									v-model="address"
									label="cheqd wallet Address"
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
								color="#FE5000"
								class="d-block mx-auto"
							>
								Continue
							</v-btn>
						</v-col>
					</v-form>
				</v-stepper-window-item>
			</v-stepper-window>
			<v-divider></v-divider>

			<!-- Step 3: Verification Challenge -->
			<v-stepper-header>
				<v-stepper-item :value="3">
					<template v-slot:title>
						<span class="d-flex align-center">
							Complete the captcha!
							<v-tooltip location="top" close-delay="2000">
								<template v-slot:activator="{ props }">
									<v-icon v-bind="props" small>mdi-information-outline</v-icon>
								</template>
								<span
									>Once you have completed this, we'll send you a notification with confirmation that
									your tokens have been sent.</span
								>
							</v-tooltip>
						</span>
					</template>
				</v-stepper-item>
			</v-stepper-header>

			<v-stepper-window v-if="step === 3">
				<v-stepper-window-item :value="3">
					<v-form @submit.prevent="handle_submit">
						<!-- Cloudflare Turnstile -->
						<v-container class="d-flex flex-column align-center justify-center">
							<NuxtTurnstile v-model="token" class="center" />
							<v-btn
								:disabled="!turnstileToken"
								@click="validate"
								depressed
								color="#FE5000"
								class="d-block mx-auto"
							>
								Verify & Continue
							</v-btn>
						</v-container>
					</v-form>
				</v-stepper-window-item>
			</v-stepper-window>
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
			<b
				>Done! Your requests tokens should have arrived at your provided address ({{
					CHEQD_CURRENT_AMOUNT_GIVEN
				}}
				{{ CHEQD_MINIMAL_DENOM }}).</b
			>
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
			v-model="error_turnstile"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>You haven't passed the captcha verification challenge yet.</b>
		</v-alert>
	</div>
</template>

<script>
import axios from 'axios';
import { 
	CHEQD_MINIMAL_DENOM,
	CHEQD_CURRENT_AMOUNT_GIVEN,
	DEFAULT_TESTING_ADDRESS
} from '../constants/constants';

export default {
	data: () => ({
		step: 1,
		address: null,
		valid: false,
		loading: false,
		success: false,
		error: false,
		error_non_existing_address: false,
		error_turnstile: false,
		turnstileToken: '',
		address_rules: [
			(value) => !!value || `Required.\n Example: ${DEFAULT_TESTING_ADDRESS}`,
			(value) => /^(cheqd)1[a-z0-9]{38}$/.test(value) || 'Invalid cheqd address format.',
		],
		CHEQD_MINIMAL_DENOM,
		CHEQD_CURRENT_AMOUNT_GIVEN,
		DEFAULT_TESTING_ADDRESS,
	}),

	methods: {
		validate() {
			this.$refs.form.validate();
			return this.valid ? this.step++ : false;
		},

		async handle_auto_dismiss(prop, interval = 4000) {
			return setTimeout(() => {
				return (this[prop] = !this[prop]);
			}, interval);
		},

		async verifyCaptcha() {
			if (!this.token) {
				this.error_turnstile = true;
				this.handle_auto_dismiss('error_turnstile');
				return false;
			}

			try {
				const response = await axios.post('/api/verify-captcha', {
					token: this.token,
				});

				if (response.data.success) {
					return true;
				} else {
					this.error_turnstile = true;
					this.handle_auto_dismiss('error_turnstile');
					return false;
				}
			} catch (error) {
				console.error('Turnstile verification failed', error);
				this.error_turnstile = true;
				this.handle_auto_dismiss('error_recaptcha');
				return false;
			}
		},

		async handle_submit() {
			this.loading = true;

			const isValidCaptcha = await this.verifyCaptcha();
			if (!isValidCaptcha) {
				this.loading = false;
				return;
			}

			const status = await this.handle_fetch();
			this.loading = false;

			if (!status) return (this.error_non_existing_address = true);

			if (status.data === 'ok') {
				this.success = true;
				return this.handle_auto_dismiss('success');
			}

			this.error = true;
			return this.handle_auto_dismiss('error');
		},

		async handle_fetch() {
			try {
				const response = await axios.post(`${CHEQD_FAUCET_SERVER}/credit`, {
					denom: CHEQD_MINIMAL_DENOM,
					address: this.address || DEFAULT_TESTING_ADDRESS,
				});
				return response;
			} catch (error) {
				return false;
			}
		},
	},
};
</script>
<style scoped>
div.bgdarkopacity {
    background: rgba(48,48,48,0.9) !important;
    width: 700px;
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
    pointer-events: auto;
  }
  :v-deep(.stepiconfont .v-stepper__step__step) {
    font-size: 1.25rem;
    height: 35px;
    min-width: 35px;
    width: 28px;
	background-color: #FF5722;
	color: white;
  }
  :v-deep(.v-stepper:not(.v-stepper--vertical) .v-stepper__label) {
    display: block !important;
  }
  :deep(.statusbadge .v-badge__badge) {
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
  .welcometitle {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  .v-stepper-item {
  	flex-grow: 1;
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
