import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { Colors } from "../../theme/colors";

export default function AddJourneyScreen() {
  const [route, setRoute] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [date, setDate] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");

  function saveJourney() {
    Alert.alert("Success", "Journey has been scheduled.");
    setRoute("");
    setBusNumber("");
    setDate("");
    setDeparture("");
    setArrival("");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PageHeader
          title="Add Journey"
          subtitle="Schedule Upcoming Journey"
          showBackButton
        />

        <View style={styles.card}>
          <Text style={styles.label}>Route</Text>
          <TextInput
            value={route}
            onChangeText={setRoute}
            placeholder="Ratnapark → Koteshwor"
            style={styles.input}
          />

          <Text style={styles.label}>Bus Number</Text>
          <TextInput
            value={busNumber}
            onChangeText={setBusNumber}
            placeholder="BA 3 KHA 4567"
            style={styles.input}
          />

          <Text style={styles.label}>Journey Date</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />

          <Text style={styles.label}>Departure Time</Text>
          <TextInput
            value={departure}
            onChangeText={setDeparture}
            placeholder="07:30"
            style={styles.input}
          />

          <Text style={styles.label}>Arrival Time</Text>
          <TextInput
            value={arrival}
            onChangeText={setArrival}
            placeholder="08:45"
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={saveJourney}
          >
            <Text style={styles.buttonText}>
              Save Journey
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Next 7 Days Planning
          </Text>

          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <View key={day} style={styles.dayRow}>
              <Text>{day}</Text>
              <Text style={styles.pending}>
                No Journey Added
              </Text>
            </View>
          ))}
        </View>
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
    borderColor:Colors.border
  },
  label:{
    fontWeight:"700",
    marginTop:14,
    marginBottom:6,
    color:Colors.text
  },
  input:{
    height:52,
    borderRadius:14,
    backgroundColor:"#F8FAFC",
    borderWidth:1,
    borderColor:Colors.border,
    paddingHorizontal:14
  },
  button:{
    marginTop:24,
    height:54,
    borderRadius:16,
    backgroundColor:Colors.primary,
    justifyContent:"center",
    alignItems:"center"
  },
  buttonText:{
    color:"#fff",
    fontWeight:"800",
    fontSize:16
  },
  infoCard:{
    marginTop:24,
    backgroundColor:"#fff",
    borderRadius:20,
    padding:20,
    borderWidth:1,
    borderColor:Colors.border
  },
  infoTitle:{
    fontSize:18,
    fontWeight:"800",
    marginBottom:14
  },
  dayRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingVertical:10,
    borderBottomWidth:1,
    borderBottomColor:"#eee"
  },
  pending:{
    color:"#EF4444",
    fontWeight:"600"
  }
});