<template>
	<Legend :CMIP_Value="CMIP_Value" :Type="Type" ref="LegendRef"></Legend>
	<el-button type="primary" id="show-trend" :class="{ open_trend: message.flag, close_trend: !message.flag }" @click="resultShow">{{
		message.msg
	}}</el-button>
	<!-- 指数选择器 -->
	<el-card id="trend" class="box-card-trend" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
		<CMIPValueSelect @changeCMIP="changeCMIP"></CMIPValueSelect>
		<SSPValueSelect @changeSSP="changeSSP"></SSPValueSelect>
	</el-card>
	<!-- 对比窗口 -->
	<el-button type="primary" id="show-contrast" @click="resultShow1">{{ contrast.msg }}</el-button>
	<el-card id="contrast_area" :class="{ 'open-card-X': contrast.flag, 'close-card-X': !contrast.flag }">
		<div id="chart"></div>
	</el-card>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance, watch } from "vue";
import Legend from "@/components/Legend.vue";
import CMIPValueSelect from "@/components/CMIP_Value_Select.vue";
import SSPValueSelect from "@/components/SSP_Value_Select.vue";

const global = getCurrentInstance().appContext.config.globalProperties;
let echarts = global.$echarts;
let axios = global.$axios;
// 子组件
let LegendRef = ref(null);

onMounted(() => {
	global.$mapConfig.MapZoom(110, 35, 4.5);
	global.$mapConfig.removeLayer();
	LegendRef.value.legendRender();
	drawEchart();
	global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN");
	global.$mapConfig.changeFeature("CMIP:China_Area");
});
const contrast = ref({
	msg: "收起窗口",
	flag: true,
});
const message = ref({
	msg: "收起",
	flag: true,
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
watch(CMIP_Value, (newCMIP, oldCMIP) => {
	drawEchart();
});
// 结果图加载
let RasterLoad = () => {
	global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN");
	LegendRef.value.legendRender();
};
let drawEchart = () => {
	const jsonUrl = "./json/Area.json";
	axios.get(jsonUrl, {}).then((res) => {
		let CMIP = CMIP_Value.value;
		let data = res.data[CMIP];
		var chartDom = document.getElementById("chart");
		var myChart = echarts.init(chartDom);
		var option;
		option = {
			title: {
				text: "区域指数均值盒须图",
			},
			dataset: [
				{
					source: data[0],
				},
				{
					source: data[1],
				},
				{
					source: data[2],
				},
				{
					fromDatasetIndex: 0,
					transform: { type: "boxplot" },
				},
				{
					fromDatasetIndex: 1,
					transform: { type: "boxplot" },
				},
				{
					fromDatasetIndex: 2,
					transform: { type: "boxplot" },
				},
			],
			legend: {
				right: "0",
			},
			tooltip: {
				trigger: "item",
				axisPointer: {
					type: "shadow",
				},
			},
			grid: {
				left: "3%",
				right: "4%",
				bottom: "3%",
				containLabel: true,
			},
			xAxis: {
				type: "category",
				axisLabel: {
					formatter: function (value) {
						const regions = ["NEC(东北)", "NC(北部)", "NWC(西北)", "EC(东部)", "CC(中部)", "SWC1(西南1)", "SWC2(西南2)", "SC(南部)"];
						return regions[value];
					},
				},
			},
			yAxis: {
				type: "value",
				name: "Value",
			},
			series: [
				{
					name: "SSP1-2.6",
					type: "boxplot",
					datasetIndex: 3,
					itemStyle: { borderWidth: 2 },
				},
				{
					name: "SSP2-4.5",
					type: "boxplot",
					datasetIndex: 4,
					itemStyle: { borderWidth: 2 },
				},
				{
					name: "SSP5-8.5",
					type: "boxplot",
					datasetIndex: 5,
					itemStyle: { borderWidth: 2 },
				},
			],
		};
		myChart.clear();
		option && myChart.setOption(option);
	});
};
</script>
<style scoped></style>
