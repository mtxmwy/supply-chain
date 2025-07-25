import React from 'react';
import { Typography, Card, Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Sales: React.FC = () => {
  const columns = [
    { title: '销售单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '客户', dataIndex: 'customer', key: 'customer' },
    { title: '销售金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === '已完成' ? 'green' : 'blue'}>{status}</Tag>
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ];

  const data = [
    { key: '1', orderNo: 'SO-2024-001', customer: '华为技术有限公司', amount: 156800, status: '已完成', createTime: '2024-01-15' },
    { key: '2', orderNo: 'SO-2024-002', customer: '小米科技有限公司', amount: 89600, status: '处理中', createTime: '2024-01-14' },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>销售管理</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />}>新增销售单</Button>
        </Space>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Sales;