import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Typography, 
  Input, 
  Select, 
  Card,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ExportOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface ProductData {
  key: string;
  productCode: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  supplier: string;
  createTime: string;
}

const Products: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const [products, setProducts] = useState<ProductData[]>([
    {
      key: '1',
      productCode: 'P001',
      productName: 'iPhone 15 Pro',
      category: '手机',
      price: 7999,
      stock: 150,
      status: 'active',
      supplier: '苹果公司',
      createTime: '2024-01-15'
    },
    {
      key: '2',
      productCode: 'P002',
      productName: '小米14',
      category: '手机',
      price: 3999,
      stock: 300,
      status: 'active',
      supplier: '小米科技',
      createTime: '2024-01-14'
    },
    {
      key: '3',
      productCode: 'P003',
      productName: 'MacBook Pro',
      category: '笔记本',
      price: 14999,
      stock: 50,
      status: 'active',
      supplier: '苹果公司',
      createTime: '2024-01-13'
    },
    {
      key: '4',
      productCode: 'P004',
      productName: 'AirPods Pro',
      category: '耳机',
      price: 1999,
      stock: 0,
      status: 'inactive',
      supplier: '苹果公司',
      createTime: '2024-01-12'
    }
  ]);

  const columns: ColumnsType<ProductData> = [
    {
      title: '商品编码',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.productName.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: '手机', value: '手机' },
        { text: '笔记本', value: '笔记本' },
        { text: '耳机', value: '耳机' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toLocaleString()}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <span style={{ color: stock === 0 ? '#ff4d4f' : stock < 100 ? '#faad14' : '#52c41a' }}>
          {stock}
        </span>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个商品吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product: ProductData) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setProducts(products.filter(item => item.key !== key));
    message.success('删除成功');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingProduct) {
        // 编辑
        setProducts(products.map(item => 
          item.key === editingProduct.key 
            ? { ...item, ...values }
            : item
        ));
        message.success('更新成功');
      } else {
        // 新增
        const newProduct: ProductData = {
          key: Date.now().toString(),
          ...values,
          createTime: new Date().toISOString().split('T')[0]
        };
        setProducts([...products, newProduct]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        商品管理
      </Title>

      <Card style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索商品名称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="选择分类"
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 120 }}
            allowClear
          >
            <Option value="手机">手机</Option>
            <Option value="笔记本">笔记本</Option>
            <Option value="耳机">耳机</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增商品
          </Button>
          <Button icon={<ExportOutlined />}>
            导出数据
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          pagination={{
            total: filteredProducts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingProduct ? '编辑商品' : '新增商品'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active' }}
        >
          <Form.Item
            name="productCode"
            label="商品编码"
            rules={[{ required: true, message: '请输入商品编码' }]}
          >
            <Input placeholder="请输入商品编码" />
          </Form.Item>
          <Form.Item
            name="productName"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            name="category"
            label="商品分类"
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
            <Select placeholder="请选择商品分类">
              <Option value="手机">手机</Option>
              <Option value="笔记本">笔记本</Option>
              <Option value="耳机">耳机</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              placeholder="请输入价格"
              style={{ width: '100%' }}
              min={0}
              precision={2}
            />
          </Form.Item>
          <Form.Item
            name="stock"
            label="库存数量"
            rules={[{ required: true, message: '请输入库存数量' }]}
          >
            <InputNumber
              placeholder="请输入库存数量"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="supplier"
            label="供应商"
            rules={[{ required: true, message: '请输入供应商' }]}
          >
            <Input placeholder="请输入供应商" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="inactive">停用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;