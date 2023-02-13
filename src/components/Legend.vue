<template>
  <div class="Legend"></div>
</template>
<script>
import { getCurrentInstance } from "vue";
export default {
  props: ["CMIP_Value"],
  setup(props) {
    const global = getCurrentInstance().appContext.config.globalProperties;
    let axios = global.$axios;
    let echarts = global.$echarts;
    const legendRender = () => {
      const jsonUrl = "./json/legend.json";
      axios.get(jsonUrl, { headers: {}, emulateJSON: true }).then((res) => {
        let data = res.data.MK_SEN;
        let color = null;
        let text = null;
        let type = null;
        if (props.CMIP_Value == "CSDI") {
          type = 0;
        } else if (props.CMIP_Value == "WSDI") {
          type = 1;
        } else if (props.CMIP_Value == "TN10P") {
          type = 2;
        } else if (props.CMIP_Value == "TN90P") {
          type = 3;
        } else if (props.CMIP_Value == "TX10P") {
          type = 4;
        } else if (props.CMIP_Value == "TX90P") {
          type = 5;
        }
        text = data[type].text;
        color = data[type].color;
        let barChart = echarts.init(document.querySelector(".Legend"));
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
    };
  },
};
</script>
<style>
.Legend {
  width: 75px;
  height: 200px;
  position: absolute;
  left: 2%;
  bottom: 150px;
  border: 1px solid #409eff;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}
</style>
