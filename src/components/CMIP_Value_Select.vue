<template>
  <div id="selectRow">
    <span class="select-span">极端指数选择：</span>
    <el-radio-group v-model="CMIP_Value" @change="changeCMIP()">
      <el-tooltip class="box-item" effect="customized" content="暖期持续时间指数" placement="top">
        <el-radio-button label="WSDI">WSDI</el-radio-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="customized" content="寒潮持续时间指数" placement="top">
        <el-radio-button label="CSDI">CSDI</el-radio-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="customized" content="冷夜指数" placement="top">
        <el-radio-button label="TN10P">TN10P</el-radio-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="customized" content="暖夜指数" placement="top">
        <el-radio-button label="TN90P">TN90P</el-radio-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="customized" content="冷昼指数" placement="top">
        <el-radio-button label="TX10P">TX10P</el-radio-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="customized" content="暖昼指数" placement="top">
        <el-radio-button label="TX90P">TX90P</el-radio-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="customized" content="持续干旱指数" placement="top">
        <el-radio-button label="CDD">CDD</el-radio-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="customized" content="持续湿润指数" placement="top">
        <el-radio-button label="CWD">CWD</el-radio-button>
      </el-tooltip>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref } from "vue";
const CMIP_Value = ref("WSDI");

const emits = defineEmits(["changeCMIP"]);

const changeCMIP = () => {
  emits("changeCMIP", CMIP_Value.value);
};
</script>

<style scoped></style>
