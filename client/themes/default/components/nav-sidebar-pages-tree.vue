<template lang="pug">
  div.nav-sidebar-pages-tree
    //-> Custom Navigation
    template(v-if='mode === `custom`')
      //v-list-item(
      //  v-if='item.k === `link`'
      //  :href='item.t'
      //  :target='item.y === `externalblank` ? `_blank` : `_self`'
      //  :rel='item.y === `externalblank` ? `noopener` : ``'
      //  style='min-height: 30px;'
      //  )
      //  v-list-item-avatar(size='18', tile, :style='`padding-left: 0px; width: auto; margin: 0 5px 0 0;`')
      //    v-icon(v-if='item.c.match(/fa[a-z] fa-/)', size='19') {{ item.c }}
      //    v-icon(v-else small) {{ item.c }}
      //  v-list-item-title {{ item.l }}
      v-treeview(
        :active.sync='currentNode'
        :open.sync='openNodes'
        :items='tree'
        :load-children='fetchPages'
        dense
        expand-icon='mdi-menu-down-outline'
        item-id='path'
        activatable
        hoverable
        style='min-height: 30px;'
        )
        template(v-slot:prepend='{ item, open }')
          v-list-item(
            :href='item.level === 0 ? item.t : `/` + item.locale + `/` + item.path'
            :target='item.level === 0 ? (item.y === `externalblank` ? `_blank` : `_self`) : `_self`'
            :rel='item.level === 0 ? (item.y === `externalblank` ? `noopener` : ``) : ``'
            style='min-height: 30px;'
            )
            v-list-item-avatar(size='18', tile, :style='`padding-left: 0px; width: auto; margin: 0 5px 0 0;`')
              v-icon(v-if='item.level === 0 && item.c.match(/fa[a-z] fa-/)', size='19') {{ item.c }}
              v-icon(v-else-if='item.level === 0' small) {{ item.c }}
              v-icon(v-else small) mdi-chevron-right
            v-list-item-title {{ getItemTitle(item) }}
    //-> Browse
    template(v-if='mode === `browse`')
      //v-list-item(:href='`/` + item.locale + `/` + item.path', :key='`childpage-` + item.id', :input-value='path === item.path', style='min-height: 30px;')
      //  v-list-item-avatar(size='18', :style='`padding-left: 0px; width: auto; margin: 0 5px 0 0;`')
      //    v-icon(small) mdi-text-box
      //  v-list-item-title {{ item.title }}
      v-treeview(
        :active.sync='currentNode'
        :open.sync='openNodes'
        :items='tree'
        :load-children='fetchPages'
        dense
        expand-icon='mdi-menu-down-outline'
        item-id='path'
        activatable
        hoverable
        style='min-height: 30px;'
        )
        template(v-slot:prepend='{ item, open }')
          v-list-item(:href='`/` + item.locale + `/` + item.path', :key='`childsubpage-` + item.id', :input-value='path === item.path', style='min-height: 30px;')
            v-list-item-avatar(size='18', :style='`padding-left: 0px; width: auto; margin: 0 5px 0 0;`')
              v-icon(small) mdi-text-box
            v-list-item-title {{ item.title }}
</template>

<script>
const _ = require('lodash')
import gql from 'graphql-tag'

export default {
  name: 'NavSidebarPagesTree',
  props: {
    mode: {
      type: String,
      default: 'custom'
    },
    item: {
      type: Object
    },
    path: {
      type: String
    },
    locale: {
      type: String
    }
  },
  data() {
    return {
      currentNode: [0],
      openNodes: [0],
      tree: this.mode === 'custom' ? [
        {
          id: 0,
          k: this.item.k,
          t: this.item.t,
          y: this.item.y,
          c: this.item.c,
          l: this.item.l,
          level: 0,
          children: []
        }
      ] : [
        {
          id: 0,
          title: this.item.title,
          locale: this.item.locale,
          children: []
        }
      ],
      all: []
    }
  },
  watch: {
    currentNode (newValue, oldValue) {
      if (newValue.length < 1) { // force a selection
        this.$nextTick(() => {
          this.currentNode = oldValue
        })
      } else {
        const current = _.find(this.all, ['id', newValue[0]])

        if (this.openNodes.indexOf(newValue[0]) < 0) { // auto open and load children
          if (current) {
            if (this.openNodes.indexOf(current.parent) < 0) {
              this.$nextTick(() => {
                this.openNodes.push(current.parent)
              })
            }
          }
          this.$nextTick(() => {
            this.openNodes.push(newValue[0])
          })
        }
      }
    }
  },
  methods: {
    getItemTitle (item) {
      if (item.level === 0) {
        return item.l
      } else {
        let i = item.path.lastIndexOf(`/`)
        if (i !== -1 && i + 1 < item.path.length) {
          return item.path.substring(i + 1)
        } else {
          return item.title
        }
      }
    },
    async fetchPages (item) {
      this.$store.commit(`loadingStart`, 'browse-load')
      let path = null
      let locale = null
      if (this.mode === 'custom' && item.id === 0) {
        if (item.t === '/' && item.y === 'home') {
          path = item.y
        } else {
          path = this.item.t.indexOf(`/` + this.locale + `/`) === 0 ? this.item.t.substring((`/` + this.locale + `/`).length) : this.item.t
        }
      } else {
        path = item.path
      }
      if (this.mode === 'custom') {
        locale = this.locale
      } else {
        locale = item.locale
      }
      let resp = null
      if (item.id !== 0) {
        resp = await this.$apollo.query({
          query: gql`
            query ($parent: Int!, $locale: String!) {
              pages {
                subtree(parent: $parent, locale: $locale) {
                  id
                  path
                  title
                  level
                  pageId
                  parent
                  locale
                }
              }
            }
          `,
          fetchPolicy: 'cache-first',
          variables: {
            parent: item.id,
            locale: locale
          }
        })
      } else {
        resp = await this.$apollo.query({
          query: gql`
            query ($path: String, $locale: String!) {
              pages {
                subtree(path: $path, pageWithPathAsParent: true, locale: $locale) {
                  id
                  path
                  title
                  level
                  pageId
                  parent
                  locale
                }
              }
            }
          `,
          fetchPolicy: 'cache-first',
          variables: {
            path: path,
            locale: locale
          }
        })
      }
      const items = _.get(resp, 'data.pages.subtree', [])
      if (this.mode === 'custom' && item.id === 0) {
        item.id = _.find(items, ['path', path]).id
      }
      const itemPages = _.filter(items, j => j.parent === item.id).map(f => ({...f, children: []}))
      if (itemPages.length > 0) {
        item.children = itemPages
      } else {
        item.children = undefined
      }
      this.all = _.unionBy(this.all, items, 'id')

      this.$store.commit(`loadingStop`, 'browse-load')
    },
    async loadFromPath() {
      this.$store.commit(`loadingStart`, 'browse-load')
      let all = []
      let tree = []
      let openNodes = []
      let path = null
      if (this.path) {
        path = this.path
      } else {
        path = this.item.path
      }
      const resp = await this.$apollo.query({
        query: gql`
          query ($path: String, $locale: String!) {
            pages {
              subtree(path: $path, locale: $locale, includeAncestors: true) {
                id
                path
                title
                level
                pageId
                parent
                locale
              }
            }
          }
        `,
        fetchPolicy: 'cache-first',
        variables: {
          path: path,
          locale: this.item.locale
        }
      })
      const items = _.get(resp, 'data.pages.subtree', []).map(f => ({...f, children: []}))
      const curPage = _.find(items, ['path', path])
      if (!curPage) {
        console.warn("Could not find the page with id = '" + this.item.pageId + "' in page subtree listing!")
        return
      }
      const level = curPage.level
      let item = null
      let itemId = null
      let previousItem = null
      for (let i = 0; i < level + 1; i++) {
        if (i === 0) {
          itemId = curPage.id
          item = _.find(items, {
            id: itemId
          })
        } else {
          itemId = previousItem.parent
          item = _.find(items, {
            id: itemId
          })
        }
        if (i === level) {
          tree.push(item)
        }
        openNodes.push(itemId)
        const itemPages = _.filter(items, j => j.parent === item.id)
        if (itemPages.length > 0) {
          item.children = itemPages
        } else if (i !== 0) {
          item.children = undefined
        }
        previousItem = item
        all = _.unionBy(all, items, 'id')
      }
      this.all = all
      this.tree = tree
      this.currentNode = [curPage.id]
      this.openNodes = openNodes.reverse()

      this.$store.commit(`loadingStop`, 'browse-load')
    }
  },
  mounted () {
    if (this.mode === 'browse') {
      this.loadFromPath()
    }
  }
}
</script>

<style lang="scss">

.nav-sidebar-pages-tree {
  .v-treeview-node__root {
    min-height: 37px;
  }
  .v-treeview-node__content {
    display: block;
    color: #fff;
  }
  .v-treeview-node__level, .v-treeview-node__toggle {
    width: 18px;
  }
  .v-treeview-node__root > .v-icon.v-icon {
    font-size: 18px;
  }
  .v-treeview-node__root .v-list-item {
    padding: 0 5px;
  }
}

</style>
