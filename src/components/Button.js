import { StyleSheet, Pressable } from "react-native";
import React from "react";
import Text from "./Text";

const Button = ({ text, onPress, style = {} }) => {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 300,
    backgroundColor: "rgba(217, 217, 217, 0.74)",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 8,
    display: "flex",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },
});

export default Button;
