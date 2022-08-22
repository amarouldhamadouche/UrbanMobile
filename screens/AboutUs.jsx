import React,{useEffect} from 'react'
import {View,Text,TouchableOpacity,BackHandler,ScrollView,StatusBar,StyleSheet} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icons from "react-native-vector-icons/Feather";
export default function AboutUs(){
 const navigation = useNavigation()
 useEffect(() => {
    
  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      navigation.goBack();
      return true;
    }
  );
}, []);
 return(
  <View style={styles.container}>
   <StatusBar backgroundColor="white" barStyle="dark-content" />
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
        <Text style={{ marginLeft: 20, fontWeight: "bold", fontSize: 17 }}>
         Qui somme nous
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
       <ScrollView style={{paddingHorizontal:20,marginTop:20}} keyboardShouldPersistTaps="always"  showsVerticalScrollIndicator={false}>
           <Text style={{marginBottom:10}}>
            {'   '} Vous voyez quand vous et vous amis voulez voyager quelque part, et au lieu de voyager en transport, vous demendez à un amis qui a une voiture et vous partagez le prix de carburant pour économiser de l'argent,
            maintenant vous pouvez le faire avec UrbanMobile, avec vos amis ou même avec des inconnus, c'est ce qu'on appelle du covoiturage

           </Text >
           <Text style={{marginBottom:10}}>
           {'   '} Si vous souhaitez voyager en tant que passager, il vous suffit de choisir votre destination précise et de réserver une place dans l'offre qui vous convient, vous pouvez réservez des places même pour vos accompagnons!
           </Text>
           <Text style={{marginBottom:10}}>
           {'   '} Si vous souhaitez voyager en tant que chauffeur, tout ce que vous avez à faire est de choisir la destination spécifique avec la date à laquelle vous souhaitez voyager et de créer le voyage, pius vous attendez  que les passagers voient votre offre et y réservent des places 
           </Text>
           <Text>
           {'   '} UrbanMobile c'est la première application de covoiturage en algerie, fondée par deux érudiants amar ould hamadouche et chawki naouar en 2022
           </Text>
       </ScrollView>

  </View>
 )
}
const styles = StyleSheet.create({
 container: {
  paddingHorizontal: 5,
  
  paddingTop: 10,
  flex: 1,
  backgroundColor: "white",
},
})