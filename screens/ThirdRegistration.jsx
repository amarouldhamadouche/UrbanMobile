import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  StatusBar,
  BackHandler,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import Icon from "react-native-vector-icons/FontAwesome";
export default function ThirdRegistration() {
  const route = useRoute();
  const {
    passager,
    chauffeur,
    nom,
    prenom,
    tel,
    password,
    date,
    selectedCar,
    selectedYear,
  } = route.params;
  const [checked, setChecked] = useState();
  const [checkedAge, setCheckedAge] = useState();
  const navigation = useNavigation();
  const showToast1 = () => {
    ToastAndroid.show("merci de selecter votre genre", ToastAndroid.LONG);
  };
  const showToast2 = () => {
    ToastAndroid.show(
      "merci de selecter votre tranche d'age",
      ToastAndroid.LONG
    );
  };
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
  function navigateToForthReg() {
    passager
      ? !checked
        ? showToast1()
        : !checkedAge
        ? showToast2()
        : navigation.navigate("forthRegistration", {
            passager,
            chauffeur,
            nom,
            prenom,
            tel,
            password,
            checked,
            checkedAge,
          })
      : chauffeur && !checked
      ? showToast1()
      : navigation.navigate("forthRegistration", {
          passager,
          chauffeur,
          nom,
          prenom,
          tel,
          password,
          date,
          selectedCar,
          selectedYear,
          checked,
        });
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View>
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
              backgroundColor: "#C4C4C4",
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
              backgroundColor: passager ? mainColor : "#C4C4C4",
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
              backgroundColor: passager ? "#C4C4C4" : mainColor,
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
        <View style={styles.top}>
          <Text style={{ fontWeight: "bold", fontSize: 30, color: "white" }}>
            Inscription
          </Text>
        </View>
      </View>
      <View style={styles.center}>
        <View style={styles.gender}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Genre</Text>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => setChecked("homme")}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#C4C4C4",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 50,
                }}
              >
                <Icon
                  size={25}
                  color={checked === "homme" ? "blue" : "black"}
                  name="male"
                />
              </View>

              <Text
                style={
                  checked === "homme" ? { color: "blue" } : { color: "black" }
                }
              >
                Homme
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => setChecked("femme")}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#C4C4C4",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 50,
                }}
              >
                <Icon
                  size={25}
                  color={checked === "femme" ? "#DC143C" : "black"}
                  name="female"
                />
              </View>
              <Text
                style={
                  checked === "femme"
                    ? { color: "#DC143C" }
                    : { color: "black" }
                }
              >
                Femme
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {passager && (
          <View style={styles.gender}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Age</Text>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => setCheckedAge("1")}
                style={{
                  width: Dimensions.get("window").width * 0.2,
                  height: 20,

                  borderWidth: 1,
                  borderColor: checkedAge === "1" ? "blue" : "black",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
              >
                <Text
                  style={
                    checkedAge === "1" ? { color: "blue" } : { color: "black" }
                  }
                >
                  18 - 25
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCheckedAge("2")}
                style={{
                  width: Dimensions.get("window").width * 0.2,
                  height: 20,

                  borderWidth: 1,
                  borderColor: checkedAge === "2" ? "blue" : "black",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
              >
                <Text
                  style={
                    checkedAge === "2" ? { color: "blue" } : { color: "black" }
                  }
                >
                  26 - 40
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCheckedAge("3")}
                style={{
                  width: Dimensions.get("window").width * 0.2,
                  height: 20,

                  borderWidth: 1,
                  borderColor: checkedAge === "3" ? "blue" : "black",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
              >
                <Text
                  style={
                    checkedAge === "3" ? { color: "blue" } : { color: "black" }
                  }
                >
                  +40
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToForthReg()}
      >
        <Text style={{ color: "white" }}>Suivant</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight,
    paddingBottom: Dimensions.get("window").height * 0.18,
    backgroundColor: "white",
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
    height: Dimensions.get("window").height * 0.5,
    justifyContent: "space-around",
    paddingHorizontal: "5%",
  },
  gender: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
});
