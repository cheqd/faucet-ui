<template>

	<div class="faucet-container">
		 <v-stepper v-model="step" alt-labels class="bgdarkopacity" vertical linear
			> <!-- Step 1: Instructions --> <v-stepper-header
				> <v-stepper-item class="stepiconfont" title="Instructions" :value="1" :complete="step > 1" editable />
				</v-stepper-header
			> <v-stepper-window v-if="step === 1"
				> <v-stepper-window-item :value="1" class="d-flex flex-column align-center"
					> <v-card flat class="pa-4"
						>
						<div class="text-center mb-4">

							<p>
								 If you are a developer looking to test the functionality of cheqd network or setting up
								a node on testnet, setting up a node on the cheqd test network, you can acquire
								<b>test</b> CHEQ tokens through this faucet.
							</p>

						</div>
						 <v-btn
							@click="step++"
							:loading="loading"
							color="#FE5000"
							class="d-block mx-auto centered"
							variant="elevated"
							> Start </v-btn
						> </v-card
					> </v-stepper-window-item
				> </v-stepper-window
			> <!-- Step 2: Add cheqd Testnet Address --> <v-stepper-header
				> <v-stepper-item :value="2" :complete="step > 2" editable
					> <template v-slot:title
						>
						<div class="d-flex align-center flex-wrap">
							 <span class="me-1">Add your cheqd testnet Address</span> <v-tooltip
								location="top"
								:close-delay="2000"
								openOnClick
								persistent
								> <template v-slot:activator="{ props }"
									> <v-icon v-bind="props" size="small">mdi-information-outline</v-icon> </template
								>
								<div class="pa-2 tooltip-content">

									<p>
										Please enter your cheqd testnet wallet address which we'll use to transfer your
										test tokens.
									</p>

									<p>
										 To show the wallet address, follow the <a
											class="font-weight-bold text-decoration-none white--text"
											href="https://docs.cheqd.io/node/getting-started/cheqd-cli/cheqd-cli-key-management#listing-available-keys-on-a-node"
											target="_blank"
											rel="noopener noreferrer"
											@click.stop
											> cheqd CLI guide on managing accounts </a
										>
									</p>

									<p>It should begin with "cheqd1".</p>

								</div>
								 </v-tooltip
							>
						</div>
						 </template
					> </v-stepper-item
				> </v-stepper-header
			> <v-stepper-window v-if="step === 2"
				> <v-stepper-window-item :value="2"
					> <v-form ref="form" v-model="valid" @submit.prevent="validate"
						> <v-card class="pa-4" variant="flat"
							> <v-text-field
								v-model="address"
								label="cheqd wallet Address"
								:hint="`Example: ${DEFAULT_TESTING_ADDRESS}`"
								persistent-hint
								required
								:rules="address_rules"
								:loading="loading"
							/> <v-text-field
								v-model="email"
								label="Email Address"
								type="email"
								required
								:rules="email_rules"
							/> <v-text-field v-model="name" label="Full Name" required :rules="name_rules" />
							<v-text-field v-model="company" label="Company/Organisation (Optional)" /> <v-checkbox
								v-model="marketingOptin"
								label="Subscribe to receive newsletter, updates and promotional communications"
							/> <v-btn
								:disabled="!valid || loading"
								@click="validate"
								color="#FE5000"
								class="mt-4 d-block mx-auto"
								:loading="loading"
								variant="elevated"
								> Continue </v-btn
							> </v-card
						> </v-form
					> </v-stepper-window-item
				> </v-stepper-window
			> <v-divider></v-divider> <!-- Step 3: Verification Challenge --> <v-stepper-header
				> <v-stepper-item :value="3" :complete="step > 3"
					> <template v-slot:title
						>
						<div class="d-flex align-center flex-wrap">
							 <span class="me-1">Complete the captcha!</span> <v-tooltip
								location="top"
								close-delay="2000"
								> <template v-slot:activator="{ props }"
									> <v-icon v-bind="props" size="small">mdi-information-outline</v-icon> </template
								> <span>Once completed, you'll receive a confirmation of your token transfer.</span>
								</v-tooltip
							>
						</div>
						 </template
					> </v-stepper-item
				> </v-stepper-header
			> <v-stepper-window v-if="step === 3"
				> <v-stepper-window-item :value="3"
					> <v-card class="pa-4" variant="flat"
						> <v-form @submit.prevent="handle_submit"
							> <v-container class="d-flex flex-column align-center"
								> <NuxtTurnstile v-model="token" class="mb-4" /> <v-btn
									:disabled="!token || loading"
									@click="handle_submit"
									color="#FE5000"
									:loading="loading"
									variant="elevated"
									> Verify & Submit </v-btn
								> </v-container
							> </v-form
						> </v-card
					> </v-stepper-window-item
				> </v-stepper-window
			> </v-stepper
		> <v-alert
			icon="mdi-shield-lock-outline"
			prominent
			dismissible
			text
			type="success"
			v-model="success"
			transition="scale-transition"
			class="mt-3"
			outlined
			> <b
				>Done! Your requests tokens should have arrived at your provided address ({{
					CHEQD_CURRENT_AMOUNT_GIVEN
				}} {{ CHEQD_MINIMAL_DENOM }}).</b
			> </v-alert
		> <v-alert
			icon="mdi-shield-lock-outline"
			prominent
			dismissible
			text
			type="error"
			v-model="error"
			transition="scale-transition"
			class="mt-3"
			outlined
			> <b>Server is unreachable at the moment. Kindly, try again later.</b> </v-alert
		> <v-alert
			icon="mdi-shield-lock-outline"
			prominent
			dismissible
			text
			type="info"
			v-model="error_non_existing_address"
			transition="scale-transition"
			class="mt-3"
			outlined
			> <b>Address is not in the expected format for this chain or does not exist.</b> </v-alert
		> <v-alert
			icon="mdi-shield-lock-outline"
			prominent
			dismissible
			text
			type="warning"
			v-model="error_turnstile"
			transition="scale-transition"
			class="mt-3"
			outlined
			> <b>You haven't passed the captcha verification challenge yet.</b> </v-alert
		>
	</div>

</template>

<script>
	import axios from 'axios';
	import {
		CHEQD_MINIMAL_DENOM,
		CHEQD_CURRENT_AMOUNT_GIVEN,
		DEFAULT_TESTING_ADDRESS,
		CHEQD_FAUCET_SERVER,
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
			token: '',
			email: '',
			name: '',
			company: '',
			marketingOptin: false,
			address_rules: [
				(value) => !!value || `Required.\n Example: ${DEFAULT_TESTING_ADDRESS}`,
				(value) => /^(cheqd)1[a-z0-9]{38}$/.test(value) || 'Invalid cheqd address format.',
			],
			email_rules: [
				(v) => !!v || 'Email is required',
				(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid',
			],
			name_rules: [
				(v) => !!v || 'Name is required',
				(v) => v.length >= 2 || 'Name must be at least 2 characters',
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

			handle_auto_dismiss(prop, interval = 4000) {
				return setTimeout(() => {
					this[prop] = false;
				}, interval);
			},

			async verifyCaptcha() {
				if (!this.token) {
					this.error_turnstile = true;
					this.handle_auto_dismiss('error_turnstile');
					return false;
				}

				try {
					const { data } = await axios.post('/api/verify-captcha', { token: this.token });
					if (data.success) return true;

					this.error_turnstile = true;
					this.handle_auto_dismiss('error_turnstile');
					return false;
				} catch (error) {
					console.error('Turnstile verification failed', error);
					this.error_turnstile = true;
					this.handle_auto_dismiss('error_turnstile');
					return false;
				}
			},

			async handle_submit() {
				if (this.loading) return;
				this.loading = true;

				try {
					const isValidCaptcha = await this.verifyCaptcha();
					if (!isValidCaptcha) {
						this.loading = false;
						return;
					}

					const status = await this.handle_fetch();
					if (!status) {
						this.error_non_existing_address = true;
						this.handle_auto_dismiss('error_non_existing_address');
						return;
					}

					if (status.data.status === 'ok') {
						this.success = true;
						this.handle_auto_dismiss('success');
					} else {
						this.error = true;
						this.handle_auto_dismiss('error');
					}
				} catch (error) {
					console.error('Submission failed:', error);
					this.error = true;
					this.handle_auto_dismiss('error');
				} finally {
					this.loading = false;
				}
			},

			async handle_fetch() {
				try {
					const requestBody = {
						denom: CHEQD_MINIMAL_DENOM,
						address: this.address || DEFAULT_TESTING_ADDRESS,
						email: this.email,
						name: this.name,
						marketing_optin: this.marketingOptin,
						...(this.company && { company: this.company }),
					};

					return await axios.post(`${CHEQD_FAUCET_SERVER}/credit`, requestBody);
				} catch (error) {
					console.error('Fetch failed:', error);
					return false;
				}
			},
		},
	};
</script>

<style scoped>
	.faucet-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 1rem;
}
.bgdarkopacity {
	background: rgba(48, 48, 48, 0.9) !important;
	width: 100%;
	border-radius: 8px;
}
.v-tooltip__content {
  pointer-events: auto;
}
/* Responsive styles */
@media (max-width: 600px) {
	.faucet-container {
		padding: 0.5rem;
	}

	:deep(.v-stepper) {
		width: 100%;
	}

	:deep(.v-stepper-header) {
		flex-wrap: wrap;
	}

	:deep(.v-stepper-item) {
		flex: 1 1 100%;
	}
}
/* Stepper icon styling */
:deep(.v-stepper-item .v-stepper-item__avatar) {
    background-color: #FE5000 !important;
    color: white !important;
    width: 35px !important;
    height: 35px !important;
    font-size: 16px !important;
}

:deep(.v-stepper-item--complete .v-stepper-item__avatar) {
    background-color: #FE5000 !important;
}

:deep(.v-stepper-item--active .v-stepper-item__avatar) {
    background-color: #FE5000 !important;
}

:deep(.v-stepper-item--disabled .v-stepper-item__avatar) {
    background-color: rgba(254, 80, 0, 0.7) !important;
}
:deep(.stepiconfont .v-stepper__step__step) {
	font-size: 1.25rem;
	height: 35px;
	min-width: 35px;
	width: 35px;
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

.tooltip-content {
    pointer-events: auto;
}

.tooltip-content a {
    color: white !important;
    text-decoration: underline !important;
}

.tooltip-content a:hover {
    opacity: 0.8;
}

/* Add some spacing between form fields */
.v-text-field {
    margin-bottom: 8px;
}

/* Style the checkbox */
:deep(.v-checkbox) {
    margin-top: 16px;
}
</style>

