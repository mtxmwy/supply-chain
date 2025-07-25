<template>
  <div class="inventory-page">
    <div class="page-header">
      <h2>库存管理</h2>
      <div class="header-actions">
        <el-button type="warning" @click="handleInventoryCheck">
          <el-icon><Document /></el-icon>
          库存盘点
        </el-button>
        <el-button type="primary" @click="handleStockIn">
          <el-icon><Plus /></el-icon>
          入库
        </el-button>
      </div>
    </div>

    <!-- 库存概览卡片 -->
    <div class="overview-cards">
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in overviewData" :key="item.title">
          <div class="kd-card overview-card">
            <div class="card-content">
              <div class="card-icon" :class="item.iconClass">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="card-info">
                <div class="card-value">{{ item.value }}</div>
                <div class="card-title">{{ item.title }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="kd-card search-section">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.productName" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="searchForm.productCode" placeholder="请输入商品编码" clearable />
        </el-form-item>
        <el-form-item label="仓库">
          <el-select v-model="searchForm.warehouseId" placeholder="请选择仓库" clearable>
            <el-option label="主仓库" value="1" />
            <el-option label="北京仓" value="2" />
            <el-option label="上海仓" value="3" />
            <el-option label="广州仓" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存状态">
          <el-select v-model="searchForm.stockStatus" placeholder="请选择状态" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="预警" value="warning" />
            <el-option label="缺货" value="shortage" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 库存列表 -->
    <div class="kd-card table-section">
      <div class="table-header">
        <span>库存列表</span>
        <div class="table-actions">
          <el-button size="small" @click="handleExport">导出</el-button>
          <el-button size="small" @click="handleBatchOperation">批量操作</el-button>
        </div>
      </div>
      
      <el-table 
        :data="tableData" 
        v-loading="loading" 
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="productCode" label="商品编码" width="120" />
        <el-table-column prop="productName" label="商品名称" width="200">
          <template #default="{ row }">
            <div class="product-info">
              <img :src="row.productImage" alt="" class="product-image" />
              <span>{{ row.productName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="warehouseName" label="仓库" width="120" />
        <el-table-column prop="currentStock" label="当前库存" width="100">
          <template #default="{ row }">
            <span :class="getStockClass(row.currentStock, row.minStock)">
              {{ row.currentStock }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="minStock" label="最低库存" width="100" />
        <el-table-column prop="maxStock" label="最高库存" width="100" />
        <el-table-column prop="avgCost" label="平均成本" width="100">
          <template #default="{ row }">
            <span>¥{{ row.avgCost.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalValue" label="库存价值" width="120">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.totalValue.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdateTime" label="最后更新" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleStockDetail(row)">库存明细</el-button>
            <el-button type="warning" size="small" text @click="handleStockAdjust(row)">库存调整</el-button>
            <el-button type="info" size="small" text @click="handleStockMove(row)">库存转移</el-button>
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

    <!-- 库存调整对话框 -->
    <el-dialog
      v-model="showAdjustDialog"
      title="库存调整"
      width="600px"
    >
      <el-form :model="adjustForm" :rules="adjustRules" ref="adjustFormRef" label-width="100px">
        <el-form-item label="商品信息">
          <div class="product-display">
            <img :src="currentProduct?.productImage" alt="" class="product-image" />
            <div>
              <div>{{ currentProduct?.productName }}</div>
              <div class="product-code">{{ currentProduct?.productCode }}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="当前库存">
          <span class="current-stock">{{ currentProduct?.currentStock }} 件</span>
        </el-form-item>
        <el-form-item label="调整类型" prop="adjustType">
          <el-radio-group v-model="adjustForm.adjustType">
            <el-radio value="increase">增加</el-radio>
            <el-radio value="decrease">减少</el-radio>
            <el-radio value="set">设置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整数量" prop="adjustQuantity">
          <el-input-number 
            v-model="adjustForm.adjustQuantity" 
            :min="adjustForm.adjustType === 'decrease' ? 0 : 1"
            :max="adjustForm.adjustType === 'decrease' ? currentProduct?.currentStock : undefined"
          />
          <span class="adjust-hint">
            调整后库存: {{ calculateNewStock() }} 件
          </span>
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-select v-model="adjustForm.reason" placeholder="请选择调整原因">
            <el-option label="盘点调整" value="inventory" />
            <el-option label="损耗调整" value="loss" />
            <el-option label="其他调整" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="adjustForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAdjustDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdjustSubmit" :loading="adjusting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { Plus, Document } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const adjusting = ref(false)
const showAdjustDialog = ref(false)
const currentProduct = ref<any>(null)
const selectedRows = ref<any[]>([])
const adjustFormRef = ref<FormInstance>()

// 概览数据
const overviewData = ref([
  {
    title: '商品总数',
    value: '1,234',
    icon: 'Box',
    iconClass: 'product-icon'
  },
  {
    title: '库存总值',
    value: '¥2,345,678',
    icon: 'Money',
    iconClass: 'value-icon'
  },
  {
    title: '预警商品',
    value: '23',
    icon: 'Warning',
    iconClass: 'warning-icon'
  },
  {
    title: '缺货商品',
    value: '5',
    icon: 'CircleClose',
    iconClass: 'shortage-icon'
  }
])

// 搜索表单
const searchForm = reactive({
  productName: '',
  productCode: '',
  warehouseId: '',
  stockStatus: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 库存调整表单
const adjustForm = reactive({
  adjustType: 'increase',
  adjustQuantity: 1,
  reason: '',
  remark: ''
})

const adjustRules = {
  adjustType: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
  adjustQuantity: [{ required: true, message: '请输入调整数量', trigger: 'blur' }],
  reason: [{ required: true, message: '请选择调整原因', trigger: 'change' }]
}

// 表格数据
const tableData = ref([
  {
    id: 1,
    productCode: 'IP15001',
    productName: 'iPhone 15 Pro 256GB',
    productImage: 'https://via.placeholder.com/40x40',
    category: '手机',
    warehouseName: '主仓库',
    currentStock: 156,
    minStock: 50,
    maxStock: 500,
    avgCost: 8999.00,
    totalValue: 1403844,
    lastUpdateTime: '2024-01-15 14:30'
  },
  {
    id: 2,
    productCode: 'MB001',
    productName: 'MacBook Pro 14英寸',
    productImage: 'https://via.placeholder.com/40x40',
    category: '电脑',
    warehouseName: '主仓库',
    currentStock: 23,
    minStock: 30,
    maxStock: 200,
    avgCost: 15999.00,
    totalValue: 367977,
    lastUpdateTime: '2024-01-15 10:20'
  },
  {
    id: 3,
    productCode: 'IP001',
    productName: 'iPad Air 第5代',
    productImage: 'https://via.placeholder.com/40x40',
    category: '平板',
    warehouseName: '北京仓',
    currentStock: 0,
    minStock: 20,
    maxStock: 150,
    avgCost: 4999.00,
    totalValue: 0,
    lastUpdateTime: '2024-01-14 16:45'
  }
])

// 计算调整后库存
const calculateNewStock = () => {
  if (!currentProduct.value) return 0
  
  const current = currentProduct.value.currentStock
  const adjust = adjustForm.adjustQuantity || 0
  
  switch (adjustForm.adjustType) {
    case 'increase':
      return current + adjust
    case 'decrease':
      return Math.max(0, current - adjust)
    case 'set':
      return adjust
    default:
      return current
  }
}

// 方法
const getStockClass = (current: number, min: number) => {
  if (current === 0) return 'stock-shortage'
  if (current <= min) return 'stock-warning'
  return 'stock-normal'
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
    productName: '',
    productCode: '',
    warehouseId: '',
    stockStatus: ''
  })
}

const handleInventoryCheck = () => {
  ElMessage.info('库存盘点功能开发中...')
}

const handleStockIn = () => {
  ElMessage.info('入库功能开发中...')
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

const handleBatchOperation = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要操作的商品')
    return
  }
  ElMessage.info('批量操作功能开发中...')
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const handleStockDetail = (row: any) => {
  ElMessage.info(`查看库存明细: ${row.productName}`)
}

const handleStockAdjust = (row: any) => {
  currentProduct.value = row
  Object.assign(adjustForm, {
    adjustType: 'increase',
    adjustQuantity: 1,
    reason: '',
    remark: ''
  })
  showAdjustDialog.value = true
}

const handleStockMove = (row: any) => {
  ElMessage.info(`库存转移: ${row.productName}`)
}

const handleAdjustSubmit = async () => {
  if (!adjustFormRef.value) return
  
  try {
    await adjustFormRef.value.validate()
    adjusting.value = true
    
    // 模拟调整
    setTimeout(() => {
      const newStock = calculateNewStock()
      currentProduct.value.currentStock = newStock
      currentProduct.value.totalValue = newStock * currentProduct.value.avgCost
      currentProduct.value.lastUpdateTime = new Date().toLocaleString()
      
      adjusting.value = false
      showAdjustDialog.value = false
      ElMessage.success('库存调整成功')
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
}

onMounted(() => {
  pagination.total = tableData.value.length
})
</script>

<style lang="scss" scoped>
.inventory-page {
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
  
  .overview-cards {
    margin-bottom: 20px;
    
    .overview-card {
      .card-content {
        display: flex;
        align-items: center;
        padding: 20px;
        
        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          font-size: 20px;
          
          &.product-icon {
            background: rgba(0, 102, 204, 0.1);
            color: #0066cc;
          }
          
          &.value-icon {
            background: rgba(103, 194, 58, 0.1);
            color: #67c23a;
          }
          
          &.warning-icon {
            background: rgba(230, 162, 60, 0.1);
            color: #e6a23c;
          }
          
          &.shortage-icon {
            background: rgba(245, 108, 108, 0.1);
            color: #f56c6c;
          }
        }
        
        .card-info {
          .card-value {
            font-size: 20px;
            font-weight: 600;
            color: var(--kd-text-primary);
            margin-bottom: 4px;
          }
          
          .card-title {
            font-size: 14px;
            color: var(--kd-text-secondary);
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
    
    .product-info {
      display: flex;
      align-items: center;
      
      .product-image {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        margin-right: 8px;
        object-fit: cover;
      }
    }
    
    .stock-normal {
      color: var(--kd-success-color);
      font-weight: 500;
    }
    
    .stock-warning {
      color: var(--kd-warning-color);
      font-weight: 500;
    }
    
    .stock-shortage {
      color: var(--kd-danger-color);
      font-weight: 500;
    }
    
    .amount-text {
      color: var(--kd-primary-color);
      font-weight: 500;
    }
    
    .pagination-wrapper {
      margin-top: 20px;
      text-align: right;
    }
  }
  
  .product-display {
    display: flex;
    align-items: center;
    
    .product-image {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      margin-right: 12px;
      object-fit: cover;
    }
    
    .product-code {
      font-size: 12px;
      color: var(--kd-text-secondary);
      margin-top: 4px;
    }
  }
  
  .current-stock {
    font-size: 16px;
    font-weight: 500;
    color: var(--kd-primary-color);
  }
  
  .adjust-hint {
    margin-left: 12px;
    font-size: 12px;
    color: var(--kd-text-secondary);
  }
}
</style>