import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Picker,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ToastAndroid,
  StatusBar,
} from "react-native";
import Icons from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
export default function CreerTrajet2() {
  const [places, setPlaces] = useState("1");
  const route = useRoute();
  const { depart, destination } = route.params;
  const navigation = useNavigation();
  const place = ["1", "2", "3", "4", "5", "6", "7"];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.top}>
        <TouchableOpacity
          style={[styles.littleCard, { justifyContent: "center" }]}
          onPress={() => navigation.goBack()}
        >
          <Icons size={25} name="arrow-left" color={mainColor} />
        </TouchableOpacity>
        <View style={{ width: "60%", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
            places disponibles
          </Text>
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View>
            <View style={styles.center}>
              <View style={styles.inputsContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={places}
                  style={{ width: "100%", height: 100 }}
                  onValueChange={(itemValue, itemIndex) => {
                    setPlaces(itemValue);
                  }}
                >
                  {place.map((p) => (
                    <Picker.Item
                      key={p}
                      label={p.toString()}
                      value={p.toString()}
                    />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  places &&
                  places.length === 1 &&
                  navigation.navigate("creerTrajet3", {
                    depart,
                    destination,
                    places,
                  })
                }
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
    paddingTop: 10,
  },
  top: {
    height: Dimensions.get("window").height * 0.15,
    backgroundColor: mainColor,
    width: "95%",
    borderTopRightRadius: (Dimensions.get("window").height * 0.15) / 2,
    borderBottomRightRadius: (Dimensions.get("window").height * 0.15) / 2,
    flexDirection: "row",
    alignItems: "center",

    marginTop: 10,
  },
  littleCard: {
    marginLeft: 10,
    marginRight: 10,
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
    borderRadius: 20,
  },
  center: {
    height: Dimensions.get("window").height * 0.6,
    justifyContent: "space-around",
    paddingTop: "10%",
  },

  inputsContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingLeft: "45%",
    paddingRight: 10,
  },
  inputContainer: {
    height: 50,
    width: Dimensions.get("window").width * 0.65,
    flexDirection: "row",

    borderBottomWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  input: {
    width: "20%",
    borderBottomWidth: 1,
    alignItems: "center",
    textAlign: "center",
    padding: 10,
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
