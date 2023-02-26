import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { defaults, ScaleLine, MousePosition, OverviewMap } from "ol/control";
import { createStringXY } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { OSM, TileWMS, XYZ } from "ol/source";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { Circle, Fill, Stroke, Style } from "ol/style.js";
import Overlay from "ol/Overlay.js";

// 工作空间URL
const urlRoot = "http://localhost:8080/geoserver/CMIP/wms";

let map = null;
const BaseLayer = new TileLayer({});
const CVALayer = new TileLayer({});
const VEC = new XYZ({
  url: "http://t" + Math.round(Math.random() * 7) + ".tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
});
const CAV = new XYZ({
  url: "http://t" + Math.round(Math.random() * 7) + ".tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
});
const IMG = new XYZ({
  url: "http://t" + Math.round(Math.random() * 7) + ".tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
});
const CIA = new XYZ({
  url: "http://t" + Math.round(Math.random() * 7) + ".tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
});
const vectorLayer = new VectorLayer({});
const featureLayer = new TileLayer({});
const rasterLayer = new TileLayer({});
// 地图初始化
const initMap = () => {
  BaseLayer.setSource(VEC);
  CVALayer.setSource(CAV);
  map = new Map({
    layers: [BaseLayer, rasterLayer, featureLayer, vectorLayer, CVALayer],
    target: "map",
    view: new View({
      center: fromLonLat([110, 35]),
      zoom: 4.5,
    }),
    controls: defaults({
      zoom: false,
      attribution: false,
    }).extend([scaleControl, mousePositionControl, overviewMapControl]),
  });
};
// 点击弹窗
var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});
// 关闭弹窗
closer.onclick = function () {
  overlay.setPosition(undefined);
};
// 获取弹窗
let getOverlay = () => {
  return overlay;
};
let getContent = () => {
  return content;
};
// 切换地图
const menuClickEvent = (menu_router) => {
  if (menu_router == "map1") {
    BaseLayer.setSource(VEC);
    CVALayer.setSource(CAV);
  } else if (menu_router == "map2") {
    BaseLayer.setSource(IMG);
    CVALayer.setSource(CIA);
  }
};
// 获取当前地图变量
let getMap = () => {
  return map;
};

// 更换栅格图层
const changeRaster = (value) => {
  let source = new TileWMS({
    url: urlRoot,
    params: {
      LAYERS: value,
    },
  });
  rasterLayer.setSource(source);
};
// 更换矢量图层
const changeFeature = (value) => {
  let source = new TileWMS({
    url: urlRoot,
    params: {
      LAYERS: value,
    },
  });
  featureLayer.setSource(source);
};
// 更换矢量图层geojson
const changeVector = (value, width) => {
  let source = new VectorSource({
    projection: "EPSG:3857",
    url: value,
    format: new GeoJSON(),
  });
  let style = new Style({
    stroke: new Stroke({
      color: "#007bbb",
      width: width,
    }),
    fill: new Fill({
      color: "rgba(0,0,0,0)",
    }),
  });
  vectorLayer.setSource(source);
  vectorLayer.setStyle(style);
};
const removeLayer = () => {
  vectorLayer.setSource(null);
  featureLayer.setSource(null);
  rasterLayer.setSource(null);
};

// 底图缩放
let MapZoom = (lon, lat, zoom) => {
  let view = map.getView();
  var loc = fromLonLat([lon, lat]);
  view.animate({
    center: loc,
    duration: 0,
  });
  view.setZoom(zoom);
};
// 比例尺
const scaleControl = new ScaleLine({
  units: "metric",
});
// 鼠标位置
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(2),
  projection: "EPSG:4326",
  className: "custom-mouse-position",
  target: document.getElementById("mouse-position"),
});
// 鹰眼
const overviewMapControl = new OverviewMap({
  collapsed: false,
  layers: [
    new TileLayer({
      source: new OSM({
        url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=214369c2e1984d369e2f13fcaed16233",
      }),
    }),
  ],
});

export default {
  initMap,
  changeRaster,
  changeFeature,
  changeVector,
  removeLayer,
  getMap,
  menuClickEvent,
  getOverlay,
  getContent,
  MapZoom,
};
