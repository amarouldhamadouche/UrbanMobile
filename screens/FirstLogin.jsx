import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
  ToastAndroid,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { useNavigation, useRoute } from "@react-navigation/native";
import { mainColor } from "./mainColor";

export default function FirstLogin() {
  const [date, setDate] = useState();
  const [nom, setNom] = useState();
  const [prenom, setPrenom] = useState();
  const [tel, setTel] = useState();
  const navigation = useNavigation();
  const [isPickerShow1, setIsPickerShow1] = useState(false);
  const showPicker1 = () => {
    setIsPickerShow1(true);
  };
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
  const onChange1 = (event, value) => {
    setIsPickerShow1(false);
    value && setDate(moment(value).format("DD/MM/YYYY"));
  };
  const route = useRoute();
  const { passager, chauffeur } = route.params;
  const handleChangeNom = (text) => {
    if (/^[A-Za-z ]*$/.test(text)) {
      setNom(text);
    }
  };
  const handleChangePrenom = (text) => {
    if (/^[A-Za-z ]*$/.test(text)) {
      setPrenom(text);
    }
  };
  const handleChangeTel = (text) => {
    if (/^[0-9]*$/.test(text)) {
      setTel(text);
    }
  };
  function navigateToLogin() {
    navigation.navigate("second", { passager, chauffeur });
  }
  function navigateToSecReg() {
    if (passager) {
      if (
        nom &&
        prenom &&
        tel &&
        nom.length >= 2 &&
        prenom.length >= 2 &&
        tel.length === 10
      ) {
        navigation.navigate("secondRegistration", {
          passager,
          chauffeur,
          nom,
          prenom,
          tel,
        });
      } else {
        ToastAndroid.show("Entrez vos informations ", ToastAndroid.LONG);
      }
    } else if (chauffeur) {
      if (
        nom &&
        prenom &&
        tel &&
        date &&
        nom.length >= 2 &&
        prenom.length >= 2 &&
        tel.length === 10
      ) {
        navigation.navigate("secondRegistration", {
          passager,
          chauffeur,
          nom,
          prenom,
          tel,
          date,
        });
      } else {
        ToastAndroid.show("Entrez vos informations", ToastAndroid.LONG);
      }
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="white"
        hidden={false}
        barStyle="dark-content"
      />
      <View
        style={{
          marginLeft: 10,
          flexDirection: "row",

          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: mainColor,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>1</Text>
        </View>
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>2</Text>
        </View>
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>3</Text>
        </View>
        <View
          style={{
            width: 25,
            height: 25,
            backgroundColor: "#C4C4C4",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ color: "white" }}>4</Text>
        </View>
        {chauffeur && (
          <View
            style={{
              width: 25,
              height: 25,
              backgroundColor: "#C4C4C4",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
              marginHorizontal: 2,
            }}
          >
            <Text style={{ color: "white" }}>5</Text>
          </View>
        )}
      </View>
      <ScrollView keyboardShouldPersistTaps="always">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View>
            <View style={styles.top}>
              <Text
                style={{ fontWeight: "bold", fontSize: 30, color: "white" }}
              >
                Inscription
              </Text>
            </View>
            <View
              style={{
                height:
                  Dimensions.get("window").height -
                  StatusBar.currentHeight -
                  35 -
                  StatusBar.currentHeight -
                  Dimensions.get("window").height * 0.15,

                justifyContent: "space-between",
              }}
            >
              <View
                style={
                  chauffeur
                    ? {
                        justifyContent: "space-between",
                        height: Dimensions.get("window").height * 0.6,

                        paddingTop: "10%",
                      }
                    : {
                        paddingTop: "10%",
                        paddingBottom: "5%",
                        justifyContent: "space-between",
                        height: Dimensions.get("window").height * 0.6,
                      }
                }
              >
                <View style={styles.inputsContainer}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Nom"
                      style={styles.input}
                      value={nom}
                      onChangeText={(text) => handleChangeNom(text)}
                    />
                    <Icon size={25} color={mainColor} name="user" />
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Prenom"
                      value={prenom}
                      onChangeText={(text) => handleChangePrenom(text)}
                      style={styles.input}
                    />
                    <Icon size={25} color={mainColor} name="user" />
                  </View>
                  {chauffeur && (
                    <TouchableWithoutFeedback
                      onPress={() => setIsPickerShow1(true)}
                      style={styles.inputContainer}
                    >
                      <View style={styles.inputContainer}>
                        <Text
                          placeholder="Date de naissance"
                          style={[
                            styles.input,
                            { color: date ? "black" : "gray" },
                          ]}
                        >
                          {date ? date : "date de naissance"}
                        </Text>
                        <Icon size={25} color={mainColor} name="calendar" />
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                  {isPickerShow1 && (
                    <DateTimePicker
                      value={new Date(Date.now())}
                      mode={"date"}
                      is24Hour={true}
                      onChange={onChange1}
                      style={styles.datePicker}
                      maximumDate={new Date("2003")}
                      minimumDate={new Date("1950")}
                    />
                  )}

                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Num de téléphone"
                      value={tel}
                      onChangeText={(text) => handleChangeTel(text)}
                      keyboardType="numeric"
                      maxLength={10}
                      style={styles.input}
                    />
                    <Icon size={25} color={mainColor} name="phone" />
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigateToSecReg()}
                >
                  <Text style={{ color: "white" }}>Suivant</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottom}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                  onPress={() => navigateToLogin()}
                >
                  <Text style={{ fontSize: 15, marginRight: 20 }}>
                    Vous avez deja un compte !
                  </Text>
                  <Icon size={22} color="black" name="chevron-right" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "white",
    paddingTop: StatusBar.currentHeight,
  },
  top: {
    height: Dimensions.get("window").height * 0.15,
    backgroundColor: mainColor,
    width: "95%",
    borderTopRightRadius: (Dimensions.get("window").height * 0.15) / 2,
    borderBottomRightRadius: (Dimensions.get("window").height * 0.15) / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  inputsContainer: {
    width: "100%",
    alignItems: "center",
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
  },
  bottom: {
    height: Dimensions.get("window").height * 0.1,

    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
