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
  Picker,
  ToastAndroid,
  StatusBar,
  BackHandler,
} from "react-native";
import { years, cars } from "../assets/dummyData";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
export default function ThirdRegistration2() {
  const route = useRoute();

  const [selectedYear, setSelectedYear] = useState();
  const [selectedCar, setSelectedCar] = useState();
  const { passager, chauffeur, nom, prenom, tel, password, date } =
    route.params;
  const navigation = useNavigation();
  const showToast1 = () => {
    ToastAndroid.show(
      "merci de selecter la marque de voiture",
      ToastAndroid.LONG
    );
  };
  const showToast2 = () => {
    ToastAndroid.show(
      "merci de selecter l'année de voiture",
      ToastAndroid.LONG
    );
  };

  function navigateToForthRegistration() {
    !selectedCar || selectedCar.marque === "Marque de voiture"
      ? showToast1()
      : selectedYear === "Année de voiture" || !selectedYear
      ? showToast2()
      : navigation.navigate("thirdRegistration", {
          passager,
          chauffeur,
          nom,
          prenom,
          tel,
          password,
          date,
          selectedCar,
          selectedYear,
        });
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
      <StatusBar backgroundColor="white" barStyle="dark-content" />
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
            backgroundColor: mainColor,
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
                  <Picker
                    mode="dropdown"
                    selectedValue={selectedCar}
                    style={{ width: "100%", height: 100 }}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedCar(itemValue);
                    }}
                  >
                    {cars.map((c) => (
                      <Picker.Item key={c.marque} label={c.marque} value={c} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Logo de voiture"
                    style={styles.input}
                    value={selectedCar ? selectedCar.logo : ""}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Picker
                    mode="dropdown"
                    selectedValue={selectedYear}
                    style={{ width: "100%", height: 100 }}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedYear(itemValue);
                    }}
                  >
                    {years.map((y) => (
                      <Picker.Item key={y.id} label={y.val} value={y.val} />
                    ))}
                  </Picker>
                </View>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigateToForthRegistration()}
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
    paddingTop: "10%",
  },

  inputsContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    height: 50,
    width: Dimensions.get("window").width * 0.85,
    flexDirection: "row",

    borderBottomWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  input: {
    width: "100%",
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
