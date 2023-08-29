import { Socket } from "socket.io";
import DB from "~/DB";
import { User } from "~/types";

export default (socket: Socket) =>
	({ roomId, user }: { roomId: string; user: User }) => {
		if (!DB.getRoom(roomId)) {
			socket.emit("room_not_found", { roomId });
			return;
		}

		DB.removeUserFromRoom(user.id, roomId);

		socket.to(roomId).emit("user_left", { userId: user.id });
		socket.leave(roomId);
		console.log(`User ${user.id} left the room ${roomId}`);
	};
