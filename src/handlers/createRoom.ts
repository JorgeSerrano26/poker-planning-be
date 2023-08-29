import { Socket } from "socket.io";
import DB from "~/DB";

export default (socket: Socket) => () => {
	const roomId = DB.createRoom();

	console.log(`Socket ${socket.id} created room ${roomId}`);

	socket.emit("room_created", { roomId });
};
