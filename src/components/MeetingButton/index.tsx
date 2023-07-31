import { Button } from "@chakra-ui/react";

const MeetingButton = () => {
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.1.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };

  const handleClick = async () => {
    console.log("Button clicked");

    // Call existing function to create offer
    await createOffer();
  };

  const createOffer = async () => {
    const peerConnection = new RTCPeerConnection(servers);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Log offer after creating it
    console.log("Offer: ", offer);
  };

  return <Button onClick={handleClick}>Start a Meeting</Button>;
};

export default MeetingButton;
