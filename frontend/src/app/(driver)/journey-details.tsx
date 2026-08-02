import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { useBusDetails } from "../../hooks/useBusDetails";
import { Colors } from "../../theme/colors";
import { DriverUser } from "../../types/auth";

export default function JourneyDetailsScreen() {
  const { user } = useAuth();
  const driver = user?.role === "driver" ? (user as DriverUser) : null;
  const driverBus = driver?.buses?.[0];
  const { bus, loading } = useBusDetails(driverBus?.id);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!bus) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <PageHeader title="Journey Details" subtitle="Today's Route" showBackButton />
          <Text style={styles.info}>No bus registered yet.</Text>
        </View>
      </ScrollView>
    );
  }

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
            {bus.routeName}
          </Text>

          <Text style={styles.info}>
            Bus No: {bus.plateNumber}
          </Text>

          <Text style={styles.info}>
            Status: {bus.status}
          </Text>

          <Text style={styles.info}>
            ETA: {bus.mlEtaMinutes ?? bus.etaMinutes} min
          </Text>

          <Text style={styles.info}>
            Driver: {bus.driverName}
          </Text>
        </View>

        <Text style={styles.heading}>Stations</Text>

        {bus.routeStations.length === 0 && (
          <Text style={styles.info}>No stations set for this route yet.</Text>
        )}

        {bus.routeStations.map((station, index) => (
          <View key={station + index} style={styles.station}>
            <Ionicons
              name={
                index === 0
                  ? "play-circle"
                  : index === bus.routeStations.length - 1
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
loader: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.background },
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
