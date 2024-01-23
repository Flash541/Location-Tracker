import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Text from "../components/Text";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";

const auth = getAuth();

function SignUpScreen({ navigation }) {
  const [value, setValue] = React.useState({
    name: "",
    email: "",
    password: "",
    error: "",
  });

  async function signUp() {
    if (value.name === "" || value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Name, email and password are mandatory.",
      });
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );

      await addDoc(collection(db, "UsersInfo"), {
        user_uid: newUser.user.uid,
        name: value.name,
      });

      navigation.navigate("Sign In");
    } catch (error) {
      console.log(error);
      setValue({
        ...value,
        error: error.message,
      });
    }
  }

  return (
    <AuthLayout>
      <TouchableOpacity
        onPress={navigation.goBack}
        style={{ position: "absolute", top: 60, left: 20 }}
      >
        <Text>
          <Ionicons name="arrow-back-outline" size={32} color="white" />
        </Text>
      </TouchableOpacity>
      <View style={styles.topBlock}>
        <Text style={{ fontSize: 40, fontWeight: "800", marginBottom: 50 }}>
          Sign Up
        </Text>
        <TextInput
          placeholder="name"
          value={value.name}
          onChangeText={(text) => setValue({ ...value, name: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="email"
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="password"
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          style={styles.input}
        />

        {value.error && (
          <Text style={{ color: "yellow", fontSize: 14 }}>{value.error}</Text>
        )}

        <Button text="Sign Up" onPress={signUp} style={{ marginTop: 10 }} />
      </View>
    </AuthLayout>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  topBlock: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: 300,
    height: 55,
    backgroundColor: "rgba(217, 217, 217, 0.63)",
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    color: "white",
    fontSize: 18,
  },
});
