<template>
	<div id="selectRow">
		<el-text style="padding: 8px; font-weight: 700" class="mx-1" size="large">极端情景选择：</el-text>
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
let changeSSPValue = (value) => {
	SSP_Value.value = value;
	changeSSP();
};
defineExpose({ changeSSPValue });
</script>
<style scoped>
#selectRow {
	display: flex;
	margin-right: auto;
}
</style>
