import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  FlatList,
  StatusBar,
  BackHandler,
} from "react-native";
import axios from "axios";
import ContentLoader from "react-native-easy-content-loader";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import { wilaya } from "../assets/dummyData";
import Icon from "react-native-vector-icons/FontAwesome";
import TrajetDetail from "../components/TrajetDetail";
import { AuthContext } from "../contexts/AuthContext";

export default function TrajetsDetail() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [currentTrajets, setCurrentTrajets] = useState();

  const route = useRoute();
  const [isFetching, setIsFetching] = useState(false);
  const { depart, destination, t, arriver } = route.params;
  const [currentDepart, setCurrentDepart] = useState();
  const [currentDestination, setCurrentDestination] = useState();
  const renderItem = ({ item }) =>
    !(item.woman_only && user && user.sex === "homme") &&
    new Date(item.start_time) > new Date(Date.now()) &&
    item.active && (
      <TrajetDetail key={item.id} trajet={item} currentUser={user} />
    );
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
  const fetchTrips = async () => {
    setIsFetching(true);
    try {
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/trips_by_wilaya/${depart.mat}/${destination.mat}/`
      );
      const d = resp.data.filter((da)=>user&& user.sex==='homme'? new Date(da.start_time) > new Date(Date.now()).setHours(new Date(Date.now()).getHours()+1)&&!(da.woman_only):new Date(da.start_time) > new Date(Date.now()).setHours(new Date(Date.now()).getHours()+1))
      setCurrentTrajets(d);
     
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
    if (depart && destination && !t) {
      setCurrentDepart(depart);
      setCurrentDestination(destination);
      fetchTrips();
    }
  }, [depart, destination]);
  const fetchT = async () => {
    try {
      setIsFetching(true);
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/api/trips/${t}/`
      );

      const resp2 = wilaya.find((w) => w.mat === resp.data.starting_point);
      const resp1 = wilaya.find((w) => w.mat === resp.data.destination);
      setCurrentDepart(resp2);
      setCurrentDestination(resp1);

      setCurrentTrajets(resp.data);
      setIsFetching(false);
    } catch (err) {
     
      if (err.message === "Request failed with status code 404") {
        try{
          const resp3 = await axios.get(
            `https://urban-online.herokuapp.com/api/disactive/trips/${t}`
          );
    
          const resp5 = wilaya.find((w) => w.mat === resp3.data.starting_point);
          const resp4 = wilaya.find((w) => w.mat === resp3.data.destination);
          setCurrentDepart(resp5);
          setCurrentDestination(resp4);
    
          setCurrentTrajets(resp3.data);
          setIsFetching(false);
        }catch(err){if (err.message === "Request failed with status code 404") {
          setCurrentTrajets({});
          setIsFetching(false);
        }
      }
      }else  if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );}
    }
  };
  useEffect(() => {
    if (t) {
      fetchT();
    }
  }, [t]);

  function navigateToLogin() {
    navigation.navigate("second", { passager: true, chauffeur: false });
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden={false} backgroundColor="white" translucent={true} />
      {currentDestination && currentDepart && (
        <MapView
        provider = {PROVIDER_GOOGLE}
          initialRegion={{
            latitude:
              (currentDestination.latitude + currentDepart.latitude) / 2 + 1,
            longitude: 1.396,
            latitudeDelta:
              Math.abs(currentDepart.latitude - currentDestination.latitude) +
              4,
            longitudeDelta: 5.321,
          }}
          style={{
         
            height: Dimensions.get("window").height * 0.15,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentDepart.latitude,
              longitude: currentDepart.longitude,
            }}
            style={{ alignItems: "center" }}
          >
            <Text style={{ fontSize: 7 }}>
              {currentDepart && currentDepart.name}
            </Text>
            <Icon size={15} color={mainColor} name="map-marker" />
          </Marker>

          <Marker
            coordinate={{
              latitude: currentDestination.latitude,
              longitude: currentDestination.longitude,
            }}
            style={{ alignItems: "center" }}
          >
            <Text style={{ fontSize: 7 }}>
              {currentDestination && currentDestination.name}
            </Text>
            <Icon size={15} color={mainColor} name="map-marker" />
          </Marker>

          <Polyline
            coordinates={[
              {
                latitude: currentDepart.latitude,
                longitude: currentDepart.longitude,
              },
              {
                latitude: currentDestination.latitude,
                longitude: currentDestination.longitude,
              },
            ]}
            strokeColor={mainColor}
            strokeColors={[mainColor]}
            strokeWidth={3}
          />
        </MapView>
      )}

      <View style={styles.top}>
        <Text style={{ color: mainColor, fontWeight: "bold", fontSize: 25 }}>
          UrbanMobile
        </Text>
        {!user && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigateToLogin()}
          >
            <Text style={{ color: "white" }}>Connexion</Text>
          </TouchableOpacity>
        )}
      </View>
      {isFetching ? (
        <View
          style={{
            justifyContent: t && "center",
            height: Dimensions.get("window").height * 0.7,
          }}
        >
          <ContentLoader
            active
            pRows={1}
            pHeight={200}
            pWidth="100%"
            loading={true}
          />
          {!t && (
            <ContentLoader
              active
              pRows={1}
              pHeight={200}
              pWidth="100%"
              loading={true}
            />
          )}
          {!t && (
            <ContentLoader
              active
              pRows={1}
              pHeight={200}
              pWidth="100%"
              loading={true}
            />
          )}
          {!t && (
            <ContentLoader
              active
              pRows={1}
              pHeight={200}
              pWidth="100%"
              loading={true}
            />
          )}
          {!t && (
            <ContentLoader
              active
              pRows={1}
              pHeight={200}
              pWidth="100%"
              loading={true}
            />
          )}
        </View>
      ) : currentTrajets && Object.keys(currentTrajets).length === 0 && !t ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: Dimensions.get("window").height * 0.7,
          }}
        >
          <Text style={{ color: "#C4C4C4" }}>Y'a aucun trajet</Text>
        </View>
      ) : currentTrajets && depart && destination ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 10 }}
          style={{
            paddingHorizontal: 10,
            marginBottom: 0,
            paddingTop: 10,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          data={currentTrajets.sort((a,b)=>{
            return new Date(a.start_time) - new Date(b.start_time)})}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : currentTrajets && Object.keys(currentTrajets).length > 0 ? (
        t && (
          <View
            style={{
              paddingHorizontal: 10,
              height: Dimensions.get("window").height * 0.6,
              justifyContent: "center",
            }}
          >
            <TrajetDetail
              key={currentTrajets.id}
              trajet={currentTrajets}
              currentUser={user}
              arriver={arriver}
            />
          </View>
        )
      ) : (
        currentTrajets &&
        t &&
        Object.keys(currentTrajets).length === 0 && (
          <View
            style={{
              paddingHorizontal: 10,
              height: Dimensions.get("window").height * 0.8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#C4C4C4" }}>le trajet a été supprimé</Text>
          </View>
        )
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  top: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {},
  gender: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  button: {
    width: Dimensions.get("window").width * 0.27,
    height: Dimensions.get("window").height * 0.05,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: mainColor,
    borderRadius: 50,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 3,
  },
  TrajetDetail: {
    backgroundColor: "#C4C4C4",
    width: "100%",
    height: Dimensions.get("window").height * 0.4,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "black",
    marginVertical: 5,
  },
});
