import Vue from 'vue'

import AdminGeneralNavTreeParams from './components/admin/admin-general-nav-tree-params.vue'
import {
  adminGeneralNavTreeParamsQuery,
  adminGeneralNavTreeParamsMutation1,
  adminGeneralNavTreeParamsMutation2
} from './components/admin/admin-general-nav-tree-params.vue'
import NavHeaderTreeParams from './components/common/nav-header-tree-params.vue'
import NavSidebarPagesTree from './themes/default/components/nav-sidebar-pages-tree.vue'
import EditorNavTreeParams from './components/editor/editor-nav-tree-params.vue'
import PageNavTreeParams from './themes/default/components/page-nav-tree-params.vue'
import pageStore from './store/page.js'

export {
  AdminGeneralNavTreeParams,
  adminGeneralNavTreeParamsQuery,
  adminGeneralNavTreeParamsMutation1,
  adminGeneralNavTreeParamsMutation2,
  NavHeaderTreeParams,
  NavSidebarPagesTree,
  EditorNavTreeParams,
  PageNavTreeParams,
  pageStore
}
