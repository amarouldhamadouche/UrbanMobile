import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, Dimensions,  LogBox } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import PassagerHome from "./PassagerHome";
import { UpdateScheduleNotification } from "../ApiCalls";
import * as Notifications from "expo-notifications";
import { Logout } from "../ApiCalls";
import { AuthContext } from "../contexts/AuthContext";
import firebase from "firebase";
import Dialog from "react-native-dialog";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,

    shouldSetBadge: true,
  }),
});
export default function Menu() {
  const { user, dispatch } = useContext(AuthContext);
  const navigation = useNavigation();
  LogBox.ignoreLogs(["Setting a timer"]);

  const [menu, setMenu] = useState(false);
  const [passager, setPassager] = useState();
  const [visible,setVisible] = useState(false)
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    var isMounted = true;
    user && user.car_brand ? setPassager(0) : setPassager(1);
    return () => {
      isMounted = false;
    };
  }, [user]);


  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
       
        if (
          notification.request.content.data.type === 7 ||
          notification.request.content.data.type === 8
        ) {
          firebase.database().ref("/notifications").push().set({
            notificationType: notification.request.content.data.type,
            recipientId: notification.request.content.data.recipientId,

            data: notification.request.content.data.trajet,
          });
          firebase
            .database()
            .ref("NotificationSetting/")
            .child(notification.request.content.data.recipientId)
            .update({ read: false });
          if (notification.request.content.data.type === 7) {
            user.car_brand
              ? firebase
                  .database()
                  .ref(
                    `scheduleNotificationsId/reveille${notification.request.content.data.trajet.id}`
                  )
                  .once("value", (snapshot) => {
                    snapshot.val() &&
                      Notifications.cancelScheduledNotificationAsync(
                        snapshot.val().id
                      );
                  })
              : firebase
                  .database()
                  .ref(
                    `scheduleNotificationsId/reveille${notification.request.content.data.recipientId}${notification.request.content.data.trajet.id}`
                  )
                  .once("value", (snapshot) => {
                    snapshot.val() &&
                      Notifications.cancelScheduledNotificationAsync(
                        snapshot.val().id
                      );
                  });
          } else if (notification.request.content.data.type === 8) {
            firebase
              .database()
              .ref(
                `scheduleNotificationsId/arriver${notification.request.content.data.trajet.id}`
              )
              .once("value", (snapshot) => {
                snapshot.val() &&
                  Notifications.cancelScheduledNotificationAsync(
                    snapshot.val().id
                  );
              });
          }
        } else if (notification.request.content.data.type === 2) {
          firebase
            .database()
            .ref(
              `scheduleNotificationsId/reveille${user.user}${notification.request.content.data.trajet.id}`
            )
            .once("value", (snapshot) => {
              snapshot.val() &&
                Notifications.cancelScheduledNotificationAsync(
                  snapshot.val().id
                );
            });
        } else if (notification.request.content.data.type === 3) {
          firebase
            .database()
            .ref(
              `scheduleNotificationsId/reveille${user.user}${notification.request.content.data.trajet.id}`
            )
            .once("value",async (snapshot) => {
              snapshot.val() &&
               await Notifications.cancelScheduledNotificationAsync(
                  snapshot.val().id
                );
                
          UpdateScheduleNotification(
            notification.request.content.data.trajet,
            user
          );
            });

        }

      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
     
        if (response.notification.request.content.data.type === 1) {
          navigation.navigate("Avis et notes", {
            chauffeur: user.id,
          });
        } else if (response.notification.request.content.data.type === 2) {
          navigation.navigate("Vos trajets", { currentUser: user });
        } else if (
          response.notification.request.content.data.type === 3 ||
          response.notification.request.content.data.type === 4 ||
          response.notification.request.content.data.type === 5 ||
          response.notification.request.content.data.type === 7
        ) {
          navigation.navigate("trajetsDetail", {
            t: response.notification.request.content.data.trajet.id,
          });
        } else if (response.notification.request.content.data.type === 8) {
          navigation.navigate("trajetsDetail", {
            t: response.notification.request.content.data.trajet.id,
            arriver: true,
          });
        }else if(response.notification.request.content.data.type === 9){
          navigation.navigate("laisser un comment", {
            trajetId: response.notification.request.content.data.trajet,
           
          }); 
        }
      });
   
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  useEffect(() => {
   
    registerForPushNotification();
  }, [user.user]);
  const registerForPushNotification = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      let FinalStatus = status;
      if (FinalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        FinalStatus = status;
      }
    
      if (FinalStatus !== "granted") {
        return;
      }
      let tokenn = await Notifications.getExpoPushTokenAsync();
      
      

      user &&
        (await firebase
          .database()
          .ref("users/")
          .child(user.user)
          .update({ getExpoPushToken: tokenn.data }));
    } catch (err) {
    }
  };
  const handleLogout = ()=>{
    firebase.database().ref('users/').child(user.user).remove()
    Logout(dispatch)
   // navigation.navigate('firstLogin',{passager:user.car_brand?false:true})
  }
  return (
    <View
      style={{
        backgroundColor: mainColor,
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingBottom: 10,
        paddingTop: Dimensions.get("window").height * 0.1,
        flexGrow: 1,
      }}
    >
      {user && (
        <PassagerHome
          menu={menu}
          setMenu={setMenu}
          passager={passager}
        />
      )}
      <View>
        {TabButton(
          user,
          navigation,

        setVisible,
          "Information sur profile"
        )}
        {user &&
          passager === 0 &&
          TabButton(user, navigation,setVisible, "Avis et notes")}
        {TabButton(user, navigation, setVisible, "Vos trajets")}
        {TabButton(
          user,
          navigation,
         setVisible,
          "Localisation d'agence"
        )}
        {TabButton(user, navigation, setVisible, "Cantacter nous")}
        {TabButton(
          user,
          navigation,
        setVisible,
          "Qui sommes nous?"
        )}
      </View>
      <View>
        {TabButton(user, navigation,setVisible, "Deconéxion")}
      </View>
      <Dialog.Container visible={visible}>
        <Dialog.Description>
        Souhaitez-vous vraiment vous déconnecter ?
        </Dialog.Description>

        <Dialog.Button
          color={mainColor}
          label="oui"
          onPress={() => handleLogout()}
        />
        <Dialog.Button
          color="black"
          label="Annuler"
          onPress={() => setVisible(false)}
        />
      </Dialog.Container>
    </View>
  );
}
const TabButton = (user, navigation,setVisible,  title) => {
  return (
    <TouchableOpacity
      onPress={() => {
        
        title === "Deconéxion"
          ? setVisible(true)
          : navigation.navigate(
              title,
              title === "Avis et notes"
                ? {
                    chauffeur: user.id,
                  }
                : { currentUser: user }
            );
      }}
      style={{
        alignItems: "flex-start",
        justifyContent: "center",

        backgroundColor: mainColor,
        paddingHorizontal: 10,
        marginTop: 10,
        marginLeft: 10,

        height: 50,

        borderRadius: 10,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 15,
          color: "white",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
