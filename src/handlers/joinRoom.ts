import { Socket } from "socket.io";
import DB from "~/DB";
import { User } from "~/types";
import cards from "~/cards";

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

	const { users, votes } = DB.getRoom(roomId);

	socket.emit("joined", {
		cards,
		users,
		votes,
		showCards: false,
	});

	console.log(`User ${user.id} joined room ${roomId}`);
};
