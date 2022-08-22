import * as React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { mainColor } from "./mainColor";

import { useNavigation } from "@react-navigation/native";
export default function FirstScreen() {
  const navigation = useNavigation();

  function navigateToLogin1() {
    navigation.navigate("trajetDispo", { passager: true, chauffeur: false });
  }
  function navigateToLogin2() {
    navigation.navigate("second", { passager: false, chauffeur: true });
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="white"
        barStyle="dark-content"
        translucent={true}
      />
      <View
        style={{
          flex: 2,

          width: "100%",
          paddingLeft: "7%",
          paddingRight: "7%",
          paddingTop: 10,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            height: "25%",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.bold}> UrbanMobile</Text>

          <Text style={{ color: "black", left: 10 }}>
           Votre sélection de manège a petits prix
          </Text>
        </View>
        <View style={styles.center}>
          <Image
            style={{ width: 200, height: 200 }}
            source={require("../assets/img/Car.png")}
            alt=""
          />
        </View>
      </View>
      <View
        style={{
          flex: 1.3,
          backgroundColor: mainColor,
          width: "100%",

          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToLogin1()}
        >
          <Text style={{ color: "white" }}>Passager</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToLogin2()}
        >
          <Text style={{ color: "white" }}>Chauffeur</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    alignItems: "center",
    width: "100%",
  },

  bold: {
    left: 0,
    fontWeight: "bold",
    fontSize: 30,
    color: mainColor,
  },

  button: {
    width: "50%",
    marginTop: 20,
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,

    backgroundColor: mainColor,
    borderColor: "white",
    borderWidth: 2,

    borderRadius: 40,
  },
});
