export default {
  data() {
    return {
      total: 0,
      pageNo: 1,
      pageSize: 10,
      tableData: [],
      loading: false
    }
  },

  created() {
    this.searchData()
  },

  methods: {
    // 防止报错，可以在组件中声明，替换 mixin 中的 searchData 函数
    searchData() {},
    handleSizeChange(size) {
      this.pageSize = size
      this.searchData()
    },

    handleCurrentChange(page) {
      this.pageNo = page
      this.searchData()
    },

    handleSearchData() {
      this.pageNo = 1
      this.searchData()
    }
  }
}
