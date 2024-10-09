'use client'
import { useEffect, useState } from "react";
import { Card, Button, Form, Input, Modal, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CharacterTable from "./components/CharacterTable";

interface DataType {
  id: string;
  key: string;
  name: string;
  age: number;
  gender: string;
  address: string;
  originName: string;
}

const CharacterPage = () => {
  const [form] = Form.useForm();
  //引入信息提示
  const [messageApi, contextHolder] = message.useMessage();

  const [isAddSuccess, setIsAddSuccess] = useState(false);

  //增加学生的功能  
  /* const addStudentHandler = async (newCharacterData:DataType) => {
    const result = await fetch("http://localhost:3000/api/character", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newCharacterData.name,
        age: +newCharacterData.age,
        gender:newCharacterData.gender,
        address: newCharacterData.address,
        originName:newCharacterData.originName
      }),
    });
    await result.json();
    setIsAddSuccess(true);
    form.resetFields();        
  }; */

  
  



  //弹出信息框的处理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  

  //操作成功的提示信息
  useEffect(() => {
    if (isAddSuccess) {
      messageApi.open({
        type: "success",
        content: "添加学生成功",
      });
    }
  }, [isAddSuccess, messageApi]);

  
  return (
    <>
      {contextHolder}
      <Card
        title="角色列表"
        extra={
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
            ></Button>
          </div>
        }
        style={{ width: "100%" }}
      >
        <CharacterTable />
      </Card>
      <Modal
        title="录入角色数据"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form          
          labelCol={{span:4}}
          form={form}          
          onFinish={async (newCharacterData:DataType) => {
            const result = await fetch("http://localhost:3000/api/character", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: newCharacterData.name,
                age: +newCharacterData.age,
                gender:newCharacterData.gender,
                address: newCharacterData.address,
                originName:newCharacterData.originName
              }),
            });
            await result.json();
            setIsAddSuccess(true);
            form.resetFields(); }}
        >
          <Form.Item label="Name" name="name">
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="Age" name="age">
            <Input placeholder="请输入年龄" />
          </Form.Item>
          <Form.Item label="Gender" name="gender" initialValue="男">
            <Select
              style={{ width: "100%" }}
              options={[
                { value: "男", label: "男" },
                { value: "女", label: "女" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input placeholder="请输入地址" />
          </Form.Item>
          <Form.Item label="Origin" name="originName">
            <Input placeholder="请输入角色来源" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CharacterPage;