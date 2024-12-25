<template lang='pug'>
</template>

<script>
export default {
  name: 'PageAdditionalParams',
  props: {
    additionalParams: {
      type: Object
    }
  },
  created() {
    let additionalParams = this.additionalParams
    let level = additionalParams.level
    let parentSectionId = additionalParams.parentSectionId
    let order = additionalParams.order

    this.$store.set('page/level', level)
    this.$store.set('page/parentSectionId', parentSectionId)
    this.$store.set('page/order', order)

    console.log("'page-additional-params.vue' component loaded")
    console.log(level + ' - level')
    console.log(parentSectionId + ' - parentSectionId')
    console.log(order + ' - order')
  }
}
</script>
