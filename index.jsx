import * as React from "react";
import { StyleSheet, StatusBar, ActivityIndicator, Text } from "react-native";
import { mainColor } from "./screens/mainColor";
import FirstScreen from "./screens/FirstScreen";
import SecondScreen from "./screens/SecondScreen.1";
import FirstLogin from "./screens/FirstLogin";
import SecondRegistration from "./screens/SecondRegistration";
import ThirdRegistration from "./screens/ThirdRegistration";
import ThirdRegistration2 from "./screens/ThirdRegistration2";
import ForthRegistration from "./screens/ForthRegistration";
import TrajetDispo from "./screens/TrajetDispo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TrajetsDetail from "./screens/TrajetsDetails";
import CreerTrajet1 from "./screens/CreerTrajet1";
import CreerTrajet2 from "./screens/CreerTrajet2";
import CreerTrajet3 from "./screens/CreerTrajet3";
import CreerTrajet4 from "./screens/CreerTrajet4";
import Menu from "./screens/Menu";
import Notifications from "./screens/Notifications";
import VosTrajets from "./screens/VosTrajets";
import ModifierLeTrajet from "./screens/ModifierTrajet";
import ProfileInfo from "./screens/ProfileInfo";
import ModifierMotPass from "./screens/ModifierMotPass";
import ModifierLaVoiture from "./screens/ModifierLaVoiture";
import AvisEtNotes from "./screens/AvisEtNotes";
import LisserUnComent from "./screens/LaisserUnComent";
import Contact from "./screens/Contact";
import AddGuest from "./screens/AddGust";
import AboutUs from './screens/AboutUs'
import { AuthContext } from "./contexts/AuthContext";
import { AsyncStorage } from "react-native";

const AppStack = createStackNavigator();
export default function Index() {
  const [data, setData] = React.useState();
  const { user, dispatch } = React.useContext(AuthContext);
  const [isFetching, setIsFetchin] = React.useState(false);

  const fetchData = async () => {
    const resp = await getData();
    const d = await JSON.parse(resp);
    dispatch({ type: "UPLOAD", payload: d });
    setIsFetchin(false);
  };
  React.useEffect(() => {
    setIsFetchin(true);
    fetchData();
  }, []);
  const getData = async () => {
    try {
      d = await AsyncStorage.getItem("user");

      return d;
    } catch (err) {}
  };

  return (
    <NavigationContainer>
      <StatusBar hidden={false} />
      <Text></Text>
      {isFetching ? (
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
      ) : (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
          <AppStack.Screen name="Home" component={user ? Menu : FirstScreen} />
          <AppStack.Screen
            name="second"
            component={user ? Menu : SecondScreen}
          />

          <AppStack.Screen name="firstLogin" component={FirstLogin} />

          <AppStack.Screen
            name="secondRegistration"
            component={SecondRegistration}
          />

          <AppStack.Screen
            name="thirdRegistration"
            component={ThirdRegistration}
          />

          <AppStack.Screen
            name="thirdRegistration2"
            component={ThirdRegistration2}
          />

          <AppStack.Screen
            name="forthRegistration"
            component={user ? Menu : ForthRegistration}
          />
          <AppStack.Screen
            name="passagerHome"
            component={user ? Menu : FirstScreen}
          />
          <AppStack.Screen name="trajetDispo" component={TrajetDispo} />
          <AppStack.Screen name="trajetsDetail" component={TrajetsDetail} />

          <AppStack.Screen name="notification" component={Notifications} />
          <AppStack.Screen name="creerTrajet1" component={CreerTrajet1} />
          <AppStack.Screen name="creerTrajet2" component={CreerTrajet2} />
          <AppStack.Screen name="creerTrajet3" component={CreerTrajet3} />
          <AppStack.Screen name="creerTrajet4" component={CreerTrajet4} />
          <AppStack.Screen name="Vos trajets" component={VosTrajets} />
          <AppStack.Screen name="modifierTrajet" component={ModifierLeTrajet} />
          <AppStack.Screen
            name="Information sur profile"
            component={ProfileInfo}
          />
          <AppStack.Screen name="modifierMotPass" component={ModifierMotPass} />
          <AppStack.Screen
            name="modifierLaVoiture"
            component={ModifierLaVoiture}
          />
          <AppStack.Screen name="Avis et notes" component={AvisEtNotes} />
          <AppStack.Screen
            name="laisser un comment"
            component={LisserUnComent}
          />
          <AppStack.Screen name="Cantacter nous" component={Contact} />
          <AppStack.Screen name="Add guest" component={AddGuest} />
          <AppStack.Screen name="Qui sommes nous?" component={AboutUs} />
        </AppStack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
