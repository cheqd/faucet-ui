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

							<p class="text-body-1 text-center mx-auto" style="max-width: 600px">
								 If you are a developer looking to develop oncheqd network or setting up a node on
								testnet, you can acquire testnet CHEQ tokens through this faucet. <b>Note:</b> A given
								wallet address can be topped up only <b>once an hour</b>.
							</p>

						</div>
						 <v-btn
							@click="suggestCheqdTestnet"
							color="secondary"
							class="mb-4 d-block mx-auto"
							:loading="suggesting"
							> Add cheqd Testnet to Leap Wallet </v-btn
						> <v-btn
							@click="step++"
							:loading="loading"
							color="#FE5000"
							class="d-block mx-auto centered"
							variant="elevated"
							> Skip and continue </v-btn
						> </v-card
					> </v-stepper-window-item
				> </v-stepper-window
			> <!-- Step 2: Form --> <v-stepper-header
				> <v-stepper-item :value="2" :complete="step > 2" editable
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
			> <v-stepper-window v-if="step === 2"
				> <v-stepper-window-item :value="2"
					> <v-form ref="form" v-model="valid" @submit.prevent="validate"
						> <v-card class="pa-4" variant="flat"
							> <v-text-field
								v-model="address"
								label="Cheqd Wallet Address"
								:hint="`Example: ${DEFAULT_TESTING_ADDRESS}`"
								persistent-hint
								required
								:rules="address_rules"
								:loading="loading"
								> <template v-slot:append-inner
									> <v-tooltip text="Copy address from Leap Wallet"
										> <template v-slot:activator="{ props }"
											> <v-btn
												icon="mdi-wallet"
												color="#FE5000"
												variant="text"
												size="medium"
												v-bind="props"
												@click="getAddressFromLeap"
												:loading="loadingAddress"
											></v-btn
											> </template
										> </v-tooltip
									> </template
								> </v-text-field
							> <v-text-field
								v-model="email"
								label="Email Address"
								type="email"
								required
								:rules="email_rules"
							/> <v-text-field v-model="name" label="Full Name" required :rules="name_rules" />
							<v-text-field v-model="company" label="Company/Organisation (Optional)" /> <v-checkbox
								v-model="marketingOptin"
								label="Subscribe to receive our newsletter and product updates"
							/>
							<div class="d-flex justify-center my-4">
								 <NuxtTurnstile v-model="token" class="mb-4" />
							</div>
							 <v-btn
								:disabled="!valid || !token || loading"
								@click="handle_submit"
								color="#FE5000"
								class="mt-4 d-block mx-auto"
								:loading="loading"
								variant="elevated"
								> Submit </v-btn
							> </v-card
						> </v-form
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
				>Done! Testnet CHEQ tokens should be sent to your wallet address shortly. ({{
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
			> <b>Server is unreachable at the moment. Please try again later.</b> </v-alert
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
			> <b>You haven't passed the CAPTCHA verification challenge yet.</b> </v-alert
		> <v-alert
			icon="mdi-wallet-outline"
			prominent
			dismissible
			text
			type="success"
			v-model="leap_success"
			transition="scale-transition"
			class="mt-3"
			outlined
			> <b>cheqd Testnet successfully added to Leap Wallet!</b> </v-alert
		> <v-alert
			icon="mdi-wallet-outline"
			prominent
			dismissible
			text
			type="error"
			v-model="leap_error"
			transition="scale-transition"
			class="mt-3"
			outlined
			> <b
				>Failed to add cheqd Testnet to Leap Wallet. Please try again or skip if you already know your wallet
				address.</b
			> </v-alert
		> <v-alert
			icon="mdi-wallet-outline"
			prominent
			dismissible
			text
			type="warning"
			v-model="leap_not_installed"
			transition="scale-transition"
			class="mt-3"
			outlined
			>
			<div>
				 <b>Leap Wallet extension is not installed.</b>
				<p class="mb-0 mt-2">
					 Please install Leap Wallet from <a
						href="https://www.leapwallet.io/download"
						target="_blank"
						rel="noopener noreferrer"
						class="font-weight-bold"
						>leapwallet.io</a
					>
				</p>

			</div>
			 </v-alert
		> <v-alert
			icon="mdi-wallet-outline"
			prominent
			dismissible
			text
			type="info"
			v-model="leap_already_added"
			transition="scale-transition"
			class="mt-3"
			outlined
			> <b>cheqd Testnet is already added to your Leap Wallet!</b> </v-alert
		> <v-alert
			icon="mdi-clock-outline"
			prominent
			dismissible
			text
			type="warning"
			v-model="error_rate_limit"
			transition="scale-transition"
			class="mt-3"
			outlined
			> <b>Rate limit exceeded for this wallet address. Please try again in an hour.</b> </v-alert
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
			suggesting: false,
			loadingAddress: false,
			leap_success: false,
			leap_error: false,
			leap_not_installed: false,
			leap_already_added: false,
			error_rate_limit: false,
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
						this.error_turnstile = true;
						this.handle_auto_dismiss('error_turnstile'); //obrisi
						this.loading = false;
						return;
					}

					const status = await this.handle_fetch();
					if (status === 429) {
						this.error_rate_limit = true;
						this.handle_auto_dismiss('error_rate_limit');
					} else if (!status) {
						this.error_non_existing_address = true;
						this.handle_auto_dismiss('error_non_existing_address');
					} else if (status.data.status === 'ok') {
						this.success = true;
						this.handle_auto_dismiss('success');
					} else {
						this.error = true;
						this.handle_auto_dismiss('error');
					}
				} catch (error) {
					console.error('Submission failed:', error);
					if (error.response?.status === 429) {
						this.error_rate_limit = true;
						this.handle_auto_dismiss('error_rate_limit');
					} else {
						this.error = true;
						this.handle_auto_dismiss('error');
					}
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
					if (error.response?.status === 429) {
						return 429;
					}
					return false;
				}
			},

			async suggestCheqdTestnet() {
				if (!window.leap) {
					this.leap_not_installed = true;
					this.handle_auto_dismiss('leap_not_installed');
					return;
				}

				this.suggesting = true;

				try {
					await window.leap.getKey('cheqd-testnet-6');
					this.leap_already_added = true;
					this.handle_auto_dismiss('leap_already_added');
					this.suggesting = false;
					return;
				} catch (error) {
					try {
						await window.leap.experimentalSuggestChain({
							chainId: 'cheqd-testnet-6',
							chainName: 'cheqd Testnet',
							rest: 'https://api.cheqd.network',
							rpc: 'https://rpc.cheqd.network',
							bip44: {
								coinType: 118,
							},
							bech32Config: {
								bech32PrefixAccAddr: 'cheqd',
								bech32PrefixAccPub: 'cheqdpub',
								bech32PrefixValAddr: 'cheqdvaloper',
								bech32PrefixValPub: 'cheqdvaloperpub',
								bech32PrefixConsAddr: 'cheqdvalcons',
								bech32PrefixConsPub: 'cheqdvalconspub',
							},
							currencies: [
								{
									coinDenom: 'CHEQ',
									coinMinimalDenom: 'ncheq',
									coinDecimals: 9,
									coinGeckoId: 'cheqd-network',
								},
							],
							feeCurrencies: [
								{
									coinDenom: 'CHEQ',
									coinMinimalDenom: 'ncheq',
									coinDecimals: 9,
									coinGeckoId: 'cheqd-network',
									gasPriceStep: {
										low_gas_price: 5000,
										average_gas_price: 7500,
										high_gas_price: 10000,
									},
								},
							],
							stakeCurrency: {
								coinDenom: 'CHEQ',
								coinMinimalDenom: 'ncheq',
								coinDecimals: 9,
								coinGeckoId: 'cheqd-network',
							},
							image: 'https://raw.githubusercontent.com/cosmos/chain-registry/refs/heads/master/cheqd/images/cheq.svg',
							theme: {
								primaryColor: '#FE5000',
								gradient:
									'linear-gradient(180deg, rgba(254, 80, 0, 0.32) 0%, rgba(254, 80, 0, 0) 100%)',
							},
						});

						this.leap_success = true;
						this.handle_auto_dismiss('leap_success');
					} catch (suggestError) {
						console.error('Failed to suggest chain:', suggestError);
						this.leap_error = true;
						this.handle_auto_dismiss('leap_error');
					}
				} finally {
					this.suggesting = false;
				}
			},

			async getAddressFromLeap() {
				if (!window.leap) {
					this.leap_not_installed = true;
					this.handle_auto_dismiss('leap_not_installed');
					return;
				}
				this.loadingAddress = true;
				try {
					const [account] = await window.leap.getOfflineSigner('cheqd-testnet-6').getAccounts();
					if (account?.address) {
						this.address = account.address;
					}
				} catch (error) {
					console.error('Failed to get address from Leap:', error);
					this.leap_error = true;
					this.handle_auto_dismiss('leap_error');
				} finally {
					this.loadingAddress = false;
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

.v-alert a {
    color: inherit;
    text-decoration: underline;
}

.v-alert a:hover {
    opacity: 0.8;
}
</style>

