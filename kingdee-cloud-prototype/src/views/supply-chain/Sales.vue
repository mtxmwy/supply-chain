<template>
  <div class="sales-page">
    <div class="page-header">
      <h2>销售管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          新建销售单
        </el-button>
      </div>
    </div>

    <!-- 销售统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in statsData" :key="item.title">
          <div class="kd-card stats-card">
            <div class="stats-content">
              <div class="stats-icon" :class="item.iconClass">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-value">{{ item.value }}</div>
                <div class="stats-title">{{ item.title }}</div>
                <div class="stats-trend" :class="item.trend > 0 ? 'up' : 'down'">
                  <el-icon><component :is="item.trend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                  {{ Math.abs(item.trend) }}%
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="kd-card search-section">
      <el-form :model="searchForm" inline>
        <el-form-item label="销售单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入销售单号" clearable />
        </el-form-item>
        <el-form-item label="客户">
          <el-select v-model="searchForm.customerId" placeholder="请选择客户" clearable>
            <el-option label="阿里巴巴集团" value="1" />
            <el-option label="腾讯科技" value="2" />
            <el-option label="华为技术" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 销售订单列表 -->
    <div class="kd-card table-section">
      <div class="table-header">
        <span>销售订单列表</span>
        <div class="table-actions">
          <el-button size="small" @click="handleExport">导出</el-button>
          <el-button size="small" @click="handleBatchShip">批量发货</el-button>
        </div>
      </div>
      
      <el-table 
        :data="tableData" 
        v-loading="loading" 
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNo" label="销售单号" width="140" />
        <el-table-column prop="customerName" label="客户名称" width="160" />
        <el-table-column prop="totalAmount" label="销售金额" width="120">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.totalAmount.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="预计利润" width="120">
          <template #default="{ row }">
            <span class="profit-text">¥{{ row.profit.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" label="下单日期" width="120" />
        <el-table-column prop="deliveryDate" label="交货日期" width="120" />
        <el-table-column prop="salesperson" label="销售员" width="100" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleView(row)">查看</el-button>
            <el-button type="warning" size="small" text @click="handleEdit(row)" v-if="row.status === 'pending'">编辑</el-button>
            <el-button type="success" size="small" text @click="handleConfirm(row)" v-if="row.status === 'pending'">确认</el-button>
            <el-button type="info" size="small" text @click="handleShip(row)" v-if="row.status === 'confirmed'">发货</el-button>
            <el-button type="danger" size="small" text @click="handleCancel(row)" v-if="['pending', 'confirmed'].includes(row.status)">取消</el-button>
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

    <!-- 新建/编辑销售单对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingRow ? '编辑销售单' : '新建销售单'"
      width="900px"
      :before-close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户" prop="customerId">
              <el-select v-model="formData.customerId" placeholder="请选择客户" style="width: 100%">
                <el-option label="阿里巴巴集团" value="1" />
                <el-option label="腾讯科技" value="2" />
                <el-option label="华为技术" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交货日期" prop="deliveryDate">
              <el-date-picker
                v-model="formData.deliveryDate"
                type="date"
                placeholder="请选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售员" prop="salesperson">
              <el-select v-model="formData.salesperson" placeholder="请选择销售员" style="width: 100%">
                <el-option label="张三" value="zhangsan" />
                <el-option label="李四" value="lisi" />
                <el-option label="王五" value="wangwu" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
        
        <!-- 销售明细 -->
        <div class="form-section">
          <div class="section-header">
            <span>销售明细</span>
            <el-button type="primary" size="small" @click="addSalesItem">添加商品</el-button>
          </div>
          <el-table :data="formData.items" border max-height="300">
            <el-table-column label="商品名称" width="180">
              <template #default="{ row, $index }">
                <el-select v-model="row.productId" placeholder="请选择商品" @change="handleProductChange($index)">
                  <el-option label="iPhone 15 Pro" value="1" />
                  <el-option label="MacBook Pro" value="2" />
                  <el-option label="iPad Air" value="3" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="100">
              <template #default="{ row }">
                <el-input-number v-model="row.quantity" :min="1" @change="calculateAmount(row)" />
              </template>
            </el-table-column>
            <el-table-column label="单价" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.price" :min="0" :precision="2" @change="calculateAmount(row)" />
              </template>
            </el-table-column>
            <el-table-column label="成本" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.cost" :min="0" :precision="2" @change="calculateProfit(row)" />
              </template>
            </el-table-column>
            <el-table-column label="金额" width="120">
              <template #default="{ row }">
                <span>¥{{ row.amount?.toFixed(2) || '0.00' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="利润" width="120">
              <template #default="{ row }">
                <span class="profit-text">¥{{ row.profit?.toFixed(2) || '0.00' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button type="danger" size="small" text @click="removeSalesItem($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="summary-info">
            <div class="summary-item">
              <span>总金额: ¥{{ totalAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-item">
              <span>总成本: ¥{{ totalCost.toFixed(2) }}</span>
            </div>
            <div class="summary-item profit">
              <span>总利润: ¥{{ totalProfit.toFixed(2) }}</span>
            </div>
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
const selectedRows = ref<any[]>([])
const formRef = ref<FormInstance>()

// 统计数据
const statsData = ref([
  {
    title: '今日销售额',
    value: '¥156,789',
    icon: 'Money',
    iconClass: 'money-icon',
    trend: 15.6
  },
  {
    title: '今日订单数',
    value: '89',
    icon: 'Document',
    iconClass: 'order-icon',
    trend: 12.3
  },
  {
    title: '今日利润',
    value: '¥45,678',
    icon: 'TrendCharts',
    iconClass: 'profit-icon',
    trend: 18.9
  },
  {
    title: '客户数量',
    value: '1,234',
    icon: 'User',
    iconClass: 'customer-icon',
    trend: -2.1
  }
])

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  customerId: '',
  status: '',
  dateRange: null
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
    orderNo: 'SO202401001',
    customerName: '阿里巴巴集团',
    totalAmount: 289600,
    profit: 45600,
    status: 'pending',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
    salesperson: '张三'
  },
  {
    id: 2,
    orderNo: 'SO202401002',
    customerName: '腾讯科技',
    totalAmount: 156800,
    profit: 23400,
    status: 'confirmed',
    orderDate: '2024-01-14',
    deliveryDate: '2024-01-19',
    salesperson: '李四'
  },
  {
    id: 3,
    orderNo: 'SO202401003',
    customerName: '华为技术',
    totalAmount: 445200,
    profit: 89600,
    status: 'shipped',
    orderDate: '2024-01-13',
    deliveryDate: '2024-01-18',
    salesperson: '王五'
  }
])

// 表单数据
const formData = reactive<{
  customerId: string
  deliveryDate: string | Date
  salesperson: string
  remark: string
  items: any[]
}>({
  customerId: '',
  deliveryDate: '',
  salesperson: '',
  remark: '',
  items: []
})

// 表单验证规则
const formRules = {
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  deliveryDate: [{ required: true, message: '请选择交货日期', trigger: 'change' }],
  salesperson: [{ required: true, message: '请选择销售员', trigger: 'change' }]
}

// 计算属性
const totalAmount = computed(() => {
  return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const totalCost = computed(() => {
  return formData.items.reduce((sum, item) => sum + ((item.cost || 0) * (item.quantity || 0)), 0)
})

const totalProfit = computed(() => {
  return formData.items.reduce((sum, item) => sum + (item.profit || 0), 0)
})

// 方法
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'warning',
    confirmed: 'primary',
    shipped: 'info',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知'
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询完成')
  }, 1000)
}

const handleReset = () => {
  Object.assign(searchForm, {
    orderNo: '',
    customerId: '',
    status: '',
    dateRange: null
  })
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

const handleBatchShip = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要发货的订单')
    return
  }
  ElMessage.info('批量发货功能开发中...')
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const handleView = (row: any) => {
  ElMessage.info(`查看销售单: ${row.orderNo}`)
}

const handleEdit = (row: any) => {
  editingRow.value = row
  Object.assign(formData, {
    customerId: '1',
    deliveryDate: new Date(row.deliveryDate),
    salesperson: row.salesperson,
    remark: '编辑中的销售单',
    items: [
      { productId: '1', quantity: 10, price: 9999, cost: 7999, amount: 99990, profit: 20000 }
    ]
  })
  showCreateDialog.value = true
}

const handleConfirm = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认该销售单吗？', '确认操作', {
      type: 'warning'
    })
    row.status = 'confirmed'
    ElMessage.success('确认成功')
  } catch {
    // 用户取消
  }
}

const handleShip = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认发货吗？', '确认发货', {
      type: 'warning'
    })
    row.status = 'shipped'
    ElMessage.success('发货成功')
  } catch {
    // 用户取消
  }
}

const handleCancel = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认取消该销售单吗？', '确认取消', {
      type: 'warning'
    })
    row.status = 'cancelled'
    ElMessage.success('取消成功')
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
    customerId: '',
    deliveryDate: '',
    salesperson: '',
    remark: '',
    items: []
  })
  editingRow.value = null
}

const addSalesItem = () => {
  formData.items.push({
    productId: '',
    quantity: 1,
    price: 0,
    cost: 0,
    amount: 0,
    profit: 0
  })
}

const removeSalesItem = (index: number) => {
  formData.items.splice(index, 1)
}

const handleProductChange = (index: number) => {
  const item = formData.items[index]
  // 根据商品设置默认价格和成本
  const productData: Record<string, { price: number; cost: number }> = {
    '1': { price: 9999, cost: 7999 },
    '2': { price: 15999, cost: 12999 },
    '3': { price: 5999, cost: 4499 }
  }
  const data = productData[item.productId]
  if (data) {
    item.price = data.price
    item.cost = data.cost
    calculateAmount(item)
    calculateProfit(item)
  }
}

const calculateAmount = (item: any) => {
  item.amount = item.quantity * item.price
  calculateProfit(item)
}

const calculateProfit = (item: any) => {
  item.profit = item.amount - (item.quantity * item.cost)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (formData.items.length === 0) {
      ElMessage.warning('请至少添加一个销售商品')
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
          orderNo: `SO${Date.now()}`,
          customerName: '阿里巴巴集团',
          totalAmount: totalAmount.value,
          profit: totalProfit.value,
          status: 'pending',
          orderDate: new Date().toISOString().split('T')[0],
          deliveryDate: typeof formData.deliveryDate === 'string' ? formData.deliveryDate : formData.deliveryDate.toISOString().split('T')[0],
          salesperson: formData.salesperson
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
.sales-page {
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
  
  .stats-cards {
    margin-bottom: 20px;
    
    .stats-card {
      .stats-content {
        display: flex;
        align-items: center;
        padding: 20px;
        
        .stats-icon {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          font-size: 20px;
          
          &.money-icon {
            background: rgba(103, 194, 58, 0.1);
            color: #67c23a;
          }
          
          &.order-icon {
            background: rgba(0, 102, 204, 0.1);
            color: #0066cc;
          }
          
          &.profit-icon {
            background: rgba(255, 193, 7, 0.1);
            color: #ffc107;
          }
          
          &.customer-icon {
            background: rgba(108, 117, 125, 0.1);
            color: #6c757d;
          }
        }
        
        .stats-info {
          flex: 1;
          
          .stats-value {
            font-size: 20px;
            font-weight: 600;
            color: var(--kd-text-primary);
            margin-bottom: 4px;
          }
          
          .stats-title {
            font-size: 14px;
            color: var(--kd-text-secondary);
            margin-bottom: 4px;
          }
          
          .stats-trend {
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
  
  .search-section {
    margin-bottom: 20px;
  }
  
  .table-section {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 0;
      
      span {
        font-weight: 500;
        color: var(--kd-text-primary);
      }
    }
    
    .amount-text {
      color: var(--kd-primary-color);
      font-weight: 500;
    }
    
    .profit-text {
      color: var(--kd-success-color);
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
    
    .summary-info {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
      margin-top: 10px;
      padding: 10px;
      background: var(--kd-bg-dark);
      border-radius: 4px;
      
      .summary-item {
        font-size: 14px;
        font-weight: 500;
        
        &.profit {
          color: var(--kd-success-color);
        }
      }
    }
  }
}
</style>