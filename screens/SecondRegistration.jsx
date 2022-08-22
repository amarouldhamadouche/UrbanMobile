import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
  ToastAndroid,
  BackHandler,
} from "react-native";

import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
export default function SecondRegistration() {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const route = useRoute();
  const { passager, chauffeur, nom, prenom, tel, date } = route.params;
  function navigateTothreg() {
    if (password.length >= 8) {
      passager
        ? navigation.navigate("thirdRegistration", {
            passager,
            chauffeur,
            nom,
            prenom,
            tel,
            password,
          })
        : navigation.navigate("thirdRegistration2", {
            passager,
            chauffeur,
            nom,
            prenom,
            tel,
            password,
            date,
          });
    } else {
      ToastAndroid.show(
        "le mot de passe doit etre en 8 characters minimum",
        ToastAndroid.LONG
      );
    }
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="white"
        hidden={false}
        barStyle="dark-content"
      />
      <View
        style={{
          marginLeft: 10,
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>1</Text>
        </View>
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: mainColor,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>2</Text>
        </View>
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>3</Text>
        </View>
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>4</Text>
        </View>
        {chauffeur && (
          <View
            style={{
              width: 25,
              height: 25,
              backgroundColor: "#C4C4C4",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
              marginHorizontal: 2,
            }}
          >
            <Text style={{ color: "white" }}>5</Text>
          </View>
        )}
      </View>
      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View>
            <View style={styles.top}>
              <Text
                style={{ fontWeight: "bold", fontSize: 30, color: "white" }}
              >
                Inscription
              </Text>
            </View>

            <View style={styles.center}>
              <View style={styles.inputsContainer}>
                <View style={styles.inputContainer}>
                  <TextInput
                    secureTextEntry={secure}
                    placeholder="Mot de pass"
                    style={styles.input}
                    minLength="8"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                  />
                  <TouchableOpacity>
                    <Icon
                      size={25}
                      color={mainColor}
                      name={secure ? "eye-off" : "eye"}
                      onPress={() => setSecure(!secure)}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={{ textAlign: "center", color: "#C4C4C4" }}>
                8 caractèrre minimum
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigateTothreg()}
              >
                <Text style={{ color: "white" }}>Suivant</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: StatusBar.currentHeight,
  },
  top: {
    height: Dimensions.get("window").height * 0.15,
    backgroundColor: mainColor,
    width: "95%",
    borderTopRightRadius: (Dimensions.get("window").height * 0.15) / 2,
    borderBottomRightRadius: (Dimensions.get("window").height * 0.15) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    height: Dimensions.get("window").height * 0.6,
    justifyContent: "space-around",
    paddingTop: "15%",
  },

  inputsContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    height: 50,
    width: Dimensions.get("window").width * 0.85,
    flexDirection: "row",
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  input: {
    width: "90%",
  },
  button: {
    width: "50%",
    backgroundColor: mainColor,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
});
