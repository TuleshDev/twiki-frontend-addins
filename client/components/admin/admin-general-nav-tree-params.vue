<template lang='pug'>
  .mt-3
    v-switch.mt-0(
      inset
      label='Tree Navigation'
      color='indigo'
      v-model='config.featurePageTreeNavigation'
      persistent-hint
      hint='Allow users to use tree navigation.'
      )
</template>

<script>
export const adminGeneralNavTreeParamsQuery = () => {
  return 'featurePageTreeNavigation'
}

export const adminGeneralNavTreeParamsMutation1 = () => {
  return '$featurePageTreeNavigation: Boolean'
}

export const adminGeneralNavTreeParamsMutation2 = () => {
  return 'featurePageTreeNavigation: $featurePageTreeNavigation'
}

export default {
  name: 'AdminGeneralNavTreeParams',
  props: {
    config: {
      type: Object
    }
  },
  created() {
    console.log("'admin-general-nav-tree-params.vue' component loaded")
  },
  computed: {
    variables() {
      return {
        featurePageTreeNavigation: this.config.featurePageTreeNavigation
      }
    }
  }
}
</script>
