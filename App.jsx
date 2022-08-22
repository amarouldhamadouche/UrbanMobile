import Index from "./index";
import * as React from "react";
import { StatusBar } from "react-native";
import { AuthContextProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthContextProvider>
      <StatusBar hidden={false} />
      <Index />
    </AuthContextProvider>
  );
}
