import "./assets/main.scss";

import { createApp } from "vue";
import VueOnboardingTour from "vue-onboarding-tour";
import { router } from "@/router.ts";
import { RouterView } from "vue-router";

createApp(RouterView).use(router).use(VueOnboardingTour).mount("#app");
