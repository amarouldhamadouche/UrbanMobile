import React, { useState, useEffect, useContext } from "react";
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
import {
  SchedulePushNotification,
  scheduleArriveNotification,
} from "../ApiCalls";

import moment from "moment";
import getDistance from "geolib/es/getDistance";
import { CreateTrajet } from "../ApiCalls";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../contexts/AuthContext";
import Icons from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";

export default function CreerTrajet3() {
  const { user, dispatch } = useContext(AuthContext);
  const [isFetching,setIsFecthing] = useState(false)
  const [date, setDate] = useState();
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();
  const [hour, setHour] = useState();
  const [min, setMin] = useState();
  const [heure, setHeure] = useState();
  const [sec, setSec] = useState();
  const [isPickerShow1, setIsPickerShow1] = useState(false);
  const [isPickerShow2, setIsPickerShow2] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [price, setPrice] = useState();
  const [distance, setDistance] = useState();
  const route = useRoute();
  const { depart, destination, places } = route.params;
  const showPicker1 = () => {
    setIsPickerShow1(true);
  };
  useEffect(() => {
    const dis = getDistance(
      { latitude: depart.latitude, longitude: depart.longitude },
      { latitude: destination.latitude, longitude: destination.longitude }
    );
    setDistance(dis);
    const x = (dis / 5000) * 45;
    const y = Math.round(x / places);
    setPrice(y);
  }, [depart, destination]);

  const onChange1 = (event, value) => {
    setIsPickerShow1(false);
    value && setDate(moment(value).format("DD/MM/YYYY"));
    value && setYear(value.getFullYear());
    value && setMonth(value.getMonth() + 1);
    value && setDay(value.getDate());
    value &&
      setSelectedDate(
        `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}T${
          hour && hour
        }:${min && min}:${sec && sec}`
      );
  };
  const showPicker2 = () => {
    setIsPickerShow2(true);
  };
  const onChange2 = (event, value) => {
    setIsPickerShow2(false);
    value && setHeure(moment(value).format("HH:mm"));
    value && setHour(value.getHours());
    value && setMin(value.getMinutes());
    value && setSec(value.getSeconds());

    value &&
      setSelectedDate(
        `${year && year}-${month && month}-${
          day && day
        }T${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`
      );
  };
  const navigation = useNavigation();
  const showToast1 = () => {
    ToastAndroid.show(
      "merci de selecter la date et l'heure de trajet",
      ToastAndroid.LONG
    );
  };
  const navigateToHome = async () => {
    setIsFecthing(true)
    const data = new FormData();
    data.append("driver", user.id);
    data.append("start_time", selectedDate);
    data.append("places", places);
 
    data.append("starting_point", depart.mat);
    data.append("destination", destination.mat);
    data.append("active", true);
    const d = await CreateTrajet(data, dispatch);
    setIsFecthing(false)
    if(d){
    navigation.navigate("Home");
    SchedulePushNotification(hour, min, day, month, d, user);
    scheduleArriveNotification(hour, min, day, month, d, distance, user);
}
 
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
          <Icons size={25} name="arrow-left" color={mainColor} />
        </TouchableOpacity>
        <View style={{ width: "60%", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
            Date et heure
          </Text>
        </View>
      </View>

      <View>
        <View style={styles.center}>
          <Text style={{ textAlign: "center" }}>{date}</Text>

          <TouchableOpacity
            onPress={showPicker1}
            style={{ paddingVertical: 10, paddingHorizontal: 20 }}
          >
            <Text style={{ color: mainColor, textAlign: "center" }}>
              Selecter la date
            </Text>
          </TouchableOpacity>

          {isPickerShow1 && (
            <DateTimePicker
              value={new Date(Date.now())}
              mode={"date"}
              is24Hour={true}
              onChange={onChange1}
              style={styles.datePicker}
              minimumDate={new Date(Date.now())}
            />
          )}
          <Text style={{ textAlign: "center" }}>{heure}</Text>

          <TouchableOpacity
            onPress={showPicker2}
            style={{ paddingVertical: 10, paddingHorizontal: 20 }}
          >
            <Text style={{ color: mainColor, textAlign: "center" }}>
              Selecter l'heure
            </Text>
          </TouchableOpacity>

          {isPickerShow2 && (
            <DateTimePicker
              value={new Date(Date.now())}
              mode={"time"}
              is24Hour={true}
              onChange={onChange2}
              style={styles.datePicker}
              minimumDate={new Date(Date.now())}
            />
          )}

          <TouchableOpacity
            onPress={() =>
              
              user && user.sex === "femme"
                ? date && heure
                  ? navigation.navigate("creerTrajet4", {
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
                    })
                  : showToast1()
                :!isFetching&& user.sex === "homme" && date && heure
                ? navigateToHome()
                : showToast1()
            }
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
            <Text style={{ color: "white" }}>
      {              user && user.sex === "homme"
                ? "Terminer"
                : user && user.sex === "femme" && "Suivant"}
            </Text>}
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

  datePicker: {
    width: 320,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
