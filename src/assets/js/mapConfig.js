import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { defaults, ScaleLine, MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, TileWMS, XYZ, Vector as VectorSource } from "ol/source";
import { Stroke, Style, Fill, Circle } from "ol/style";
import { WFS, GeoJSON } from "ol/format";
import { equalTo, intersects } from "ol/format/filter";
import Draw from "ol/interaction/Draw";

let map = null;
let TianDiTu_Map = null;

let initMap = () => {
  TianDiTu_Map = new TileLayer({
    source: new XYZ({
      url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
    }),
  });
  map = new Map({
    layers: [TianDiTu_Map],
    target: "map",
    view: new View({
      center: fromLonLat([110, 38]),
      zoom: 4.5,
    }),
    controls: defaults({
      zoom: false,
      attribution: false,
    }).extend([scaleControl, mousePositionControl]),
  });
};
// 比例尺
const scaleControl = new ScaleLine({
  units: "metric",
});
// 鼠标位置
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: "EPSG:4326",
  className: "custom-mouse-position",
  target: document.getElementById("mouse-position"),
});
export default {
  initMap,
};
