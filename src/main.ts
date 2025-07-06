import "./assets/main.scss";

import { createApp } from "vue";
import App from "./App.vue";
import VueOnboardingTour from "vue-onboarding-tour";

createApp(App).use(VueOnboardingTour).mount("#app");
