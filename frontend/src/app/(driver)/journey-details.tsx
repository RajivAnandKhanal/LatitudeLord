import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

export default function JourneyDetailsScreen() {
  const stations = [
    "Ratnapark",
    "Putalisadak",
    "Baneshwor",
    "Tinkune",
    "Airport",
    "Koteshwor",
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PageHeader
          title="Journey Details"
          subtitle="Today's Route"
          showBackButton
        />

        <View style={styles.card}>
          <Text style={styles.route}>
            Ratnapark → Koteshwor
          </Text>

          <Text style={styles.info}>
            Bus No: BA 3 KHA 4567
          </Text>

          <Text style={styles.info}>
            Departure: 7:30 AM
          </Text>

          <Text style={styles.info}>
            Expected Arrival: 8:45 AM
          </Text>

          <Text style={styles.info}>
            Current Passengers: 26
          </Text>

          <Text style={styles.info}>
            Driver: Ram Bahadur
          </Text>
        </View>

        <Text style={styles.heading}>Stations</Text>

        {stations.map((station, index) => (
          <View key={index} style={styles.station}>
            <Ionicons
              name={
                index === 0
                  ? "play-circle"
                  : index === stations.length - 1
                  ? "flag"
                  : "ellipse"
              }
              size={18}
              color={Colors.primary}
            />

            <Text style={styles.stationText}>
              {station}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
container:{flex:1,backgroundColor:Colors.background},
content:{padding:20,paddingTop:56,paddingBottom:40},
card:{
backgroundColor:"#fff",
padding:20,
borderRadius:20,
borderWidth:1,
borderColor:Colors.border,
marginBottom:24
},
route:{fontSize:22,fontWeight:"800",color:Colors.text},
info:{marginTop:10,color:Colors.textSecondary},
heading:{fontSize:20,fontWeight:"800",marginBottom:18},
station:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#fff",
padding:18,
borderRadius:16,
marginBottom:10
},
stationText:{
marginLeft:12,
fontSize:16,
fontWeight:"600"
}
});