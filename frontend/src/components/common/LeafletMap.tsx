import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

export interface LeafletMarker {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  color?: string;
}

export interface LeafletLatLng {
  lat: number;
  lng: number;
}

export interface LeafletMapHandle {
  setView: (lat: number, lng: number, zoom?: number) => void;
}

interface Props {
  markers: LeafletMarker[];
  polyline?: LeafletLatLng[];
  center: LeafletLatLng;
  zoom?: number;
  userLocation?: LeafletLatLng;
  onMarkerPress?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

// Loads Leaflet from the CDN inside the WebView. The device needs internet
// access for tiles either way (same requirement react-native-maps had for
// Google/Apple map tiles), so this doesn't add a new constraint.
function buildHtml(
  center: LeafletLatLng,
  zoom: number,
  userLocation?: LeafletLatLng,
): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html,body,#map{height:100%;margin:0;padding:0;background:#e5e7eb;}
  .user-dot-pulse {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2563EB;
    border: 3px solid #fff;
    box-shadow: 0 0 0 rgba(37,99,235,0.5);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(37,99,235,0.5); }
    70% { box-shadow: 0 0 0 14px rgba(37,99,235,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
  }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${center.lat}, ${center.lng}], ${zoom});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  var markersLayer = L.layerGroup().addTo(map);
  var polylineLayer = null;
  var userMarker = null;

  var userIcon = L.divIcon({
    className: '',
    html: '<div class="user-dot-pulse"></div>',
    iconSize: [16, 16],
  });

  function iconFor(color) {
    return L.divIcon({
      className: '',
      html: '<div style="background:' + color + ';width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>',
      iconSize: [16, 16],
    });
  }

  function updateMarkers(markers) {
    markersLayer.clearLayers();
    markers.forEach(function (m) {
      var marker = L.marker([m.lat, m.lng], { icon: iconFor(m.color || '#2563EB') }).addTo(markersLayer);
      if (m.title) {
        marker.bindPopup('<b>' + m.title + '</b>' + (m.description ? '<br/>' + m.description : ''));
      }
      marker.on('click', function () {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: m.id }));
      });
    });
  }

  function updateUserLocation(loc) {
    if (!loc) {
      if (userMarker) { map.removeLayer(userMarker); userMarker = null; }
      return;
    }
    if (userMarker) {
      userMarker.setLatLng([loc.lat, loc.lng]);
    } else {
      userMarker = L.marker([loc.lat, loc.lng], { icon: userIcon, zIndexOffset: 1000 })
        .bindPopup('You are here')
        .addTo(map);
    }
  }

  function updatePolyline(coords) {
    if (polylineLayer) { map.removeLayer(polylineLayer); polylineLayer = null; }
    if (coords && coords.length > 1) {
      polylineLayer = L.polyline(coords.map(function (c) { return [c.lat, c.lng]; }), { color: '#2563EB', weight: 4 }).addTo(map);
    }
  }

  function setView(lat, lng, zoom) {
    map.setView([lat, lng], zoom || map.getZoom());
  }

  window.updateMarkers = updateMarkers;
  window.updateUserLocation = updateUserLocation;
  window.updatePolyline = updatePolyline;
  window.setView = setView;
  updateMarkers([]);
  updateUserLocation(${JSON.stringify(userLocation ?? null)});
</script>
</body>
</html>`;
}

const LeafletMap = forwardRef<LeafletMapHandle, Props>(function LeafletMap(
  { markers, polyline, center, zoom = 15, userLocation, onMarkerPress, style },
  ref,
) {
  const webviewRef = useRef<WebView>(null);
  // Built once per mount — subsequent marker/polyline/location updates go
  // through injectJavaScript instead of reloading the page, so live
  // location updates don't cause flicker.
  const html = useMemo(() => buildHtml(center, zoom, userLocation), []); // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(ref, () => ({
    setView: (lat, lng, z) => {
      webviewRef.current?.injectJavaScript(
        `window.setView(${lat}, ${lng}, ${z ?? ""}); true;`,
      );
    },
  }));

  useEffect(() => {
    webviewRef.current?.injectJavaScript(
      `window.updateMarkers(${JSON.stringify(markers)}); true;`,
    );
  }, [markers]);

  useEffect(() => {
    webviewRef.current?.injectJavaScript(
      `window.updatePolyline(${JSON.stringify(polyline ?? [])}); true;`,
    );
  }, [polyline]);

  useEffect(() => {
    webviewRef.current?.injectJavaScript(
      `window.updateUserLocation(${JSON.stringify(userLocation ?? null)}); true;`,
    );
  }, [userLocation?.lat, userLocation?.lng]);

  function handleMessage(event: WebViewMessageEvent) {
    try {
      const payload = JSON.parse(event.nativeEvent.data);
      if (payload.type === "markerPress") {
        onMarkerPress?.(payload.id);
      }
    } catch {
      // ignore malformed messages
    }
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webviewRef}
        source={{ html }}
        originWhitelist={["*"]}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        style={styles.webview}
      />
    </View>
  );
});

export default LeafletMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
