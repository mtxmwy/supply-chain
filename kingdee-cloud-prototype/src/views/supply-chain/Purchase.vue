<template>
  <div class="purchase-page">
    <div class="page-header">
      <h2>采购管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          新建采购单
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="kd-card search-section">
      <el-form :model="searchForm" inline>
        <el-form-item label="采购单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入采购单号" clearable />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="searchForm.supplierId" placeholder="请选择供应商" clearable>
            <el-option label="深圳科技有限公司" value="1" />
            <el-option label="广州贸易公司" value="2" />
            <el-option label="北京电子公司" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已审核" value="approved" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <div class="kd-card table-section">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="orderNo" label="采购单号" width="160" />
        <el-table-column prop="supplierName" label="供应商" width="180" />
        <el-table-column prop="totalAmount" label="采购金额" width="120">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.totalAmount.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="160" />
        <el-table-column prop="creator" label="创建人" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleView(row)">查看</el-button>
            <el-button type="warning" size="small" text @click="handleEdit(row)" v-if="row.status === 'pending'">编辑</el-button>
            <el-button type="success" size="small" text @click="handleApprove(row)" v-if="row.status === 'pending'">审核</el-button>
            <el-button type="danger" size="small" text @click="handleDelete(row)" v-if="row.status === 'pending'">删除</el-button>
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

    <!-- 新建/编辑对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingRow ? '编辑采购单' : '新建采购单'"
      width="800px"
      :before-close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplierId">
              <el-select v-model="formData.supplierId" placeholder="请选择供应商" style="width: 100%">
                <el-option label="深圳科技有限公司" value="1" />
                <el-option label="广州贸易公司" value="2" />
                <el-option label="北京电子公司" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计到货日期" prop="expectedDate">
              <el-date-picker
                v-model="formData.expectedDate"
                type="date"
                placeholder="请选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
        
        <!-- 采购明细 -->
        <div class="form-section">
          <div class="section-header">
            <span>采购明细</span>
            <el-button type="primary" size="small" @click="addPurchaseItem">添加商品</el-button>
          </div>
          <el-table :data="formData.items" border>
            <el-table-column label="商品名称" width="200">
              <template #default="{ row, $index }">
                <el-select v-model="row.productId" placeholder="请选择商品" @change="handleProductChange($index)">
                  <el-option label="iPhone 15" value="1" />
                  <el-option label="MacBook Pro" value="2" />
                  <el-option label="iPad Air" value="3" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.quantity" :min="1" @change="calculateAmount(row)" />
              </template>
            </el-table-column>
            <el-table-column label="单价" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.price" :min="0" :precision="2" @change="calculateAmount(row)" />
              </template>
            </el-table-column>
            <el-table-column label="金额" width="120">
              <template #default="{ row }">
                <span>¥{{ row.amount?.toFixed(2) || '0.00' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button type="danger" size="small" text @click="removePurchaseItem($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="total-amount">
            <span>总金额: ¥{{ totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
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
  orderNo: '',
  supplierId: '',
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
    orderNo: 'PO202401001',
    supplierName: '深圳科技有限公司',
    totalAmount: 125600,
    status: 'pending',
    createDate: '2024-01-15 10:30',
    creator: '张三'
  },
  {
    id: 2,
    orderNo: 'PO202401002',
    supplierName: '广州贸易公司',
    totalAmount: 89400,
    status: 'approved',
    createDate: '2024-01-14 14:20',
    creator: '李四'
  },
  {
    id: 3,
    orderNo: 'PO202401003',
    supplierName: '北京电子公司',
    totalAmount: 234500,
    status: 'completed',
    createDate: '2024-01-13 09:15',
    creator: '王五'
  }
])

// 表单数据
const formData = reactive<{
  supplierId: string
  expectedDate: string
  remark: string
  items: any[]
}>({
  supplierId: '',
  expectedDate: '',
  remark: '',
  items: []
})

// 表单验证规则
const formRules = {
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  expectedDate: [{ required: true, message: '请选择预计到货日期', trigger: 'change' }]
}

// 计算总金额
const totalAmount = computed(() => {
  return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0)
})

// 方法
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'warning',
    approved: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    approved: '已审核',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知'
}

const handleSearch = () => {
  loading.value = true
  // 模拟搜索
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询完成')
  }, 1000)
}

const handleReset = () => {
  Object.assign(searchForm, {
    orderNo: '',
    supplierId: '',
    status: ''
  })
}

const handleView = (row: any) => {
  ElMessage.info(`查看采购单: ${row.orderNo}`)
}

const handleEdit = (row: any) => {
  editingRow.value = row
  Object.assign(formData, {
    supplierId: '1',
    expectedDate: new Date(),
    remark: '编辑中的采购单',
    items: [
      { productId: '1', quantity: 10, price: 8999, amount: 89990 }
    ]
  })
  showCreateDialog.value = true
}

const handleApprove = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认审核通过该采购单吗？', '确认审核', {
      type: 'warning'
    })
    row.status = 'approved'
    ElMessage.success('审核成功')
  } catch {
    // 用户取消
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该采购单吗？', '确认删除', {
      type: 'warning'
    })
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  // 重新加载数据
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  // 重新加载数据
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    supplierId: '',
    expectedDate: '',
    remark: '',
    items: []
  })
  editingRow.value = null
}

const addPurchaseItem = () => {
  formData.items.push({
    productId: '',
    quantity: 1,
    price: 0,
    amount: 0
  })
}

const removePurchaseItem = (index: number) => {
  formData.items.splice(index, 1)
}

const handleProductChange = (index: number) => {
  const item = formData.items[index]
  // 根据商品设置默认价格
  const priceMap: Record<string, number> = {
    '1': 8999,
    '2': 12999,
    '3': 4999
  }
  item.price = priceMap[item.productId] || 0
  calculateAmount(item)
}

const calculateAmount = (item: any) => {
  item.amount = item.quantity * item.price
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (formData.items.length === 0) {
      ElMessage.warning('请至少添加一个采购商品')
      return
    }
    
    submitting.value = true
    
    // 模拟提交
    setTimeout(() => {
      if (editingRow.value) {
        ElMessage.success('编辑成功')
      } else {
        ElMessage.success('创建成功')
        // 添加到表格数据
        tableData.value.unshift({
          id: Date.now(),
          orderNo: `PO${Date.now()}`,
          supplierName: '深圳科技有限公司',
          totalAmount: totalAmount.value,
          status: 'pending',
          createDate: new Date().toLocaleString(),
          creator: '当前用户'
        })
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
.purchase-page {
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
    
    .kd-card-body {
      padding: 20px;
    }
  }
  
  .table-section {
    .amount-text {
      color: var(--kd-primary-color);
      font-weight: 500;
    }
    
    .pagination-wrapper {
      margin-top: 20px;
      text-align: right;
    }
  }
  
  .form-section {
    margin-top: 20px;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      
      span {
        font-weight: 500;
        color: var(--kd-text-primary);
      }
    }
    
    .total-amount {
      text-align: right;
      margin-top: 10px;
      font-size: 16px;
      font-weight: 600;
      color: var(--kd-primary-color);
    }
  }
}
</style>