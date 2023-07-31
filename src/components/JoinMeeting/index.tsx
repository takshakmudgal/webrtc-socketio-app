/* eslint-disable */
import { Button, FormControl, Input, HStack } from "@chakra-ui/react";
import { useState, useCallback, useEffect } from "react";
import { useSocket } from "../../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const JoinMeeting = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <>
      <HStack my={"20"}>
        <FormControl w={"lg"} textColor={"white"} fontFamily={"para"}>
          <HStack mb={"2"}>
            <Input
              type="email"
              placeholder="Enter your email address."
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter the meeting room code."
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <Button onClick={handleSubmitForm}>Join</Button>
          </HStack>
        </FormControl>
      </HStack>
    </>
  );
};

export default JoinMeeting;
