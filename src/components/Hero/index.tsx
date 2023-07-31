import { Heading, Text, VStack } from "@chakra-ui/react";
import MeetingButton from "../MeetingButton";
import JoinMeeting from "../JoinMeeting";

const Hero = () => {
  return (
    <>
      <VStack mt={"16"} rowGap={"6"}>
        <Heading
          fontFamily={"heading"}
          fontWeight={"300px"}
          fontSize={{ base: "lg", sm: "4xl", md: "5xl", lg: "7xl" }}
          textColor={"white"}
          maxW={"8xl"}
          textAlign={"center"}
        >
          Video Conferencing Made Easy Connect and Collaborate Anywhere
          Experience Seamless Communication
        </Heading>
        <Text
          fontFamily={"para"}
          fontWeight={"300px"}
          fontSize={{ base: "xs", sm: "lg", md: "xl", lg: "2xl" }}
          textAlign={"center"}
          textColor={"white"}
          maxW={"4xl"}
        >
          Collaborate, communicate, and connect in real-time with high-quality
          video conferencing technology using peer-to-peer connection. Enjoy
          seamless meetings and build stronger relationships with your team, no
          matter where you are.
        </Text>
        <MeetingButton />
        <JoinMeeting />
      </VStack>
    </>
  );
};
export default Hero;
