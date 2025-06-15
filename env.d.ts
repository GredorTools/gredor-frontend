/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
