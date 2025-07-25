import React from 'react';
import { Typography, Card, Table, Button, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Inventory: React.FC = () => {
  const columns = [
    { title: '商品编码', dataIndex: 'productCode', key: 'productCode' },
    { title: '商品名称', dataIndex: 'productName', key: 'productName' },
    { title: '当前库存', dataIndex: 'stock', key: 'stock', render: (stock: number) => <span style={{ color: stock < 100 ? '#ff4d4f' : '#52c41a' }}>{stock}</span> },
    { title: '预警阈值', dataIndex: 'threshold', key: 'threshold' },
    { title: '仓库', dataIndex: 'warehouse', key: 'warehouse' },
  ];

  const data = [
    { key: '1', productCode: 'P001', productName: 'iPhone 15 Pro', stock: 150, threshold: 100, warehouse: '主仓库' },
    { key: '2', productCode: 'P002', productName: '小米14', stock: 300, threshold: 200, warehouse: '主仓库' },
    { key: '3', productCode: 'P004', productName: 'AirPods Pro', stock: 0, threshold: 50, warehouse: '主仓库' },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>库存管理</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<SyncOutlined />}>刷新库存</Button>
        </Space>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Inventory;