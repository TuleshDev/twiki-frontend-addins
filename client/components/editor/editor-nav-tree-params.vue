<template lang='pug'>
</template>

<script>
import VueRouter from 'vue-router'

const router = new VueRouter({
  mode: 'history',
  base: '/e'
})

export default {
  name: 'EditorNavTreeParams',
  computed: {
    mutation1() {
      return '$level: Int\n$parentSectionId: Int'
    },
    mutation2() {
      return 'level: $level\nparentSectionId: $parentSectionId'
    },
    variables() {
      return {
        level: this.$store.get('page/level') || 0,
        parentSectionId: this.$store.get('page/parentSectionId') || 0
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

    console.log("'editor-nav-tree-params.vue' component loaded")
  }
}
</script>
