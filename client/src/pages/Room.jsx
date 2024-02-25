import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import ReactPlayer from "react-player";
import peer from "../service/peer";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleUserJoined = (data) => {
    console.log(data);
    setRemoteSocketId(data.id);
  };

const handleCallUser = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setCallStatus("Calling...");
  } catch (error) {
    console.error("Error calling user:", error);
    setCallStatus("Failed to initiate call");
  }
};


  const handleIncomingCall = async ({ from, offer }) => {
    setRemoteSocketId(from);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log("incoming call", from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
      setCallStatus("Call accepted");
    } catch (error) {
      console.error("Error accepting incoming call:", error);
      setCallStatus("Failed to accept call");
    }
  };

  const handleNegoNeeded = async () => {
    try {
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    } catch (error) {
      console.error("Error negotiating stream:", error);
    }
  };

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const secondScreen = ev.streams;
      setRemoteStream(secondScreen[0]);
    });
  }, []);

  const sendStreams = () => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  };

  const handleCallAccepted = async ({ from, ans }) => {
    try {
      peer.setLocalDescription(ans);
      console.log("call accepted");
      sendStreams();
      setCallStatus("Call connected");
    } catch (error) {
      console.error("Error accepting call:", error);
      setCallStatus("Failed to connect call");
    }
  };

  useEffect(() => {
    if (remoteSocketId) {
      handleCallUser();
    }
  }, [remoteSocketId]);


  const handleNegoNeedIncoming = async ({ from, offer }) => {
    try {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    } catch (error) {
      console.error("Error negotiating incoming call:", error);
    }
  };

  const handleNegoNeedFinal = async ({ ans }) => {
    try {
      await peer.setLocalDescription(ans);
    } catch (error) {
      console.error("Error finalizing negotiation:", error);
    }
  };

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [socket, handleUserJoined]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Room page</h1>
      <h4 className="mb-4">
        {remoteSocketId ? "Connected" : "No one is in the room"}
      </h4>
      {remoteSocketId && (
        <button
          onClick={handleCallUser}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded `}
        >
          Share screen
        </button>
      )}
      {myStream && (
        <ReactPlayer
          playing
          muted
          width="300px"
          height="300px"
          controls
          url={myStream}
        />
      )}
      {remoteStream && (
        <ReactPlayer
          playing
          muted
          width="300px"
          height="300px"
          controls
          url={remoteStream}
        />
      )}
    </div>
  );
};

export default Room;
