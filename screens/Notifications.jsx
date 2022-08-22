import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  FlatList,
} from "react-native";
import NotificationItem from "../components/NotificationItem";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../contexts/AuthContext";
import Icons from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import  { Bullets } from "react-native-easy-content-loader";
export default function Notifications() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [currentnotifications, setCurrentNotifications] = useState();
  const [isFetching, setIsFetching] = useState(true);
  const renderItem = ({ item }) => (
    <NotificationItem key={item.senderId} notification={item} />
  );

  useEffect(() => {
    async function fetch() {
      try {
        await firebase
          .database()
          .ref(`NotificationSetting/${user.user}`)
          .update({
            read: true,
          });
        firebase
          .database()
          .ref("notifications")
          .orderByChild("recipientId")
          .equalTo(user.user)
          .on("value", (snapshot) => {
           
           snapshot.val()
              ? setCurrentNotifications(
               snapshot.val()
                )
              : setCurrentNotifications({});
          });
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
      }
    }
    fetch();
  }, [user.user]);

  return (
    <View
      style={{
        paddingHorizontal: 0,
        paddingTop: 0,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingLeft:10,
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
        <Text style={{ marginLeft: 20, fontWeight: "bold", fontSize: 17 }}>
          Notifications
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
      <View style={{ flex: 1 }}>
        {isFetching ? (
          <View style={{ paddingTop: 10, paddingLeft: 10 }}>
            <Bullets active listSize={10} containerStyles={{height:50}} />
       
          </View>
        ) : currentnotifications &&
          Object.keys(currentnotifications).length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 10,
              paddingHorizontal: 10,
              marginBottom: 0,
              paddingTop: 10,
            }}
            keyboardShouldPersistTaps="always"
            data={Object.values(currentnotifications).reverse()}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          !isFetching && currentnotifications&& Object.keys(currentnotifications).length===0 &&(
            <View style={{height:Dimensions.get('window').height*0.8,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'#C4C4C4'}}>Aucune notifications</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
}
