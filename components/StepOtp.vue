<template>
	<v-stepper-window-item :value="2">
		<v-card class="pa-4" variant="flat">
			<p class="text-body-2 mb-4 text-center">
				We've sent a verification code to <b>{{ email }}</b>. Please enter it below.
			</p>
			<v-form ref="form" v-model="formValid" @submit.prevent="submit">
				<v-text-field
					v-model="otpModel"
					label="Enter OTP"
					required
					:rules="otpRules"
					:loading="loading"
					class="otp-input mx-auto"
					maxlength="6"
				/>
				<v-btn
					:disabled="loading"
					@click="submit"
					color="#FE5000"
					class="mt-4 d-block mx-auto"
					:loading="loading"
					variant="elevated"
				>
					Submit OTP
				</v-btn>
			</v-form>
		</v-card>
	</v-stepper-window-item>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
	email: { type: String, default: '' },
	otp: { type: String, default: '' },
	otpRules: { type: Array, default: () => [] },
	loading: { type: Boolean, default: false },
});

const emit = defineEmits(['update:otp', 'verify-otp']);

const form = ref(null);
const formValid = ref(false);

const otpModel = computed({
	get: () => props.otp,
	set: (val) => emit('update:otp', val),
});

const submit = async () => {
	const result = await form.value?.validate();
	if (result?.valid) {
		emit('verify-otp');
	}
};
</script>

<style scoped>
.otp-input {
    max-width: 200px;
    margin: 0 auto;
    text-align: center;
    letter-spacing: 0.4rem;
    font-size: 1.5rem;
}
</style>
