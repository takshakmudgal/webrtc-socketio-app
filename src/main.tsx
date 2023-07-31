import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { SocketProvieder } from "./context/SocketProvider.tsx";

const theme = extendTheme({
  fonts: {
    heading: "'Handjet', cursive",
    para: "'Yanone Kaffeesatz', sans-serif;",
  },
  styles: {
    global: {
      body: {
        bgGradient: "radial(purple.900, black) no-repeat",
        bgRepeat: "no-repeat",
        backgroundSize: "100% 100vh",
      },
      fonts: {},
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <SocketProvieder>
        <App />
      </SocketProvieder>
    </ChakraProvider>
  </React.StrictMode>
);
