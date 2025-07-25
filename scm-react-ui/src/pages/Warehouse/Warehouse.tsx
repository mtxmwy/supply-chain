import React from 'react';
import { Typography, Card, Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Warehouse: React.FC = () => {
  const columns = [
    { title: '仓库编码', dataIndex: 'code', key: 'code' },
    { title: '仓库名称', dataIndex: 'name', key: 'name' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    { title: '负责人', dataIndex: 'manager', key: 'manager' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag> },
  ];

  const data = [
    { key: '1', code: 'WH001', name: '主仓库', address: '北京市朝阳区', manager: '王五', status: '启用' },
    { key: '2', code: 'WH002', name: '分仓库A', address: '上海市浦东新区', manager: '赵六', status: '启用' },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>仓库管理</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />}>新增仓库</Button>
        </Space>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Warehouse;