<template lang='pug'>
</template>

<script>
export default {
  name: 'PageNavTreeParams',
  props: {
    navTreeParams: {
      type: Object
    }
  },
  created() {
    let navTreeParams = this.navTreeParams
    let level = navTreeParams.level
    let parentSectionId = navTreeParams.parentSectionId

    this.$store.set('page/level', level)
    this.$store.set('page/parentSectionId', parentSectionId)

    console.log("'page-nav-tree-params.vue' component loaded")
    console.log(level + ' - level')
    console.log(parentSectionId + ' - parentSectionId')
  }
}
</script>
