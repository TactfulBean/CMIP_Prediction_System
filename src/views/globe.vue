<template>
	<Legend ref="LegendRef" :CMIP_Value="CMIP_Value" :Type="Type"></Legend>
	<el-button id="show-trend" :class="{ open_trend: message.flag, close_trend: !message.flag }" type="primary" @click="resultShow()"
		>{{ message.msg }}
	</el-button>
	<!-- 指数选择器 -->
	<el-card id="trend" :class="{ 'result-open': message.flag, 'result-close': !message.flag }" class="box-card-trend">
		<CMIPValueSelect @changeCMIP="changeCMIP"></CMIPValueSelect>
		<SSPValueSelect @changeSSP="changeSSP" ref="SSPValueSelectRef"></SSPValueSelect>
		<div id="selectRow">
			<el-text style="padding: 8px; font-weight: 700" class="mx-1" size="large">时间选择：</el-text>
			<el-select
				v-model="Time_Value"
				class="m-2"
				placeholder="Select"
				@change="
					RasterLoad();
					changeSSPValue('SSP2-4.5');
				"
			>
				<el-option v-for="item in Time_Options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>
		<div id="selectRow" style="display: flex; float: right">
			<el-button color="#409EFF" plain @click="ReLoad()"><span class="iconfont">&#xe782; </span><span>重新加载</span></el-button>
			<el-button color="#409EFF" plain @click="removeLayer()"><span class="iconfont">&#xe74b; </span><span>清除图层</span></el-button>
		</div>
	</el-card>
	<!-- 对比窗口 -->
	<el-button id="show-contrast" type="primary" @click="resultShow1()">{{ contrast.msg }}</el-button>
	<el-card id="contrast_world" :class="{ 'open-card-X': contrast.flag, 'close-card-X': !contrast.flag }">
		<div id="contrast-content_world" style="width: 100%; height: 350px"></div>
	</el-card>
	<el-card id="contrast-top" :class="{ 'open-card-X-top': contrast.flag, 'close-card-X-top': !contrast.flag }">各时间段数值对比</el-card>
</template>
<script setup>
import { getCurrentInstance, onMounted, onUnmounted, ref, watch } from "vue";
import Legend from "@/components/Legend.vue";
import { Fill, Stroke, Style } from "ol/style.js";
import CMIPValueSelect from "@/components/CMIP_Value_Select.vue";
import SSPValueSelect from "@/components/SSP_Value_Select.vue";

const global = getCurrentInstance().appContext.config.globalProperties;
// 子组件
let LegendRef = ref(null);
let SSPValueSelectRef = ref(null);
let echarts = global.$echarts;
let axios = global.$axios;
onMounted(() => {
	global.$mapConfig.MapZoom(160, 20, 0);
	global.$mapConfig.removeLayer();
	ReLoad();
	LegendRef.value.legendRender();
	drawEchart();
	designHoverOnMap();
	designClickOnMap();
});
onUnmounted(() => {
	DELOverlay();
	DELdesignHoverOnMap();
	DELdesignClickOnMap();
});
const message = ref({
	msg: "收起",
	flag: true
});
const contrast = ref({
	msg: "收起窗口",
	flag: true
});
const Time_Options = [
	{ value: "", label: "2021-2100" },
	{ value: "_2021-2040", label: "2021-2040" },
	{ value: "_2041-2060", label: "2041-2060" },
	{ value: "_2061-2080", label: "2061-2080" },
	{ value: "_2081-2100", label: "2081-2100" }
];
let resultShow = () => {
	message.value.msg = message.value.flag ? "展开" : "收起";
	message.value.flag = !message.value.flag;
};

let resultShow1 = () => {
	contrast.value.msg = contrast.value.flag ? "展开窗口" : "收起窗口";
	contrast.value.flag = !contrast.value.flag;
};
const SSP_Value = ref("SSP2-4.5");
const CMIP_Value = ref("WSDI");
const Time_Value = ref("");
const Type = ref(1);
// 子组件事件
let changeCMIP = (value) => {
	CMIP_Value.value = value;
};
let changeSSP = (value) => {
	SSP_Value.value = value;
};
let changeSSPValue = (value) => {
	SSPValueSelectRef.value.changeSSPValue(value);
};
// 监听数值变化
watch([CMIP_Value, SSP_Value], () => {
	RasterLoad();
});
watch(CMIP_Value, () => {
	drawEchart();
});
// 结果图加载
let RasterLoad = () => {
	DELOverlay();
	global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + Time_Value.value + "_MK_SEN_World");
	LegendRef.value.legendRender();
};
let ReLoad = () => {
	global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + Time_Value.value + "_MK_SEN_World");
	// global.$mapConfig.changeFeature("CMIP:World");
	global.$mapConfig.changeVector("./geojson/World_MK_SEN.geojson", 1.5);
};
// 清除图层
let removeLayer = () => {
	global.$mapConfig.removeLayer();
};
let drawEchart = () => {
	const jsonUrl = "./json/World.json";
	let data = null;
	axios.get(jsonUrl, {}).then((res) => {
		let CMIP = CMIP_Value.value;
		if (CMIP === "CSDI") {
			data = res.data.CSDI;
		} else if (CMIP === "WSDI") {
			data = res.data.WSDI;
		} else if (CMIP === "TN10P") {
			data = res.data.TN10P;
		} else if (CMIP === "TN90P") {
			data = res.data.TN90P;
		} else if (CMIP === "TX10P") {
			data = res.data.TX10P;
		} else if (CMIP === "TX90P") {
			data = res.data.TX90P;
		} else if (CMIP === "CDD") {
			data = res.data.CDD;
		} else {
			data = res.data.CWD;
		}
		let chartDom = document.getElementById("contrast-content_world");
		let myChart = echarts.init(chartDom);
		let option = {
			title: {
				text: "各洲极端气候指数变化均值对比"
			},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "shadow"
				}
			},
			legend: {
				right: 0
			},
			grid: {
				left: "3%",
				right: "4%",
				bottom: "3%",
				containLabel: true
			},
			xAxis: {
				type: "category",
				data: ["非洲", "南极洲", "亚洲", "欧洲", "北美洲", "大洋洲", "南美洲"]
			},
			yAxis: {
				type: "value",
				boundaryGap: [0, 0.01]
			},
			series: [
				{
					name: "SSP1-2.6",
					type: "bar",
					data: [data[0][0], data[1][0], data[2][0], data[3][0], data[4][0], data[5][0], data[6][0]],
					itemStyle: {
						color: "#2ca9e1"
					}
				},
				{
					name: "SSP2-4.5",
					type: "bar",
					data: [data[0][1], data[1][1], data[2][1], data[3][1], data[4][1], data[5][1], data[6][1]],
					itemStyle: {
						color: "#f6ad49"
					}
				},
				{
					name: "SSP5-8.5",
					type: "bar",
					data: [data[0][2], data[1][2], data[2][2], data[3][2], data[4][2], data[5][2], data[6][2]],
					itemStyle: {
						color: "#e83929"
					}
				}
			]
		};
		myChart.clear();
		option && myChart.setOption(option);
	});
};
// 鼠标选中样式
let highFeature = null;
let selectStyle = new Style({
	stroke: new Stroke({
		color: "#0095d9",
		width: 3
	}),
	fill: new Fill({
		color: "rgba(56,161,219,0.2)"
	})
});
let defaultStyle = new Style({
	stroke: new Stroke({
		color: "#007bbb",
		width: 1.5
	}),
	fill: new Fill({
		color: "rgba(0,0,0,0)"
	})
});
// 鼠标移动监听器
let pointermove = (event) => {
	let pixel = event.pixel;
	let features = global.$mapConfig.getMap().forEachFeatureAtPixel(pixel, function (feature, layer) {
		return {
			feature: feature,
			layer: layer
		};
	});
	if (features) {
		global.$mapConfig.getMap().getTargetElement().style.cursor = "pointer";
		if (highFeature != null) {
			highFeature.setStyle(defaultStyle);
		}
		features.feature.setStyle(selectStyle);
		highFeature = features.feature;
	} else {
		if (highFeature) {
			highFeature.setStyle(defaultStyle);
		}
		global.$mapConfig.getMap().getTargetElement().style.cursor = "";
	}
};
// 启用监听器
let designHoverOnMap = () => {
	global.$mapConfig.getMap().on("pointermove", pointermove);
};
// 终止监听器
let DELdesignHoverOnMap = () => {
	global.$mapConfig.getMap().un("pointermove", pointermove);
};

// 地图单击事件
let pointerClick = (event) => {
	const coordinate = event.coordinate;
	let overlay = global.$mapConfig.getOverlay();
	let pixel = event.pixel;
	let features = global.$mapConfig.getMap().forEachFeatureAtPixel(pixel, function (feature, layer) {
		return {
			feature: feature,
			layer: layer
		};
	});
	if (features) {
		let title = features.feature.values_["NAME"] + "  " + CMIP_Value.value + "区域变化均值(通过95%显著性检验)";
		let data1;
		let data2;
		let data3;
		console.log(features.feature.values_);
		data1 = features.feature.values_[CMIP_Value.value + "126"];
		data2 = features.feature.values_[CMIP_Value.value + "245"];
		data3 = features.feature.values_[CMIP_Value.value + "585"];

		overlay.setPosition(coordinate);

		// 渲染统计表
		let chartDom = global.$mapConfig.getContent();
		let myChart = echarts.init(chartDom);
		let option;
		const labelRight = {
			position: "right"
		};
		option = {
			title: {
				text: title
			},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "shadow"
				}
			},
			grid: {
				top: 40,
				bottom: 20,
				right: 60,
				left: 60
			},
			xAxis: {
				type: "value",
				position: "bottom",
				splitLine: {
					lineStyle: {
						type: "dashed"
					}
				}
			},
			yAxis: {
				type: "category",
				axisLine: { show: false },
				axisLabel: { show: false },
				axisTick: { show: false },
				splitLine: { show: false },
				data: ["SSP1-2.6", "SSP2-4.5", "SSP5-8.5"]
			},
			series: [
				{
					name: "value",
					type: "bar",
					stack: "Total",
					label: {
						show: true,
						formatter: "{b}"
					},
					data: [
						{
							value: data1,
							label: labelRight,
							itemStyle: {
								color: "#2ca9e1"
							}
						},
						{
							value: data2,
							label: labelRight,
							itemStyle: {
								color: "#f6ad49"
							}
						},
						{
							value: data3,
							itemStyle: {
								color: "#e83929"
							}
						}
					]
				}
			]
		};
		myChart.clear();
		option && myChart.setOption(option);
		// 设置弹窗位置
		global.$mapConfig.getMap().addOverlay(overlay);
	} else {
		DELOverlay();
	}
};

// 启用监听器
let designClickOnMap = () => {
	global.$mapConfig.getMap().on("singleclick", pointerClick);
};
// 终止监听器
let DELdesignClickOnMap = () => {
	global.$mapConfig.getMap().un("singleclick", pointerClick);
};
// 弹出框隐藏
let DELOverlay = () => {
	let overlay = global.$mapConfig.getOverlay();
	overlay.setPosition(undefined);
};
</script>

<style scoped>
#trend {
	position: absolute;
	z-index: 10;
	width: 100%;
	bottom: 0;
	box-shadow: 2px 2px 3px rgb(0 0 0 / 30%);
}

#show-trend {
	position: absolute;
	z-index: 10;
	bottom: 79px;
	left: 20px;
}

.open_trend {
	animation: open_trend 0.75s !important;
}

.close_trend {
	animation: close_trend 0.75s !important;
	transform: translateY(82px);
}

#show-contrast {
	position: absolute;
	z-index: 10;
	right: 0;
	bottom: 90px;
}

#contrast_world {
	position: absolute;
	width: 600px;
	height: 400px;
	right: 0;
	bottom: 90px;
}

#contrast-top {
	position: absolute;
	width: 600px;
	height: 300px;
	right: 0;
	bottom: 500px;
}

#trend :deep(.el-card__body) {
	display: flex;
	justify-content: flex-end;
}
#selectRow {
	display: flex;
	margin-right: auto;
}
</style>
