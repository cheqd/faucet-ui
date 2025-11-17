<template>

	<div class="faucet-container">
		 <v-stepper v-model="step" alt-labels class="bgdarkopacity" vertical linear
			> <!-- Step 1: Email and Privacy Policy --> <v-stepper-header
				> <v-stepper-item class="stepiconfont" title="Email Verification" :value="1" :complete="step > 1" :editable="false" />
				</v-stepper-header
		> <v-stepper-window v-if="step === 1">
				<StepEmail
					v-model:email="email"
					v-model:privacy-policy-accepted="privacyPolicyAccepted"
					v-model:marketing-optin="marketingOptin"
					v-model:turnstile-token="turnstileToken"
					:loading="loadingOtp"
					:email-rules="email_rules"
					:privacy-rules="privacy_rules"
					@request-otp="handle_request_otp"
				/>
			</v-stepper-window
		> <!-- Step 2: OTP Verification --> <v-stepper-header
				> <v-stepper-item :value="2" :complete="step > 2" :editable="false"
					> <template v-slot:title
						>
						<div class="d-flex align-center flex-wrap">
							 <span class="me-1">Verify OTP</span>
						</div>
					</template
					> </v-stepper-item
				> </v-stepper-header
			> <v-stepper-window v-if="step === 2">
				<StepOtp
					:email="email"
					v-model:otp="otp"
					:otp-rules="otp_rules"
					:loading="loadingOtp"
					@verify-otp="handle_verify_otp"
				/>
			</v-stepper-window
		> <!-- Step 3: User Details --> <v-stepper-header
				> <v-stepper-item :value="3" :editable="false"
					> <template v-slot:title
						>
						<div class="d-flex align-center flex-wrap">
							 <span class="me-1">Fill in your details</span> <v-tooltip
								location="top"
								:close-delay="2000"
								openOnClick
								persistent
								> <template v-slot:activator="{ props }"
									> <v-icon v-bind="props" size="small">mdi-information-outline</v-icon> </template
								>
								<div class="pa-2 tooltip-content">

									<p> Please enter cheqd testnet wallet address to send testnet CHEQ tokens to. </p>

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

									<p> It should begin with "cheqd1".</p>

									<p>
										You can also copy it directly from Leap Wallet extension or just press the
										Wallet button inside cheqd wallet address field.
									</p>

								</div>
								 </v-tooltip
							>
						</div>
						 </template
					> </v-stepper-item
				> </v-stepper-header
			> <v-stepper-window v-if="step === 3">
				<StepDetails
					v-model:first-name="firstName"
					v-model:last-name="lastName"
					v-model:company="company"
					v-model:address="address"
					:first-name-rules="firstName_rules"
					:last-name-rules="lastName_rules"
					:address-rules="address_rules"
					:default-address="DEFAULT_TESTING_ADDRESS"
					:loading="loading"
					:loading-address="loadingAddress"
					:suggesting="suggesting"
					@submit="handle_submit"
					@copy-address="getAddressFromLeap"
					@suggest-leap="suggestCheqdTestnet"
				/>
			</v-stepper-window
			> </v-stepper
		> <FaucetAlerts
			v-model:success="success"
			v-model:error="error"
			v-model:error-non-existing-address="error_non_existing_address"
			v-model:error-turnstile="error_turnstile"
			v-model:error-otp-request="error_otp_request"
			v-model:error-otp-verify="error_otp_verify"
			v-model:otp-sent="otp_sent"
			v-model:leap-success="leap_success"
			v-model:leap-error="leap_error"
			v-model:leap-copy-error="leap_copy_error"
			v-model:leap-not-installed="leap_not_installed"
			v-model:leap-already-added="leap_already_added"
			v-model:error-rate-limit="error_rate_limit"
			:amount-given="CHEQD_CURRENT_AMOUNT_GIVEN"
			:denom="CHEQD_MINIMAL_DENOM"
		/>
	</div>

</template>

<script>
	import FaucetAlerts from '~/components/FaucetAlerts.vue';
	import StepEmail from '~/components/StepEmail.vue';
	import StepOtp from '~/components/StepOtp.vue';
	import StepDetails from '~/components/StepDetails.vue';
	import {
		verifyTurnstile as verifyTurnstileHelper,
		handleRequestOtp,
		handleVerifyOtp,
		handleSubmit as handleSubmitHelper,
		handleFetch as handleFetchHelper,
		suggestCheqdTestnet as suggestCheqdTestnetHelper,
		getAddressFromLeap as getAddressFromLeapHelper,
	} from '~/helpers/faucetActions';
	import {
		CHEQD_MINIMAL_DENOM,
		CHEQD_CURRENT_AMOUNT_GIVEN,
		DEFAULT_TESTING_ADDRESS,
		CHEQD_FAUCET_SERVER,
	} from '../constants/constants';

	export default {
		components: { StepEmail, StepOtp, StepDetails, FaucetAlerts },
		data: () => ({
			step: 1,
			address: null,
			loading: false,
			loadingOtp: false,
			success: false,
			error: false,
			error_non_existing_address: false,
			error_otp_request: false,
			error_otp_verify: false,
			otp_sent: false,
			email: '',
			otp: '',
			privacyPolicyAccepted: false,
			otpRequested: false,
			otpVerified: false,
			firstName: '',
			lastName: '',
			company: '',
			marketingOptin: false,
			turnstileToken: '',
			error_turnstile: false,
			address_rules: [
				(value) => !!value || `Required.\n Example: ${DEFAULT_TESTING_ADDRESS}`,
				(value) => /^(cheqd)1[a-z0-9]{38}$/.test(value) || 'Invalid cheqd address format.',
			],
			email_rules: [
				(v) => !!v || 'Email is required',
				(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid',
			],
			privacy_rules: [
				(v) => !!v || 'You must agree to the Privacy Policy to continue',
			],
			otp_rules: [
				(v) => !!v || 'OTP is required',
				(v) => /^\d{6}$/.test(v) || 'OTP must be 6 digits',
			],
			firstName_rules: [
				(v) => !!v || 'First name is required',
				(v) => v.length >= 2 || 'First name must be at least 2 characters',
			],
			lastName_rules: [
				(v) => !!v || 'Last name is required',
				(v) => v.length >= 2 || 'Last name must be at least 2 characters',
			],
			CHEQD_MINIMAL_DENOM,
			CHEQD_CURRENT_AMOUNT_GIVEN,
			DEFAULT_TESTING_ADDRESS,
			suggesting: false,
			loadingAddress: false,
			leap_success: false,
			leap_error: false,
			leap_copy_error: false,
			leap_not_installed: false,
			leap_already_added: false,
			error_rate_limit: false,
		}),

		watch: {
			step(newStep, oldStep) {
				// Prevent moving backwards
				if (newStep < oldStep) {
					this.$nextTick(() => {
						this.step = oldStep;
					});
					return;
				}
				// Prevent going to step 2 without requesting OTP
				if (newStep === 2 && !this.otpRequested) {
					this.$nextTick(() => {
						this.step = oldStep;
					});
					return;
				}
				// Prevent going to step 3 without verifying OTP
				if (newStep === 3 && !this.otpVerified) {
					this.$nextTick(() => {
						this.step = oldStep;
					});
					return;
				}
			},
		},

		methods: {
			handle_auto_dismiss(prop, interval = 4000) {
				return setTimeout(() => {
					this[prop] = false;
				}, interval);
			},
			verifyTurnstile() {
				return verifyTurnstileHelper(this);
			},
			handle_request_otp() {
				return handleRequestOtp(this);
			},
			handle_verify_otp() {
				return handleVerifyOtp(this);
			},
			handle_submit() {
				return handleSubmitHelper(this);
			},
			handle_fetch() {
				return handleFetchHelper(this);
			},
			suggestCheqdTestnet() {
				return suggestCheqdTestnetHelper(this);
			},
			getAddressFromLeap() {
				return getAddressFromLeapHelper(this);
			},
		},
	};
</script>

<style scoped>
	.faucet-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 1rem;
	width: 100%;
	box-sizing: border-box;
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

.v-alert a {
    color: inherit;
    text-decoration: underline;
}

.v-alert a:hover {
    opacity: 0.8;
}
</style>

