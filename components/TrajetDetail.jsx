import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Image,
} from "react-native";
import { SchedulePushNotification } from "../ApiCalls";
import { sendNotification } from "../ApiCalls";
import * as Notifications from "expo-notifications";
import firebase from "firebase";
import moment from "moment";
import Feather from "react-native-vector-icons/Feather";
import ContentLoader from "react-native-easy-content-loader";

import Age from "./Age";
import Gender from "./Gender";
import { useNavigation } from "@react-navigation/native";
import { mainColor } from "../screens/mainColor";
import { Logo } from "../assets/dummyData";
import axios from "axios";
import Dialog from "react-native-dialog";
export default function TrajetDetail({ trajet, currentUser, arriver }) {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [currentChauffeur, setChauffeur] = useState();
  const [img, setImg] = useState();
  const [currentPassager, setCurrentPassager] = useState([]);
  const [nonDuplicateAge, setNonDuplicateAge] = useState();
  const [nonDuplicateGender, setNonDuplicateGender] = useState();
  const [currentClient, setCurrentClient] = useState();

  const showDialog = () => {
    setVisible(true);
  };
  const showDialog1 = () => {
    setVisible1(true);
  };
  const showDialog2 = () => {
    setVisible2(true);
  };
  var today = new Date();
  const [age, setAge] = useState();
  const [isBottom, setIsBottom] = useState(false);
  const [date, setDate] = useState();
  const [hour, setHour] = useState();
  const [isFetching, setIsFecthing] = useState(false);
  const [scheduleDate, setSheduleDate] = useState();
  const calculateAge = () => {
    const dateNaissance = new Date(currentChauffeur.age);
    setAge(today.getFullYear() - dateNaissance.getFullYear());
  };
  useEffect(() => {
    if (currentChauffeur) {
      const resp = Logo.find((l) => l.logo === currentChauffeur.car_brand);
      setImg(resp.img);
    }
  }, [currentChauffeur]);
  const fetch = async () => {
    try {
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/api/driver/${trajet.driver}`
      );
      setChauffeur(resp.data);
    } catch (err) {}
  };
  const fetchClient = async (i) => {
    try {
      if (trajet.client.length > 0) {
        const resp = await axios.get(
          `https://urban-online.herokuapp.com/api/client/${trajet.client[i]}`
        );
        return resp.data;
      }
    } catch (err) {
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );
      }
    }
  };

  useEffect(() => {
    fetch();

    const d = new Date(trajet.start_time);
    setSheduleDate(d);
    const dd =
      moment(d).format("HH") == "00"
        ? moment(d).subtract(1, "days").format("DD/MM/YYYY")
        : moment(d).format("DD/MM/YYYY");

    setDate(dd);

    const h =
      moment(d).format("HH") == "00"
        ? `23:${moment(d).format("mm")}`
        : `${moment(d).format("HH") - 1}:${moment(d).format("mm")}`;
    setHour(h);
    console.log("hour", d.getMonth());
  }, [trajet]);
  const fetchResp = async (l) => {
    let resp = trajet.guest && trajet.guest
    l !== 0 && setIsFecthing(true);
    for (let i = 0; i < l; i++) {
      const d = await fetchClient(i);
      if (d) {
        resp = [...resp, d];
      }
      if (i + 1 === l) {
        setIsFecthing(false);
        break;
      }
    }

    setCurrentPassager(resp);

    setCurrentClient(resp.filter((r)=>r.user));
     return resp;
  };
  useEffect(() => {
   
    const l = trajet.client && trajet.client.length;

    trajet.client && fetchResp(l);
  }, [trajet.client]);
  useEffect(() => {
    if (currentPassager.length > 0) {
      setNonDuplicateAge(
        currentPassager.filter(
          (value, index, self) =>
            index === self.findIndex((p) => p.age === value.age)
        )
      );
      setNonDuplicateGender(
        currentPassager.filter(
          (value, index, self) =>
            index === self.findIndex((p) => p.sex === value.sex)
        )
      );
    }
  }, [currentPassager]);
  useEffect(() => {
    currentChauffeur && calculateAge();
  }, [currentChauffeur]);
  const showToast1 = () => {
    ToastAndroid.show("Y'a aucune place desponible", ToastAndroid.LONG);
  };
  const showToast2 = () => {
    ToastAndroid.show(`Y'a que ${places} places desponible`, ToastAndroid.LONG);
  };
  const showToast3 = () => {
    ToastAndroid.show(` places bien réservé`, ToastAndroid.LONG);
  };
  const showToast4 = () => {
    ToastAndroid.show("réservation a été annulé", ToastAndroid.LONG);
  };
  const showToast5 = () => {
    ToastAndroid.show("trajet a été annulé", ToastAndroid.LONG);
  };
  const handleArriver = async () => {
    
    const data = new FormData();
    data.append("active", false);
    try{
      firebase
      .database()
      .ref(`scheduleNotificationsId/arriver${trajet.id}`)
      .once("value",async (snapshot) => {
        snapshot.val() &&
         await Notifications.cancelScheduledNotificationAsync(snapshot.val().id);
      });
    navigation.navigate('Home')
     handleUpdate(data)

   let i = 0;
   while(i<currentClient.length){
    firebase.database().ref("/notifications").push().set({
      notificationType: 9,
      recipientId: currentClient[i].user,
      senderId: currentUser.id,
      data: trajet,
    });
    firebase
      .database()
      .ref("NotificationSetting/")
      .child(currentClient[i].user)
      .update({ read: false });

    firebase
      .database()
      .ref(`users/${currentClient[i].user}`)
      .once("value", (snapshot) => {
       
        const message = snapshot.val() && {
          to: snapshot.val().getExpoPushToken,
          sound: "default",
          title: `vous pouvez  laisser un commentair sur le profile  de ${currentUser.first_name}  `,

          data: { type: 9, trajet: trajet },
        };

        snapshot.val() && sendNotification(message);
      });
      i=i+1
   }
    
  }catch(err){
    if (err.message === "Network Error") {
      ToastAndroid.show(
        "verifier votre conexion internet ",
        ToastAndroid.LONG
      );}
  }}
  const handleUpdate =async (data)=>{
   
      try {
        const resp = await axios({
          url: `https://urban-online.herokuapp.com/api/trips/${trajet.id}/`,
  
          method: "PATCH",
          transformRequest: (d) => {
            return data;
          },
          data: data,
        });
  }catch(err){}}
  const places =
    currentUser && currentUser.car_brand
      ? trajet.client && trajet.guest
        ? Object.keys(trajet.client).length + Object.keys(trajet.guest).length
        : trajet.client && Object.keys(trajet.client).length
      : trajet.client && trajet.guest
      ? trajet.places -
        (Object.keys(trajet.client).length + Object.keys(trajet.guest).length)
      : trajet.client && trajet.client.length;
  const handleReservation = async () => {
    try {
      await axios.get(
        `https://urban-online.herokuapp.com/add_client_to_trip/${currentUser.id}/${trajet.id}/`
      );
      
      showToast3();
      navigation.navigate("Home");
     
      firebase.database().ref("/notifications").push().set({
        notificationType: 4,
        recipientId: currentChauffeur.user,
        senderId: currentUser.id,
        data: trajet,
      });
      firebase
        .database()
        .ref("NotificationSetting/")
        .child(currentChauffeur.user)
        .update({ read: false });

      firebase
        .database()
        .ref(`users/${currentChauffeur.user}`)
        .once("value", (snapshot) => {
        
          const message = snapshot.val() && {
            to: snapshot.val().getExpoPushToken,
            sound: "default",
            title: `${currentUser.first_name} a réservé une place sur votre trajets`,

            data: { type: 4, trajet: trajet },
          };

          snapshot.val() && sendNotification(message);
        });
        var h;
        var min;
        var day;
        var month;
  
        h = scheduleDate.getHours() == 0 ? 23 : scheduleDate.getHours() - 1;
        min = scheduleDate.getMinutes();
        day =
          moment(scheduleDate).format("HH") == "00"
            ? moment(scheduleDate).subtract(1, "days").format("DD").toInt()
            : scheduleDate.getDate();
  
        month =
          moment(scheduleDate).format("HH") == "00"
            ? moment(scheduleDate).subtract(1, "days").format("MM").toInt() + 1
            : scheduleDate.getMonth() + 1;
  
        h &&
          min &&
          day &&
          month &&
         await SchedulePushNotification(h, min, day, month, trajet, currentUser);

 return true;
    } catch (err) {
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );
      }
      return false;
    }
  };

  const navigateToHome = async () => {
     handleReservation();
    
  };
  const HandleDelete = async () => {
    try {
      await axios.get(
        `https://urban-online.herokuapp.com/remove_client_from_trip/${currentUser.id}/${trajet.id}/`
      );
      firebase
      .database()
      .ref(`scheduleNotificationsId/reveille${currentUser.user}${trajet.id}`)
      .once("value", async(snapshot) => {
        snapshot.val()? console.log('deleted ',snapshot.val()):console.log('dffd')
        snapshot.val() &&
         await Notifications.cancelScheduledNotificationAsync(snapshot.val().id);
      });
      navigation.navigate("Home");
      setVisible1(false);
      showToast4();

      firebase.database().ref("/notifications").push().set({
        notificationType: 5,
        recipientId: currentChauffeur.user,
        senderId: currentUser.id,
        data: trajet,
      });
      firebase
        .database()
        .ref("NotificationSetting/")
        .child(currentChauffeur.user)
        .update({ read: false });

      firebase
        .database()
        .ref(`users/${currentChauffeur.user}`)
        .once("value", (snapshot) => {
         
          const message = snapshot.val() && {
            to: snapshot.val().getExpoPushToken,
            sound: "default",
            title: `${currentUser.first_name} a annulé la réservation  sur votre trajets`,

            data: { type: 5, trajet: trajet },
          };

          snapshot.val() && sendNotification(message);
        });

    
    } catch (err) {
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );
      }
    }
  };

  const HandleDeleteTrajet = async () => {
    setVisible2(false);

    try {
      await axios.delete(
        `https://urban-online.herokuapp.com/api/trips/${trajet.id}/`
      );

    
      showToast5();
      firebase
        .database()
        .ref(`scheduleNotificationsId/reveille${trajet.id}`)
        .once("value",async (snapshot) => {
        
           
          snapshot.val() &&
           await Notifications.cancelScheduledNotificationAsync(snapshot.val().id);
        });
      firebase
        .database()
        .ref(`scheduleNotificationsId/arriver${trajet.id}`)
        .once("value",async (snapshot) => {
          snapshot.val() &&
           await Notifications.cancelScheduledNotificationAsync(snapshot.val().id);
        });
        navigation.navigate("Home");
      let l = Object.keys(currentClient).length - 1;
      let i = 0;

      while (i <= l) {
        firebase.database().ref("/notifications").push().set({
          notificationType: 2,
          recipientId: currentClient[i].user,
          senderId: currentUser.id,
          data: trajet,
        });
        firebase
          .database()
          .ref("NotificationSetting/")
          .child(currentClient[i].user)
          .update({ read: false });

        firebase
          .database()
          .ref(`users/${currentClient[i].user}`)
          .once("value", (snapshot) => {
           
             
            const message = snapshot.val() && {
              to: snapshot.val().getExpoPushToken,
              sound: "default",
              title: `votre trajet a été annulé`,

              data: { type: 2, trajet: trajet },
            };

            snapshot.val() && sendNotification(message);
          });
        i = i + 1;
      }
    } catch (err) {
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );
      }
    }
  };

  return isFetching ? (
    <ContentLoader active pRows={1} pHeight={200} pWidth="100%" />
  ) : (
    <View style={styles.TrajetDetail}>
      <View style={styles.top}>
        <View style={styles.topTop}>
          <Image
            style={{ width: 40, height: 40 }}
            source={{
              uri: img && img,
            }}
            alt=""
          />
          <View
            style={{
              flexDirection: "row",
              width: "50%",
              justifyContent: "space-around",
            }}
          >
            <Text>{currentChauffeur && currentChauffeur.car_type}</Text>
            <Text>{currentChauffeur && currentChauffeur.car_year}</Text>
          </View>
          <Text style={{ fontWeight: "bold" }}>{trajet.price&&Math.round(trajet.price/ trajet.places)} DA </Text>
        </View>
        <View style={styles.topBottom}>
          <View
            style={{
              flexDirection: "row",

              justifyContent: "space-around",
            }}
          >
            <Text>{date && date} </Text>
            <Text>{hour && hour} </Text>
          </View>
          <Text>
            {currentUser && currentUser.car_brand
              ? `${places} places réservé`
              : `${places}/${trajet.places} places disponibles`}
          </Text>
        </View>
      </View>
      {trajet.client && trajet.client.length > 0 && (
        <View style={styles.center}>
          <Text>Passagers</Text>
          <View
            style={{
              height: "85%",

              justifyContent: "space-around",
              paddingHorizontal: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", marginRight: 5 }}>Age</Text>
              {nonDuplicateAge &&
                nonDuplicateAge.map((p) => <Age key={p.id} age={p.age} />)}
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", marginRight: 5 }}>Genre</Text>
              {nonDuplicateGender &&
                nonDuplicateGender.map((p) => (
                  <Gender key={p.id} gender={p.sex} />
                ))}
            </View>
          </View>
        </View>
      )}

      <View style={styles.bottom}>
        <Text>Chauffeur</Text>
        <View style={{ paddingLeft: 10 }}>
          <TouchableOpacity
            onPress={() =>
              currentUser &&
              navigation.navigate("Avis et notes", {
                chauffeur: currentChauffeur.id,
              })
            }
          >
            <Text style={{ fontWeight: "bold" }}>
              {currentChauffeur &&
                currentChauffeur.first_name + " " + currentChauffeur.last_name}
            </Text>
          </TouchableOpacity>
          <Text>{age && "Age" + " " + age} </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: currentUser && !currentUser.car_brand ? 30 : 0,
        }}
      >
        {currentUser && trajet.active !== 0 && (
          <View
            style={{
              width: currentUser && currentUser.car_brand ? "100%" : "90%",
              alignItems: "center",
            }}
          >
            {!currentUser.car_brand &&
            trajet.client &&
            trajet.client.indexOf(currentUser.id) !== -1 && !(new Date(Date.now()).setHours(new Date(Date.now()).getHours()+1)  > new Date(trajet.start_time)) ? (
              <TouchableOpacity
                onPress={() => showDialog1()}
                style={styles.actifButton}
              >
                <Text style={{ color: "white" }}>Annuler la réservation</Text>
              </TouchableOpacity>
            ) : (
              !currentUser.car_brand &&!(new Date(Date.now()).setHours(new Date(Date.now()).getHours()+1)  > new Date(trajet.start_time)) &&(
                <TouchableOpacity
                  onPress={() => (places > 0 ? navigateToHome() : showToast1())}
                  style={
                    places > 0 ? styles.actifButton : styles.disactifButton
                  }
                >
                  <Text style={{ color: "white" }}>Réserver</Text>
                </TouchableOpacity>
              )
            )}
            {currentUser.car_brand &&
              trajet.driver === currentUser.id &&
              (arriver && trajet.active==true ? (
                <TouchableOpacity
                  style={[styles.actifButton, { marginLeft: 5 }]}
                  onPress={() => {
                    handleArriver();
                  }}
                >
                  <Text style={{ color: "white" }}>Arriver a destination</Text>
                </TouchableOpacity>
              ) :!(new Date(Date.now()).setHours(new Date(Date.now()).getHours()+1) > new Date(trajet.start_time))&& (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    style={[styles.actifButton, { marginLeft: 5 }]}
                    onPress={() =>
                      navigation.navigate("modifierTrajet", {
                        trajet,
                        currentClient,
                      })
                    }
                  >
                    <Text style={{ color: "white" }}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actifButton, { marginLeft: 5 }]}
                    onPress={showDialog2}
                  >
                    <Text style={{ color: "white" }}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}
        {currentUser && !currentUser.car_brand&&trajet.client &&
            trajet.client.indexOf(currentUser.id) !== -1 &&!(new Date(Date.now()).setHours(new Date(Date.now()).getHours()+1) > new Date(trajet.start_time)) &&(
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 25,
            }}
            onPress={() => setIsBottom(!isBottom)}
          >
            <Feather
              style={{ transform: [{ rotate: isBottom ? "-90deg" : "90deg" }] }}
              size={20}
              name="chevron-right"
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
      {isBottom && (
        <View style={{ width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            style={places > 0 ? styles.actifButton : styles.disactifButton}
            onPress={() =>
              places > 0
                ? navigation.navigate("Add guest", {
                    currentUser: currentUser,
                    trajet,
                    chauffeur: currentChauffeur,
                  })
                : showToast1()
            }
          >
            <Text style={{ color: "white" }}>Réserver à un invité</Text>
          </TouchableOpacity>
        </View>
      )}
     
     
      <Dialog.Container visible={visible1}>
        <Dialog.Description>
          Voulez vous vraiment annuler la réservation ?
        </Dialog.Description>

        <Dialog.Button
          color={mainColor}
          label="oui"
          onPress={() => HandleDelete()}
        />
        <Dialog.Button
          color="black"
          label="Annuler"
          onPress={() => setVisible1(false)}
        />
      </Dialog.Container>
      <Dialog.Container visible={visible2}>
        <Dialog.Description>
          Voulez-vous vraiment annuler votre trajet ?
        </Dialog.Description>

        <Dialog.Button
          color={mainColor}
          label="oui"
          onPress={() => HandleDeleteTrajet()}
        />
        <Dialog.Button
          color="black"
          label="Annuler"
          onPress={() => setVisible2(false)}
        />
      </Dialog.Container>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Dimensions.get("window").height * 0.1,
    paddingHorizontal: 10,
  },
  top: {},
  center: {},
  gender: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  actifButton: {
    backgroundColor: mainColor,
    paddingHorizontal: 5,
    width: Dimensions.get("window").width * 0.4,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "black",
    marginTop: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderRadius: 50,
  },
  disactifButton: {
    width: Dimensions.get("window").width * 0.4,
    backgroundColor: "#DCDCDC",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    elevation: 1,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    borderRadius: 50,
  },

  TrajetDetail: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    width: "100%",

    borderRadius: 15,

    marginVertical: 5,
  },
  top: {
    height: Dimensions.get("window").height * 0.15,
  },
  topTop: {
    height: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    height: Dimensions.get("window").height * 0.15,
    backgroundColor: "white",
    marginVertical: 10,
    borderRadius: 15,
 padding: 5,
  },
  bottom: {
    marginTop: 15,
  },
});
