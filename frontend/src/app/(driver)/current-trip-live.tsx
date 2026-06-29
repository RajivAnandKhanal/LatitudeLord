import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

export default function CurrentTripLiveScreen() {
  function confirmEndJourney() {
    Alert.alert("End Journey?", "This will mark the current trip as completed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Journey",
        style: "destructive",
        onPress: () => router.replace("/(driver)/dashboard"),
      },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PageHeader
          title="Current Journey"
          subtitle="Live Trip Status"
          showBackButton
        />

        <View style={styles.statusCard}>
          <Text style={styles.bus}>Bus NP-01-1234</Text>

          <Text style={styles.route}>
            Ratnapark → Koteshwor
          </Text>

          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              Trip Currently Running
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.box}>
            <Text style={styles.number}>18</Text>
            <Text style={styles.label}>Passengers</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.number}>7</Text>
            <Text style={styles.label}>Stops Left</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>
            Upcoming Stops
          </Text>

          {[
            "Baneshwor",
            "Tinkune",
            "Airport",
            "Koteshwor",
          ].map((item) => (
            <View style={styles.station} key={item}>
              <Ionicons
                name="location"
                size={18}
                color={Colors.primary}
              />

              <Text style={styles.stationName}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.stopButton} onPress={confirmEndJourney}>
          <Ionicons
            name="stop-circle"
            size={22}
            color="#fff"
          />

          <Text style={styles.stopText}>
            End Journey
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:Colors.background
  },

  content:{
    padding:20,
    paddingTop:56,
    paddingBottom:40
  },

  statusCard:{
    backgroundColor:"#DCFCE7",
    padding:22,
    borderRadius:20,
    marginBottom:20
  },

  bus:{
    fontSize:24,
    fontWeight:"800",
    color:Colors.text
  },

  route:{
    marginTop:6,
    color:Colors.textSecondary
  },

  liveRow:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:18
  },

  liveDot:{
    width:12,
    height:12,
    borderRadius:6,
    backgroundColor:"#22C55E",
    marginRight:10
  },

  liveText:{
    fontWeight:"700",
    color:"#15803D"
  },

  stats:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:20
  },

  box:{
    width:"48%",
    backgroundColor:"#fff",
    borderRadius:18,
    padding:20,
    alignItems:"center",
    borderWidth:1,
    borderColor:Colors.border
  },

  number:{
    fontSize:30,
    fontWeight:"800",
    color:Colors.primary
  },

  label:{
    marginTop:6,
    color:Colors.textSecondary
  },

  card:{
    backgroundColor:"#fff",
    borderRadius:20,
    padding:20,
    borderWidth:1,
    borderColor:Colors.border
  },

  section:{
    fontWeight:"800",
    fontSize:18,
    marginBottom:16,
    color:Colors.text
  },

  station:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:14
  },

  stationName:{
    marginLeft:12,
    fontSize:16,
    color:Colors.text
  },

  stopButton:{
    marginTop:24,
    height:56,
    backgroundColor:"#DC2626",
    borderRadius:18,
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"row"
  },

  stopText:{
    color:"#fff",
    fontWeight:"800",
    fontSize:17,
    marginLeft:10
  }
});