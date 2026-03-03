"use client";
import React, { useEffect, useState } from 'react';
import { 
  Table, Tag, Space, Card, Typography, Button, Modal, Form, Input, InputNumber, Checkbox, message 
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng Modal
  const [form] = Form.useForm(); // Hook để quản lý Form

  // 1. Hàm lấy danh sách (Giữ nguyên)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      message.error("Lỗi kết nối đến Backend!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Hàm xử lý khi bấm nút "Lưu" trên Form
  const handleCreate = async (values: any) => {
    try {
      // ÉP KIỂU DỮ LIỆU ĐỂ CHIỀU LÒNG BACKEND DTO
      const formattedValues = {
        ...values,
        units: values.units.map((u: any) => ({
          ...u,
          // Bắt buộc ép về dạng Số (Number) để không bị Backend chê lỗi @IsNumber()
          conversion_factor: Number(u.conversion_factor || 0), 
          price: Number(u.price || 0), 
          // Đảm bảo luôn là true hoặc false
          is_base_unit: u.is_base_unit === true 
        }))
      };

      // Gọi API tạo mới
      const res = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedValues),
      });

      if (res.ok) {
        message.success('Tạo sản phẩm thành công! 🎉');
        setIsModalOpen(false); // Đóng Modal
        form.resetFields(); // Xóa trắng form
        fetchProducts(); // Tải lại danh sách
      } else {
        // IN LỖI CHI TIẾT RA MÀN HÌNH NẾU BACKEND TỪ CHỐI
        const errorData = await res.json();
        const errorMsg = Array.isArray(errorData.message) 
          ? errorData.message.join(', ') 
          : errorData.message;
          
        message.error(`Lỗi từ Backend: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
      message.error('Không kết nối được Server Backend (Có thể server đang tắt?)');
    }
  };

  // Cấu hình cột bảng (Giữ nguyên)
  const columns = [
    {
      title: 'Mã SP',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: 'Đơn vị & Giá bán',
      key: 'units',
      render: (_, record: any) => (
        <Space direction="vertical">
          {record.product_units?.map((unit: any) => (
            <Tag key={unit.id} color={unit.is_base_unit ? "green" : "default"}>
              {unit.unit_name}: {Number(unit.price).toLocaleString()} đ
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 50, background: '#f5f5f5', minHeight: '100vh' }}>
      <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <Title level={3} style={{ margin: 0 }}>📦 Kho Vật Liệu</Title>
          
          {/* Nút mở Modal Thêm mới */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Thêm sản phẩm
          </Button>
        </div>
        
        <Table dataSource={products} columns={columns} rowKey="id" loading={loading} bordered />
      </Card>

      {/* --- MODAL FORM TẠO MỚI --- */}
      <Modal
        title="Thêm Vật Liệu Mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // Tắt nút mặc định để dùng nút của Form
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ units: [{ unit_name: '', conversion_factor: 1, price: 0, is_base_unit: true }] }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
              <Input placeholder="Ví dụ: Xi măng Hà Tiên" />
            </Form.Item>
            <Form.Item label="Mã sản phẩm" name="code" rules={[{ required: true }]}>
              <Input placeholder="Ví dụ: XM-HT-01" />
            </Form.Item>
          </div>

          <Form.Item label="Hình ảnh (URL)" name="image_url">
            <Input placeholder="https://..." />
          </Form.Item>

          {/* --- DANH SÁCH ĐƠN VỊ ĐỘNG (Dynamic List) --- */}
          <Typography.Text strong>Danh sách đơn vị tính:</Typography.Text>
          <Form.List name="units">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'unit_name']}
                      rules={[{ required: true, message: 'Nhập tên ĐVT' }]}
                    >
                      <Input placeholder="Tên ĐVT (Bao, Kg)" style={{ width: 120 }} />
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'conversion_factor']}
                      rules={[{ required: true }]}
                    >
                      <InputNumber placeholder="Hệ số quy đổi" min={0} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      rules={[{ required: true }]}
                    >
                      <InputNumber 
                        placeholder="Giá bán" 
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                        style={{ width: 150 }} 
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'is_base_unit']}
                      valuePropName="checked"
                    >
                      <Checkbox>Đơn vị gốc</Checkbox>
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    + Thêm dòng đơn vị tính
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu lại</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}