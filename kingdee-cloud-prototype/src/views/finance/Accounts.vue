<template>
  <div class="accounts-page">
    <div class="page-header">
      <h2>总账管理</h2>
      <div class="header-actions">
        <el-button type="primary">
          <el-icon><Plus /></el-icon>
          新建凭证
        </el-button>
      </div>
    </div>

    <!-- 功能开发中提示 -->
    <div class="kd-card development-notice">
      <div class="notice-content">
        <el-result
          icon="info"
          title="功能开发中"
          sub-title="总账管理模块正在开发中，敬请期待！"
        >
          <template #extra>
            <el-button type="primary" @click="$router.push('/dashboard')">返回工作台</el-button>
          </template>
        </el-result>
      </div>
    </div>

    <!-- 功能预览 -->
    <div class="kd-card feature-preview">
      <div class="kd-card-header">
        <div class="kd-card-title">规划功能</div>
      </div>
      <div class="kd-card-body">
        <el-row :gutter="20">
          <el-col :span="8" v-for="feature in features" :key="feature.title">
            <div class="feature-item">
              <div class="feature-icon">
                <el-icon><component :is="feature.icon" /></el-icon>
              </div>
              <div class="feature-info">
                <h4>{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const features = ref([
  {
    title: '会计科目',
    description: '科目设置、科目余额、科目明细查询',
    icon: 'List'
  },
  {
    title: '凭证管理',
    description: '凭证录入、审核、查询、打印',
    icon: 'Document'
  },
  {
    title: '账簿查询',
    description: '总账、明细账、科目余额表',
    icon: 'Notebook'
  },
  {
    title: '期末处理',
    description: '期末结转、损益结转、账套备份',
    icon: 'Calendar'
  },
  {
    title: '财务报表',
    description: '资产负债表、利润表、现金流量表',
    icon: 'DataAnalysis'
  },
  {
    title: '辅助核算',
    description: '客户往来、供应商往来、部门核算',
    icon: 'Connection'
  }
])
</script>

<style lang="scss" scoped>
.accounts-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      color: var(--kd-text-primary);
    }
  }
  
  .development-notice {
    margin-bottom: 20px;
    
    .notice-content {
      padding: 40px 20px;
      text-align: center;
    }
  }
  
  .feature-preview {
    .feature-item {
      display: flex;
      align-items: flex-start;
      padding: 20px;
      border: 1px solid var(--kd-border-lighter);
      border-radius: 8px;
      margin-bottom: 20px;
      transition: all 0.3s;
      
      &:hover {
        border-color: var(--kd-primary-color);
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
      }
      
      .feature-icon {
        width: 48px;
        height: 48px;
        background: rgba(0, 102, 204, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        color: var(--kd-primary-color);
        font-size: 20px;
      }
      
      .feature-info {
        flex: 1;
        
        h4 {
          margin: 0 0 8px 0;
          color: var(--kd-text-primary);
          font-size: 16px;
          font-weight: 500;
        }
        
        p {
          margin: 0;
          color: var(--kd-text-secondary);
          font-size: 14px;
          line-height: 1.5;
        }
      }
    }
  }
}
</style>