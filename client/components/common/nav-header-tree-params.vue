<template lang='pug'>
  .v-toolbar__content
    div
      v-tooltip(bottom)
        template(v-slot:activator='{ on }')
          v-btn(icon, tile, height='64', v-on='on', @click='subpageNew', :aria-label='$t(`common:header.newSubpage`)')
            v-icon(color='grey') mdi-text-box-plus
        span {{$t('common:header.newSubpage')}}
    v-divider(vertical)

    page-selector(mode='create', v-model='newSubpageModal', :open-handler='subpageNewCreate', :locale='locale')
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  name: 'NavHeaderTreeParams',
  data() {
    return {
      newSubpageModal: false
    }
  },
  computed: {
    locale: get('page/locale'),
    level: get('page/level'),
    pageId: get('page/id')
  },
  created() {
    console.log("'nav-header-tree-params.vue' component loaded")
  },
  methods: {
    subpageNew () {
      this.newSubpageModal = true
    },
    subpageNewCreate ({ path, locale }) {
      window.location.assign(`/e/${locale}/${path}?level=${this.level + 1}&parentSectionId=${this.pageId}`)
    }
  }
}
</script>
