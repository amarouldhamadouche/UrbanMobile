import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  BackHandler,
  ToastAndroid,
} from "react-native";
import firebase from 'firebase'
import {sendNotification} from '../ApiCalls'
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import axios from "axios";
import Icons from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
export default function AddGuest() {
  const [prenom, setPrenom] = useState();
  const [nom, setNom] = useState();
  const [checkedAge, setCheckedAge] = useState();
  const [checked, setChecked] = useState();
  const navigation = useNavigation();
  const route = useRoute();
  const [isFetching, setIsFetching] = useState(false);
  const { currentUser, trajet,chauffeur } = route.params;
  const sendreq = async (data) => {
    console.log(data);
    try {
     const resp = await axios({
        url: "https://urban-online.herokuapp.com/api/guest/",
        method: "POST",
        transformRequest: (d) => {
          return data;
        },
        data: data,
      });
    await axios.get(`https://urban-online.herokuapp.com/add_guest_to_trip/${resp.data.id}/${trajet.id}/`)
      firebase.database().ref("/notifications").push().set({
        
       // createdAt: await new Date(Date.now()),
        notificationType: 6,
        recipientId: chauffeur.user,
        senderId: currentUser.id,
        data: trajet,
      });
      firebase
        .database()
        .ref("NotificationSetting/")
        .child(chauffeur.user)
        .update({ read: false });

      firebase
        .database()
        .ref(`users/${chauffeur.user}`)
        .once("value", (snapshot) => {
         
          const message = snapshot.val() && {
            to: snapshot.val().getExpoPushToken,
            sound: "default",
            title: `${currentUser.first_name} a réservé une place pour son compagnon sur votre trajets`,

            data: { type: 4, trajet: trajet },
          };

          snapshot.val() && sendNotification(message);
        });

      setIsFetching(false);
      ToastAndroid.show("place bien réservé", ToastAndroid.LONG);
      navigation.navigate("Home");
    } catch (err) {
      setIsFetching(false);
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );
      }
      console.log(err);
    }
  };
  const HandleReservation = async () => {
    if (nom && prenom && currentUser && trajet && checked && checkedAge) {
      if (!(checked === "homme" && trajet.woman_only)) {
        setIsFetching(true);
        const data = new FormData();
        data.append("client", currentUser.id.toString());
      
        data.append("first_name", prenom);
        data.append("last_name", nom);
        data.append("age", checkedAge);
        data.append("sex", checked);
        
        sendreq(data);
      } else {
        ToastAndroid.show(
          "ce trajet est seulement pour les femmes",
          ToastAndroid.LONG
        );
      }
    } else {
      ToastAndroid.show("Merci de remplir ses informations", ToastAndroid.LONG);
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
  }, []);
  return (
    <View style={styles.conatainer}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
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
          Réserver à un invité
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
      <ScrollView keyboardShouldPersistTaps="always"  showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={{
              height: Dimensions.get("window").height * 0.8,
              alignItems: "center",
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: 10,
              justifyContent: "space-between",
            }}
          >
            <View style={styles.inputsContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  value={prenom}
                  placeholder="Son prenom"
                  style={styles.input}
                  onChangeText={(text) => setPrenom(text)}
                />
                <Icons size={25} color={mainColor} name="user" />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  value={nom}
                  placeholder="Son nom"
                  style={styles.input}
                  onChangeText={(text) => setNom(text)}
                />
                <Icons size={25} color={mainColor} name="user" />
              </View>
              <View style={styles.gender}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Son genre
                </Text>
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
                      <FontAwesome
                        size={25}
                        color={checked === "homme" ? "blue" : "black"}
                        name="male"
                      />
                    </View>

                    <Text
                      style={
                        checked === "homme"
                          ? { color: "blue" }
                          : { color: "black" }
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
                      <FontAwesome
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
              <View style={styles.gender}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Son age
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setCheckedAge("1")}
                    style={{
                      width: Dimensions.get("window").width * 0.17,
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
                        checkedAge === "1"
                          ? { color: "blue" }
                          : { color: "black" }
                      }
                    >
                      18 - 25
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCheckedAge("2")}
                    style={{
                      width: Dimensions.get("window").width * 0.17,
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
                        checkedAge === "2"
                          ? { color: "blue" }
                          : { color: "black" }
                      }
                    >
                      26 - 40
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCheckedAge("3")}
                    style={{
                      width: Dimensions.get("window").width * 0.17,
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
                        checkedAge === "3"
                          ? { color: "blue" }
                          : { color: "black" }
                      }
                    >
                      +40
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={{
                height: 35,
                width: Dimensions.get("window").width * 0.4,
                backgroundColor: mainColor,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
              onPress={() =>!isFetching&& HandleReservation()}
            >
              {isFetching ? (
                <ActivityIndicator
                  animating={isFetching}
                  color='white'
                  size={25}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                  }}
                />
              ):(
              <Text style={{ color: "white" }}>Réserver</Text>
            )}</TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  conatainer: {
    paddingHorizontal: 5,
    paddingTop: 10,
    flex: 1,
    backgroundColor: "white",
  },
  inputsContainer: {
    width: "100%",
    alignItems: "center",

    height: "80%",
    justifyContent: "space-between",
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
  gender: {
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
