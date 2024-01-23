import React from "react";
import "./src/config/firebase";
import RootNavigation from "./src/navigation";
import "./ignoreWarning";
import { NotifierWrapper } from "react-native-notifier";

export default function App() {
  return (
    <NotifierWrapper>
      <RootNavigation />
    </NotifierWrapper>
  );
}
