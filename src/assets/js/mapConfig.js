import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { defaults, ScaleLine, MousePosition, OverviewMap } from "ol/control";
import { createStringXY } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { OSM, TileWMS, XYZ } from "ol/source";

// 工作空间URL
const urlRoot = "http://localhost:8080/geoserver/CMIP/wms";

let map = null;
let CMIP_Raster = null;
// 地图
const TianDiTu_Map = new TileLayer({
  className: "baseLayerClass",
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
const ThunderForest = new TileLayer({
  source: new XYZ({
    url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=214369c2e1984d369e2f13fcaed16233",
  }),
});

// 地图初始化
const initMap = () => {
  map = new Map({
    layers: [TianDiTu_Map, TianDiTu_CVA],
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
// 清除所有图层
const removeAllLayers = () => {
  let layers = map.getLayers().getArray();
  for (let i = layers.length - 1; i >= 0; i--) {
    map.removeLayer(layers[i]);
  }
};
// 切换底图
const changeMap = (type) => {
  removeAllLayers();
  if (type == 1) {
    map.addLayer(TianDiTu_Map);
    map.addLayer(TianDiTu_CVA);
  } else if (type == 2) {
    map.addLayer(TianDiTu_TMG);
    map.addLayer(TianDiTu_CIA);
  } else if (type == 3) {
    map.addLayer(ThunderForest);
  }
};
// 菜单点击事件
const menuClickEvent = (menu_router) => {
  if (menu_router == "map1") {
    changeMap(1);
  } else if (menu_router == "map2") {
    changeMap(2);
  } else if (menu_router == "map3") {
    changeMap(3);
  }
  return 1;
};
// 获取当前地图变量
const getMap = () => {
  return map;
};
// 添加栅格图层
const addRasterLayer = (value) => {
  // 存在栅格图层时清除栅格图层
  removeRaster();
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
// 清除栅格图层
const removeRaster = () => {
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
  addRasterLayer,
  getMap,
  changeMap,
  removeRaster,
  menuClickEvent,
};
