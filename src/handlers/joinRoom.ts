import { Socket } from "socket.io";
import DB from "~/DB";
import { User } from "~/types";

type Data = {
	user: User;
	roomId: string;
};

export default (socket: Socket) => (data: Data) => {
	const { user, roomId } = data; // Data sent from client when join_room event emitted

	if (!DB.getRoom(roomId)) {
		socket.emit("room_not_found", { roomId });
		return;
	}

	DB.addUserToRoom(user, roomId);

	socket.to(roomId).emit("user_joined", user);

	socket.join(roomId);

	const room = DB.getRoom(roomId);

	socket.emit("joined", room);

	console.log(`User ${user.id} joined room ${roomId}`);
};
