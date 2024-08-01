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
      v-treeview(
        v-if='item.k === `link`'
        v-model='tree'
        :items='items1'
        :opened='initiallyOpen'
        item-key='name'
        activatable
        open-on-click
        )
        template(v-slot:prepend='{ item, open }')
          v-list-item(
            v-if='item.k === `link`'
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
      v-treeview(
        v-model='tree'
        :items='items2'
        :opened='initiallyOpen'
        item-key='name'
        activatable
        open-on-click
        )
        template(v-slot:prepend='{ item, open }')
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
  },
  data() {
    return {
      initiallyOpen: ['public'],
      tree: []
    }
  },
  computed: {
    items1() {
      return [
        {
          k: this.item.k,
          t: this.item.t,
          y: this.item.y,
          c: this.item.c,
          l: this.item.l
        },
        {
          k: this.item.k,
          t: this.item.t,
          y: this.item.y,
          c: this.item.c,
          l: this.item.l,
          children: [
            {
              k: this.item.k,
              t: this.item.t,
              y: this.item.y,
              c: this.item.c,
              l: this.item.l
            }
          ]
        }
      ]
    },
    items2() {
      return [
        {
          id: this.item.id,
          locale: this.item.locale,
          path: this.item.path,
          title: this.item.title
        },
        {
          id: this.item.id,
          locale: this.item.locale,
          path: this.item.path,
          title: this.item.title,
          children: [
            {
              id: this.item.id,
              locale: this.item.locale,
              path: this.item.path,
              title: this.item.title
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss">

.v-treeview-node__content {
  display: block;
  color: #fff;
}

</style>
