import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { defaults, ScaleLine, MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";
import { fromLonLat, get as getProjection } from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, TileWMS, XYZ, Vector as VectorSource } from "ol/source";
import { Stroke, Style, Fill, Circle } from "ol/style";
import { WFS, GeoJSON } from "ol/format";
import { equalTo, intersects } from "ol/format/filter";
import Draw from "ol/interaction/Draw";

// 工作空间URL
const urlRoot = "http://localhost:8080/geoserver/CMIP/wms";

let map = null;
let CMIP_Raster = null;
// 地图
let TianDiTu_Map = new TileLayer({
  source: new XYZ({
    url:
      "http://t" +
      Math.round(Math.random() * 7) +
      ".tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
  }),
});
let TianDiTu_CVA = new TileLayer({
  source: new XYZ({
    url:
      "http://t" +
      Math.round(Math.random() * 7) +
      ".tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
  }),
});
// 地图初始化
let initMap = () => {
  map = new Map({
    layers: [TianDiTu_Map, TianDiTu_CVA],
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
// 获取当前地图变量
let getMap = () => {
  return map;
};
// 添加图层
let addLayer = (value) => {
  // 存在栅格图层时清除栅格图层
  if (CMIP_Raster) {
    map.removeLayer(CMIP_Raster);
  }
  // 栅格加载
  CMIP_Raster = new TileLayer({
    source: new TileWMS({
      url: urlRoot,
      params: {
        LAYERS: value,
      },
    }),
  });
  map.addLayer(CMIP_Raster);
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

export default {
  initMap,
  addLayer,
  getMap,
};
