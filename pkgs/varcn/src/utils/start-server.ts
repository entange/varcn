import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { onOpen, onMessage, onClose } from "@/core/websocket";

export const startServer = async (port: number, cssFilePath: string) => {
  const app = new Hono();

  const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

  app.get(
    "/ws",
    upgradeWebSocket((c) => {
      return {
        onOpen,
        onMessage,
        onClose,
        onError: (evt, ws) => {
          console.error("websocket error:", evt);
          ws.close(1000, "Internal Server Error");
        },
      };
    }),
  );

  const server = serve({ port, fetch: app.fetch }, (i) =>
    console.log(`server started at port: ${i.port}`),
  );
  injectWebSocket(server);
};
