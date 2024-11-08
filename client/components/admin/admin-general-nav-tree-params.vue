<template lang='pug'>
  div
    v-divider
    .overline.grey--text.pa-4 {{$t('admin:generalNavTreeParams.navigation')}}
    .px-4.pb-3
      v-switch.mt-0(
        inset
        :label='$t(`admin:generalNavTreeParams.treeNavigation`)'
        color='indigo'
        v-model='config.featurePageTreeNavigation'
        persistent-hint
        :hint='$t(`admin:generalNavTreeParams.treeNavigationHint`)'
        )
      v-switch.mt-4(
        v-if='config.featurePageTreeNavigation'
        inset
        :label='$t(`admin:generalNavTreeParams.calculateStateOfLastNodes`)'
        color='indigo'
        v-model='config.featureCalculateStateOfLastNodes'
        persistent-hint
        :hint='$t(`admin:generalNavTreeParams.calculateStateOfLastNodesHint`)'
        )
</template>

<script>
export const adminGeneralNavTreeParamsQuery = () => {
  return `featurePageTreeNavigation
    featureCalculateStateOfLastNodes`
}

export const adminGeneralNavTreeParamsMutation1 = () => {
  return `$featurePageTreeNavigation: Boolean
    $featureCalculateStateOfLastNodes: Boolean`
}

export const adminGeneralNavTreeParamsMutation2 = () => {
  return `featurePageTreeNavigation: $featurePageTreeNavigation
    featureCalculateStateOfLastNodes: $featureCalculateStateOfLastNodes`
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
        featurePageTreeNavigation: this.config.featurePageTreeNavigation,
        featureCalculateStateOfLastNodes: this.config.featureCalculateStateOfLastNodes
      }
    }
  }
}
</script>
