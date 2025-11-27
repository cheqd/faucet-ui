<template>
	<v-stepper-window-item :value="3">
		<v-card class="pa-4" variant="flat">
			<div class="text-end mb-2">
				<v-btn
					variant="tonal"
					color="secondary"
					size="small"
					@click="emit('suggest-leap')"
					:loading="suggesting"
				>
					Add cheqd Testnet to Leap Wallet
				</v-btn>
			</div>
			<v-form ref="form" v-model="formValid" @submit.prevent="submit">
				<v-text-field
					v-model="firstNameModel"
					label="First Name"
					required
					:rules="firstNameRules"
				/>
				<v-text-field
					v-model="lastNameModel"
					label="Last Name"
					required
					:rules="lastNameRules"
				/>
				<v-text-field v-model="companyModel" label="Company/Organisation (Optional)" />
				<v-text-field
					v-model="addressModel"
					label="Cheqd Wallet Address"
					:hint="`Example: ${defaultAddress}`"
					persistent-hint
					required
					:rules="addressRules"
					:loading="loading"
				>
					<template #append-inner>
						<v-tooltip text="Copy address from Leap Wallet">
							<template #activator="{ props }">
								<v-btn
									icon="mdi-wallet"
									color="#FE5000"
									variant="text"
									size="medium"
									v-bind="props"
									@click.prevent="emit('copy-address')"
									:loading="loadingAddress"
								></v-btn>
							</template>
						</v-tooltip>
					</template>
				</v-text-field>
				<v-btn
					:disabled="loading || !formValid"
					@click="submit"
					color="#FE5000"
					class="mt-4 d-block mx-auto"
					:loading="loading"
					variant="elevated"
				>
					Submit
				</v-btn>
			</v-form>
		</v-card>
	</v-stepper-window-item>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	company: { type: String, default: '' },
	address: { type: String, default: '' },
	firstNameRules: { type: Array, default: () => [] },
	lastNameRules: { type: Array, default: () => [] },
	addressRules: { type: Array, default: () => [] },
	defaultAddress: { type: String, default: '' },
	loading: { type: Boolean, default: false },
	loadingAddress: { type: Boolean, default: false },
	suggesting: { type: Boolean, default: false },
});

const emit = defineEmits([
	'update:firstName',
	'update:lastName',
	'update:company',
	'update:address',
	'submit',
	'copy-address',
	'suggest-leap',
]);

const form = ref(null);
const formValid = ref(false);

const firstNameModel = computed({
	get: () => props.firstName,
	set: (val) => emit('update:firstName', val),
});

const lastNameModel = computed({
	get: () => props.lastName,
	set: (val) => emit('update:lastName', val),
});

const companyModel = computed({
	get: () => props.company,
	set: (val) => emit('update:company', val),
});

const addressModel = computed({
	get: () => props.address,
	set: (val) => emit('update:address', val),
});

const submit = async () => {
	const result = await form.value?.validate();
	if (result?.valid) {
		emit('submit');
	}
};
</script>
