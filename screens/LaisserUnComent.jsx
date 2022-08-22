import React, { useState, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import { CreateComent } from "../ApiCalls";
import Entrypo from "react-native-vector-icons/Entypo";
import { AuthContext } from "../contexts/AuthContext";
import firebase from "firebase";
export default function LisserUnComent() {
  const { user } = useContext(AuthContext);
  const [star, setStar] = useState(0);
  const [content, setContent] = useState();
  const [currentChauffeur, setCurrentChauffeur] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [isFetching1, setIsFetching1] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { trajetId } = route.params;
  const handleValider = async () => {
    if (user && content && star) {
      setIsFetching1(true);
      const data = new FormData();
      data.append("client", user.id);
      data.append("driver", currentChauffeur.id);
      data.append("star", star.toString());
      data.append("content", content);
      console.log(user.id, currentChauffeur.id, star, content);
      const c = await CreateComent(data);
      if (c) {
        setIsFetching1(false);
        ToastAndroid.show("votre commentaire a été  crée", ToastAndroid.LONG);
        navigation.navigate("Home");
        firebase
          .database()
          .ref("/notifications")
          .push()
          .set({
            createdDate: new Date(Date.now()),
            notificationType: 1,
            recipientId: currentChauffeur.user,
            senderId: user.id,
            data: "",
          });
        firebase
          .database()
          .ref("NotificationSetting/")
          .child(currentChauffeur.user)
          .update({ read: false });

        firebase
          .database()
          .ref(`users/${currentChauffeur.user}`)
          .on("value", (snapshot) => {
           
            async function sendNotification() {
              const message = snapshot.val()&&{
                to:snapshot.val()&& snapshot.val().getExpoPushToken,
                sound: "default",
                title: `${user.first_name} a laissé un commentaire sur votre profile`,

                data: { type: 1 },
              };

              await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Accept-encoding": "gzip, deflate",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
              });
            }

            snapshot.val() && sendNotification();
          });
      } else {
        setIsFetching1(false);
      }
    }
  };
  const fetchChauffeur = async (id) => {
    try {
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/api/driver/${id}`
      );
      setIsFetching(false);
      setCurrentChauffeur(resp.data);
    } catch (err) {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setIsFetching(true);

    trajetId && fetchChauffeur(trajetId.driver);;
  }, [trajetId]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate("notification");
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);
  return isFetching ? (
    <ActivityIndicator
      animating={isFetching}
      color={mainColor}
      size={60}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 100,
      }}
    />
  ) : (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={{ width: "100%", alignItems: "flex-end" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={{ color: mainColor }}>Ignorer</Text>
        </TouchableOpacity>
      </View>
      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              height: Dimensions.get("window").height * 0.8,
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                height: "50%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 25 }}>
                Noter le chauffeur
              </Text>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: mainColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                >
                  {currentChauffeur &&
                    currentChauffeur.first_name[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 20 }}>
                  {currentChauffeur &&
                    currentChauffeur.first_name +
                      " " +
                      currentChauffeur.last_name}{" "}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <TouchableWithoutFeedback
                    style={{ marginHorizontam: 5 }}
                    onPress={() => setStar(1)}
                  >
                    <Entrypo
                      size={30}
                      name="star"
                      color={star >= 1 ? mainColor : "#C4C4C4"}
                    />
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={{ marginHorizontal: 5 }}
                    onPress={() => setStar(2)}
                  >
                    <Entrypo
                      size={30}
                      name="star"
                      color={star >= 2 ? mainColor : "#C4C4C4"}
                    />
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={{ marginHorizontal: 5 }}
                    onPress={() => setStar(3)}
                  >
                    <Entrypo
                      size={30}
                      name="star"
                      color={star >= 3 ? mainColor : "#C4C4C4"}
                    />
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={{ marginHorizontal: 5 }}
                    onPress={() => setStar(4)}
                  >
                    <Entrypo
                      size={30}
                      name="star"
                      color={star >= 4 ? mainColor : "#C4C4C4"}
                    />
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    style={{ marginHorizontal: 5 }}
                    onPress={() => setStar(5)}
                  >
                    <Entrypo
                      size={30}
                      name="star"
                      color={star >= 5 ? mainColor : "#C4C4C4"}
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
            <TextInput
              value={content}
              onChangeText={(text) => setContent(text)}
              style={styles.input}
              placeholder="Ajouter un comentaire"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleValider()}
            >
              {isFetching1 ? (
                <ActivityIndicator
                  animating={isFetching1}
                  color="white"
                  size={20}
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
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    width: Dimensions.get("window").width * 0.6,
  },
  button: {
    backgroundColor: mainColor,
    minWidth: 150,
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
});
