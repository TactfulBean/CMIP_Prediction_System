<template>
  <div class="Legend">
    <div style="width: 100%">{{ unit }}</div>
    <div id="Legend" style="height: 200px"></div>
  </div>
</template>
<script>
import { ref, getCurrentInstance } from "vue";
export default {
  props: ["CMIP_Value", "Type"],
  setup(props) {
    const global = getCurrentInstance().appContext.config.globalProperties;
    let axios = global.$axios;
    let echarts = global.$echarts;
    let unit = ref(null);
    const legendRender = () => {
      const jsonUrl = "./json/legend.json";
      axios.get(jsonUrl, { headers: {}, emulateJSON: true }).then((res) => {
        // 选择类型
        let data = null;
        if (props.Type == 1) {
          data = res.data.MK_SEN;
        } else if (props.Type == 2) {
          data = res.data.TIME_LINE;
        }
        let color = null;
        let text = null;
        let type = null;
        if (props.CMIP_Value == "CSDI") {
          type = 0;
          unit.value = "(天)";
        } else if (props.CMIP_Value == "WSDI") {
          type = 1;
          unit.value = "(天)";
        } else if (props.CMIP_Value == "TN10P") {
          type = 2;
          unit.value = "(%)";
        } else if (props.CMIP_Value == "TN90P") {
          type = 3;
          unit.value = "(%)";
        } else if (props.CMIP_Value == "TX10P") {
          type = 4;
          unit.value = "(%)";
        } else if (props.CMIP_Value == "TX90P") {
          type = 5;
          unit.value = "(%)";
        }
        text = data[type].text;

        color = data[type].color;
        let barChart = echarts.init(document.querySelector("#Legend"));
        const option = {
          xAxis: { name: "", axisLine: { show: false } },
          yAxis: { type: "", axisLine: { show: false } },
          visualMap: {
            min: text[1],
            max: text[0],
            text: text,
            inRange: {
              color: color,
            },
            textStyle: {
              color: "#434394",
              fontSize: 14,
              fontWeight: 700,
            },
          },
        };
        barChart.clear();
        barChart.setOption(option);
      });
    };
    return {
      legendRender,
      unit,
    };
  },
};
</script>
<style>
.Legend {
  width: 75px;
  height: 220px;
  position: absolute;
  left: 2%;
  bottom: 190px;
  border: 1px solid #409eff;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}
</style>
