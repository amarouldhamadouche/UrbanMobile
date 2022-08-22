import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Logo, wilaya } from "../assets/dummyData";
export default function VosTrajetsItems({ t, currentUser,active }) {
  const navigation = useNavigation();
  const [carBrand, setCarBrand] = useState();
  const [car_type, setCar_type] = useState();
  const [car_year, setCar_year] = useState();
  const [date, setDate] = useState();
  const [hour, setHour] = useState();
  const [depart, setDepart] = useState();
  const [destination, setDestination] = useState();
  const [img, setImg] = useState();
  const places = t.places - (t.client.length+t.guest.length);
  const fetchChauffeur = async () => {
    try {
      const resp = await axios.get(
        `https://urban-online.herokuapp.com/api/driver/${t.driver}`
      );
      setCarBrand(resp.data.car_brand);
      setCar_type(resp.data.car_type);
      setCar_year(resp.data.car_year);
      setIsFetching(false);
    } catch (err) {}
  };
  useEffect(() => {
    if (currentUser && currentUser.car_brand) {
      setCarBrand(currentUser.car_brand);
      setCar_type(currentUser.car_type);
      setCar_year(currentUser.car_year);
    } else if (currentUser) {
      fetchChauffeur();
    }

    const wi = wilaya.find((w) => w.mat === t.starting_point);
    setDepart(wi);
    const wi1 = wilaya.find((w) => w.mat === t.destination);
    setDestination(wi1);
    const d = new Date(t.start_time);

    const dd =
      moment(d).format("HH") == "00"
        ? moment(d).subtract(1, "days").format("DD/MM/YYYY")
        : moment(d).format("DD/MM/YYYY");
    setDate(dd);

    const h =
      moment(d).format("HH") == "00"
        ? `23:${moment(d).format("mm")}`
        : `${moment(d).format("HH") - 1}:${moment(d).format("mm")}`;
    setHour(h);
  }, [currentUser, t]);
  useEffect(() => {
    if (carBrand) {
      const resp = Logo.find((l) => l.logo === carBrand);
      setImg(resp.img);
    }
  }, [carBrand]);
  return (
    <TouchableOpacity
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: "#F5F5F5",
        borderRadius: 20,
      }}
      onPress={() =>
      new Date(Date.now()).setHours(new Date(Date.now()).getHours()+1)  > new Date(t.start_time)? 
       navigation.navigate("trajetsDetail", {
          t: t.id,
          arriver : true
        }): navigation.navigate("trajetsDetail", {
          t: t.id,
        })
      }
    >
      <View style={styles.top}>
        <Image
          style={{ width: 40, height: 40 }}
          source={{
            uri: img && img,
          }}
          alt=""
        />
        <View
          style={{
            flexDirection: "row",
            width: "30%",
            justifyContent: "space-around",
          }}
        >
          <Text>{car_type && car_type}</Text>
          <Text>{car_year && car_year}</Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>{t.price && Math.round(t.price/ t.places)} DA </Text>
      </View>

      <View style={styles.center}>
        <View
          style={{
            flexDirection: "row",

            justifyContent: "space-around",
          }}
        >
          <Text>{date} </Text>
          <Text>{hour} </Text>
        </View>
        <Text>
          {currentUser.car_brand
            ? `${t.client.length+t.guest.length} places reservé`
            : `${places} places disponibles`}
        </Text>
      </View>
      <View style={styles.bottom}>
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          {depart && depart.name} - {destination && destination.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  center: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  bottom: {
    width: "100%",
  },
});
