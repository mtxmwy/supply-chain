<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="kd-card">
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>欢迎回来，{{ username }}</h2>
            <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
          </div>
          <div class="welcome-stats">
            <div class="stat-item">
              <div class="stat-value">{{ todayOrders }}</div>
              <div class="stat-label">今日订单</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ todayRevenue }}</div>
              <div class="stat-label">今日收入</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ pendingTasks }}</div>
              <div class="stat-label">待办任务</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="overview-section">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="item in overviewData" :key="item.title">
          <div class="kd-card overview-card">
            <div class="overview-content">
              <div class="overview-icon" :class="item.iconClass">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="overview-info">
                <div class="overview-value">{{ item.value }}</div>
                <div class="overview-title">{{ item.title }}</div>
                <div class="overview-trend" :class="item.trend > 0 ? 'up' : 'down'">
                  <el-icon><component :is="item.trend > 0 ? 'TrendCharts' : 'Bottom'" /></el-icon>
                  {{ Math.abs(item.trend) }}%
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="16">
          <div class="kd-card">
            <div class="kd-card-header">
              <div class="kd-card-title">销售趋势</div>
            </div>
            <div class="kd-card-body">
              <v-chart :option="salesChartOption" style="height: 300px;" />
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :lg="8">
          <div class="kd-card">
            <div class="kd-card-header">
              <div class="kd-card-title">销售构成</div>
            </div>
            <div class="kd-card-body">
              <v-chart :option="pieChartOption" style="height: 300px;" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 待办事项和最新动态 -->
    <div class="bottom-section">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="12">
          <div class="kd-card">
            <div class="kd-card-header">
              <div class="kd-card-title">待办事项</div>
              <el-button type="primary" size="small">查看全部</el-button>
            </div>
            <div class="kd-card-body">
              <div class="todo-list">
                <div v-for="item in todoList" :key="item.id" class="todo-item">
                  <div class="todo-content">
                    <div class="todo-title">{{ item.title }}</div>
                    <div class="todo-desc">{{ item.description }}</div>
                  </div>
                  <div class="todo-meta">
                    <el-tag :type="item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'info'" size="small">
                      {{ item.priorityText }}
                    </el-tag>
                    <span class="todo-time">{{ item.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :lg="12">
          <div class="kd-card">
            <div class="kd-card-header">
              <div class="kd-card-title">最新动态</div>
            </div>
            <div class="kd-card-body">
              <el-timeline>
                <el-timeline-item
                  v-for="item in activities"
                  :key="item.id"
                  :timestamp="item.timestamp"
                  :type="item.type"
                >
                  <div class="activity-content">
                    <div class="activity-title">{{ item.title }}</div>
                    <div class="activity-desc">{{ item.description }}</div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import dayjs from 'dayjs'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 响应式数据
const username = ref(localStorage.getItem('username') || '管理员')
const todayOrders = ref(156)
const todayRevenue = ref('¥28,456')
const pendingTasks = ref(8)

const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日 dddd')
})

// 概览数据
const overviewData = ref([
  {
    title: '总销售额',
    value: '¥1,234,567',
    icon: 'Money',
    iconClass: 'money-icon',
    trend: 12.5
  },
  {
    title: '订单数量',
    value: '3,456',
    icon: 'Document',
    iconClass: 'order-icon',
    trend: 8.2
  },
  {
    title: '客户数量',
    value: '1,234',
    icon: 'User',
    iconClass: 'user-icon',
    trend: -2.1
  },
  {
    title: '库存周转',
    value: '15.6天',
    icon: 'Box',
    iconClass: 'inventory-icon',
    trend: 5.3
  }
])

// 待办事项
const todoList = ref([
  {
    id: 1,
    title: '审核采购订单',
    description: '需要审核5个待处理的采购订单',
    priority: 'high',
    priorityText: '紧急',
    time: '2小时前'
  },
  {
    id: 2,
    title: '库存盘点',
    description: '完成本月的库存盘点工作',
    priority: 'medium',
    priorityText: '重要',
    time: '1天前'
  },
  {
    id: 3,
    title: '客户回访',
    description: '联系新客户了解使用情况',
    priority: 'low',
    priorityText: '一般',
    time: '2天前'
  }
])

// 最新动态
const activities = ref([
  {
    id: 1,
    title: '订单审核完成',
    description: '张三提交的采购订单已审核通过',
    timestamp: '2024-01-15 14:30',
    type: 'success'
  },
  {
    id: 2,
    title: '库存预警',
    description: 'iPhone 15库存不足，请及时补货',
    timestamp: '2024-01-15 10:20',
    type: 'warning'
  },
  {
    id: 3,
    title: '新用户注册',
    description: '新客户"科技有限公司"完成注册',
    timestamp: '2024-01-14 16:45',
    type: 'primary'
  }
])

// 销售趋势图表配置
const salesChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '销售额',
      type: 'line',
      smooth: true,
      data: [820, 932, 901, 934, 1290, 1330, 1320, 1420, 1200, 1350, 1400, 1500],
      itemStyle: {
        color: '#0066cc'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 102, 204, 0.3)' },
            { offset: 1, color: 'rgba(0, 102, 204, 0.1)' }
          ]
        }
      }
    }
  ]
})

// 饼图配置
const pieChartOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '电子产品' },
        { value: 735, name: '服装鞋帽' },
        { value: 580, name: '家居用品' },
        { value: 484, name: '食品饮料' },
        { value: 300, name: '其他' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

onMounted(() => {
  // 页面加载完成后的初始化逻辑
})
</script>

<style lang="scss" scoped>
.dashboard {
  .welcome-section {
    margin-bottom: 20px;
    
    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      
      .welcome-text {
        h2 {
          margin: 0 0 8px 0;
          color: var(--kd-text-primary);
          font-size: 24px;
          font-weight: 500;
        }
        
        p {
          margin: 0;
          color: var(--kd-text-secondary);
        }
      }
      
      .welcome-stats {
        display: flex;
        gap: 40px;
        
        .stat-item {
          text-align: center;
          
          .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--kd-primary-color);
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 12px;
            color: var(--kd-text-secondary);
          }
        }
      }
    }
  }
  
  .overview-section {
    margin-bottom: 20px;
    
    .overview-card {
      .overview-content {
        display: flex;
        align-items: center;
        padding: 20px;
        
        .overview-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          font-size: 24px;
          
          &.money-icon {
            background: rgba(103, 194, 58, 0.1);
            color: #67c23a;
          }
          
          &.order-icon {
            background: rgba(0, 102, 204, 0.1);
            color: #0066cc;
          }
          
          &.user-icon {
            background: rgba(230, 162, 60, 0.1);
            color: #e6a23c;
          }
          
          &.inventory-icon {
            background: rgba(245, 108, 108, 0.1);
            color: #f56c6c;
          }
        }
        
        .overview-info {
          flex: 1;
          
          .overview-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--kd-text-primary);
            margin-bottom: 4px;
          }
          
          .overview-title {
            font-size: 14px;
            color: var(--kd-text-secondary);
            margin-bottom: 8px;
          }
          
          .overview-trend {
            font-size: 12px;
            display: flex;
            align-items: center;
            
            &.up {
              color: #67c23a;
            }
            
            &.down {
              color: #f56c6c;
            }
            
            .el-icon {
              margin-right: 2px;
            }
          }
        }
      }
    }
  }
  
  .charts-section, .bottom-section {
    margin-bottom: 20px;
  }
  
  .todo-list {
    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid var(--kd-border-lighter);
      
      &:last-child {
        border-bottom: none;
      }
      
      .todo-content {
        flex: 1;
        
        .todo-title {
          font-weight: 500;
          color: var(--kd-text-primary);
          margin-bottom: 4px;
        }
        
        .todo-desc {
          font-size: 12px;
          color: var(--kd-text-secondary);
        }
      }
      
      .todo-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        
        .todo-time {
          font-size: 12px;
          color: var(--kd-text-placeholder);
        }
      }
    }
  }
  
  .activity-content {
    .activity-title {
      font-weight: 500;
      color: var(--kd-text-primary);
      margin-bottom: 4px;
    }
    
    .activity-desc {
      font-size: 12px;
      color: var(--kd-text-secondary);
    }
  }
}

@media (max-width: 768px) {
  .dashboard {
    .welcome-content {
      flex-direction: column;
      text-align: center;
      
      .welcome-stats {
        margin-top: 20px;
        gap: 20px;
      }
    }
    
    .overview-content {
      .overview-icon {
        width: 48px;
        height: 48px;
        font-size: 20px;
      }
      
      .overview-value {
        font-size: 20px !important;
      }
    }
  }
}
</style>