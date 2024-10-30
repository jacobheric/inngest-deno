import { inngest } from "@/lib/inngest/client.ts";
import { generateText, generateTextAiSdk } from "@/lib/inngest/functions.ts";
import type { FreshContext } from "fresh";

import { InngestCommHandler, type ServeHandlerOptions } from "inngest";

const serve = (options: ServeHandlerOptions) => {
  const handler = new InngestCommHandler({
    frameworkName: "deno/fresh-beta",
    fetch: fetch.bind(globalThis),
    ...options,
    handler: ({ req }: FreshContext) => {
      return {
        body: () => req.json(),
        headers: (key) => req.headers.get(key),
        method: () => req.method,
        url: () => new URL(req.url, `https://${req.headers.get("host") || ""}`),
        transformResponse: ({ body, status, headers }) => {
          return new Response(body, { status, headers });
        },
      };
    },
  });

  return handler.createHandler();
};

export const handler = serve({
  client: inngest,
  functions: [generateText, generateTextAiSdk],
});
