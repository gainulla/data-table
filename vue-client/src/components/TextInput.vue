<template>
	<div class="field">
		<input type="text" :value="value" @input="enter" />
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			required: true,
		}
	},
	methods: {
		enter(e) {
			this.$emit('entered', e.target.value);
		}
	}
}
</script>

<style scoped lang="scss">
.field {
	display: inline-block;

	input {
		padding: 8px;
		font-size: 16px;
		border: 1px solid gainsboro;
		outline: none;
		background-color: transparent;
	}
}
</style>