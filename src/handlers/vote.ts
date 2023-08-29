import { Socket } from "socket.io";
import DB from "~/DB";
import { User, Vote } from "~/types";

type Data = {
	roomId: string;
	cardId: Vote["cardId"];
	user: User;
};

export default (socket: Socket) => ({ roomId, cardId, user }: Data) => {
	if (!DB.getRoom(roomId)) {
		socket.emit("room_not_found", { roomId });
		return;
	}

	const voteId = DB.addVote(user.id, cardId, roomId);

	console.log(`User ${user.id} voted for card ${cardId}`);

	const response: Vote = { userId: user.id, cardId, voteId };

	socket.to(roomId).emit("user_voted", response);
	socket.emit("user_voted", response);
};
