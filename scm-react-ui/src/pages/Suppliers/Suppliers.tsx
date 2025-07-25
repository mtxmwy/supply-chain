import React from 'react';
import { Typography, Card, Table, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Suppliers: React.FC = () => {
  const columns = [
    { title: '供应商编码', dataIndex: 'code', key: 'code' },
    { title: '供应商名称', dataIndex: 'name', key: 'name' },
    { title: '联系人', dataIndex: 'contact', key: 'contact' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    { title: '状态', dataIndex: 'status', key: 'status' },
  ];

  const data = [
    { key: '1', code: 'S001', name: '苹果公司', contact: '张三', phone: '13800138000', status: '启用' },
    { key: '2', code: 'S002', name: '小米科技', contact: '李四', phone: '13800138001', status: '启用' },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>供应商管理</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />}>新增供应商</Button>
        </Space>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Suppliers;