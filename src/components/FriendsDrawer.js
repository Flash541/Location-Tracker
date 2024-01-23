import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import image from "../../assets/gradient.png";
import Text from "./Text";

// We need to get the height of the phone and use it relatively,
// This is because height of phones vary
const windowHeight = Dimensions.get("window").height;

const FriendsDrawer = ({ visible, onRequestClose, friends }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      // We use the state here to toggle visibility of Bottom Sheet
      visible={visible}
      // We pass our function as default function to close the Modal
      onRequestClose={onRequestClose}
    >
      <View style={[styles.bottomSheet, { height: windowHeight * 0.6 }]}>
        <View style={styles.closeIconWrapper}>
          <TouchableOpacity
            style={{
              backgroundColor: "gray",
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 20,
              justifyContent: "flex-end",
            }}
            onPress={onRequestClose}
          >
            <Text>X</Text>
          </TouchableOpacity>
        </View>
        {friends.map(
          (friend) =>
            friend.geolocation && (
              <TouchableOpacity
                key={friend.id}
                onPress={() => onRequestClose(friend.geolocation)}
              >
                <ImageBackground source={image} style={styles.friendCard}>
                  <Text style={{ color: "white", fontWeight: "500" }}>{`${
                    friend.name
                  } ${friend.surName || ""}`}</Text>
                </ImageBackground>
              </TouchableOpacity>
            )
        )}
      </View>
    </Modal>
  );
};

// The StyleSheet is imported from React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIconWrapper: {
    alignItems: "flex-end",
    width: 350,
  },
  friendCard: {
    width: 350,
    padding: 20,
    backgroundColor: "purple",
    marginTop: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    opacity: 0.8,
    paddingVertical: 23,
    paddingHorizontal: 25,
    bottom: 0,
    borderWidth: 1,
  },
});

export default FriendsDrawer;
