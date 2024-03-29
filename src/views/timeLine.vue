<template>
	<Legend :CMIP_Value="CMIP_Value" :Type="Type" ref="LegendRef"></Legend>
	<div id="show-time">
		<el-button type="primary" :class="{ open_time: message.flag, close_time: !message.flag }" @click="resultShow()">{{ message.msg }}</el-button>
	</div>
	<div id="time" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
		<el-card class="box-card-time">
			<template #header>
				<CMIPValueSelect @changeCMIP="changeCMIP" style="margin-right: auto"></CMIPValueSelect>
				<div id="selectRow" style="display: flex">
					<el-button color="#409EFF" plain @click="reTimeSet()"
						><span class="iconfont">&#xe782; </span><span>{{ timeSet.message }}</span></el-button
					>
				</div>
			</template>
			<div class="slider-demo-block">
				<el-slider v-model="year" :step="10" show-stops :min="2021" :max="2100" :marks="marks" @change="print()" />
			</div>
		</el-card>
	</div>
	<el-button type="primary" id="show-timeLine" @click="resultShow1()">{{ timeLine.msg }}</el-button>
	<el-card id="timeLine" :class="{ 'open-card-X': timeLine.flag, 'close-card-X': !timeLine.flag }">
		<div id="timeLine-content" style="width: 100%; height: 100%"></div>
	</el-card>
</template>
<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance, watch } from "vue";
import Legend from "@/components/Legend.vue";
import CMIPValueSelect from "@/components/CMIP_Value_Select.vue";

const global = getCurrentInstance().appContext.config.globalProperties;
let echarts = global.$echarts;
let axios = global.$axios;
onMounted(() => {
	global.$mapConfig.MapZoom(110, 35, 4.5);
	global.$mapConfig.removeLayer();
	global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_SSP2-4.5_" + year.value);
	global.$mapConfig.changeVector("./geojson/China_MK_SEN.geojson", 0.5);
	drawEchart();
	RasterLoad();
});
onUnmounted(() => {
	clearInterval(timeSet.value.interval);
});
// 子组件
let LegendRef = ref(null);

const message = ref({
	msg: "收起",
	flag: true
});
const timeLine = ref({
	msg: "收起窗口",
	flag: true
});
const marks = ref({
	2021: "2021",
	2031: "2031",
	2041: "2041",
	2051: "2051",
	2061: "2061",
	2071: "2071",
	2081: "2081",
	2091: "2091",
	2100: "2100"
});
let resultShow = () => {
	message.value.msg = message.value.flag ? "展开" : "收起";
	message.value.flag = !message.value.flag;
};

let resultShow1 = () => {
	timeLine.value.msg = timeLine.value.flag ? "展开窗口" : "收起窗口";
	timeLine.value.flag = !timeLine.value.flag;
};
const CMIP_Value = ref("WSDI");
const Type = ref(2);
const year = ref(2021);
let timeSet = ref({
	interval: null,
	message: "暂停播放",
	flag: true
});
// 子组件事件
let changeCMIP = (value) => {
	CMIP_Value.value = value;
};
// 监听数值变化
watch(CMIP_Value, () => {
	RasterLoad();
});

let RasterLoad = () => {
	year.value = 2021;
	clearInterval(timeSet.value.interval);
	LegendRef.value.legendRender();
	drawEchart();
	setTimeSet();
};
let setTimeSet = () => {
	timeSet.value.interval = setInterval(function () {
		if (!timeSet.value.flag) {
			if (year.value === 2091) {
				year.value += 9;
			} else {
				year.value += 10;
			}
		}
		timeSet.value.flag = false;
		global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_SSP2-4.5_" + year.value);
		//
		if (year.value >= 2100) {
			timeSet.value.message = "重新播放";
			clearInterval(timeSet.value.interval);
		}
	}, 2500);
	timeSet.value.message = "暂停播放";
};
let reTimeSet = () => {
	if (timeSet.value.message === "继续播放") {
		setTimeSet();
		timeSet.value.message = "暂停播放";
	} else if (timeSet.value.message === "暂停播放") {
		clearInterval(timeSet.value.interval);
		timeSet.value.message = "继续播放";
	} else if (timeSet.value.message === "重新播放") {
		year.value = 2021;
		setTimeSet();
		timeSet.value.message = "暂停播放";
	}
};
let print = () => {
	if (year.value !== 2100 && timeSet.value.message === "重新播放") {
		timeSet.value.message = "继续播放";
	}
	global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_SSP2-4.5_" + year.value);
};
let base = 2021;
let time = new Array(80);
for (let i = 0; i < time.length; i++) {
	time[i] = base;
	base += 1;
}
// 折线图渲染
let drawEchart = () => {
	const CMIPTexts = {
		CSDI: "寒潮持续时间指数",
		WSDI: "暖期持续时间指数",
		TN10P: "冷夜",
		TN90P: "暖夜",
		TX10P: "冷昼",
		TX90P: "暖昼",
		CDD: "持续干旱指数",
		CWD: "持续湿润指数"
	};

	const jsonUrl = "./json/SSP.json";
	axios.get(jsonUrl).then((res) => {
		const CMIP = CMIP_Value.value;
		const data = res.data[CMIP];
		const [data1, data2, data3] = [data[0].data, data[1].data, data[2].data];
		const CMIPText = CMIPTexts[CMIP];

		let chartDom = document.getElementById("timeLine-content");
		let myChart = echarts.init(chartDom);
		let option;

		option = {
			title: {
				text: CMIP_Value.value + "(" + CMIPText + ")" + "年均趋势图"
			},
			grid: {
				left: "5%",
				top: "30%",
				right: "0%",
				bottom: "10%"
			},
			tooltip: {
				trigger: "axis"
			},
			legend: {
				data: ["SSP1-2.6", "SSP2-4.5", "SSP5-8.5"],
				right: 0
			},
			xAxis: {
				type: "category",
				data: time
			},
			yAxis: {
				type: "value"
			},
			series: [
				{
					name: "SSP1-2.6",
					data: data1,
					type: "line",
					smooth: true,
					symbol: "none",
					itemStyle: {
						color: "#2ca9e1"
					}
				},
				{
					name: "SSP2-4.5",
					data: data2,
					type: "line",
					smooth: true,
					symbol: "none",
					itemStyle: {
						color: "#f6ad49"
					}
				},
				{
					name: "SSP5-8.5",
					data: data3,
					type: "line",
					smooth: true,
					symbol: "none",
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
</script>
<style scoped>
.slider-demo-block {
	padding: 0 30px;
}
#time {
	position: absolute;
	z-index: 10;
	width: 100%;
	bottom: 0;
}
#show-time {
	position: absolute;
	z-index: 10;
	bottom: 149px;
}
.open_time {
	animation: open-tean 0.75s !important;
}
.close_time {
	animation: close-time 0.75s !important;
	transform: translateY(152px);
}
/* 折线图窗口 */
#show-timeLine {
	position: absolute;
	z-index: 10;
	bottom: 160px;
	right: 0;
}
#timeLine {
	position: absolute;
	width: 700px;
	height: 300px;
	right: 0;
	bottom: 160px;
}
.box-card-time :deep(.el-card__header) {
	display: flex;
	justify-content: flex-end;
}
</style>
