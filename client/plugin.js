import components from'./components'
import {
  adminGeneralNavTreeParamsQuery,
  adminGeneralNavTreeParamsMutation1,
  adminGeneralNavTreeParamsMutation2
} from './components/admin/admin-general-nav-tree-params.vue'

const plugin = {
  install (Vue) {
    for (const prop in components) {
      if (components.hasOwnProperty(prop)) {
        const component = components[prop]
        Vue.component(component.name, component)
      }
    }
  }
}

export default plugin
export {
  adminGeneralNavTreeParamsQuery,
  adminGeneralNavTreeParamsMutation1,
  adminGeneralNavTreeParamsMutation2
}
