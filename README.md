# orgchart-vue3

A Vue 3 component for displaying organizational charts.

## Installation

```bash
npm install orgchart-vue3
# or
yarn add orgchart-vue3
```

## Usage

### Global Registration

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import OrgChartVue3 from 'orgchart-vue3'
import 'orgchart-vue3/style.css'

const app = createApp(App)
app.use(OrgChartVue3)
app.mount('#app')
```

### Component Registration

```javascript
import { OrgChart, OrgNode } from 'orgchart-vue3'
import 'orgchart-vue3/style.css'

export default {
  components: {
    OrgChart,
    OrgNode
  }
}
```

### Template Usage

```vue
<template>
  <div>
    <org-chart :treeData="orgData" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const orgData = ref({
      id: 1,
      name: 'CEO',
      children: [
        {
          id: 2,
          name: 'CTO',
          children: [
            { id: 5, name: 'Developer 1' },
            { id: 6, name: 'Developer 2' }
          ]
        },
        {
          id: 3,
          name: 'CFO'
        },
        {
          id: 4,
          name: 'COO'
        }
      ]
    })

    return {
      orgData
    }
  }
}
</script>
```

## Props

### OrgChart

| Name | Type | Default | Description |
|------|------|---------|-------------|
| treeData | Object | null | The organizational chart data |
| nodeWidth | Number | 180 | Width of each node |
| nodeHeight | Number | 60 | Height of each node |
| verticalSpacing | Number | 20 | Vertical spacing between nodes |
| horizontalSpacing | Number | 40 | Horizontal spacing between nodes |
| direction | String | 'top-down' | Direction of the chart: 'top-down', 'left-right', 'right-left', 'bottom-top' |
| customNode | Boolean | false | Whether to use custom node component |

## Custom Node

You can use the `OrgNode` component to customize the node appearance:

```vue
<template>
  <org-chart :treeData="orgData" :customNode="true">
    <template #node="{ node }">
      <org-node :node="node" />
    </template>
  </org-chart>
</template>
```

## License

MIT