import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { defaults, ScaleLine, MousePosition, OverviewMap } from "ol/control";
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
let mapFlag = 0;
let CMIP_Raster = null;
// 地图
const TianDiTu_Map = new TileLayer({
  source: new XYZ({
    url:
      "http://t" +
      Math.round(Math.random() * 7) +
      ".tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
  }),
});
const TianDiTu_CVA = new TileLayer({
  source: new XYZ({
    url:
      "http://t" +
      Math.round(Math.random() * 7) +
      ".tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
  }),
});
const TianDiTu_TMG = new TileLayer({
  source: new XYZ({
    url:
      "http://t" +
      Math.round(Math.random() * 7) +
      ".tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
  }),
});
const TianDiTu_CIA = new TileLayer({
  source: new XYZ({
    url:
      "http://t" +
      Math.round(Math.random() * 7) +
      ".tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
  }),
});

// 地图初始化
const initMap = () => {
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
    }).extend([scaleControl, mousePositionControl, overviewMap]),
  });
};
// 切换卫星图
const changeMap = () => {
  let layers = map.getLayers().getArray();
  for (let i = layers.length - 1; i >= 0; i--) {
    map.removeLayer(layers[i]);
  }
  if (mapFlag == 0) {
    mapFlag = 1;
    map.addLayer(TianDiTu_TMG);
    map.addLayer(TianDiTu_CIA);
  } else {
    mapFlag = 0;
    map.addLayer(TianDiTu_Map);
    map.addLayer(TianDiTu_CVA);
  }
};
// 菜单点击事件
const menuClickEvent = (menu_router) => {
  if (menu_router == "map1") {
    mapFlag = 1;
    changeMap();
  } else {
    mapFlag = 0;
    changeMap();
  }
};
// 获取当前地图变量
const getMap = () => {
  return map;
};
// 添加图层
const addLayer = (value) => {
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
// 清除图层
const removeLayer = () => {
  if (CMIP_Raster) {
    map.removeLayer(CMIP_Raster);
  }
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
const overviewMap = new OverviewMap({
  collapsed: false,
  layers: [
    new TileLayer({
      source: new XYZ({
        url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a09b07dabc667ef1fbc9df093f3fbce9",
      }),
    }),
  ],
});
const location = (lon, lat) => {
  let view = map.getView();
  var loc = fromLonLat([lon, lat]);
  view.animate({
    center: loc,
    duration: 0,
  });
  if ((lon == 110) & (lat == 38)) {
    view.setZoom(4.5);
  } else {
    view.setZoom(8);
  }
};
export default {
  initMap,
  addLayer,
  removeLayer,
  getMap,
  changeMap,
  menuClickEvent,
  location,
};
