/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_ENV_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
