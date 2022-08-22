import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Picker,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import Icons from "react-native-vector-icons/Feather";
import { UpdateUser } from "../ApiCalls";
import { years, cars } from "../assets/dummyData";
import { useNavigation } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import { AuthContext } from "../contexts/AuthContext";
export default function ModifierLaVoiture() {
  const { user, dispatch } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedCar, setSelectedCar] = useState();
  const [oldCar, setOldCar] = useState();
  const [oldYear, setOldYear] = useState();
  const [isFetching, setIsFecthing] = useState(false);
  const passager = 0;
  const car = 1;
  useEffect(() => {
    if (user) {
      const resp1 = years.find((y) => y.val == user.car_year);

      setSelectedYear(resp1.val);
      setOldYear(resp1.val);

      const resp = cars.find((c) => c.marque === user.car_type);
      setSelectedCar(resp);
      setOldCar(resp);
    }
  }, [user]);
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

  function navigateBack() {
    !selectedCar || selectedCar.marque === "Marque de voiture"
      ? showToast1()
      : selectedYear === "Année de voiture" || !selectedYear
      ? showToast2()
      : Update();
  }

  const navigate = () => {
    navigation.goBack();
  };
  const Update = async () => {
    setIsFecthing(true);
    const data = new FormData();

    data.append("car_brand", selectedCar.logo);
    data.append("car_type", selectedCar.marque);
    data.append("car_year", parseInt(selectedYear));

    const id = user.id;
    const d = await UpdateUser(dispatch, data, id, passager, car);
    setIsFecthing(false);
    if (d) {
      navigate();
    }
  };
  return (
    <View style={styles.conatainer}>
      <StatusBar
        backgroundColor="white"
        barStyle="dark-content"
        hidden={false}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingVertical: 10,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{ padding: 5, borderRadius: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Icons size={25} name="arrow-left" color="black" />
        </TouchableOpacity>
        <Text style={{ marginLeft: 20, fontWeight: "bold", fontSize: 17 }}>
          Modifier votre voiture
        </Text>
      </View>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 1,
          marginVertical: 10,
          marginHorizontal: 30,
        }}
      ></View>

      <View
        style={{
          padding: 40,
        }}
      >
        <View style={styles.inputsContainer}>
          <View style={styles.inputContainer}>
            <Picker
              mode="dropdown"
              selectedValue={selectedCar && selectedCar}
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
              selectedValue={selectedYear && selectedYear}
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
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  oldCar === selectedCar && oldYear === selectedYear
                    ? "#DCDCDC"
                    : mainColor,
              },
            ]}
            onPress={() => {
              !(oldCar === selectedCar && oldYear === selectedYear) &&
                navigateBack();
            }}
          >
            {isFetching ? (
              <ActivityIndicator
                animating={isFetching}
                color="white"
                size={20}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 100,
                }}
              />
            ) : (
              <Text style={{ color: "white" }}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  conatainer: {
    paddingHorizontal: 10,
    paddingTop: 5,
    flex: 1,
    backgroundColor: "white",
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
    borderBottomWidth: 1,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  input: {
    width: "75%",
  },
  button: {
    width: "50%",

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
    borderRadius: 10,
    marginTop: 50,
  },
});
