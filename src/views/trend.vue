<template>
	<Legend :CMIP_Value="CMIP_Value" :Type="Type" ref="LegendRef"></Legend>
	<el-button type="primary" id="show-trend" :class="{ open_trend: message.flag, close_trend: !message.flag }" @click="resultShow">{{
		message.msg
	}}</el-button>
	<el-card id="trend" class="box-card-trend" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
		<CMIPValueSelect @changeCMIP="changeCMIP"></CMIPValueSelect>
		<SSPValueSelect @changeSSP="changeSSP"></SSPValueSelect>
		<div id="selectRow" style="display: flex; float: right">
			<el-button color="#409EFF" plain @click="ReLoad()"><span class="iconfont">&#xe782; </span><span>重新加载</span></el-button>
			<el-button color="#409EFF" plain @click="removeLayer()"><span class="iconfont">&#xe74b; </span><span>清除图层</span></el-button>
		</div>
	</el-card>
	<!-- 对比窗口 -->
	<el-button type="primary" id="show-contrast" @click="resultShow1">{{ contrast.msg }}</el-button>
	<el-card id="contrast" :class="{ 'open-card-X': contrast.flag, 'close-card-X': !contrast.flag }">
		<div>
			<el-button @click="contrastBtn" type="primary">对比</el-button>
			<el-text style="padding: 0 8px; font-weight: 700" class="mx-1" size="large">{{ city2.CMIP_Value }}</el-text>
			<el-text style="padding: 0 8px; font-weight: 700" class="mx-1" size="large">{{ city1.name }}</el-text>
			<el-text style="padding: 0 8px; font-weight: 700" class="mx-1" type="primary" size="large">对比</el-text>
			<el-text style="padding: 0 8px; font-weight: 700" class="mx-1" size="large">{{ city2.name }}</el-text>
		</div>
		<div id="contrast-content" style="width: 100%; height: 200px"></div>
	</el-card>
</template>
<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance, watch } from "vue";
import { Fill, Stroke, Style } from "ol/style.js";
import Legend from "@/components/Legend.vue";
import { ElMessage } from "element-plus";
import CMIPValueSelect from "@/components/CMIP_Value_Select.vue";
import SSPValueSelect from "@/components/SSP_Value_Select.vue";
const global = getCurrentInstance().appContext.config.globalProperties;
let echarts = global.$echarts;
// 子组件
let LegendRef = ref(null);

onMounted(() => {
	global.$mapConfig.MapZoom(110, 35, 4.5);
	global.$mapConfig.removeLayer();
	ReLoad();
	LegendRef.value.legendRender();
	drawContrast();
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
	flag: true,
});
const contrast = ref({
	msg: "收起窗口",
	flag: true,
});
let city1 = ref({
	CMIP_Value: "WSDI",
	name: "河北",
	data: [1.88229888482, 6.91878883065, 20.0275192027],
});
let city2 = ref({
	CMIP_Value: "WSDI",
	name: "云南",
	data: [11.1327442957, 21.3738245735, 38.8525626326],
});
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
const Type = ref(1);
// 子组件事件
let changeCMIP = (value) => {
	CMIP_Value.value = value;
};
let changeSSP = (value) => {
	SSP_Value.value = value;
};
// 监听数值变化
watch([CMIP_Value, SSP_Value], ([newCMIP, oldCMIP], [newSSP, oldSSP]) => {
	RasterLoad();
});
// 结果图加载
let RasterLoad = () => {
	DELOverlay();
	global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN");
	LegendRef.value.legendRender();
};
// 清除图层
let removeLayer = () => {
	global.$mapConfig.removeLayer();
};
let ReLoad = () => {
	global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN");
	global.$mapConfig.changeVector("./geojson/China_MK_SEN.geojson", 0.5);
};
// 鼠标选中样式
let highFeature = null;
let selectStyle = new Style({
	stroke: new Stroke({
		color: "#0095d9",
		width: 3,
	}),
	fill: new Fill({
		color: "rgba(56,161,219,0.2)",
	}),
});
let defaultStyle = new Style({
	stroke: new Stroke({
		color: "#007bbb",
		width: 0.5,
	}),
	fill: new Fill({
		color: "rgba(0,0,0,0)",
	}),
});
// 鼠标移动监听器
let pointermove = (event) => {
	let pixel = event.pixel;
	let features = global.$mapConfig.getMap().forEachFeatureAtPixel(pixel, function (feature, layer) {
		return {
			feature: feature,
			layer: layer,
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
// 对比及地图点击弹窗
let drawContrast = () => {
	var chartDom = document.getElementById("contrast-content");
	var myChart = echarts.init(chartDom);
	var option;
	ElMessage({
		message: "完成",
		type: "success",
		duration: 1000,
		offset: 5,
	});
	option = {
		title: {
			text: "区域变化均值对比",
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow",
			},
		},
		legend: {},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			containLabel: true,
		},
		yAxis: {
			type: "value",
			boundaryGap: [0, 0.01],
		},
		xAxis: {
			type: "category",
			data: ["SSP1-2.6", "SSP2-4.5", "SSP5-8.5"],
		},
		series: [
			{
				name: city1.value.name,
				type: "bar",
				data: [city1.value.data[0], city1.value.data[1], city1.value.data[2]],
			},
			{
				name: city2.value.name,
				type: "bar",
				data: [city2.value.data[0], city2.value.data[1], city2.value.data[2]],
			},
		],
	};
	option && myChart.setOption(option);
};
// 对比按钮点击
let contrastBtn = () => {
	ElMessage({
		message: "请用鼠标选择要进行对比的第一个地区",
		duration: 5000,
		offset: 5,
		customClass: "elmessage",
	});
	city1.value.name = "";
	city2.value.name = "";
};
// 地图单击事件
let pointerclick = (event) => {
	const coordinate = event.coordinate;
	let overlay = global.$mapConfig.getOverlay();
	let pixel = event.pixel;
	let features = global.$mapConfig.getMap().forEachFeatureAtPixel(pixel, function (feature, layer) {
		return {
			feature: feature,
			layer: layer,
		};
	});
	if (features) {
		let title = features.feature.values_.NAME + "  " + CMIP_Value.value + "区域变化均值(通过95%显著性检验)";
		let data1;
		let data2;
		let data3;
		if (CMIP_Value.value == "CSDI") {
			data1 = features.feature.values_.CSDI126;
			data2 = features.feature.values_.CSDI245;
			data3 = features.feature.values_.CSDI585;
		} else if (CMIP_Value.value == "WSDI") {
			data1 = features.feature.values_.WSDI126;
			data2 = features.feature.values_.WSDI245;
			data3 = features.feature.values_.WSDI585;
		} else if (CMIP_Value.value == "TN10P") {
			data1 = features.feature.values_.TN10P126;
			data2 = features.feature.values_.TN10P245;
			data3 = features.feature.values_.TN10P585;
		} else if (CMIP_Value.value == "TN90P") {
			data1 = features.feature.values_.TN90P126;
			data2 = features.feature.values_.TN90P245;
			data3 = features.feature.values_.TN90P585;
		} else if (CMIP_Value.value == "TX10P") {
			data1 = features.feature.values_.TX10P126;
			data2 = features.feature.values_.TX10P245;
			data3 = features.feature.values_.TX10P585;
		} else if (CMIP_Value.value == "TX90P") {
			data1 = features.feature.values_.TX90P126;
			data2 = features.feature.values_.TX90P245;
			data3 = features.feature.values_.TX90P585;
		}
		// 对比事件数据
		if (city2.value.name != "") {
			overlay.setPosition(coordinate);
		} else {
			overlay.setPosition(undefined);
		}
		if (city1.value.name == "") {
			ElMessage({
				message: "请用鼠标选择要进行对比的第二个地区",
				duration: 5000,
				offset: 5,
				customClass: "elmessage",
			});
			city1.value.CMIP_Value = CMIP_Value.value;
			city1.value.name = features.feature.values_.NAME;
			city1.value.data[0] = data1;
			city1.value.data[1] = data2;
			city1.value.data[2] = data3;
		} else if (city2.value.name == "") {
			city2.value.CMIP_Value = CMIP_Value.value;
			city2.value.name = features.feature.values_.NAME;
			city2.value.data[0] = data1;
			city2.value.data[1] = data2;
			city2.value.data[2] = data3;
			drawContrast();
		}
		// 渲染统计表
		var chartDom = global.$mapConfig.getContent();
		var myChart = echarts.init(chartDom);
		var option;
		const labelRight = {
			position: "right",
		};
		option = {
			title: {
				text: title,
			},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "shadow",
				},
			},
			grid: {
				top: 40,
				bottom: 20,
				right: 60,
				left: 60,
			},
			xAxis: {
				type: "value",
				position: "bottom",
				splitLine: {
					lineStyle: {
						type: "dashed",
					},
				},
			},
			yAxis: {
				type: "category",
				axisLine: { show: false },
				axisLabel: { show: false },
				axisTick: { show: false },
				splitLine: { show: false },
				data: ["SSP1-2.6", "SSP2-4.5", "SSP5-8.5"],
			},
			series: [
				{
					name: "value",
					type: "bar",
					stack: "Total",
					label: {
						show: true,
						formatter: "{b}",
					},
					data: [
						{
							value: data1,
							label: labelRight,
							itemStyle: {
								color: "#2ca9e1",
							},
						},
						{
							value: data2,
							label: labelRight,
							itemStyle: {
								color: "#f6ad49",
							},
						},
						{
							value: data3,
							itemStyle: {
								color: "#e83929",
							},
						},
					],
				},
			],
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
	global.$mapConfig.getMap().on("singleclick", pointerclick);
};
// 终止监听器
let DELdesignClickOnMap = () => {
	global.$mapConfig.getMap().un("singleclick", pointerclick);
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
	bottom: 0px;
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
#contrast {
	position: absolute;
	width: 500px;
	height: 300px;
	right: 0;
	bottom: 90px;
}
#trend ::v-deep .el-card__body {
	display: flex;
	justify-content: flex-end;
}
</style>
