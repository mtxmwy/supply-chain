import React from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Typography, Tag } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  InboxOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface RecentOrderData {
  key: string;
  orderNo: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

const Dashboard: React.FC = () => {
  // 模拟数据
  const recentOrders: RecentOrderData[] = [
    {
      key: '1',
      orderNo: 'SO-2024-001',
      customer: '华为技术有限公司',
      amount: 156800,
      status: 'processing',
      date: '2024-01-15'
    },
    {
      key: '2',
      orderNo: 'SO-2024-002',
      customer: '小米科技有限公司',
      amount: 89600,
      status: 'completed',
      date: '2024-01-14'
    },
    {
      key: '3',
      orderNo: 'SO-2024-003',
      customer: 'OPPO广东移动通信有限公司',
      amount: 234500,
      status: 'pending',
      date: '2024-01-13'
    },
    {
      key: '4',
      orderNo: 'SO-2024-004',
      customer: 'vivo通信科技有限公司',
      amount: 178900,
      status: 'completed',
      date: '2024-01-12'
    }
  ];

  const columns: ColumnsType<RecentOrderData> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'orange', text: '待处理' },
          processing: { color: 'blue', text: '处理中' },
          completed: { color: 'green', text: '已完成' }
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        仪表盘
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日销售额"
              value={1128960}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="元"
            />
            <div style={{ marginTop: 8 }}>
              <ArrowUpOutlined style={{ color: '#3f8600' }} />
              <span style={{ color: '#3f8600', marginLeft: 4 }}>12.5%</span>
              <span style={{ marginLeft: 8, color: '#666' }}>较昨日</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日订单数"
              value={156}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
              suffix="单"
            />
            <div style={{ marginTop: 8 }}>
              <ArrowUpOutlined style={{ color: '#3f8600' }} />
              <span style={{ color: '#3f8600', marginLeft: 4 }}>8.2%</span>
              <span style={{ marginLeft: 8, color: '#666' }}>较昨日</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="库存预警"
              value={23}
              valueStyle={{ color: '#cf1322' }}
              prefix={<InboxOutlined />}
              suffix="种商品"
            />
            <div style={{ marginTop: 8 }}>
              <ArrowDownOutlined style={{ color: '#cf1322' }} />
              <span style={{ color: '#cf1322', marginLeft: 4 }}>3.1%</span>
              <span style={{ marginLeft: 8, color: '#666' }}>较昨日</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃供应商"
              value={89}
              valueStyle={{ color: '#722ed1' }}
              prefix={<TeamOutlined />}
              suffix="家"
            />
            <div style={{ marginTop: 8 }}>
              <ArrowUpOutlined style={{ color: '#3f8600' }} />
              <span style={{ color: '#3f8600', marginLeft: 4 }}>5.7%</span>
              <span style={{ marginLeft: 8, color: '#666' }}>较昨日</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表和表格 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="库存状态" style={{ height: 400 }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Title level={4}>充足</Title>
                  <Progress 
                    type="circle" 
                    percent={75} 
                    strokeColor="#52c41a"
                    format={() => '1,245'}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Title level={4}>预警</Title>
                  <Progress 
                    type="circle" 
                    percent={15} 
                    strokeColor="#faad14"
                    format={() => '156'}
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={4}>缺货</Title>
                  <Progress 
                    type="circle" 
                    percent={10} 
                    strokeColor="#ff4d4f"
                    format={() => '23'}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={4}>总计</Title>
                  <Progress 
                    type="circle" 
                    percent={100} 
                    strokeColor="#1890ff"
                    format={() => '1,424'}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="最近订单" style={{ height: 400 }}>
            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
              scroll={{ y: 280 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;