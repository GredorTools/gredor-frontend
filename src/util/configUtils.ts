/**
 * Hämtar värdet för en given nyckel ur applikationens konfiguration.
 *
 * Denna funktion försöker hämta konfigurationsvärdet från följande platser, i
 * följande ordning:
 *
 * 1) `window.config` (ska användas i byggda miljöer)
 * 2) `import.meta.env` (ska användas i utvecklingsmiljö)
 *
 * @param key - Miljönyckeln för vilken konfigurationsvärdet önskas
 * @returns Konfigurationsvärdet som är kopplat till den angivna nyckeln, eller
 * `undefined` om nyckeln inte finns
 */
export function getConfigValue(key: EnvironmentKey): string | undefined {
  return window.config[key] || import.meta.env[key];
}

/**
 * Returnerar applikationens versionsnummer, inklusive miljönamn om det är
 * konfigurerat.
 */
export function getAppFullVersion() {
  let version = __APP_VERSION__;
  const environmentName = getConfigValue("VITE_ENV_NAME");
  if (environmentName) {
    version += `-${environmentName}`;
  }
  return version;
}

declare global {
  interface Window {
    config: EnvironmentConfig; // Kommer från config.js
  }
}
