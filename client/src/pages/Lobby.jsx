import React, { useState } from "react";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [lobbyNo, setLobbyNo] = useState("");
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="bg-gray-300 p-10 rounded">
        <div className="text-xl font-semibold mb-4">Enter your details</div>
        <form className="flex flex-col items-center" action="">
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
            placeholder="Enter Lobby Number"
            onChange={(e) => setLobbyNo(e.target.value)}
            value={lobbyNo}
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
