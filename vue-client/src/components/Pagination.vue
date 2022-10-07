<template>
	<nav>
    <button
      class="btn btn-left"
			@click="getPrevPage"
			:disabled="currentPage === 1"
    >
      <span>Предыдущая</span>
		</button>
    <button
      class="btn btn-right"
			@click="getNextPage"
			:disabled="currentPage === totalPages"
		>
      <span>Следующая</span>
		</button>
	</nav>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
		pageNum: {
			type: Number,
			required: true
		},
  },
  computed: {
    totalPages () {
      return Math.ceil(this.total / this.perPage)
    },
    currentPage () {
      return parseInt(this.pageNum) || 1
    },
    prevPage () {
      return this.currentPage > 1 ? this.currentPage - 1 : 1
    },
    nextPage () {
      return this.currentPage < this.totalPages
        ? this.currentPage + 1
        : this.totalPages
    }
  },
	methods: {
		getPrevPage() {
			this.$emit('prev');
		},
		getNextPage() {
			this.$emit('next');
		},
	}
}
</script>

<style scoped lang="scss">
nav {
	margin-top: 1rem;
}
button {
	margin: 0 .2rem;
	padding: .5em .8em;
	cursor: pointer;
}
button[disabled]{
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
	cursor: default;
}
</style>