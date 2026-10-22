/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

type EnvironmentKey =
  | "VITE_ENV_NAME"
  | "VITE_TEST_MODE"
  | "VITE_IS_CYPRESS"
  | "VITE_GREDOR_BACKEND_BASEURL"
  | "VITE_PREPARED_SUBMISSION_ALLOWED_ORIGINS";
type EnvironmentConfig = Record<EnvironmentKey, string>;

interface ImportMeta {
  readonly env: EnvironmentConfig;
}
