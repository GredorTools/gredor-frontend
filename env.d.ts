/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

type EnvironmentKey = "VITE_ENV_NAME" | "VITE_GREDOR_BACKEND_BASEURL";
type EnvironmentConfig = Record<EnvironmentKey, string>;

interface ImportMeta {
  readonly env: EnvironmentConfig;
}
