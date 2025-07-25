<template>
  <div class="users-page">
    <div class="page-header">
      <h2>用户管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          新建用户
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="kd-card search-section">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.realName" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="searchForm.departmentId" placeholder="请选择部门" clearable>
            <el-option label="技术部" value="1" />
            <el-option label="销售部" value="2" />
            <el-option label="财务部" value="3" />
            <el-option label="人事部" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 用户列表 -->
    <div class="kd-card table-section">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="departmentName" label="部门" width="120" />
        <el-table-column prop="roleName" label="角色" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录" width="160" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleView(row)">查看</el-button>
            <el-button type="warning" size="small" text @click="handleEdit(row)">编辑</el-button>
            <el-button 
              :type="row.status === 'active' ? 'danger' : 'success'" 
              size="small" 
              text 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button type="info" size="small" text @click="handleResetPassword(row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新建/编辑用户对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingRow ? '编辑用户' : '新建用户'"
      width="600px"
      :before-close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="!!editingRow" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="formData.realName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentId">
              <el-select v-model="formData.departmentId" placeholder="请选择部门" style="width: 100%">
                <el-option label="技术部" value="1" />
                <el-option label="销售部" value="2" />
                <el-option label="财务部" value="3" />
                <el-option label="人事部" value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="formData.roleId" placeholder="请选择角色" style="width: 100%">
                <el-option label="系统管理员" value="1" />
                <el-option label="部门经理" value="2" />
                <el-option label="普通员工" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="!editingRow">
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            active-value="active"
            inactive-value="inactive"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const showCreateDialog = ref(false)
const editingRow = ref(null)
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  username: '',
  realName: '',
  departmentId: '',
  status: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    username: 'admin',
    realName: '系统管理员',
    email: 'admin@kingdee.com',
    phone: '13800138001',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    departmentName: '技术部',
    roleName: '系统管理员',
    status: 'active',
    lastLoginTime: '2024-01-15 14:30',
    createTime: '2023-01-01 10:00'
  },
  {
    id: 2,
    username: 'zhangsan',
    realName: '张三',
    email: 'zhangsan@kingdee.com',
    phone: '13800138002',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    departmentName: '销售部',
    roleName: '部门经理',
    status: 'active',
    lastLoginTime: '2024-01-15 09:15',
    createTime: '2023-02-15 14:20'
  },
  {
    id: 3,
    username: 'lisi',
    realName: '李四',
    email: 'lisi@kingdee.com',
    phone: '13800138003',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    departmentName: '财务部',
    roleName: '普通员工',
    status: 'inactive',
    lastLoginTime: '2024-01-10 16:45',
    createTime: '2023-03-20 11:30'
  }
])

// 表单数据
const formData = reactive({
  username: '',
  realName: '',
  email: '',
  phone: '',
  departmentId: '',
  roleId: '',
  password: '',
  confirmPassword: '',
  status: 'active',
  remark: ''
})

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 方法
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询完成')
  }, 1000)
}

const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    realName: '',
    departmentId: '',
    status: ''
  })
}

const handleView = (row: any) => {
  ElMessage.info(`查看用户: ${row.realName}`)
}

const handleEdit = (row: any) => {
  editingRow.value = row
  Object.assign(formData, {
    username: row.username,
    realName: row.realName,
    email: row.email,
    phone: row.phone,
    departmentId: '1',
    roleId: '2',
    status: row.status,
    remark: '编辑用户信息'
  })
  showCreateDialog.value = true
}

const handleToggleStatus = async (row: any) => {
  const action = row.status === 'active' ? '禁用' : '启用'
  try {
    await ElMessageBox.confirm(`确认${action}用户"${row.realName}"吗？`, `确认${action}`, {
      type: 'warning'
    })
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`${action}成功`)
  } catch {
    // 用户取消
  }
}

const handleResetPassword = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确认重置用户"${row.realName}"的密码吗？`, '确认重置', {
      type: 'warning'
    })
    ElMessage.success('密码重置成功，新密码为：123456')
  } catch {
    // 用户取消
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    username: '',
    realName: '',
    email: '',
    phone: '',
    departmentId: '',
    roleId: '',
    password: '',
    confirmPassword: '',
    status: 'active',
    remark: ''
  })
  editingRow.value = null
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 模拟提交
    setTimeout(() => {
      if (editingRow.value) {
        // 更新现有用户
        Object.assign(editingRow.value, {
          realName: formData.realName,
          email: formData.email,
          phone: formData.phone,
          status: formData.status
        })
        ElMessage.success('编辑成功')
      } else {
        // 添加新用户
        tableData.value.unshift({
          id: Date.now(),
          username: formData.username,
          realName: formData.realName,
          email: formData.email,
          phone: formData.phone,
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          departmentName: '技术部',
          roleName: '普通员工',
          status: formData.status,
          lastLoginTime: '从未登录',
          createTime: new Date().toLocaleString()
        })
        ElMessage.success('创建成功')
      }
      
      submitting.value = false
      showCreateDialog.value = false
      handleDialogClose()
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

onMounted(() => {
  pagination.total = tableData.value.length
})
</script>

<style lang="scss" scoped>
.users-page {
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
  
  .search-section {
    margin-bottom: 20px;
  }
  
  .table-section {
    .pagination-wrapper {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>