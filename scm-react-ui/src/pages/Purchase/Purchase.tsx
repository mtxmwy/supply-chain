import React from 'react';
import { Typography, Card, Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Purchase: React.FC = () => {
  const columns = [
    { title: '采购单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '采购金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const colorMap: { [key: string]: string } = {
          '待审核': 'orange',
          '已审核': 'blue',
          '已完成': 'green'
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      }
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ];

  const data = [
    { key: '1', orderNo: 'PO-2024-001', supplier: '苹果公司', amount: 1580000, status: '已完成', createTime: '2024-01-15' },
    { key: '2', orderNo: 'PO-2024-002', supplier: '小米科技', amount: 896000, status: '待审核', createTime: '2024-01-14' },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>采购管理</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />}>新增采购单</Button>
        </Space>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Purchase;