# supply-chain
This is an improved supply chain system based on my company's business.
包括销售平台、订单履约中心，中央库存系统、配送管理系统、仓库管理系统、门店管理系统、财务系统

业务流程

商品、供应商建档系统流程

采购入库流程

销售出库流程

门店请货流程

客户退货退款流程

订单取消流程

1作废、退款
作废-> 库存释放 -> 发票冲红或作废

换货流程（冲红抵扣新开:退款抵扣新开）
补差价，或退差价



仓间调拨系统流程

开票流程

第三方支付对接



技术架构

后端
Springcloud + Nacos + gateway + dubbo/feign+ Activiti+ mysql/mongo + rocketmq + redis/Caffeine + sentinel

前段
react


Guava Cache 和 Caffeine 区别


历史业务单据优化

activiti 审核流动态添加自动审核规则


历史审核数据归档




