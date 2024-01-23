import { Text, StyleSheet } from "react-native";
import React from "react";

const MyText = (props) => {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: "white",
  },
});

export default MyText;
