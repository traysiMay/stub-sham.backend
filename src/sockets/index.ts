import { ws } from "..";

const sockets = async socket => {
  console.log("a user is connected");
  socket.emit("CONNECTED", { connected: true });
  socket.on("disconnect", () => console.log("a user has disconnected"));
  socket.on("message", message => {
    ws.local.emit("message", message);
  });
  socket.on("start", start => {
    if (start) {
      ws.local.emit("start", start);
    }
  });
};

export default sockets;
