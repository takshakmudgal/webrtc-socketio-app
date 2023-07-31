import { Server, Socket } from "socket.io";

const io = new Server(5000, {
  cors: {
    origin: "*", // Replace "*" with the allowed origin(s) of your client app
    methods: ["GET", "POST"], // Add the allowed HTTP methods here
    allowedHeaders: ["Authorization", "Content-Type"], // Add the allowed headers here
    credentials: true, // Set this to true if you want to include credentials (e.g., cookies) in CORS requests
  },
});

const emailToSocketIdMap = new Map<string, string>(); // Add type annotations to the maps
const socketidToEmailMap = new Map<string, string>(); // Add type annotations to the maps

io.on("connection", (socket: Socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data: { email: string; room: string }) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", (data: { to: string; offer: any }) => {
    io.to(data.to).emit("incomming:call", {
      from: socket.id,
      offer: data.offer,
    });
  });

  socket.on("call:accepted", (data: { to: string; ans: any }) => {
    io.to(data.to).emit("call:accepted", { from: socket.id, ans: data.ans });
  });

  socket.on("peer:nego:needed", (data: { to: string; offer: any }) => {
    console.log("peer:nego:needed", data.offer);
    io.to(data.to).emit("peer:nego:needed", {
      from: socket.id,
      offer: data.offer,
    });
  });

  socket.on("peer:nego:done", (data: { to: string; ans: any }) => {
    console.log("peer:nego:done", data.ans);
    io.to(data.to).emit("peer:nego:final", { from: socket.id, ans: data.ans });
  });
});
