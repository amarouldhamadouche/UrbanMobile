import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Dimensions,
  Keyboard,
  ToastAndroid,
  StatusBar,
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import Icons from "react-native-vector-icons/Feather";
import { mainColor } from "./mainColor";
import { useNavigation, useRoute } from "@react-navigation/native";
import { wilaya } from "../assets/dummyData";

export default function CreerTrajet1() {
  const navigation = useNavigation();
  const [mainJson, setMainJson] = useState([]);
  const [filtredData, setFiltredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [filtredData1, setFiltredData1] = useState([]);
  const [selectedItem1, setSelectedItem1] = useState([]);
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
  function navigateToCreerTrajet2() {
    if (!(selectedItem1.length === 0) && selectedItem.name === "tiaret"&&selectedItem.name!==selectedItem1.name) {
      navigation.navigate("creerTrajet2", {
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
      } else {
        showToast2();
      }
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <TouchableOpacity
        style={[styles.littleCard, { justifyContent: "center" }]}
        onPress={() => navigation.goBack()}
      >
        <Icons size={25} name="arrow-left" color={mainColor} />
      </TouchableOpacity>
      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.center}>
            <Autocomplete
              containerStyle={styles.Autocomplete}
              autoCapitalize="none"
              inputContainerStyle={{ borderWidth: 0, marginHorizontal: 15 }}
              data={filtredData}
              defaultValue={
                JSON.stringify(selectedItem) === "{}" ? "" : selectedItem.name
              }
              onChangeText={(text) => searchDataFromJSON(text)}
              placeholder="Ville de depart"
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
              placeholder="Ville de destination"
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
            {selectedItem.length !== 0 &&
              selectedItem1.length !== 0 &&
              filtredData.length === 0 &&
              filtredData1.length === 0 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={navigateToCreerTrajet2}
                >
                  <Text style={{ color: "white" }}>Suivant</Text>
                </TouchableOpacity>
              )}
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
  button: {
    width: "50%",
    backgroundColor: mainColor,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: "30%",
  },
  littleCard: {
    marginLeft: 10,
    marginTop: 10,
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
  center: {
    height: Dimensions.get("window").height * 0.8,
    justifyContent: "flex-end",
    width: "100%",
    zIndex: 0,
    marginTop: 10,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "70%",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginBottom: 20,
    paddingVertical: 10,
    zIndex: 0,
  },
});
