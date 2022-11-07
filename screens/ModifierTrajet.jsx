import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Picker,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ToastAndroid,
  StatusBar,
  ScrollView,
  Keyboard,
  BackHandler,
  ActivityIndicator,
} from "react-native";

import * as Notifications from "expo-notifications";
import {
  SchedulePushNotification,
  scheduleArriveNotification,
} from "../ApiCalls";
import getDistance from "geolib/es/getDistance";
import { AuthContext } from "../contexts/AuthContext";
import firebase from "firebase";
import axios from "axios";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { mainColor } from "./mainColor";
import Icons from "react-native-vector-icons/Feather";
import { wilaya } from "../assets/dummyData";
export default function ModifierLeTrajet() {
  const [isPickerShow1, setIsPickerShow1] = useState(false);
  const [isPickerShow2, setIsPickerShow2] = useState(false);
  const [places, setPlaces] = useState();
  const [year, setYear] = useState();
  const [place, setPlace] = useState(["1", "2", "3", "4", "5", "6", "7"]);
  const [month, setMonth] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [day, setDay] = useState();
  const [min, setMin] = useState();
  const [sec, setSec] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const { trajet, currentClient } = route.params;
  const [date, setDate] = useState(trajet.date);
  const [hour, setHour] = useState(trajet.heure);
  const [heure, setHeure] = useState();
  const [schedulrHour, setScheduleHour] = useState();
  const [scheduleMin, setScheduleMin] = useState();
  const [scheduleMonth, setScheduleMonth] = useState();
  const [scheduleDay, setScheduleDay] = useState();
  const { user } = useContext(AuthContext);
  const [oldDate, setOldDate] = useState();
  const [oldPlace, setOldPlace] = useState();
  const [price, setPrice] = useState();
  const [depart, setDepart] = useState();
  const [destination, setDestination] = useState();
  const [distance, setDistance] = useState();
  const [x, setX] = useState();
  const showPicker1 = () => {
    setIsPickerShow1(true);
  };

  useEffect(() => {
    if (depart && destination) {
      const dis = getDistance(
        { latitude: depart.latitude, longitude: depart.longitude },
        { latitude: destination.latitude, longitude: destination.longitude }
      );
      setDistance(dis);
      const rt = (dis / 5000) * 45;
      setX(rt);
      const y = Math.round(rt / places);

      setPrice(y);
    }
    console.log(trajet);
  }, [depart, destination]);

  useEffect(() => {
    const resp = wilaya.find((w) => w.mat === trajet.starting_point);
    setDepart(resp);
    const resp1 = wilaya.find((w) => w.mat === trajet.destination);
    setDestination(resp1);
  }, [trajet]);
  const onChange1 = (event, value) => {
    setIsPickerShow1(false);

    value && setDate(moment(value).format("DD/MM/YYYY"));

    value && setYear(value.getFullYear());
    value && setMonth(value.getMonth() + 1);
    value && setDay(value.getDate());
    value && setScheduleDay(value.getDate());
    value && setScheduleMonth(value.getMonth() + 1);
    value &&
      setSelectedDate(
        `${value.getFullYear()}-${value.getMonth() + 1}-${moment(value).format(
          "DD"
        )}T${hour && hour}:${min && min}:${sec && sec}`
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
    value && setScheduleHour(value.getHours());
    value && setScheduleMin(value.getMinutes());
    value &&
      setSelectedDate(
        `${year && year}-${month && month}-${
          day && day
        }T${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`
      );
  };

  const showToast1 = () => {
    ToastAndroid.show("trajet a été modifié", ToastAndroid.LONG);
  };
  const handleUpdate = async (data) => {
    try {
      const resp = await axios({
        url: `https://urban-online.herokuapp.com/api/trips/${trajet.id}/`,

        method: "PATCH",
        transformRequest: (d) => {
          return data;
        },
        data: data,
      });
      setIsFetching(false);
      showToast1();
      
      firebase
      .database()
      .ref(`scheduleNotificationsId/reveille${trajet.id}`)
      .once("value", async(snapshot) => {
        snapshot.val() &&
        await  Notifications.cancelScheduledNotificationAsync(snapshot.val().id);
          SchedulePushNotification(
            schedulrHour,
            scheduleMin,
            scheduleDay,
            scheduleMonth + 1,
            trajet,
            user
          );
        });
   
    firebase
      .database()
      .ref(`scheduleNotificationsId/arriver${trajet.id}`)
      .once("value", async(snapshot) => {
       snapshot.val() &&
       await Notifications.cancelScheduledNotificationAsync(snapshot.val().id);
         
    scheduleArriveNotification(
      schedulrHour,
      scheduleMin,
      scheduleDay,
      scheduleMonth + 1,
      trajet,
      distance,
      user
    ); 
        });
    
     
    } catch (err) {
      setIsFetching(false);
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );}
    }
  };
  async function sendNotification(message) {
    try {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    } catch (err) {
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );}
    }
  }

  const navigationToScreen = async() => {
    if (places && date && heure) {
      setIsFetching(true);
      const data = new FormData();
      data.append("places", places);

      data.append("start_time", selectedDate);
      

       await handleUpdate(data);
      
       let l = currentClient.length - 1;
      
       let i = 0;
      
       while (i <= l) {
       
           firebase.database().ref("/notifications").push().set({
             
             notificationType: 3,
             recipientId: currentClient[i].user,
             senderId: user.id,
             data: trajet,
           });
         console.log("created");
         firebase
           .database()
           .ref("NotificationSetting/")
           .child(currentClient[i].user)
           .update({ read: false });
         firebase
           .database()
           .ref(`users/${currentClient[i].user}`)
           .once("value", (snapshot) => {
            
             const message = {
               to: snapshot.val() && snapshot.val().getExpoPushToken,
               sound: "default",
               title: `votre trajet a été modifié`,
 
               data: { type: 3, trajet: trajet },
             };
 
             snapshot.val() && sendNotification(message);
           });
         i++;
       }
       navigation.navigate("Home"); 
      
    }
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
  useEffect(() => {
    const er = trajet && place.find((p) => p == trajet.places);
    setPlaces(er);
    const ppr = trajet && trajet.client.length + trajet.guest.length;

    if (ppr != 0) {
      setPlace(place.filter((p) => p >= ppr));
    }
    setOldPlace(er);
    setSelectedDate(trajet.start_time);

    setPrice(trajet.price);
    const d = new Date(trajet.start_time);
    setScheduleDay(d.getDate());
    setScheduleMonth(d.getMonth());
    d.getHours() == 0
      ? setScheduleHour(d.getHours()) + 23
      : setScheduleHour(d.getHours() - 1);
    setScheduleMin(d.getMinutes());
    setOldDate(trajet.start_time);

    const ddd =
      moment(d).format("HH") == "00"
        ? moment(d).subtract(1, "days").format("DD")
        : moment(d).format("DD");
    const y =
      moment(d).format("HH") == "00"
        ? moment(d).subtract(1, "days").format("YYYY")
        : moment(d).format("YYYY");
    const mon =
      moment(d).format("HH") == "00"
        ? moment(d).subtract(1, "days").format("MM")
        : moment(d).format("MM");
    const hh = d.getHours() == "00" ? "23" : d.getHours() - 1;

    const min = d.getMinutes();
    const s = d.getSeconds();
    console.log(
      "min",
      d.getMinutes(),
      "hh",
      d.getHours(),
      "m",
      moment(d).format("MM"),
      "D",
      moment(d).format("DD")
    );
    setDay(ddd);
    setYear(y);
    setMonth(mon);
    setHour(hh);
    setMin(min);
    setSec(s);
    const dd = moment(d).subtract(1, "days").format("DD/MM/YYYY");

    setDate(dd);

    const h =
      moment(d).format("HH") == "00"
        ? `23:${moment(d).format("mm")}`
        : `${moment(d).format("HH") - 1}:${moment(d).format("mm")}`;
    setHeure(h);
  }, [trajet]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={"white"}
        barStyle="dark-content"
        hidden={false}
      />
       <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingVertical: 5,
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
          Modifier votre trajet 
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
      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.center}>
            <View style={styles.inputsContainer}>
              <View style={styles.inputContainer}>
                <Text>Nbr des places</Text>
                <Picker
                  mode="dropdown"
                  selectedValue={places}
                  style={{ width: "30%", height: 100 }}
                  onValueChange={(itemValue, itemIndex) => {
                    setPlaces(itemValue);

                    const y = Math.round(x / itemValue);
                    setPrice(y);
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
              <View style={styles.inputContainer}>
                <Text>La date</Text>
                {day && month && year && (
                  <TouchableWithoutFeedback onPress={showPicker1}>
                    <Text
                      style={styles.input}
                    >{`${day}/${month}/${year}`}</Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text>L'heure</Text>
                <TouchableWithoutFeedback onPress={showPicker2}>
                  <Text style={styles.input}>{heure}</Text>
                </TouchableWithoutFeedback>
              </View>
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
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    selectedDate == oldDate && places === oldPlace
                      ? "#DCDCDC"
                      : mainColor,
                },
              ]}
              onPress={() => {
                !isFetching &&
                  !(selectedDate == oldDate && places === oldPlace) &&
                  navigationToScreen();
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
                <Text style={{ color: "white" }}>Valider</Text>
              )}
            </TouchableOpacity>
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
  },
  littleCard: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    zIndex: 10,
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
  bold: {
    fontWeight: "bold",
    fontSize: 25,
    color: "black",
    textAlign: "center",
    marginVertical: 5,
  },
  center: {
    width: "100%",
    height: Dimensions.get("window").height * 0.7,

    alignItems: "center",
    justifyContent: "space-around",
  },
  inputsContainer: {
    height: "60%",
    backgroundColor: "white",
    justifyContent: "space-between",
    width: "80%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  input: {
    width: "40%",
    borderBottomWidth: 1,
    alignItems: "center",
    textAlign: "center",
    padding: 10,
  },
  button: {
    paddingVertical: 10,
    maxHeight: 40,
    minWidth: 100,

    paddingHorizontal: 50,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
