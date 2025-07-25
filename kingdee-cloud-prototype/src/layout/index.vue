<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <header class="layout-header">
      <div class="header-left">
        <div class="logo">
          <img src="/kingdee-logo.svg" alt="金蝶" class="logo-img" />
          <span class="logo-text">金蝶星空云</span>
        </div>
        <el-button
          :icon="isCollapsed ? 'Expand' : 'Fold'"
          @click="toggleSidebar"
          class="collapse-btn"
          text
        />
      </div>
      
      <div class="header-center">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="userAvatar" />
            <span class="username">{{ username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">系统设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主内容区域 -->
    <div class="layout-main">
      <!-- 侧边栏 -->
      <aside class="layout-sidebar" :class="{ collapsed: isCollapsed }">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          :unique-opened="true"
          background-color="#001529"
          text-color="#ffffff"
          active-text-color="#1890ff"
          @select="handleMenuSelect"
        >
          <template v-for="route in menuRoutes" :key="route.path">
            <el-sub-menu v-if="route.children?.length" :index="route.path">
              <template #title>
                <el-icon><component :is="route.meta?.icon" /></el-icon>
                <span>{{ route.meta?.title }}</span>
              </template>
              <el-menu-item
                v-for="child in route.children"
                :key="child.path"
                :index="child.path"
              >
                <el-icon><component :is="child.meta?.icon" /></el-icon>
                <span>{{ child.meta?.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="route.path">
              <el-icon><component :is="route.meta?.icon" /></el-icon>
              <span>{{ route.meta?.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <!-- 内容区域 -->
      <main class="layout-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 响应式数据
const isCollapsed = ref(false)
const username = ref('管理员')
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 计算属性
const activeMenu = computed(() => route.path)

const menuRoutes = computed(() => {
  return router.getRoutes()
    .find(r => r.path === '/')
    ?.children?.filter(child => child.meta?.title && child.path !== '/dashboard') || []
})

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  return matched.map(item => ({
    path: item.path,
    title: item.meta?.title
  }))
})

// 方法
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能开发中...')
      break
    case 'settings':
      ElMessage.info('系统设置功能开发中...')
      break
    case 'logout':
      localStorage.removeItem('token')
      router.push('/login')
      ElMessage.success('退出登录成功')
      break
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  height: var(--kd-header-height);
  background: #ffffff;
  border-bottom: 1px solid var(--kd-border-lighter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .logo {
      display: flex;
      align-items: center;
      margin-right: 20px;
      
      .logo-img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      
      .logo-text {
        font-size: 20px;
        font-weight: 600;
        color: var(--kd-primary-color);
      }
    }
    
    .collapse-btn {
      font-size: 18px;
      color: var(--kd-text-regular);
    }
  }
  
  .header-center {
    flex: 1;
    padding: 0 20px;
  }
  
  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: var(--kd-bg-dark);
      }
      
      .username {
        margin: 0 8px;
        color: var(--kd-text-primary);
      }
    }
  }
}

.layout-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.layout-sidebar {
  width: var(--kd-sidebar-width);
  background: #001529;
  transition: width 0.3s;
  overflow: hidden;
  
  &.collapsed {
    width: var(--kd-sidebar-collapsed-width);
  }
  
  :deep(.el-menu) {
    border-right: none;
    
    .el-menu-item, .el-sub-menu__title {
      height: 50px;
      line-height: 50px;
    }
    
    .el-menu-item.is-active {
      background-color: var(--kd-primary-color) !important;
    }
  }
}

.layout-content {
  flex: 1;
  background: var(--kd-bg-color);
  overflow: auto;
  
  .content-wrapper {
    min-height: 100%;
    padding: 20px;
  }
}
</style>