import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import Icons from "react-native-vector-icons/Feather";
import axios from "axios";
import VosTrajetsItems from "../components/VosTrajetsItems";
import { useNavigation, useRoute } from "@react-navigation/native";

import Svg, { Path } from "react-native-svg";
import { mainColor } from "./mainColor";
import { AuthContext } from "../contexts/AuthContext";
export default function VosTrajets() {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const [isFetching, setIsFetching] = useState();
  const { currentUser } = route.params;

  const [active, setActive] = useState(true);
  const [trajetActif, setTrajetActif] = useState([]);
  const [trajetNonActif, setTrajetNonActif] = useState([]);
  const [currentTrajets, setcurrentTrajets] = useState();
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <VosTrajetsItems key={item.id} currentUser={user} t={item}  active={active} />
  );

  const fetchTrips = async () => {
    try {
      setIsFetching(true);
      const resp = user.car_brand
        ? await axios.get(
            `https://urban-online.herokuapp.com/get_driver_trips/${user.id}`
          )

        : await axios.get(
            `https://urban-online.herokuapp.com/get_client_trips/${user.id}`
          );
    const resp1 =user.car_brand
        ? await axios.get(`https://urban-online.herokuapp.com/disactive/get_driver_trips/${user.id}`)
        :await axios.get(`https://urban-online.herokuapp.com/disactive/get_client_trips/${user.id}`)
    setTrajetNonActif(resp1.data)
      setcurrentTrajets(resp.data);
      setTrajetActif(resp.data)
      
      setIsFetching(false);
    } catch (err) {
      setIsFetching(false);

      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );
      } else {
        ToastAndroid.show("un erreur se produit", ToastAndroid.LONG);
      }
    
    }
  };
  useEffect(() => {
    fetchTrips();
  }, [currentUser]);
 // useEffect(() => {
   // let resp;
   // if (currentTrajets) {
     // resp = currentTrajets.filter((c) =>new Date(c.start_time) > new Date(Date.now()).setHours(new Date(Date.now()).getHours()+1)); 
    //  const resp1 = currentTrajets.filter((c) =>new Date(Date.now()).setHours(new Date(Date.now()).getHours()+1)  > new Date(c.start_time));

      //setTrajetActif(resp);
     // setTrajetNonActif(resp1);
   // }
 // }, [currentTrajets]);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={mainColor} barStyle="dark-content" />
      <Svg
        style={{
          position: "absolute",
          top: -StatusBar.currentHeight * 0.38,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height * 0.14,
          zIndex: 1,
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <Path
          fill={mainColor}
          fill-opacity="1"
          d="M0,128L80,154.7C160,181,320,235,480,213.3C640,192,800,96,960,74.7C1120,53,1280,107,1360,133.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></Path>
      </Svg>
      <TouchableOpacity
        style={[styles.littleCard, { justifyContent: "center" }]}
        onPress={() => navigation.goBack()}
      >
        <Icons size={25} name="arrow-left" color={mainColor} />
      </TouchableOpacity>
      <Text style={styles.bold}>Vos trajets</Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingRight: 10,
          marginVertical: 10,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 5,
            marginLeft: 5,
            backgroundColor: active ? "#C4C4C4" : "white",
            borderRadius: 10,
          }}
          onPress={() => setActive(true)}
        >
          <Text>Trajets en cours</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 5,
            marginLeft: 5,
            backgroundColor: !active ? "#C4C4C4" : "white",
            borderRadius: 10,
          }}
          onPress={() => setActive(false)}
        >
          <Text>Ancien trajets</Text>
        </TouchableOpacity>
      </View>
      {isFetching && (
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
      )}
      {active?
      trajetActif.length>0 ? (
        // <View style={{ paddingBottom: 0 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="always"
          data={trajetActif.sort((a,b)=>{
            return new Date(a.start_time) - new Date(b.start_time)})}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        //  </View>
        !isFetching &&
        currentTrajets && (
          <View
            style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#C4C4C4" }}>Aucun trajet</Text>
          </View>
        )
      )
      :
      trajetNonActif.length>0?(
        // <View style={{ paddingBottom: 0 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="always"
          data={ trajetNonActif.sort((a,b)=>{
            return new Date(b.start_time) - new Date(a.start_time)}) }
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        //  </View>
        !isFetching &&
        currentTrajets && (
          <View
            style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#C4C4C4" }}>Aucun trajet</Text>
          </View>
        )
      )
      }
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
    marginTop: "7%",
    zIndex: 3,
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
    left: 0,
    fontWeight: "bold",
    fontSize: 25,
    color: "black",
    textAlign: "center",
    marginVertical: 5,
  },
});
