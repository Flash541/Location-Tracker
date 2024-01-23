import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Button from "../components/Button";
import Text from "../components/Text";
import AuthLayout from "../components/AuthLayout";

const auth = getAuth();

function SignInScreen({ navigation }) {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });

  async function signIn() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
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
      <View style={styles.container}>
        <View style={styles.topBlock}>
          <Text style={{ fontSize: 40, fontWeight: "800", marginBottom: 50 }}>
            Login
          </Text>
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
          <Button text="Sign In" onPress={signIn} style={{ marginTop: 10 }} />
        </View>

        <View style={styles.bottomBlock}>
          <Text>don't have an account?</Text>
          <Button
            text="Sign Up"
            onPress={() => navigation.navigate("Sign Up")}
          />
        </View>
      </View>
    </AuthLayout>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 180,
  },
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
  bottomBlock: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
  },
});
