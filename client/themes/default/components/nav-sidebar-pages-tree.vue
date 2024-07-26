<template lang="pug">
  div
    //-> Custom Navigation
    template(v-if='currentMode === `custom`')
      v-list-item(
        :href='item.t'
        :target='item.y === `externalblank` ? `_blank` : `_self`'
        :rel='item.y === `externalblank` ? `noopener` : ``'
        )
        v-list-item-avatar(size='24', tile)
          v-icon(v-if='item.c.match(/fa[a-z] fa-/)', size='19') {{ item.c }}
          v-icon(v-else) {{ item.c }}
        v-list-item-title {{ item.l }}
    //-> Browse
    template(v-if='currentMode === `browse`')
      v-list-item(:href='`/` + item.locale + `/` + item.path', :key='`childpage-` + item.id', :input-value='path === item.path')
        v-list-item-avatar(size='24')
          v-icon mdi-text-box
        v-list-item-title {{ item.title }}
</template>

<script>
export default {
  name: 'NavSidebarPagesTree',
  props: {
    currentMode: {
      type: String,
      default: 'custom'
    },
    item: {
      type: Object
    },
    path: {
      type: String
    }
  }
}
</script>
