import React, { useState, useEffect, useContext } from "react";

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  BackHandler,
  StatusBar,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import Autocomplete from "react-native-autocomplete-input";
import { mainColor } from "./mainColor";
import { trajets, wilaya } from "../assets/dummyData";
export default function TrajetDispo() {
  const route = useRoute();
  const { user } = useContext(AuthContext);
  const [mainJson, setMainJson] = useState([]);
  const [filtredData, setFiltredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [filtredData1, setFiltredData1] = useState([]);
  const [selectedItem1, setSelectedItem1] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate("Home");
        return true;
      }
    );
    return () => backHandler.remove();
  }, [user]);

  useEffect(() => {
    setMainJson(wilaya);
  }, [wilaya]);
  const searchDataFromJSON = (query) => {
    if (query) {
      const resp = mainJson.filter(
        (m) => m.name.slice(0, query.length) === query
      );
      setFiltredData(resp);
    } else {
      setFiltredData([]);
    }
  };
  const searchDataFromJSON1 = (query) => {
    if (query) {
      const resp = mainJson.filter(
        (m) => m.name.slice(0, query.length) === query
      );
      setFiltredData1(resp);
    } else {
      setFiltredData1([]);
    }
  };
  function navigateToLogin() {
    navigation.navigate("second", { passager: true, chauffeur: false });
  }
  const showToast1 = () => {
    ToastAndroid.show(
      `nous n'avons pas de services à ${selectedItem.name} pour le moment`,
      ToastAndroid.LONG
    );
  };
  const showToast2 = () => {
    ToastAndroid.show(
      "vous devez selecter la place de depart et la place de destination",
      ToastAndroid.LONG
    );
  };
  function navigateToTrajetDetail() {
    if (!(selectedItem1.length === 0) && selectedItem.name === "tiaret"&&selectedItem.name!==selectedItem1.name)  {
      navigation.navigate("trajetsDetail", {
        user,
        depart: selectedItem,
        destination: selectedItem1,
      });
    } else {
      if(selectedItem.name===selectedItem1.name){
        ToastAndroid.show(
          "vous devez selecter deux places differents",
          ToastAndroid.LONG)
      }else
      if (!(selectedItem.length === 0) && !(selectedItem1.length === 0)) {
        showToast1();
      }
       else {
        showToast2();
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={mainColor} hidden={false} />

    
    

      {!user && (
        <View
          style={{
            width: Dimensions.get("window").width,
            height: "10%",
            marginTop: "7%",
            paddingRight: "5%",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigateToLogin()}
          >
            <Text style={{ color: "white" }}>Connexion</Text>
          </TouchableOpacity>
        </View>
      )}
      {user && (
        <TouchableOpacity
          style={[styles.littleCard, { justifyContent: "center" }]}
          onPress={() => navigation.navigate("passagerHome")}
        >
          <Feather size={25} name="arrow-left" color={mainColor} />
        </TouchableOpacity>
      )}

      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={{
              flex: 1,
              height: Dimensions.get("window").height * 0.76,

              justifyContent: "flex-end",
              paddingBottom: 10,
              alignItems: "center",
              position: "relative",
            }}
          >
            <Autocomplete
              containerStyle={styles.Autocomplete}
              autoCapitalize="none"
              inputContainerStyle={{ borderWidth: 0, marginHorizontal: 15 }}
              data={filtredData}
              defaultValue={
                JSON.stringify(selectedItem) === "{}" ? "" : selectedItem.name
              }
              onChangeText={(text) => searchDataFromJSON(text)}
              placeholder="Taper la ville de depart"
              flatListProps={{
                keyExtactor: (item, i) => i.toString(),
                keyboardShouldPersistTaps: "always",
                renderItem: ({ index, item }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedItem(item);
                      setFiltredData([]);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text style={styles.searchBox}>{item.name} </Text>
                  </TouchableOpacity>
                ),
              }}
            />
            <Autocomplete
              containerStyle={styles.Autocomplete1}
              autoCapitalize="none"
              inputContainerStyle={{ borderWidth: 0, marginHorizontal: 15 }}
              data={filtredData1}
              defaultValue={
                JSON.stringify(selectedItem1) === "{}" ? "" : selectedItem1.name
              }
              onChangeText={(text) => searchDataFromJSON1(text)}
              placeholder="Taper la ville de destination"
              flatListProps={{
                keyboardShouldPersistTaps: "always",
                keyExtactor: (item, i) => i.toString(),

                renderItem: ({ index, item }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedItem1(item);
                      Keyboard.dismiss();
                      setFiltredData1([]);
                    }}
                  >
                    <Text style={styles.searchBox}>{item.name} </Text>
                  </TouchableOpacity>
                ),
              }}
            />

            <TouchableOpacity
              style={styles.btn1}
              onPress={navigateToTrajetDetail}
            >
              <Text style={{ color: "white" }}>Chercher</Text>
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
    height: Dimensions.get("window").height,
    backgroundColor: "white",
  },
  Autocomplete: {
    flex: 1,
    left: 20,
    position: "absolute",
    right: 20,
    top: 10,
    zIndex: 5,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "white",
  },
  Autocomplete1: {
    flex: 0.5,
    left: 20,
    position: "absolute",
    right: 20,
    top: Dimensions.get("window").height * 0.1,

    zIndex: 4,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 15,
  },
  searchBox: { margin: 5, fontSize: 15, paddingTop: 4 },
  littleCard: {
    marginLeft: 10,
    marginTop: Dimensions.get("window").height * 0.07,
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
    zIndex: 3,
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
  btn1: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").height * 0.06,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: mainColor,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,

    shadowRadius: 2,
    zIndex: 1,
  },
  bold: {
    left: 0,
    fontWeight: "bold",
    fontSize: 25,
    color: "black",
    textAlign: "center",
    marginVertical: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
    height: Dimensions.get("window").height * 0.1,
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
  },
});
