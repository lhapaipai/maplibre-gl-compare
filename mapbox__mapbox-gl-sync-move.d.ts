declare module "@mapbox/mapbox-gl-sync-move" {
  import type maplibre from "maplibre-gl";
  export default function (a: maplibre.Map, b: maplibre.Map): () => void;
}
