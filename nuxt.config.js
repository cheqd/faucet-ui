import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	ssr: false,

	app: {
		head: {
			titleTemplate: 'cheqd Testnet Faucet',
			title: 'cheqd Testnet Faucet',
			htmlAttrs: {
				lang: 'en',
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'description', name: 'description', content: '' },
				{ name: 'format-detection', content: 'telephone=no' },
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{
					rel: 'stylesheet',
					href: 'https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css',
				},
			],
			script: [
				{
					defer: true,
					'data-domain': 'testnet-faucet.cheqd.io',
					src: 'https://plausible.io/js/script.js',
				},
			],
		},
	},

	css: ['vuetify/lib/styles/main.css'],

	build: {
		transpile: ['vuetify'],
	},

	components: true,

	buildModules: ['vuetify'],

	modules: ['@nuxtjs/turnstile'],

	turnstile: {
		siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
		addValidateEndpoint: true,
	},

	runtimeConfig: {
		turnstile: {
			// This can be overridden at runtime via the NUXT_TURNSTILE_SECRET_KEY
			// environment variable.
			secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
		},
	},

	serverHandlers: [
		{
			route: '/api/status',
			handler: '~/api/status/index.js',
		},
		{
			route: '/api/verify-captcha',
			handler: '~/api/status/verify-captcha.js',
		},
	],

	compatibilityDate: '2025-02-04',
});
