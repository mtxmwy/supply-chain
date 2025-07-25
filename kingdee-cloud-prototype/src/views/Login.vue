<template>
  <div class="login-container">
    <div class="login-background">
      <div class="background-pattern"></div>
    </div>
    
    <div class="login-content">
      <div class="login-form-wrapper">
        <div class="login-header">
          <div class="logo">
            <img src="/kingdee-logo.svg" alt="金蝶" class="logo-img" />
            <h1 class="logo-text">金蝶星空云</h1>
          </div>
          <p class="subtitle">企业级数字化管理平台</p>
        </div>
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>
          
          <el-form-item>
            <div class="login-options">
              <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="login-footer">
          <p class="demo-tip">
            <el-icon><InfoFilled /></el-icon>
            演示账号：admin / 123456
          </p>
        </div>
      </div>
      
      <div class="login-features">
        <h3>产品特性</h3>
        <div class="feature-list">
          <div class="feature-item">
            <el-icon class="feature-icon"><TrendCharts /></el-icon>
            <div class="feature-content">
              <h4>智能分析</h4>
              <p>基于大数据的智能业务分析</p>
            </div>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><Lock /></el-icon>
            <div class="feature-content">
              <h4>安全可靠</h4>
              <p>企业级安全保障体系</p>
            </div>
          </div>
          <div class="feature-item">
            <el-icon class="feature-icon"><Connection /></el-icon>
            <div class="feature-content">
              <h4>云端协同</h4>
              <p>多端同步，随时随地办公</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { User, Lock, InfoFilled, TrendCharts, Connection } from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const loginFormRef = ref<FormInstance>()

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  rememberMe: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 模拟登录请求
    setTimeout(() => {
      // 简单的登录验证
      if (loginForm.username === 'admin' && loginForm.password === '123456') {
        localStorage.setItem('token', 'demo-token')
        localStorage.setItem('username', loginForm.username)
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } else {
        ElMessage.error('用户名或密码错误')
      }
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .background-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    background-size: 100px 100px;
  }
}

.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.login-form-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  
  .login-header {
    text-align: center;
    margin-bottom: 30px;
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      
      .logo-img {
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }
      
      .logo-text {
        font-size: 28px;
        font-weight: 600;
        color: var(--kd-primary-color);
        margin: 0;
      }
    }
    
    .subtitle {
      color: var(--kd-text-secondary);
      font-size: 14px;
      margin: 0;
    }
  }
  
  .login-form {
    .login-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .login-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
    }
  }
  
  .login-footer {
    margin-top: 20px;
    text-align: center;
    
    .demo-tip {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--kd-text-secondary);
      font-size: 13px;
      margin: 0;
      
      .el-icon {
        margin-right: 4px;
        color: var(--kd-info-color);
      }
    }
  }
}

.login-features {
  color: white;
  max-width: 400px;
  
  h3 {
    font-size: 24px;
    margin-bottom: 30px;
    font-weight: 500;
  }
  
  .feature-list {
    .feature-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 30px;
      
      .feature-icon {
        font-size: 32px;
        margin-right: 16px;
        color: rgba(255, 255, 255, 0.9);
      }
      
      .feature-content {
        h4 {
          font-size: 18px;
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        
        p {
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    padding: 20px;
  }
  
  .login-form-wrapper {
    width: 100%;
    max-width: 400px;
    margin-bottom: 40px;
  }
  
  .login-features {
    max-width: none;
    text-align: center;
  }
}
</style>