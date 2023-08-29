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

	DB.resetVotes(roomId);

	socket.to(roomId).emit("reset_votes");
	socket.emit("reset_votes");
};
