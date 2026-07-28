<script setup lang="ts">
/**
 * En sida som dirigerar användaren genom processen att ladda upp sin
 * årsredovisning till sitt egna utrymme hos Bolagsverket.
 *
 * Sidan används inte i normalflöden i dagsläget, i framtiden är det tänkt att
 * flödena i applikationen ska separeras lite mer och då blir den mer aktuell.
 * Sidan kan även länkas till från andra applikationer som genererar
 * .gredorfardig-filer.
 */

import AppHeader from "@/components/AppHeader.vue";
import { defineAsyncComponent, provide, ref } from "vue";
import CommonComponentLoadError from "@/components/common/CommonComponentLoadError.vue";

import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import AppPage from "@/components/AppPage.vue";

const footerTeleportPointId = "page-send-wizard-footer-teleport-point";

const SendWizardSteps = defineAsyncComponent({
  loader: () => import("@/components/tools/finish/send/SendWizardSteps.vue"),
  errorComponent: CommonComponentLoadError,
});

const done = ref<boolean>(false);

provide("footerTeleportPoint", `#${footerTeleportPointId}`);
</script>

<template>
  <AppPage show-messages use-standard-content-padding>
    <template #header>
      <AppHeader page-title="Ladda upp till Bolagsverket">
        <template #extra-content>
          <RouterLink to="/om" target="_blank" class="header-about-link">
            Om Gredor <i class="bi bi-box-arrow-up-right"></i>
          </RouterLink>
        </template>
      </AppHeader>
    </template>

    <div class="page-root">
      <div class="wizard">
        <div class="steps">
          <Suspense>
            <SendWizardSteps
              @step-change="
                (step) => {
                  if (step === 'uploadReport') {
                    done = true;
                  }
                }
              "
            />

            <template #fallback>
              <div>
                Laddar…

                <CommonWizardButtons
                  next-button-disabled
                  previous-button-hidden
                />
              </div>
            </template>
          </Suspense>
        </div>

        <div class="wizard-footer" :hidden="done">
          <hr />

          <div :id="footerTeleportPointId"></div>
        </div>
      </div>
    </div>
  </AppPage>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.header-about-link {
  align-self: center;

  .bi-box-arrow-up-right {
    margin-left: $spacing-sm;
    margin-right: 0;
  }
}

.page-root {
  max-height: 100%;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
}

.wizard {
  min-width: var(--bs-modal-width, 500px);
  max-height: 100%;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  border: 2px solid $border-color-dark;
  border-radius: $border-radius-lg;
  background-color: $background-verylight;
  padding: $spacing-md;
  box-shadow: $shadow-sm;

  .steps {
    overflow: auto;
    flex: 1;
  }

  hr {
    margin-top: $spacing-xl;
    margin-bottom: $spacing-md;
  }
}
</style>
