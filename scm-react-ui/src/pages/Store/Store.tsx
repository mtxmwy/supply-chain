import React from 'react';
import { Typography, Card, Table, Button, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Store: React.FC = () => {
  const columns = [
    { title: '门店编码', dataIndex: 'code', key: 'code' },
    { title: '门店名称', dataIndex: 'name', key: 'name' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    { title: '店长', dataIndex: 'manager', key: 'manager' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === '营业' ? 'green' : 'red'}>{status}</Tag> },
  ];

  const data = [
    { key: '1', code: 'ST001', name: '旗舰店', address: '北京市王府井大街', manager: '李经理', status: '营业' },
    { key: '2', code: 'ST002', name: '分店A', address: '上海市南京路', manager: '张经理', status: '营业' },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>门店管理</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />}>新增门店</Button>
        </Space>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Store;