import React, { useState, useContext, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  Keyboard,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";
import Icons from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { UpdateUser } from "../ApiCalls";

export default function ProfileInfo() {
  const navigation = useNavigation();

  const { user, dispatch } = useContext(AuthContext);
  const [prenom, setPrenom] = useState();
  const [nom, setNom] = useState();
  const [tel, setTel] = useState();
  const [passager, setPassager] = useState();
  const [oldPrenom, setOldPrenom] = useState();
  const [oldNom, setOldNom] = useState();
  const [oldTel, setOldTel] = useState();
  const [isFetching, setIsFecthing] = useState(false);
  const car = 0;

  useEffect(() => {
    user && user.car_brand ? setPassager(0) : setPassager(1);
    setPrenom(user ? user.first_name : "");
    setOldPrenom(user ? user.first_name : "");
    setNom(user ? user.last_name : "");
    setOldNom(user ? user.last_name : "");
    setTel(user ? user.phone : "");
    setOldTel(user ? user.phone : "");
  }, [user]);
  const route = useRoute();
  const { currentUser } = route.params;

  const handleClick = async () => {
    setIsFecthing(true);
    const data = new FormData();

    if (prenom.length > 3 && nom.length > 2 && tel.length === 10) {
      data.append("first_name", prenom);
      data.append("last_name", nom);
      data.append("phone", tel);

      const id = user.id;
      const d = await UpdateUser(dispatch, data, id, passager, car);
      if (d) {
        setIsFecthing(false);
        navigation.navigate("Home");
      } else {
        setIsFecthing(false);
      }
    } else {
      setIsFecthing(false);
      ToastAndroid.show("informations invalid", ToastAndroid.LONG);
    }
  };
  return (
    <View style={styles.conatainer}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",

          paddingVertical: 5,
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
          Modifier votre profile
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

      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={{
              height: Dimensions.get("window").height - 100,

              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: 10,
              justifyContent: "space-between",
            }}
          >
            <View style={styles.inputsContainer}>
              <View>
                <View style={styles.inputContainer}>
                  <TextInput
                    value={prenom}
                    placeholder="Prenom"
                    style={styles.input}
                    onChangeText={(text) => setPrenom(text)}
                  />
                  <Icons size={25} color={mainColor} name="user" />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Nom"
                    style={styles.input}
                    value={nom}
                    onChangeText={(text) => setNom(text)}
                  />
                  <Icons size={25} color={mainColor} name="user" />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Tél"
                    style={styles.input}
                    value={tel}
                    onChangeText={(text) => setTel(text)}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  <Icons size={25} color={mainColor} name="phone" />
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        oldNom === nom && oldPrenom === prenom && oldTel === tel
                          ? "#DCDCDC"
                          : mainColor,
                    },
                  ]}
                  onPress={() =>
                    !(
                      oldNom === nom &&
                      oldPrenom === prenom &&
                      oldTel === tel
                    ) && handleClick()
                  }
                >
                  {isFetching && (
                    <ActivityIndicator
                      animating={isFetching}
                      color="white"
                      size={20}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 100,
                      }}
                    />
                  )}
                  {!isFetching && (
                    <Text style={{ color: "white" }}>Enregistrer</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() =>
                  navigation.navigate("modifierMotPass", {
                    currentUser: currentUser,
                  })
                }
              >
                <Icons name="lock" color={mainColor} size={20} />
                <Text style={{ color: mainColor, marginLeft: 10 }}>
                  Modifier votre mot de passe
                </Text>
              </TouchableOpacity>
              {passager === 0 && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  onPress={() => navigation.navigate("modifierLaVoiture", {})}
                >
                  <FontAwesome5 name="car-alt" color={mainColor} size={20} />
                  <Text style={{ color: mainColor, marginLeft: 10 }}>
                    Modifier votre voiture
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  conatainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flex: 1,
    backgroundColor: "white",
  },
  inputsContainer: {
    width: "100%",
    alignItems: "center",

    height: "60%",
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
  button: {
    width: "45%",

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
    borderRadius: 10,
  },
});
