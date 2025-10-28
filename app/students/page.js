"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Card,
  Space,
  Select,
  Typography,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const API_URL = "/api/students";

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      const data = res.data?.body?.data || [];
      setStudents(data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (values) => {
    try {
      await axios.post(API_URL, values);
      message.success("Student added successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchStudents();
    } catch (error) {
      console.error(error);
      message.error("Failed to add student");
    }
  };

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
      align: "center",
      width: 60,
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
      width: 180,
    },
    {
      title: "NIS",
      dataIndex: "nis",
      key: "nis",
      align: "center",
      width: 120,
    },
    {
      title: "Class",
      dataIndex: "class_name",
      key: "class_name",
      align: "center",
      width: 120,
    },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      width: 200,
      ellipsis: true, 
    },
  ];

  const classOptions = [
    "X RPL 1",
    "X RPL 2",
    "XI RPL 1",
    "XI RPL 2",
    "XII RPL 1",
    "XII RPL 2",
  ];

  return (
    <div
      style={{
        padding: 24,
        background: "#f5f6fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        title={<Title level={3} style={{ margin: 0 }}>Student List</Title>}
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchStudents}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Student
            </Button>
          </Space>
        }
        style={{
          borderRadius: 16,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 950,
        }}
      >
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          style={{ background: "#fff", borderRadius: 8 }}
          scroll={{ x: 700 }}
        />
      </Card>

      <Modal
        title="Add New Student"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        destroyOnHidden
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddStudent}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input name" }]}
          >
            <Input placeholder="Enter student name" />
          </Form.Item>

          <Form.Item
            name="nis"
            label="NIS"
            rules={[{ required: true, message: "Please input NIS" }]}
          >
            <Input placeholder="Enter student NIS" />
          </Form.Item>

          <Form.Item
            name="class_name"
            label="Class"
            rules={[{ required: true, message: "Please select class" }]}
          >
            <Select
              placeholder="Select class"
              options={classOptions.map((cls) => ({ label: cls, value: cls }))}
            />
          </Form.Item>

          <Form.Item
            name="major"
            label="Major"
            rules={[{ required: true, message: "Please input major" }]}
          >
            <Input placeholder="Enter major (e.g. Rekayasa Perangkat Lunak)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
