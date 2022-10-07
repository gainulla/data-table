<template>
	<div class="aselect" :data-value="value" :data-list="list">
		<div class="selector" @click="toggle">
			<div class="label">
				<span>{{ value }}</span>
			</div>
		<div class="arrow" :class="{ expanded : visible }"></div>
			<div :class="{ hidden : !visible, visible }">
				<ul>
					<li
						v-for="(item, key) in listItems" @click="select(item[1])"
						:key="key"
						:class="{ current : item[1] === value }"
					>
						{{ item[1] }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			visible: false
		}
	},
	props: {
		list: {
			type: Array,
			required: true,
		},
		value: {
			type: String,
			required: true
		},
		exlude: {
			type: Array,
			required: false,
			default: () => [],
		}
	},
	computed: {
		listItems() {
			if (!this.exlude.length) {
				return this.list;
			} else {
				return this.list.filter(item => {
					if (!this.exlude.includes(item[0])) {
						return item;
					}
				})
			}
		}
	},
	methods: {
		toggle() {
			this.visible = !this.visible;
		},
		select(option) {
			this.$emit('selected', option);
		}
	},
}
</script>

<style scoped lang="scss">
.aselect {
	display: inline-block;
	width: 200px;
	.selector {
		border: 1px solid gainsboro;
		position: relative;
		z-index: 1;
		.arrow {
			position: absolute;
			right: 10px;
			top: 40%;
			width: 0;
			height: 0;
			border-left: 7px solid transparent;
			border-right: 7px solid transparent;
			border-top: 10px solid #888;
			transform: rotateZ(0deg) translateY(0px);
			transition-duration: 0.3s;
			transition-timing-function: cubic-bezier(.59,1.39,.37,1.01);
		}
		.expanded {
			transform: rotateZ(180deg) translateY(2px);
		}
		.label {
			display: block;
			padding: 8px;
			font-size: 14px;
			text-align: left;
		}
	}
	ul {
		width: 100%;
		list-style-type: none;
		padding: 0;
		margin: 0;
		font-size: 16px;
		border: 1px solid gainsboro;
		position: absolute;
		z-index: 1;
		background: #fff;
	}
	li {
		padding: 12px 20px;
		color: #666;
		text-align: left;
		&:hover {
			color: white;
			background: seagreen;
		}
	}
	.current {
		background: #eaeaea;
	}
	.hidden {
		visibility: hidden;
	}
	.visible {
		visibility: visible;
	}
}
</style>
