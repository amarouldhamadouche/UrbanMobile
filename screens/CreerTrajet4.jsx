import React, { useState, useContext } from "react";
import {
  SchedulePushNotification,
  scheduleArriveNotification,
} from "../ApiCalls";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";

import Icons from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import { CreateTrajet } from "../ApiCalls";
export default function CreerTrajet4() {
  const { user, dispatch } = useContext(AuthContext);
  const route = useRoute();
  const {
    depart,
    destination,
    places,
    selectedDate,
    price,
    distance,
    hour,
    min,
    day,
    month,
  } = route.params;
  const [checked, setChecked] = useState();
  const [isFetching,setIsFecthing] = useState(false)

  const navigation = useNavigation();
  const navigateToHome = async () => {
    setIsFecthing(true)
    const data = new FormData();
    data.append("driver", user.id);
    data.append("start_time", selectedDate);
    data.append("places", places);

    data.append("starting_point", depart.mat);
    data.append("destination", destination.mat);
    data.append("active", true);
    checked === "femme" && data.append("woman_only", true);
    const d = await CreateTrajet(data, dispatch);
    setIsFecthing(false)
    if(d){
    navigation.navigate("Home");
    SchedulePushNotification(hour, min, day, month, d, user);
    scheduleArriveNotification(hour, min, day, month, d, distance, user);
  }};
  const showToast1 = () => {
    ToastAndroid.show(
      "merci de selecter le genre que tu veut trajet avec",
      ToastAndroid.LONG
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="white"
        barStyle="dark-content"
        hidden={false}
      />
      <View style={styles.top}>
        <TouchableOpacity
          style={[styles.littleCard, { justifyContent: "center" }]}
          onPress={() => navigation.goBack()}
        >
          <Feather size={25} name="arrow-left" color={mainColor} />
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            width: "60%",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 20,
              color: "white",
            }}
          >
            Tu veut trajet avec...
          </Text>
        </View>
      </View>

      <View>
        <View style={styles.center}>
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={styles.gender}>
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
                    <Icons
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

              <TouchableOpacity onPress={() => setChecked("mix")}>
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: "#C4C4C4",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                      borderRadius: 50,
                    }}
                  >
                    <Icons
                      size={20}
                      color={checked === "mix" ? "blue" : "black"}
                      name="male"
                    />
                    <Icons
                      size={20}
                      color={checked === "mix" ? mainColor : "black"}
                      name="female"
                    />
                  </View>
                  <Text
                    style={
                      checked === "mix" ? { color: "blue" } : { color: "black" }
                    }
                  >
                    Peu importe
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={checked&&!isFetching ? navigateToHome : showToast1}
            style={styles.button}
          >
            {isFetching? <ActivityIndicator
          animating={isFetching}
          color='white'
          size={20}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: 100,
          }}
        />:
            <Text style={{ color: "white" }}>Terminer</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
  },
  gender: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
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
    height: Dimensions.get("window").height * 0.4,
    marginTop: 50,
    justifyContent: "space-between",
    paddingTop: "10%",
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
