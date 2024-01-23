import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { getAuth } from "firebase/auth";
import Text from "../components/Text";
import { doc, updateDoc } from "firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import _ from "lodash";
import FriendsDrawer from "../components/FriendsDrawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Notifier, Easing } from "react-native-notifier";

function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
const Locator = (navigation) => {
  const auth = getAuth();
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [usersInfo, setUsersInfo] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showFriendsDrawer, setShowFriendsDrawer] = useState(false);
  const [region, setRegion] = useState(null);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    onSnapshot(collection(db, "UsersInfo"), (snapshot) => {
      let usersInfo = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.user_uid !== auth.currentUser.uid) {
          if (data.geolocation) {
            usersInfo.push({ ...data, id: doc.id });
          }
        } else {
          setCurrentUserInfo({ ...currentUserInfo, ...data, id: doc.id });
        }
      });
      setUsersInfo(usersInfo);
    });
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, [navigation]);

  useEffect(() => {
    (async () => {
      if (currentUserInfo?.id) {
        let newLocation = {};

        if (!currentUserInfo.geolocation) {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
          }

          let loc = await Location.getCurrentPositionAsync({});
          newLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          setCurrentUserInfo({
            ...currentUserInfo,
            geolocation: newLocation,
          });
        } else {
          newLocation = {
            latitude: currentUserInfo.geolocation.latitude,
            longitude: currentUserInfo.geolocation.longitude,
          };
        }

        if (!region) {
          setRegion(newLocation);
        }
      }
    })();
  }, [currentUserInfo]);

  useEffect(() => {
    if (
      currentUserInfo?.id &&
      currentUserInfo?.geolocation &&
      showNotification
    ) {
      let closeFriends = [];

      usersInfo.forEach((info) => {
        const distanceBetween = distance(
          currentUserInfo.geolocation.latitude,
          currentUserInfo.geolocation.longitude,
          info.geolocation.latitude,
          info.geolocation.longitude
        );

        if (distanceBetween < 5) {
          closeFriends.push(info.name);
        }
      });

      if (closeFriends.length) {
        Notifier.showNotification({
          title: "Good news!",
          description: `Your friends ${closeFriends.map(
            (name) => ` ${name}`
          )} are within 5km range`,
          duration: 0,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          onPress: () => setShowNotification(false),
          hideOnPress: true,
          containerStyle: {
            paddingTop: 50,
          },
        });
      }
    }
  }, [currentUserInfo, usersInfo, showNotification]);

  const updateUserLocation = (newLocation) => {
    if (!_.isEqual(newLocation, currentUserInfo.geolocation)) {
      const userInfoToUpdate = doc(db, "UsersInfo", currentUserInfo.id);
      updateDoc(userInfoToUpdate, {
        geolocation: newLocation,
      })
        .then(() => {
          setCurrentUserInfo({
            ...currentUserInfo,
            geolocation: newLocation,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  if (errorMsg) {
    return (
      <View style={{ marginTop: 80, alignItems: "center" }}>
        <Text style={{ color: "red" }}>{errorMsg}</Text>
      </View>
    );
  }

  const onFriendDrawerClosed = (newDefaultRegion) => {
    if (newDefaultRegion) {
      setRegion(newDefaultRegion);
    }

    setShowFriendsDrawer(false);
  };

  return (
    <View style={styles.container}>
      <FriendsDrawer
        visible={showFriendsDrawer}
        onRequestClose={onFriendDrawerClosed}
        friends={usersInfo}
      />
      {currentUserInfo?.id && currentUserInfo?.geolocation && (
        <MapView
          provider={PROVIDER_GOOGLE}
          region={{ ...region, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onUserLocationChange={(e) =>
            updateUserLocation({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            })
          }
          mapPadding={{ top: 40 }}
        >
          <Marker
            title={currentUserInfo.name}
            coordinate={currentUserInfo.geolocation}
          />
          {usersInfo.map((info) => {
            if (info.geolocation) {
              return (
                <Marker
                  title={info.name}
                  coordinate={{
                    latitude: info.geolocation.latitude,
                    longitude: info.geolocation.longitude,
                  }}
                  key={info.user_uid}
                />
              );
            }
          })}
        </MapView>
      )}
      <TouchableOpacity
        style={{
          position: "absolute",
          backgroundColor: "green",
          bottom: 30,
          right: 30,
          padding: 10,
          borderRadius: 30,
        }}
        onPress={() => setShowFriendsDrawer(true)}
      >
        <Ionicons name="people-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default Locator;
