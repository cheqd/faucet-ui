import axios from 'axios';
import { CHEQD_MINIMAL_DENOM, DEFAULT_TESTING_ADDRESS } from '~/constants/constants';

export async function verifyTurnstile(vm) {
	if (!vm.turnstileToken) {
		vm.error_turnstile = true;
		vm.handle_auto_dismiss('error_turnstile');
		return false;
	}

	try {
		const { data } = await axios.post('/api/verify-captcha', { token: vm.turnstileToken });
		if (data.success) return true;
	} catch (error) {
		console.error('Turnstile verification failed:', error);
	}

	vm.error_turnstile = true;
	vm.handle_auto_dismiss('error_turnstile');
	return false;
}

export async function handleRequestOtp(vm) {
	if (vm.loadingOtp) return;

	vm.loadingOtp = true;
	vm.error_otp_request = false;
	vm.otp_sent = false;

	try {
		const captchaValid = await vm.verifyTurnstile();
		if (!captchaValid) {
			vm.loadingOtp = false;
			return;
		}

		const response = await axios.post('/api/email/request-otp', {
			email: vm.email,
		});

		if (response.data.status === 'ok' || response.status === 200) {
			vm.otpRequested = true;
			vm.otp_sent = true;
			vm.handle_auto_dismiss('otp_sent');
			vm.step = 2;
		} else {
			vm.error_otp_request = true;
			vm.handle_auto_dismiss('error_otp_request');
		}
	} catch (error) {
		console.error('OTP request failed:', error);
		vm.error_otp_request = true;
		vm.handle_auto_dismiss('error_otp_request');
	} finally {
		vm.loadingOtp = false;
	}
}

export async function handleVerifyOtp(vm) {
	if (vm.loadingOtp) return;

	vm.loadingOtp = true;
	vm.error_otp_verify = false;

	try {
		const response = await axios.post('/api/email/verify-otp', {
			email: vm.email,
			otp: vm.otp,
		});

		if (response.data.status === 'ok' || response.status === 200) {
			vm.emailVerificationToken = response.data.token || response.data.verification_token || null;
			vm.otpVerified = true;
			vm.step = 3;
		} else {
			vm.error_otp_verify = true;
			vm.handle_auto_dismiss('error_otp_verify');
		}
	} catch (error) {
		console.error('OTP verification failed:', error);
		vm.error_otp_verify = true;
		vm.handle_auto_dismiss('error_otp_verify');
	} finally {
		vm.loadingOtp = false;
	}
}

export async function handleSubmit(vm) {
	if (vm.loading) return;

	vm.loading = true;

	try {
		const status = await vm.handle_fetch();
		if (status === 429) {
			vm.error_rate_limit = true;
			vm.handle_auto_dismiss('error_rate_limit');
		} else if (status?.data?.status === 'ok') {
			vm.success = true;
			vm.handle_auto_dismiss('success');
		} else if (status?.status === 400 || status?.status === 422) {
			const errorData = status.data?.error || status.data?.message || JSON.stringify(status.data);
			const errorMsg = typeof errorData === 'string' ? errorData : JSON.stringify(errorData);
			if (errorMsg.toLowerCase().includes('address')) {
				vm.error_non_existing_address = true;
				vm.handle_auto_dismiss('error_non_existing_address');
			} else {
				vm.error = true;
				vm.handle_auto_dismiss('error');
			}
		} else if (status?.data?.error) {
			const errorMsg = typeof status.data.error === 'string' ? status.data.error : JSON.stringify(status.data.error);
			if (errorMsg.toLowerCase().includes('address')) {
				vm.error_non_existing_address = true;
				vm.handle_auto_dismiss('error_non_existing_address');
			} else {
				vm.error = true;
				vm.handle_auto_dismiss('error');
			}
		} else if (!status) {
			vm.error = true;
			vm.handle_auto_dismiss('error');
		} else {
			vm.error = true;
			vm.handle_auto_dismiss('error');
		}
	} catch (error) {
		console.error('Submission failed:', error);
		if (error.response?.status === 429) {
			vm.error_rate_limit = true;
			vm.handle_auto_dismiss('error_rate_limit');
		} else if (error.response?.status === 400 || error.response?.status === 422) {
			vm.error_non_existing_address = true;
			vm.handle_auto_dismiss('error_non_existing_address');
		} else {
			vm.error = true;
			vm.handle_auto_dismiss('error');
		}
	} finally {
		vm.loading = false;
	}
}

export async function handleFetch(vm) {
	try {
		const requestBody = {
			denom: CHEQD_MINIMAL_DENOM,
			address: vm.address || DEFAULT_TESTING_ADDRESS,
			email: vm.email,
			first_name: vm.firstName,
			last_name: vm.lastName,
			marketing_optin: vm.marketingOptin,
			...(vm.company && { company: vm.company }),
			...(vm.emailVerificationToken && { verification_token: vm.emailVerificationToken }),
		};

		return await axios.post('/api/credit', requestBody);
	} catch (error) {
		console.error('Fetch failed:', error);
		if (error.response?.status === 429) {
			return 429;
		}
		if (error.response?.data) {
			return { data: error.response.data, status: error.response.status };
		}
		return false;
	}
}

export async function suggestCheqdTestnet(vm) {
	if (!window.leap) {
		vm.leap_not_installed = true;
		vm.handle_auto_dismiss('leap_not_installed');
		return;
	}

	vm.suggesting = true;

	try {
		await window.leap.getKey('cheqd-testnet-6');
		vm.leap_already_added = true;
		vm.handle_auto_dismiss('leap_already_added');
		vm.suggesting = false;
		return;
	} catch (error) {
		try {
			await window.leap.experimentalSuggestChain({
				chainId: 'cheqd-testnet-6',
				chainName: 'cheqd Testnet',
				rest: 'https://api.cheqd.network',
				rpc: 'https://rpc.cheqd.network',
				bip44: { coinType: 118 },
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
					gradient: 'linear-gradient(180deg, rgba(254, 80, 0, 0.32) 0%, rgba(254, 80, 0, 0) 100%)',
				},
			});

			try {
				await window.leap.getKey('cheqd-testnet-6');
				vm.leap_success = true;
				vm.handle_auto_dismiss('leap_success');
			} catch (verifyError) {
				throw new Error('Chain addition cancelled or not confirmed.');
			}
		} catch (suggestError) {
			console.error('Failed to suggest chain:', suggestError);
			vm.leap_error = true;
			vm.handle_auto_dismiss('leap_error');
		}
	} finally {
		vm.suggesting = false;
	}
}

export async function getAddressFromLeap(vm) {
	if (!window.leap) {
		vm.leap_not_installed = true;
		vm.handle_auto_dismiss('leap_not_installed');
		return;
	}
	vm.loadingAddress = true;
	try {
		const [account] = await window.leap.getOfflineSigner('cheqd-testnet-6').getAccounts();
		if (account?.address) {
			vm.address = account.address;
		}
	} catch (error) {
		console.error('Failed to get address from Leap:', error);
		vm.leap_copy_error = true;
		vm.handle_auto_dismiss('leap_copy_error');
	} finally {
		vm.loadingAddress = false;
	}
}
