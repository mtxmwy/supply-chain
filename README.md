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


用户登录

前台系统和后台登录系统统一使用路径/oauth2/token

通过clientId 判断是调用前台系统还是后台系统登录接口

登录密码加密方式

1.1、加密
1.1.1、加密思路
产生随机盐值（32位）。解释：这里可以使用 UUID 中的 randomUUID 方法生成一个长度为 36 位的随机盐值（格式为xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12)），而我们约定的格式中（完全由自己定义）不需要"-"，因此将产生的随机盐值先使用 toString 方法转化成字符串，最后用 replaceAll 方法将字符串中的 "-" 用空字符串代替即可。
将盐值和明文拼接起来，然后整体使用 md5 加密，得到密文（32位）。解释：这里就是对明文进行加密的过程。
根据自己约定的格式，使用 “32位盐值 +&+ 32位加盐后得到的密文” 方式进行加密得到最终密码
加盐目的：主要是防止别人彩虹表攻击。彩虹表攻击就是会把常用密码和加密后的结果用一张表收集起来。如果加了盐。那每次加密后的结果都不一样，难以收录





