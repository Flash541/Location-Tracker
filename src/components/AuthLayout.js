import { View, StyleSheet, ImageBackground } from "react-native";
import React from "react";
import image from "../../assets/gradient.png";

const AuthLayout = (props) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        {props.children}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
});

export default AuthLayout;
