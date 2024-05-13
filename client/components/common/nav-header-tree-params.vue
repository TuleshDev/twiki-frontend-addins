<template lang='pug'>
  .v-toolbar__content
    div
      v-tooltip(bottom)
        template(v-slot:activator='{ on }')
          v-btn(icon, tile, height='64', v-on='on', @click='subpageNew', :aria-label='$t(`common:header.newSubpage`)')
            v-icon(color='grey') mdi-text-box-plus
        span {{$t('common:header.newSubpage')}}
    v-divider(vertical)
</template>

<script>
export default {
  name: 'NavHeaderTreeParams',
  created() {
    console.log("'nav-header-tree-params.vue' component loaded")
  },
  methods: {
    subpageNew () {
      this.$emit('setFlag')
    }
  }
}
</script>
