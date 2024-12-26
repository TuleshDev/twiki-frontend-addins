<template lang='pug'>
</template>

<script>
import VueRouter from 'vue-router'

const router = new VueRouter({
  mode: 'history',
  base: '/e'
})

export default {
  name: 'EditorAdditionalParams',
  props: {
    additionalParams: {
      type: Object
    }
  },
  computed: {
    createMutation1() {
      return '$level: Int\n$parentSectionId: Int\n$order: Int!'
    },
    createMutation2() {
      return 'level: $level\nparentSectionId: $parentSectionId\norder: $order'
    },
    createVariables() {
      return {
        level: this.$store.get('page/level') || 0,
        parentSectionId: this.$store.get('page/parentSectionId') || 0,
        order: this.$store.get('page/order')
      }
    },
    updateMutation1() {
      return '$order: Int!'
    },
    updateMutation2() {
      return 'order: $order'
    },
    updateVariables() {
      return {
        order: this.$store.get('page/order')
      }
    }
  },
  router,
  created() {
    if (this.$route.query.level) {
      this.$store.set('page/level', parseInt(this.$route.query.level, 10))
    }
    if (this.$route.query.parentSectionId) {
      this.$store.set('page/parentSectionId', parseInt(this.$route.query.parentSectionId, 10))
    }

    this.$store.set('page/order', this.additionalParams.order)
  }
}
</script>
