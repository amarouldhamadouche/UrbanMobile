import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {  useNavigation } from "@react-navigation/native";
import { Bullets } from "react-native-easy-content-loader";

import { Logo } from "../assets/dummyData";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { mainColor } from "../screens/mainColor";
export default function NotificationItem({ notification }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [senderId, setSenderId] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const [chauffeur, setChauffeur] = useState();
  const [currentLogo, setCurrentLogo] = useState();
  
  const fetchChauffeur = async (driver) => {
    try {
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/api/driver/${driver}`
      );
      setChauffeur(resp.data);
     
      const resp2 = Logo.find((l) => l.logo === resp.data.car_brand);
      setIsFetching(false);
      setCurrentLogo(resp2);
    } catch (err) {
      setIsFetching(false);
     
    }
  };
  async function fetchUser() {
    try {
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/api/client/${notification.senderId}`
      );
      setSenderId(resp.data);
      setIsFetching(false);
    } catch (err) {
      setIsFetching(false);
    }
  }
  useEffect(() => {
    if (
      notification.notificationType === 1 ||
      notification.notificationType === 4 ||
      notification.notificationType === 5 ||
      notification.notificationType === 6
    ) {
      fetchUser();
    } else {
      notification.data.driver && fetchChauffeur(notification.data.driver);
    }
  }, [notification]);
  return isFetching ? (
    <View style={{ paddingTop: 10, paddingLeft: 10 }}>
     
     <Bullets active  containerStyles={{height:50}} />
    </View>
  ) : (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 10,
          width: "100%",
          paddingVertical: 10,

          marginBottom: 10,
        }}
        onPress={() =>
          notification.notificationType === 1
            ? user &&
              navigation.navigate("Avis et notes", { chauffeur: user.id })
            : notification.notificationType === 2
            ? navigation.navigate("Vos trajets", { currentUser: user })
            : (notification.notificationType === 3 ||
                notification.notificationType === 4 ||
                notification.notificationType === 5 ||
                notification.notificationType === 6 ||   
                 notification.notificationType === 7) ?
                 
              navigation.navigate("trajetsDetail", {
                t: notification.data.id,
                
              }):notification.notificationType === 8  ?  navigation.navigate("trajetsDetail", {
                t: notification.data.id,
                arriver:true
                
              }):notification.notificationType === 9&&navigation.navigate('laisser un comment',{
                trajetId:notification.data
              })
        }
      >
        {notification.notificationType === 1 ||
        notification.notificationType === 4 ||
        notification.notificationType === 5||
        notification.notificationType === 6 ? (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: mainColor,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 17 }}>
              {senderId && senderId.first_name[0].toUpperCase()}
            </Text>
          </View>
        ) : (
          (notification.notificationType === 2 ||
            notification.notificationType === 3||
            notification.notificationType === 7 ||
            notification.notificationType === 8||
             notification.notificationType === 9) && (
            <Image
              style={{ width: 40, height: 40, marginRight: 10 }}
              source={{
                uri: currentLogo && currentLogo.img,
              }}
              alt=""
            />
          )
        )}
        <Text style={{ flex: 1, flexWrap: "wrap" }}>
          {notification.notificationType === 1 && senderId
            ? `${senderId.first_name} a laissé un commentaire sur votre profile`
            : notification.notificationType === 2
            ? "votre trajet a été annulé"
            : notification.notificationType === 3
            ? "votre trajet a été modifié"
            : notification.notificationType === 4&& senderId
            ? `${senderId.first_name} a réservé une place sur votre trajet`
            : notification.notificationType === 5 && senderId?
              `${senderId.first_name} a annulé la réservation sur votre trajet`
            : notification.notificationType === 6&& senderId ?
              `${senderId.first_name} a réservé une place pour son compagnon sur votre trajet`
              : notification.notificationType === 7 ?
              'il rest que 15 min pour trajer'
              : notification.notificationType === 8 ?
              "s'il vous plait laisser-nous savoir si vous avez atteint votre destination"
              :notification.notificationType === 9&&`vous pouvez laisser un commentaire sur le profile de ${chauffeur.first_name}`}
              </Text>
      </TouchableOpacity>
    </View>
  );
}
