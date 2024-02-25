import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const navigate = useNavigate()
  const socket = useSocket();

  const hanldeSubmit = (e) => {
    e.preventDefault();
    try {
      socket.emit("room:join", { email, room });
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinRoom = (data) => {
    const { email, room } = data;
    navigate(`room/${room}`)
  };

  useEffect(() => {
    socket.on("room:join", (data) => handleJoinRoom(data));
    return () => {
      socket.off("roon:join", handleJoinRoom);
    };
  }, [socket]);
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="bg-gray-300 p-10 rounded">
        <div className="text-xl font-semibold mb-4">Enter your details</div>
        <form
          onSubmit={hanldeSubmit}
          className="flex flex-col items-center"
          action=""
        >
          <input
            className="border border-gray-400 rounded-md px-4 py-2 mb-4 w-64 focus:outline-none focus:border-blue-500"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
          />
          <input
            className="border border-gray-400 rounded-md px-4 py-2 mb-4 w-64 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Enter Room Number"
            onChange={(e) => setRoom(e.target.value)}
            value={room}
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;
