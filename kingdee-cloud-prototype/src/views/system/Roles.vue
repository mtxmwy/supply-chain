<template>
  <div class="roles-page">
    <div class="page-header">
      <h2>角色管理</h2>
    </div>

    <!-- 功能开发中提示 -->
    <div class="kd-card development-notice">
      <div class="notice-content">
        <el-result
          icon="info"
          title="功能开发中"
          sub-title="角色管理模块正在开发中，敬请期待！"
        >
          <template #extra>
            <el-button type="primary" @click="$router.push('/dashboard')">返回工作台</el-button>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 角色管理页面
</script>

<style lang="scss" scoped>
.roles-page {
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
}
</style>