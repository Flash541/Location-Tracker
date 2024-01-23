import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, ToastAndroid } from "react-native";
import Button from "../components/Button";
import { getAuth, signOut } from "firebase/auth";
import UserLayout from "../components/UserLayout";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

const Settings = () => {
  const auth = getAuth();
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    let usersInfoQuery;
    usersInfoQuery = query(
      collection(db, "UsersInfo"),
      where("user_uid", "==", auth.currentUser.uid)
    );

    onSnapshot(usersInfoQuery, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setCurrentUserInfo({ ...doc.data(), id: doc.id });
      });
    });
  }, []);

  useEffect(() => {
    if (currentUserInfo) {
      setFormValues({
        name: currentUserInfo.name,
        surName: currentUserInfo.surName,
      });
    }
  }, [currentUserInfo]);

  const onSave = () => {
    const userToUpdate = doc(db, "UsersInfo", currentUserInfo.id);
    updateDoc(userToUpdate, formValues).then(() => {
      ToastAndroid.show(
        "Successfully saved",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    });
  };

  return (
    <UserLayout
      style={{ justifyContent: "space-between", alignItem: "space-between" }}
    >
      <View>
        <View style={styles.topBlock}>
          <Text style={styles.name}>{`${currentUserInfo?.name} ${
            currentUserInfo?.surName || ""
          }`}</Text>
          <Text style={styles.email}>{auth.currentUser?.email}</Text>
        </View>
        <View>
          <Text style={styles.labelPrimary}>Personal Data</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={formValues?.name}
              onChangeText={(value) =>
                setFormValues({ ...formValues, name: value })
              }
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Surname</Text>
            <TextInput
              style={styles.input}
              value={formValues?.surName}
              onChangeText={(value) =>
                setFormValues({ ...formValues, surName: value })
              }
            />
          </View>
        </View>
        <Button
          style={styles.signOutButton}
          text="Save"
          onPress={() => onSave()}
        />
      </View>
      <Button
        style={styles.signOutButton}
        text="Sign out"
        onPress={() => signOut(auth)}
      />
    </UserLayout>
  );
};

const styles = StyleSheet.create({
  topBlock: {
    padding: 0,
    marginBottom: 30,
  },
  name: {
    fontSize: 28,
    fontWeight: "500",
  },
  email: {
    fontSize: 24,
    fontWeight: "500",
  },
  labelPrimary: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "500",
  },
  inputWrapper: {
    backgroundColor: "rgba(217, 217, 217, 0.26)",
    width: 350,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  input: {
    fontWeight: "500",
  },
  signOutButton: {
    backgroundColor: "green",
    marginBottom: 30,
    width: 350,
  },
});

export default Settings;
