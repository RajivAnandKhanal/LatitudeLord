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
  // Google-Maps-style pulsing ring instead of a flat dot. Use for a
  // "this is you / this is your live position" marker (e.g. the driver's
  // own dot on the live-trip map), not for every bus on a list.
  pulse?: boolean;
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
  markers: LeafletMarker[],
  userLocation?: LeafletLatLng,
): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html,body,#map{height:100%;margin:0;padding:0;background:#e5e7eb;touch-action:none;}
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
  .marker-dot-pulse {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--pulse-color, #22C55E);
    border: 3px solid #fff;
    box-shadow: 0 0 0 rgba(var(--pulse-rgb, 34,197,94), 0.5);
    animation: markerPulse 2s infinite;
  }
  @keyframes markerPulse {
    0% { box-shadow: 0 0 0 0 rgba(var(--pulse-rgb, 34,197,94), 0.5); }
    70% { box-shadow: 0 0 0 14px rgba(var(--pulse-rgb, 34,197,94), 0); }
    100% { box-shadow: 0 0 0 0 rgba(var(--pulse-rgb, 34,197,94), 0); }
  }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    tap: true,
    tapTolerance: 25,
    dragging: true,
    inertia: true,
    inertiaDeceleration: 3000,
    touchZoom: 'center',
    bounceAtZoomLimits: false,
  }).setView([${center.lat}, ${center.lng}], ${zoom});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  var markersLayer = L.layerGroup().addTo(map);
  var polylineLayer = null;
  var userMarker = null;

  var userIcon = L.divIcon({
    className: '',
    html: '<div class="user-dot-pulse"></div>',
    iconSize: [16, 16],
  });

  // Converts '#RRGGBB' to 'r,g,b' so the pulse ring's rgba() can use the
  // marker's own color instead of always being green.
  function hexToRgbTriplet(hex) {
    var m = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex || '');
    if (!m) return '34,197,94';
    return parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16);
  }

  function iconFor(color, pulse) {
    var c = color || '#2563EB';
    if (pulse) {
      var style = '--pulse-color:' + c + ';--pulse-rgb:' + hexToRgbTriplet(c) + ';';
      return L.divIcon({
        className: '',
        html: '<div class="marker-dot-pulse" style="' + style + '"></div>',
        iconSize: [16, 16],
      });
    }
    return L.divIcon({
      className: '',
      html: '<div style="background:' + c + ';width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>',
      iconSize: [16, 16],
    });
  }

  function updateMarkers(markers) {
    markersLayer.clearLayers();
    markers.forEach(function (m) {
      var marker = L.marker([m.lat, m.lng], { icon: iconFor(m.color || '#2563EB', m.pulse) }).addTo(markersLayer);
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
      polylineLayer = L.polyline(coords.map(function (c) { return [c.lat, c.lng]; }), {
        color: '#2563EB',
        weight: 4,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '1, 10',
      }).addTo(map);
    }
  }

  function setView(lat, lng, zoom) {
    map.setView([lat, lng], zoom || map.getZoom());
  }

  window.updateMarkers = updateMarkers;
  window.updateUserLocation = updateUserLocation;
  window.updatePolyline = updatePolyline;
  window.setView = setView;
  updateMarkers(${JSON.stringify(markers)});
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
  // Kept up to date on every render so onLoadEnd can push the *current*
  // data, not just whatever was true when the WebView first mounted.
  const latestMarkers = useRef(markers);
  const latestPolyline = useRef(polyline);
  const latestUserLocation = useRef(userLocation);
  latestMarkers.current = markers;
  latestPolyline.current = polyline;
  latestUserLocation.current = userLocation;

  // Built once per mount — subsequent marker/polyline/location updates go
  // through injectJavaScript instead of reloading the page, so live
  // location updates don't cause flicker.
  const html = useMemo(
    () => buildHtml(center, zoom, markers, userLocation),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

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

  // The very first injectJavaScript call (from the effects above) can race
  // the WebView's own page load — if it fires before window.updateMarkers
  // exists yet, it's silently dropped and the driver's dot never appears.
  // Re-push whatever is current once the page confirms it has loaded.
  function handleLoadEnd() {
    webviewRef.current?.injectJavaScript(
      `window.updateMarkers(${JSON.stringify(latestMarkers.current)}); true;`,
    );
    webviewRef.current?.injectJavaScript(
      `window.updatePolyline(${JSON.stringify(latestPolyline.current ?? [])}); true;`,
    );
    webviewRef.current?.injectJavaScript(
      `window.updateUserLocation(${JSON.stringify(latestUserLocation.current ?? null)}); true;`,
    );
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webviewRef}
        source={{ html }}
        originWhitelist={["*"]}
        onMessage={handleMessage}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        nestedScrollEnabled={false}
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
