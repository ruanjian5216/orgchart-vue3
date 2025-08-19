<template>
  <div class="org-chart-container">
    <div class="org-chart" ref="orgChartRef" @wheel="handleWheel" :style="{ transform: `scale(${scale})`, transformOrigin: 'center' }">
      <!-- 使用自定义节点组件，并通过插槽实现自定义内容样式 -->
      <OrgNode :node="props.treeData" :lineColor="props.lineColor" :lineWidth="props.lineWidth" >
        <template #default="{ node }">
          <slot :node="node"></slot>
        </template>
      </OrgNode>
    </div>
    <div class="zoom-controls" v-if="props.showZoomControls">
      <button @click="zoomIn" class="zoom-btn">+</button>
      <button @click="zoomOut" class="zoom-btn">-</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import OrgNode from "./OrgNode.vue";

// 定义props
const props = defineProps({
  treeData: {
    type: Object,
    required: true
  },
  lineColor: {
    type: String,
    default: '#B0C7FE'
  },
  lineWidth: {
    type: String,
    default: '3px'
  },
  minScale: {
    type: Number,
    default: 0.1
  },
  maxScale: {
    type: Number,
    default: 3
  },
  scaleStep: {
    type: Number,
    default: 0.1
  },
  showZoomControls: {
    type: Boolean,
    default: true
  }
});

// 缩放相关
const scale = ref(1);
const orgChartRef = ref(null);

// 处理滚轮事件
const handleWheel = (event) => {
  // 检查是否按住了Ctrl键
  if (event.ctrlKey) {
    event.preventDefault();
    
    // 根据滚轮方向调整缩放比例
    const delta = event.deltaY > 0 ? -props.scaleStep : props.scaleStep;
    const newScale = scale.value + delta;
    
    // 限制缩放范围
    if (newScale >= props.minScale && newScale <= props.maxScale) {
      scale.value = newScale;
    }
  }
};

// 放大函数
const zoomIn = () => {
  const newScale = scale.value + props.scaleStep;
  if (newScale <= props.maxScale) {
    scale.value = newScale;
  }
};

// 缩小函数
const zoomOut = () => {
  const newScale = scale.value - props.scaleStep;
  if (newScale >= props.minScale) {
    scale.value = newScale;
  }
};

// 阻止浏览器默认的Ctrl+滚轮缩放行为
const preventDefaultZoom = (event) => {
  if (event.ctrlKey && (event.deltaY !== 0)) {
    event.preventDefault();
  }
};

onMounted(() => {
  // 添加全局事件监听器来阻止浏览器默认缩放
  document.addEventListener('wheel', preventDefaultZoom, { passive: false });
});

onUnmounted(() => {
  // 清理事件监听器
  document.removeEventListener('wheel', preventDefaultZoom);
});
</script>

<style lang="scss">
.org-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.org-chart {
  text-align: center;
  transition: transform 0.2s ease;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zoom-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #ddd;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    background-color: #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

</style>
