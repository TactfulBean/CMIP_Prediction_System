<template>
	<div id="selectRow">
		<span class="select-span">情景选择：</span>
		<el-radio-group v-model="SSP_Value" @change="changeSSP()">
			<el-tooltip class="box-item" effect="customized" content="低辐射强迫情景（可持续发展路线）" placement="top">
				<el-radio-button label="SSP1-2.6">SSP1-2.6</el-radio-button>
			</el-tooltip>
			<el-tooltip class="box-item" effect="customized" content="中等辐射强迫情景（中等发展路线）" placement="top">
				<el-radio-button label="SSP2-4.5">SSP2-4.5</el-radio-button>
			</el-tooltip>
			<el-tooltip class="box-item" effect="customized" content="高辐射强迫情景（不平衡发展路线）" placement="top">
				<el-radio-button label="SSP5-8.5">SSP5-8.5</el-radio-button>
			</el-tooltip>
		</el-radio-group>
	</div>
</template>
<script setup>
import { ref } from "vue";
const SSP_Value = ref("SSP2-4.5");

const emits = defineEmits(["changeSSP"]);

const changeSSP = () => {
	emits("changeSSP", SSP_Value.value);
};
</script>
<style scoped></style>
