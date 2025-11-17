<template>
	<div>
		<v-alert
			icon="mdi-shield-lock-outline"
			prominent
			dismissible
			text
			type="success"
			v-model="successModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>
				Done! Testnet CHEQ tokens should be sent to your wallet address shortly. ({{ amountGiven }} {{ denom }}).
			</b>
		</v-alert>

		<v-alert
			icon="mdi-shield-lock-outline"
			prominent
			dismissible
			text
			type="error"
			v-model="errorModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>Server is unreachable at the moment. Please try again later.</b>
		</v-alert>

		<v-alert
			icon="mdi-shield-lock-outline"
			prominent
			dismissible
			text
			type="info"
			v-model="errorAddressModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>Address is not in the expected format for this chain or does not exist.</b>
		</v-alert>

		<v-alert
			icon="mdi-email-outline"
			prominent
			dismissible
			text
			type="error"
			v-model="errorOtpRequestModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>Failed to send OTP. Please try again.</b>
		</v-alert>

		<v-alert
			icon="mdi-shield-lock-outline"
			prominent
			dismissible
			text
			type="warning"
			v-model="errorTurnstileModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>Please complete the CAPTCHA challenge before continuing.</b>
		</v-alert>

		<v-alert
			icon="mdi-email-outline"
			prominent
			dismissible
			text
			type="error"
			v-model="errorOtpVerifyModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>Invalid OTP. Please check and try again.</b>
		</v-alert>

		<v-alert
			icon="mdi-email-outline"
			prominent
			dismissible
			text
			type="success"
			v-model="otpSentModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>OTP sent successfully! Please check your email.</b>
		</v-alert>

		<v-alert
			icon="mdi-wallet-outline"
			prominent
			dismissible
			text
			type="success"
			v-model="leapSuccessModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>cheqd Testnet successfully added to Leap Wallet!</b>
		</v-alert>

		<v-alert
			icon="mdi-wallet-outline"
			prominent
			dismissible
			text
			type="error"
			v-model="leapErrorModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>
				Failed to add cheqd Testnet to Leap Wallet. Please try again or skip if you already know your wallet address.
			</b>
		</v-alert>

		<v-alert
			icon="mdi-wallet-outline"
			prominent
			dismissible
			text
			type="error"
			v-model="leapCopyErrorModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>Failed to copy address from Leap Wallet. Please try again.</b>
		</v-alert>

		<v-alert
			icon="mdi-wallet-outline"
			prominent
			dismissible
			text
			type="warning"
			v-model="leapNotInstalledModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<div>
				<b>Leap Wallet extension is not installed.</b>
				<p class="mb-0 mt-2">
					Please install Leap Wallet from
					<a href="https://www.leapwallet.io/download" target="_blank" rel="noopener noreferrer" class="font-weight-bold">
						leapwallet.io
					</a>
				</p>
			</div>
		</v-alert>

		<v-alert
			icon="mdi-wallet-outline"
			prominent
			dismissible
			text
			type="info"
			v-model="leapAlreadyAddedModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>cheqd Testnet is already added to your Leap Wallet!</b>
		</v-alert>

		<v-alert
			icon="mdi-clock-outline"
			prominent
			dismissible
			text
			type="warning"
			v-model="errorRateLimitModel"
			transition="scale-transition"
			class="mt-3"
			outlined
		>
			<b>Rate limit exceeded for this wallet address. Please try again in an hour.</b>
		</v-alert>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	success: Boolean,
	error: Boolean,
	errorNonExistingAddress: Boolean,
	errorTurnstile: Boolean,
	errorOtpRequest: Boolean,
	errorOtpVerify: Boolean,
	otpSent: Boolean,
	leapSuccess: Boolean,
	leapError: Boolean,
	leapCopyError: Boolean,
	leapNotInstalled: Boolean,
	leapAlreadyAdded: Boolean,
	errorRateLimit: Boolean,
	amountGiven: { type: [String, Number], default: '' },
	denom: { type: String, default: '' },
});

const emit = defineEmits([
	'update:success',
	'update:error',
	'update:errorNonExistingAddress',
	'update:errorTurnstile',
	'update:errorOtpRequest',
	'update:errorOtpVerify',
	'update:otpSent',
	'update:leapSuccess',
	'update:leapError',
	'update:leapCopyError',
	'update:leapNotInstalled',
	'update:leapAlreadyAdded',
	'update:errorRateLimit',
]);

const makeModel = (prop, event) =>
	computed({
		get: () => props[prop],
		set: (val) => emit(event, val),
	});

const successModel = makeModel('success', 'update:success');
const errorModel = makeModel('error', 'update:error');
const errorAddressModel = makeModel('errorNonExistingAddress', 'update:errorNonExistingAddress');
const errorTurnstileModel = makeModel('errorTurnstile', 'update:errorTurnstile');
const errorOtpRequestModel = makeModel('errorOtpRequest', 'update:errorOtpRequest');
const errorOtpVerifyModel = makeModel('errorOtpVerify', 'update:errorOtpVerify');
const otpSentModel = makeModel('otpSent', 'update:otpSent');
const leapSuccessModel = makeModel('leapSuccess', 'update:leapSuccess');
const leapErrorModel = makeModel('leapError', 'update:leapError');
const leapCopyErrorModel = makeModel('leapCopyError', 'update:leapCopyError');
const leapNotInstalledModel = makeModel('leapNotInstalled', 'update:leapNotInstalled');
const leapAlreadyAddedModel = makeModel('leapAlreadyAdded', 'update:leapAlreadyAdded');
const errorRateLimitModel = makeModel('errorRateLimit', 'update:errorRateLimit');
</script>
