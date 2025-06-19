import type { WSContext } from "hono/ws";

export const onOpen = (evt: Event, ws: WSContext<WebSocket>) => {
  console.log("WebSocket connection opened");
};

export const onMessage = (evt: MessageEvent, ws: WSContext<WebSocket>) => {
  console.log("Received message:", evt.data);
  ws.send(evt.data);
};

export const onClose = (evt: CloseEvent, ws: WSContext<WebSocket>) => {
  console.log("WebSocket connection closed");
};
