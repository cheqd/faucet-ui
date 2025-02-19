<template>
	 <v-app class="vappbackground"
		>
		<header id="header">

			<div class="flex_contheader">

				<div class="statusheaderleft">
					 <img class="mainimglogo" src="../assets/img/cheqd-Logo-White.png" alt="logo" />
				</div>
				 <v-spacer></v-spacer>
				<h1 class="testnetheader">Testnet Faucet</h1>
				 <v-spacer></v-spacer>
				<div class="statusheader">

					<div class="desktopstatusdiv">
						 <v-select
							class="select_chain mr-3"
							v-model="selected"
							:items="items"
							variant="outlined"
							label="Chain ID"
							theme="dark"
							item-color="#FE5000"
							role="listbox"
						></v-select
						>
						<div class="faucetcompstatus">

							<h4 style="font-weight: 300">
								 Faucet Status: <span class="statustextcol"
									> <span style="margin-right: 3px">{{ faucet_status }}</span
									> <v-tooltip location="top" close-delay="2000"
										> <template v-slot:activator="{ attrs }"
											> <v-icon v-bind="attrs" size="x-small" :color="faucet_status_color"
												> mdi-circle </v-icon
											> </template
										> <span>{{ faucet_status }}</span
										> </v-tooltip
									> </span
								>
							</h4>

						</div>

					</div>
					 <!--  -->
					<div class="mobilestatusdiv">

						<div class="text-center">
							 <v-dialog v-model="dialog" width="auto"
								> <template v-slot:activator="{ props }"
									> <v-btn icon color="white" small v-bind="props"
										> <v-icon>mdi-information-outline</v-icon> </v-btn
									> </template
								> <v-card
									> <v-card-title class="text-h5 lighten-2"> </v-card-title> <v-card-text class="mt-2"
										>
										<div class="faucetcompstatus">
											 <v-select
												class="select_chain mr-3"
												v-model="selected"
												:items="items"
												variant="outlined"
												label="Chain ID"
												theme="dark"
												item-color="#FE5000"
												role="listbox"
											></v-select
											>
											<h4 style="font-weight: 300">
												 Faucet Status: <span class="statustextcol"
													> <span style="margin-right: 3px">{{ faucet_status }}</span
													> <v-tooltip top attach="body"
														> <template v-slot:activator="{ props }"
															> <v-icon
																v-bind="props"
																size="x-small"
																:color="faucet_status_color"
																> mdi-circle </v-icon
															> </template
														> <span>{{ faucet_status }}</span
														> </v-tooltip
													> </span
												>
											</h4>

										</div>
										 </v-card-text
									> <v-divider></v-divider> <v-card-actions
										> <v-spacer></v-spacer> <v-btn color="#FE5000" text @click="dialog = false"
											> OK </v-btn
										> </v-card-actions
									> </v-card
								> </v-dialog
							>
						</div>

					</div>
					 <!--  -->
				</div>

			</div>

		</header>
		 <v-main
			> <v-container class="maincontainer"> <NuxtPage /> </v-container> </v-main
		> <v-footer class="pagefooter" relative
			>
			<div class="social-links">
				 <a href="https://t.me/cheqd" class="social-links__icon" target="_blank"
					><span class="social-links__icon"
						><svg
							version="1.0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 496 512"
							aria-labelledby="telegram1"
							role="img"
						>

							<title id="telegram1">Follow us on Instagram</title>

							<g id="telegram1_layer">

								<path
									d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"
								></path>

							</g>

						</svg></span
					></a
				> <a href="https://twitter.com/cheqd_io" class="social-links__icon" target="_blank"
					><span class="social-links__icon"
						><svg
							version="1.0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							aria-labelledby="twitter2"
							role="img"
						>

							<title id="twitter2">Follow us on Twitter</title>

							<g id="twitter2_layer">

								<path
									d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
								></path>

							</g>

						</svg></span
					></a
				> <a href="https://www.linkedin.com/company/cheqd-identity" class="social-links__icon" target="_blank"
					><span class="social-links__icon"
						><svg
							version="1.0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
							aria-labelledby="linkedin-in3"
							role="img"
						>

							<title id="linkedin-in3">Follow us on LinkedIn</title>

							<g id="linkedin-in3_layer">

								<path
									d="M100.3 480H7.4V180.9h92.9V480zM53.8 140.1C24.1 140.1 0 115.5 0 85.8 0 56.1 24.1 32 53.8 32c29.7 0 53.8 24.1 53.8 53.8 0 29.7-24.1 54.3-53.8 54.3zM448 480h-92.7V334.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V480h-92.8V180.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V480z"
								></path>

							</g>

						</svg></span
					></a
				> <a href="https://github.com/cheqd" class="social-links__icon" target="_blank"
					><span class="social-links__icon"
						><svg
							version="1.0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 480 512"
							aria-labelledby="github-alt4"
							role="img"
						>

							<title id="github-alt4">Follow us on Facebook</title>

							<g id="github-alt4_layer">

								<path
									d="M186.1 328.7c0 20.9-10.9 55.1-36.7 55.1s-36.7-34.2-36.7-55.1 10.9-55.1 36.7-55.1 36.7 34.2 36.7 55.1zM480 278.2c0 31.9-3.2 65.7-17.5 95-37.9 76.6-142.1 74.8-216.7 74.8-75.8 0-186.2 2.7-225.6-74.8-14.6-29-20.2-63.1-20.2-95 0-41.9 13.9-81.5 41.5-113.6-5.2-15.8-7.7-32.4-7.7-48.8 0-21.5 4.9-32.3 14.6-51.8 45.3 0 74.3 9 108.8 36 29-6.9 58.8-10 88.7-10 27 0 54.2 2.9 80.4 9.2 34-26.7 63-35.2 107.8-35.2 9.8 19.5 14.6 30.3 14.6 51.8 0 16.4-2.6 32.7-7.7 48.2 27.5 32.4 39 72.3 39 114.2zm-64.3 50.5c0-43.9-26.7-82.6-73.5-82.6-18.9 0-37 3.4-56 6-14.9 2.3-29.8 3.2-45.1 3.2-15.2 0-30.1-.9-45.1-3.2-18.7-2.6-37-6-56-6-46.8 0-73.5 38.7-73.5 82.6 0 87.8 80.4 101.3 150.4 101.3h48.2c70.3 0 150.6-13.4 150.6-101.3zm-82.6-55.1c-25.8 0-36.7 34.2-36.7 55.1s10.9 55.1 36.7 55.1 36.7-34.2 36.7-55.1-10.9-55.1-36.7-55.1z"
								></path>

							</g>

						</svg></span
					></a
				>
			</div>

			<p style="text-align: center; font-size: 16px">
				 &copy; {{ new Date().getFullYear() }} cheqd - The network for authentic data | <a
					href="https://www.cheqd.io/privacy-policy?hsLang=en"
					rel="noopener"
					target="_blank"
					>Privacy policy</a
				>
			</p>
			 </v-footer
		> </v-app
	>
</template>

<script>
	import axios from 'axios';
	import { CHEQD_FAUCET_SERVER } from '../constants/constants';

	export default {
		name: 'DefaultLayout',
		data() {
			return {
				fixed: false,
				title: 'cheqd Testnet faucet',
				faucet_status: '',
				faucet_status_color: 'white',
				items: ['cheqd-testnet-6'],
				selected: 'cheqd-testnet-6',
				dialog: false,
			};
		},

		async mounted() {
			await this.handle_interval(this.handle_faucet_status(), 30000);
		},
		methods: {
			async handle_faucet_status() {
				try {
					const status = await axios.get(`${CHEQD_FAUCET_SERVER}/status`);
					if (status.data.status === 'ok') {
						this.faucet_status_color = 'green';
						this.faucet_status = 'Operational';
						return;
					}
				} catch (error) {
					this.faucet_status_color = 'red';
					this.faucet_status = 'Down';
					return;
				}

				this.faucet_status_color = 'red';
				this.faucet_status = 'Down';
				return;
			},

			async handle_interval(promise, interval) {
				while (true) {
					await new Promise((resolve) => setTimeout(resolve, interval));
					await promise;
				}
			},
		},
	};
</script>

<style scoped>
	.vappbackground {
	background: url('../assets/img/Orange_Mobius_06.jpg') center/cover no-repeat;
    font-family: 'Nunito', sans-serif;
  }
  .maincontainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .statustextcol {
    display: inline-flex;
    align-items:center;
  }
  .statustextcol i {
    margin-top: -1px;
  }
  /*  */
  #header {
    /* position: sticky;
    top:0; */
    width: 100%;
    display: block;
    background: rgba(48,48,48,0.8);
    padding:20px 0 10px 0;
    z-index: 100;
  }
  .flex_contheader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width:100%;
  }
  .statusheader {
    padding-right: 15px;
    width: 250px;
  }
  .statusheaderleft {
    width: 250px;
  }
  .mainimglogo {
    width:150px;
    display: block;
    padding-left: 15px;
  }
  /*  */
  .pagefooter {
    width: 100%;
    display: block;
    background: rgba(48,48,48,0.8);
    padding: 5px 0 8px 0;
  }
  .social-links {
    width: 100%;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 3px;
  }
  .social-links__icon {
      background-color: transparent;
      border-radius: 4px;
      display: inline-block;
      margin: 0 0.7rem 0.35rem 0;
      padding: 0.4rem 0.5rem 0.1rem 0.5rem;
      cursor: pointer;
  }
  .social-links svg {
    fill: rgba(255, 255, 255,1.0);
    width: 40px;
    height: 40px;
    transition:fill 0.2s ease-in-out ;
  }
  .social-links svg:hover {
    fill: #FE5000;
  }
  .sociallinks {
      font-weight: 300;
      text-decoration: underline;
      font-family: Nunito,sans-serif;
      font-style: normal;
      color: #00c6ab;
  }
  .select_chain {
    max-width: 225px;
  }
  .faucetcompstatus {
    margin-top: -15px;
  }
  .mobilestatusdiv {
    display: none;
  }
  @media only screen and (max-width: 992px) {
    .social-links svg {
      width: 30px;
      height: 30px;
    }
    .mainimglogo{
      width: 120px;
      margin: 0 auto;
    }
    .statusheader {
      width: auto;
    }
    .statusheaderleft {
      width: auto;
    }
    .desktopstatusdiv {
      display: none;
    }
    .mobilestatusdiv {
      display: block;
      width:100px;
    }
  }
  @media only screen and (max-width: 756px) {
    .mainimglogo{
      width: 100px;
      margin: 0 auto;
    }
    .testnetheader {
      font-size: 30px;
    }
    .mobilestatusdiv {
      display: block;
    }
   }
  @media only screen and (max-width: 576px) {
    .mobilestatusdiv {
      display:block;
      width:60px;
    }
    .mainimglogo{
      width: 80px;
      margin: 0;
    }
    .testnetheader {
      font-size: 24px;
    }
    .bgdarkopacity {
      width: 100%;
      min-width: auto;
    }
    .social-links__icon {
      margin:0;
    }
  }
  @media only screen and (max-width: 480px) {
    .social-links__icon {
      padding: 0.7rem 0.4rem 0.2rem 0.4rem;
    }
    .mobilestatusdiv {
      display: block;
    }
  }
  .pagefooter p {
    margin: 0;
    padding: 3px 0;
    font-size: 16px;
    line-height: 1.2;
  }
</style>

