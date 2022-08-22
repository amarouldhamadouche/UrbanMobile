import React, { useContext, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  BackHandler,
  ToastAndroid,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Comment from "../components/Coment";

import Icons from "react-native-vector-icons/Feather";
import Entrypo from "react-native-vector-icons/Entypo";
import ContentLoader, {
  FacebookLoader,
} from "react-native-easy-content-loader";
import call from "react-native-phone-call";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function AvisEtNotes() {
  const [driver, setDriver] = useState();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );
  }, []);
  const fetchDriver = async () => {
    setIsFetching(true);
    try {
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/api/driver/${chauffeur}`
      );
      setDriver(resp.data);
      setIsFetching(false);
    } catch (err) {
      setIsFetching(false);
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );
      }
    }
  };
  const fetchComents = async () => {
    try {
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/api/comments/${chauffeur}/`
      );
      setCurrentComent(resp.data);
    } catch (err) {
      if (err.message === "Network Error") {
        ToastAndroid.show(
          "verifier votre conexion internet ",
          ToastAndroid.LONG
        );
      }
    }
  };
  const [CurrentComent, setCurrentComent] = useState();
  useEffect(() => {
    chauffeur && fetchComents();
    chauffeur && fetchDriver();
  }, [chauffeur]);
  const route = useRoute();
  const { chauffeur } = route.params;
  const renderItem = ({ item }) => <Comment key={item.id} coment={item} />;
  return (
    <View style={styles.conatainer}>
      <StatusBar hidden={false} backgroundColor="white" />

      <View>
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
          <Text
            style={{
              marginLeft: 20,
              fontWeight: "bold",
              fontSize: 17,
              marginRight: 10,
            }}
          >
            {user && user.car_brand ? (
              "Avis et notes"
            ) : driver ? (
              driver.first_name + " " + driver.last_name
            ) : (
              <ContentLoader active pRows={1} pWidth={70} />
            )}
          </Text>
        </View>
        {user && !user.car_brand && driver && (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              paddingLeft: 50,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "limegreen",
              }}
              onPress={() =>
                driver &&
                call({ number: driver.phone, prompt: false }).catch(
                  console.error
                )
              }
            >
              <Entrypo
                style={{ transform: [{ rotate: "90deg" }] }}
                size={15}
                color="white"
                name="phone"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                driver &&
                call({ number: driver.phone, prompt: false }).catch(
                  console.error
                )
              }
            >
              <Text style={{ textAlign: "center", marginLeft: 20 }}>
                {driver && driver.phone}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {user && user.car_brand && (
          <Text style={{ textAlign: "center", textAlign: "center" }}>
            {driver && driver.phone}
          </Text>
        )}
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            marginTop: 10,
            marginHorizontal: 30,
          }}
        ></View>
        {isFetching ? (
          <View style={{ paddingTop: 10, paddingLeft: 10 }}>
            <FacebookLoader active />
            <FacebookLoader active />
            <FacebookLoader active />
            <FacebookLoader active />
            <FacebookLoader active />
          </View>
        ) : CurrentComent && Object.keys(CurrentComent).length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 90,
              paddingHorizontal: 10,
              marginBottom: 0,
              paddingTop: 10,
            }}
            keyboardShouldPersistTaps="always"
            data={CurrentComent}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          CurrentComent && (
            <View
              style={{
                width: "100%",

                height: Dimensions.get("window").height * 0.8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#C4C4C4" }}>Aucun commentaire</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  conatainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 5,
  },
});
