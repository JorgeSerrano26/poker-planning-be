// server/index.js

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import {
	joinRoom,
	vote,
	reveal,
	addCard,
	createRoom,
	leaveRoom,
	resetVotes,
} from "./handlers/index";
import DB from "./DB";

const app = express();
app.use(cors()); // Add cors middleware

// Security?
app.get("/api/room/:roomId", async (req, res) => {
	const roomId = req.params.roomId;

	const room = await DB.getRoom(roomId);

	if (!room) {
		res.status(404).send("Room not found");
		return;
	}
	res.json(room);
});

const server = http.createServer(app);

const origins = ["http://localhost:3000"];

// Add this
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

enum AppEvents {
	create_room = "create_room",
	join_room = "join_room",
	leave_room = "leave_room",
	vote = "vote",
	reset_votes = "reset_votes",
	reveal_votes = "reveal_votes",
	add_card = "add_card",
	remove_card = "remove_card",
	select_card = "select_card",
}

io.on("connection", (socket) => {
	console.log(`Socket connected ${socket.id}`);

	// Rooms
	socket.on(AppEvents.create_room, createRoom(socket));
	socket.on(AppEvents.join_room, joinRoom(socket));
	socket.on(AppEvents.leave_room, leaveRoom(socket));

	// Votes
	socket.on(AppEvents.vote, vote(socket));
	socket.on(AppEvents.reset_votes, resetVotes(socket));
	socket.on(AppEvents.reveal_votes, reveal(socket));

	// Cards
	socket.on(AppEvents.add_card, addCard(socket));
	//socket.on(AppEvents.remove_card, removeCard(socket));
	//socket.on(AppEvents.select_card, selectCard(socket));
});

const PORT = process.env.PORT ?? 4000;

server.listen(4000, () => console.log(`🪐 Listening on port ${PORT}`));
