import { Socket } from "socket.io";
import DB from "~/DB";

type Data = {
	roomId: string;
};

export default (socket: Socket) => ({ roomId }: Data) => {
	if (!DB.getRoom(roomId)) {
		socket.emit("room_not_found", { roomId });
		return;
	}

	DB.revealVotes(roomId);

	socket.to(roomId).emit("reveal_votes");
	socket.emit("reveal_votes");
};
