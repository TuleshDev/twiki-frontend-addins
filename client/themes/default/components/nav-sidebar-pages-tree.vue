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
        template(v-slot:prepend='{ item, toggle }')
          v-list-item(
            :href='item.top ? topItem.t : `/` + item.locale + `/` + item.path'
            @click.prevent='nodeClick(item, toggle, $event)'
            :target='item.top ? (topItem.y === `externalblank` ? `_blank` : `_self`) : `_self`'
            :rel='item.top ? (topItem.y === `externalblank` ? `noopener` : ``) : ``'
            :key='`customchildsubpage-` + item.id'
            :input-value='isInputValue(item)'
            style='min-height: 30px;'
            )
            v-list-item-avatar(size='18', tile, :style='`padding-left: 0px; width: auto; margin: 0 5px 0 0;`')
              v-icon(v-if='item.top && topItem.k === `link` && topItem.c.match(/fa[a-z] fa-/)', size='19') {{ topItem.c }}
              v-icon(v-else-if='item.top && topItem.k === `link`' small) {{ topItem.c }}
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
        template(v-slot:prepend='{ item, toggle }')
          v-list-item(:href='`/` + item.locale + `/` + item.path', @click.prevent='nodeClick(item, toggle, $event)', :key='`browsechildsubpage-` + item.id', :input-value='isInputValue(item)', style='min-height: 30px;')
            v-list-item-avatar(size='18', :style='`padding-left: 0px; width: auto; margin: 0 5px 0 0;`')
              v-icon(small) mdi-text-box
            v-list-item-title {{ getItemTitle(item) }}
</template>

<script>
import gql from 'graphql-tag'
const _ = require('lodash')

/* global siteConfig */

export default {
  name: 'NavSidebarPagesTree',
  props: {
    mode: {
      type: String,
      default: 'custom'
    },
    currentPath: {
      type: String,
      default: ''
    },
    topItem: {
      type: Object,
      default: null
    },
    locale: {
      type: String,
      default: 'en'
    }
  },
  data() {
    return {
      currentNode: [0],
      openNodes: [],
      tree: this.mode === 'custom' ? [
        {
          id: 0,
          title: this.getItemTitle(this.topItem),
          locale: this.getItemLocale(this.topItem),
          path: this.getItemPath(this.topItem),
          top: true,
          children: []
        }
      ] : [
        {
          id: 0,
          title: this.getItemTitle(this.topItem),
          locale: this.getItemLocale(this.topItem),
          path: this.getItemPath(this.topItem),
          children: []
        }
      ],
      all: [],
      trackInSubtree: null,
      featureCalculateStateOfLastNodes: siteConfig.featureCalculateStateOfLastNodes
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
      if (this.mode === 'custom') {
        if (!item || item.id === 0 || item === this.topItem || item.top) {
          return this.topItem.l
        } else {
          let i = item.path.lastIndexOf(`/`)
          if (i !== -1 && i + 1 < item.path.length) {
            return item.path.substring(i + 1)
          } else {
            return item.title
          }
        }
      } else {
        return item.title
      }
    },
    getItemPath (item) {
      if (this.mode === 'custom') {
        if (!item || item.id === 0 || item === this.topItem || item.top) {
          if (this.topItem.t === '/' && this.topItem.y === 'home') {
            return this.topItem.y
          } else {
            return this.topItem.t.indexOf(`/` + this.locale + `/`) === 0 ? this.topItem.t.substring((`/` + this.locale + `/`).length) : this.topItem.t
          }
        } else {
          return item.path
        }
      } else {
        if (!item) {
          if (this.currentPath) {
            return this.currentPath
          } else {
            return this.topItem.path
          }
        } else {
          return item.path
        }
      }
    },
    getItemLocale (item) {
      if (this.mode === 'custom') {
        return this.locale
      } else {
        return item.locale
      }
    },
    isInputValue (item) {
      if (item.path === this.currentPath) {
        return true
      } else {
        return false
      }
    },
    async getTrackInSubtree () {
      const resp = await this.$apollo.query({
        query: gql`
          query ($path: String, $locale: String!) {
            pages {
              trackInSubtree(path: $path, locale: $locale) {
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
          path: this.currentPath,
          locale: this.locale
        }
      })
      return _.get(resp, 'data.pages.trackInSubtree', [])
    },
    nodeClick(item, toggle, event) {
      //event.preventDefault()
      event.stopPropagation()

      const href = event.currentTarget.getAttribute('href')
      window.location.assign(href)
    },
    async fetchPages (item) {
      this.$store.commit(`loadingStart`, 'browse-load')
      const path = this.getItemPath(item)
      const locale = this.getItemLocale(item)
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
      let items = _.get(resp, 'data.pages.subtree', [])
      if (this.mode === 'custom') {
        items = items.map(f => ({...f, top: false}))
      }
      if (item.id === 0) {
        item.id = _.find(items, ['path', path]).id
      }
      const itemPages = _.filter(items, j => j.parent === item.id).map(f => ({...f, children: []}))
      if (itemPages.length > 0) {
        item.children = itemPages
      } else {
        item.children = undefined
      }
      if (this.featureCalculateStateOfLastNodes) {
        _.forEach(itemPages, item2 => {
          const item2Pages = _.filter(items, j => j.parent === item2.id).map(f => ({...f, children: []}))
          if (item2Pages.length === 0) {
            item2.children = undefined
          }
        })
      }
      this.all = _.unionBy(this.all, items, 'id')

      this.$store.commit(`loadingStop`, 'browse-load')
    },
    async loadFromPath() {
      this.$store.commit(`loadingStart`, 'browse-load')
      let openNodes = []
      let path = this.getItemPath(null)
      let level0 = 0
      if (this.mode === 'custom') {
        const path0 = path
        if (!this.trackInSubtree) {
          this.trackInSubtree = await this.getTrackInSubtree()
        }
        const item0 = _.find(this.trackInSubtree, ['path', path0])
        if (!item0) {
          this.tree[0].children = []
          this.currentNode = [0]
          this.$store.commit(`loadingStop`, 'browse-load')
          return
        }
        level0 = item0.level
        path = this.currentPath
      }
      const locale = this.getItemLocale(this.topItem)
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
          locale: locale
        }
      })
      let items = _.get(resp, 'data.pages.subtree', []).map(f => ({...f, children: []}))
      if (this.mode === 'custom') {
        items = items.map(f => ({...f, top: false}))
      }
      const curPage = _.find(items, ['path', path])
      if (!curPage) {
        console.warn("Could not find the page with path = '" + path + "' in page subtree listing!")
        return
      }
      let level = curPage.level
      let item = null
      let itemId = null
      let previousItem = null
      let parentId = null
      if (!this.featureCalculateStateOfLastNodes) {
        for (let i = level0; i < level + 1; i++) {
          if (i === level0) {
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
            if (this.tree[0].id === 0) {
              this.tree[0].id = itemId
              this.tree[0].path = item.path
              this.tree[0].level = item.level
              this.tree[0].pageId = item.pageId
              this.tree[0].parent = item.parent
              this.tree[0].locale = item.locale
              item = this.tree[0]
            }
            if (this.mode === 'custom') {
              item.top = true
            }
          }
          if (i !== level0) {
            openNodes.push(itemId)
          }
          const itemPages = _.filter(items, j => j.parent === itemId)
          if (itemPages.length > 0) {
            item.children = itemPages
          } else if (i !== level0) {
            item.children = undefined
          }
          previousItem = item
        }
      } else {
        for (let i = level0; i < level + 1; i++) {
          let items_i = _.filter(items, j => j.level === level + level0 - i)
          _.forEach(items_i, item => {
            itemId = item.id
            if (i !== level0) {
              parentId = previousItem.parent
            }
            if ((i === level0 && itemId === curPage.id) || (i !== level0 && itemId === parentId)) {
              if (i === level) {
                if (this.tree[0].id === 0) {
                  this.tree[0].id = itemId
                  this.tree[0].path = item.path
                  this.tree[0].level = item.level
                  this.tree[0].pageId = item.pageId
                  this.tree[0].parent = item.parent
                  this.tree[0].locale = item.locale
                  item = this.tree[0]
                }
                if (this.mode === 'custom') {
                  item.top = true
                }
              }
              if (i !== level0) {
                openNodes.push(itemId)
              }
              previousItem = item
            }
            const itemPages = _.filter(items, j => j.parent === itemId)
            if (itemPages.length > 0) {
              if (i !== level0 && itemId === parentId) {
                item.children = itemPages
              }
            } else {
              item.children = undefined
            }
          })
        }
      }
      this.all = _.unionBy(this.all, items, 'id')
      this.openNodes = openNodes.reverse()

      this.$store.commit(`loadingStop`, 'browse-load')
    }
  },
  mounted () {
    this.loadFromPath()
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
