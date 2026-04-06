import createClient from "openapi-fetch";
import type { paths } from "@/api/schema/gredor-backend-v1";
import { getConfigValue } from "@/util/configUtils.ts";

export const client = createClient<paths>({
  baseUrl: getConfigValue("VITE_GREDOR_BACKEND_BASEURL"),
});
