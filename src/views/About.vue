<template lang="pug">
  .about
    h1 This is an about page
</template>

<script>
import tableMixin from '../mixins/tableMixin'

export default {
  mixins: [tableMixin],
  methods: {
    // 重写 searchData 以覆盖 tableMixin
    searchData () {
      console.log('searchData')
    },
  }
}
</script>

