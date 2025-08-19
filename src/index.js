// 导入组件
import OrgChart from './OrgChart.vue'
import OrgNode from './OrgNode.vue'

// 导出组件
export { OrgChart, OrgNode }

export default {
  install: (app) => {
    app.component('OrgChart', OrgChart)
    app.component('OrgNode', OrgNode)
  }
}