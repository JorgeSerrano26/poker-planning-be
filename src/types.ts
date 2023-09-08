export type BasePayload = {
	roomId: string;
	userId: string;
	userName: string;
};

export type Card = {
	id: number;
	label: string;
	value: number | null;
};

export type User = {
	userName: string;
	id: string;
	image: string;
};

export type Vote = {
	voteId: string;
	userId: string;
	cardId: number;
};

export type Room = {
	id: string;
	users: User[];
	showVotes: boolean;
	votes: Vote[];
	votesAverage: number;
	cards: Card[];
};
