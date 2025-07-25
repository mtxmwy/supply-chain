import React from 'react';
import { Typography, Card, Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Finance: React.FC = () => {
  const columns = [
    { title: '单据号', dataIndex: 'docNo', key: 'docNo' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === '收入' ? 'green' : 'red'}>{type}</Tag> },
    { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
    { title: '科目', dataIndex: 'subject', key: 'subject' },
    { title: '日期', dataIndex: 'date', key: 'date' },
  ];

  const data = [
    { key: '1', docNo: 'FN-2024-001', type: '收入', amount: 156800, subject: '销售收入', date: '2024-01-15' },
    { key: '2', docNo: 'FN-2024-002', type: '支出', amount: 89600, subject: '采购成本', date: '2024-01-14' },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>财务管理</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />}>新增财务记录</Button>
        </Space>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Finance;