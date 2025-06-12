import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";

export const startServer = async (port: number, cssFilePath: string) => {
  const app = new Hono();

  const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

  app.get(
    "/ws",
    upgradeWebSocket((c) => {
      return {
        onOpen: (_, ws) => {},
        onMessage(event, ws) {},
        onClose: () => {},
        onError: (err) => {},
      };
    }),
  );

  const server = serve({ port, fetch: app.fetch }, (i) =>
    console.log(`> starting varcn server on port ${i.port}`),
  );
  injectWebSocket(server);
};
