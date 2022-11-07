import React, { useRef, useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  StatusBar,
} from "react-native";
import firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import Feather from "react-native-vector-icons/Feather";
import EvillIcons from "react-native-vector-icons/EvilIcons";
import { AuthContext } from "../contexts/AuthContext";
export default function PassagerHome({
  menu,
  setMenu,
  passager,

}) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  function navigateToNotification() {
    navigation.navigate("notification", {
      currentUser: user,
    });
  }
  const [read, setRead] = useState(true);

  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    firebase
      .database()
      .ref(`/NotificationSetting/${user.user}`)
      .on("value", (snapshot) => {
        snapshot.val() && setRead(snapshot.val().read);
        console.log("read", read);
      });
  }, [user.user]);
  return (
    StatusBar && (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: scaleValue }, { translateX: offsetValue }],
            borderRadius: menu ? 15 : 0,
          },
        ]}
      >
        <StatusBar
          backgroundColor={"white"}
          barStyle="dark-content"
          hidden={false}
          translucent={true}
        />
         <View
          style={{
            width: Dimensions.get("window").width,
            height: "10%",
            marginTop:"5%",

            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            alignItems: "center",
            zIndex: 3,
          }}
        >
          <TouchableOpacity
            style={[styles.littleCard, { justifyContent: "center" }]}
            onPress={() => {
              Animated.timing(scaleValue, {
                toValue: menu ? 1 : 0.88,
                duration: 300,
                useNativeDriver: true,
              }).start();
              Animated.timing(offsetValue, {
                toValue: menu ? 0 : 220,
                duration: 300,
                useNativeDriver: true,
              }).start();

              setMenu(!menu);
            }}
          >
            <EvillIcons
              name={menu ? "close" : "navicon"}
              color={mainColor}
              size={30}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.littleCard, { justifyContent: "center" }]}
            onPress={() => navigateToNotification()}
          >
            <View>
              {!read && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "red",
                    zIndex: 3,
                    position: "absolute",
                    borderWidth: 1,
                    borderColor: "white",
                    right: 3,
                    top: 0,
                  }}
                ></View>
              )}
              <Feather name="bell" size={25} color={mainColor} />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: Dimensions.get("window").height * 0.86,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 30, color: mainColor }}
            >
              UrbanMobile
            </Text>
            <Text>
              {passager === 1
                ? "Vas-tu quelque part et tu cherche quelqu'un qui peut te conduire?"
                : passager === 0 &&
                  "Vas-tu quelque part et tu as des chaises que tu veux les partager?"}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 2,
              borderRadius: 10,
              borderColor: mainColor,
              width: Dimensions.get("window").width * 0.6,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              passager === 0
                ? navigation.navigate("creerTrajet1")
                : passager === 1 && navigation.navigate("trajetDispo", { user })
            }
          >
            <Text style={{ color: mainColor }}>
              {passager === 1
                ? "Trajets disponibles"
                : passager === 0 && "Creer un trajet"}
            </Text>
          </TouchableOpacity>
          <Image
            style={{ width: 220, height: 200 }}
            source={require("../assets/img/Car1.png")}
            alt=""
          />
        </View>
      </Animated.View>
    )
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 5,
    //  flex: 1,
  },
  button: {
    width: Dimensions.get("window").width * 0.27,
    height: Dimensions.get("window").height * 0.05,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: mainColor,
    borderRadius: 50,
    zIndex: 3,
  },
  littleCard: {
    width: Dimensions.get("window").width * 0.13,
    height: Dimensions.get("window").width * 0.13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderRadius: 5,
  },
  bold: {
    left: 0,
    fontWeight: "bold",
    fontSize: 25,
    color: "black",
    textAlign: "center",
    marginVertical: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
    height: Dimensions.get("window").height * 0.1,
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
  },
});
