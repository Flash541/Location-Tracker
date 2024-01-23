import { View, StyleSheet } from "react-native";
import React from "react";

const UserLayout = (props) => {
  return <View style={[styles.container, props.style]}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(217, 217, 217, 0.31)",
    paddingTop: 80,
  },
});

export default UserLayout;
