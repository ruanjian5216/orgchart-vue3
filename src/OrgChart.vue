<template>
  <div class="org-chart-container">
    <div 
      class="org-chart" 
      ref="orgChartRef" 
      @wheel="handleWheel" 
      :style="{ 
        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`, 
        transformOrigin: 'center' 
      }"
      @mousedown="handleMouseDown"
    >
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
      <button @click="resetView" class="zoom-btn">↺</button>
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

// 缩放和拖动相关
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const orgChartRef = ref(null);

// 拖动相关变量
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const startTranslateX = ref(0);
const startTranslateY = ref(0);
let animationFrameId = null;

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

// 鼠标按下事件处理
const handleMouseDown = (event) => {
  // 只有在没有按住Ctrl键时才允许拖动
  if (!event.ctrlKey) {
    isDragging.value = true;
    startX.value = event.clientX;
    startY.value = event.clientY;
    startTranslateX.value = translateX.value;
    startTranslateY.value = translateY.value;
    
    // 添加拖动类以禁用过渡动画
    if (orgChartRef.value) {
      orgChartRef.value.classList.add('dragging');
    }
    
    // 添加全局事件监听器
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 阻止默认行为
    event.preventDefault();
  }
};

// 鼠标移动事件处理
const handleMouseMove = (event) => {
  if (isDragging.value) {
    // 取消之前的动画帧
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    // 使用requestAnimationFrame优化性能
    animationFrameId = requestAnimationFrame(() => {
      const dx = event.clientX - startX.value;
      const dy = event.clientY - startY.value;
      
      translateX.value = startTranslateX.value + dx;
      translateY.value = startTranslateY.value + dy;
      
      animationFrameId = null;
    });
  }
};

// 鼠标释放事件处理
const handleMouseUp = () => {
  isDragging.value = false;
  
  // 移除拖动类以恢复过渡动画
  if (orgChartRef.value) {
    orgChartRef.value.classList.remove('dragging');
  }
  
  // 取消之前的动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  // 移除全局事件监听器
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

// 重置视图
const resetView = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
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
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style lang="scss">
.org-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.org-chart {
  text-align: center;
  transition: transform 0.2s ease;
  cursor: grab;
  
  &.dragging {
    transition: none;
  }
  
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
