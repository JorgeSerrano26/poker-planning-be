import cards from "./cards";
import { Room, User } from "./types";
import { v4 as uuidv4 } from "uuid";

class DB {
	private rooms: Record<string, Room> = {};

	public createRoom() {
		const id = uuidv4();

		if (!this.rooms[id]) {
			this.rooms[id] = {
				id,
				users: [],
				votes: [],
				showVotes: false,
				votesAverage: 0,
				cards,
			};
		}

		return id;
	}

	public removeRoom(room: string) {
		const { [room]: _, ...rooms } = this.rooms;
		this.rooms = rooms;
	}

	public getRoom(room: string) {
		return this.rooms[room];
	}

	public addUserToRoom(user: User, room: string) {
		this.rooms[room].users.push(user);
	}

	public removeUserFromRoom(userId: string, room: string) {
		const index = this.rooms[room].users.findIndex((u) => u.id === userId);
		const user = this.rooms[room].users[index];
		this.rooms[room].users.splice(index, 1);
		return user;
	}

	resetVotes(roomId: string) {
		this.rooms[roomId].votes = [];
		this.rooms[roomId].showVotes = false;
		this.rooms[roomId].votesAverage = 0;
	}

	public revealVotes(roomId: string) {
		this.rooms[roomId].showVotes = true;
	}

	public getVotesAverage(roomId: string) {
		const votesAverage =
			this.rooms[roomId].votes.reduce((acc, vote) => {
				const card = this.rooms[roomId].cards.find(
					(card) => card.id === vote.cardId,
				);
				const voteValue = card?.value ?? 0;
				return acc + voteValue;
			}, 0) / this.rooms[roomId].votes.length;

		this.rooms[roomId].votesAverage = votesAverage;

		return votesAverage;
	}

	public addVote(userId: string, cardId: number, room: string) {
		const voteId = uuidv4();
		if (this.rooms[room].votes.find((v) => v.userId === userId)) {
			this.rooms[room].votes = this.rooms[room].votes.filter(
				(v) => v.userId !== userId,
			);
		}

		this.rooms[room].votes.push({ userId, cardId, voteId });
		return voteId;
	}

	public getRoomUsers(room: string) {
		return this.rooms[room].users;
	}
}

export default new DB();
