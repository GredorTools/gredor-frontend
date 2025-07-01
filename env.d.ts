/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_ENV_NAME?: string;
  readonly VITE_GREDOR_BACKEND_BASEURL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
