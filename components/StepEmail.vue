<template>
	<v-stepper-window-item :value="1" class="email-step-window">
		<v-card flat class="pa-3 email-form-card">
			<v-form ref="form" class="email-form" v-model="formValid" @submit.prevent="submit">
				<v-text-field
					v-model="emailModel"
					label="Email Address"
					type="email"
					required
					:rules="emailRules"
					:loading="loading"
					density="compact"
					hide-details="auto"
				/>
				<v-checkbox
					v-model="privacyModel"
					required
					:rules="privacyRules"
					density="compact"
					hide-details="auto"
				>
					<template #label>
						<span class="checkbox-label">
							I agree to the&nbsp;
							<a
								href="https://www.cheqd.io/privacy-policy?hsLang=en"
								target="_blank"
								rel="noopener noreferrer"
								class="privacy-policy-link"
								@click.stop
							>
								Privacy Policy
							</a>!
						</span>
					</template>
				</v-checkbox>
				<v-checkbox
					v-model="marketingModel"
					class="mt-1"
					density="compact"
					hide-details="auto"
				>
					<template #label>
						<span class="checkbox-label">
							Keep me updated with cheqd news, product updates, and promotions.
						</span>
					</template>
				</v-checkbox>
				<div class="turnstile-wrapper">
					<NuxtTurnstile v-model="turnstileModel" />
				</div>
				<v-btn
					:disabled="loading || !privacyModel"
					@click="submit"
					color="#FE5000"
					class="mt-1 d-block mx-auto"
					:loading="loading"
					variant="elevated"
				>
					Verify Email
				</v-btn>
			</v-form>
		</v-card>
	</v-stepper-window-item>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
	email: { type: String, default: '' },
	privacyPolicyAccepted: { type: Boolean, default: false },
	marketingOptin: { type: Boolean, default: false },
	loading: { type: Boolean, default: false },
	emailRules: { type: Array, default: () => [] },
	privacyRules: { type: Array, default: () => [] },
	turnstileToken: { type: String, default: '' },
});

const emit = defineEmits([
	'update:email',
	'update:privacyPolicyAccepted',
	'update:marketingOptin',
	'update:turnstileToken',
	'request-otp',
]);

const form = ref(null);
const formValid = ref(false);

const emailModel = computed({
	get: () => props.email,
	set: (val) => emit('update:email', val),
});

const privacyModel = computed({
	get: () => props.privacyPolicyAccepted,
	set: (val) => emit('update:privacyPolicyAccepted', val),
});

const marketingModel = computed({
	get: () => props.marketingOptin,
	set: (val) => emit('update:marketingOptin', val),
});

const turnstileModel = computed({
	get: () => props.turnstileToken,
	set: (val) => emit('update:turnstileToken', val),
});

const submit = async () => {
	const result = await form.value?.validate();
	if (result?.valid) {
		emit('request-otp');
	}
};
</script>

<style scoped>
.email-step-window {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.email-form-card {
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
}

.email-form :deep(.v-input) {
    margin-bottom: 4px;
}

.email-form :deep(.v-selection-control__label) {
    font-size: 0.8rem;
    line-height: 1.2;
    display: inline-block;
    max-width: 100%;
    white-space: normal;
}

.email-form :deep(.v-field) {
    min-height: 40px;
}

.email-form :deep(.v-checkbox) {
    margin-top: 2px;
    margin-bottom: 2px;
}

.turnstile-wrapper {
    display: flex;
    justify-content: center;
    margin: 8px 0 4px;
}

.checkbox-label {
    font-size: 0.82rem;
    line-height: 1.2;
    white-space: nowrap;
    display: inline-block;
    max-width: 520px;
}

/* Style privacy policy link in checkbox */
.privacy-policy-link {
    color: #FE5000 !important;
    text-decoration: underline !important;
    font-weight: 500;
}

.privacy-policy-link:hover {
    color: #ff6b33 !important;
    text-decoration: underline !important;
}

@media (max-width: 700px) {
    .email-form-card {
        max-width: 100%;
    }
    .checkbox-label {
        white-space: normal;
    }
}
</style>
