import { Flex, Box, Text, Button, HStack } from "@chakra-ui/react";
import { useEffect, useCallback, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../../services/peer";

const MediaStreams = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);
  return (
    <>
      <HStack
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        mt={"2"}
      >
        <Text fontFamily={"heading"} textColor={"green.500"} fontSize={"4xl"}>
          {remoteSocketId ? "Connected" : "No one in Room"}
        </Text>
        {remoteSocketId && <Button onClick={handleCallUser}>CALL</Button>}
      </HStack>
      <Flex
        height="90vh"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box
          width="80%"
          height="90%"
          border="2px"
          borderRadius="3xl"
          borderColor="white"
          p={4}
          boxShadow="0px 0px 60px 10px rgba(128, 0, 128, 0.5)"
          bg="transparent"
          position="relative"
        >
          {remoteStream && (
            <>
              <ReactPlayer
                playing
                muted
                width={"100%"}
                height={"100%"}
                url={remoteStream}
              />
            </>
          )}
        </Box>

        <Box
          position="absolute"
          top="9%"
          right="12%"
          width="20%"
          height="30%"
          border="2px"
          borderRadius="3xl"
          borderColor="white"
          boxShadow="0px 0px 10px 4px rgba(128, 0, 128, 0.5)"
          overflow="hidden" // Ensure that the video is not overflowing the Box
        >
          {myStream && (
            <ReactPlayer
              url={myStream}
              playing
              muted
              width={"100%"}
              height={"100%"}
              style={{
                position: "absolute",
                objectFit: "inherit",
                borderRadius: "inherit",
              }}
            />
          )}
        </Box>
      </Flex>
    </>
  );
};

export default MediaStreams;
