"use client";
import { useEffect, useState, useRef } from "react";
import {
  Form,
  Table,
  Space,
  Popconfirm,
  Typography,
  message,
  Input,
  InputNumber,
  Button,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

interface DataType {
  id: string;
  key: string;
  name: string;
  age: number;
  gender: string;
  address: string;
  originName: string;
}

type DataIndex = keyof DataType;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text";
  record: DataType;
  index: number;
}

//定义可编辑表格项
const editableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  // record,
  // index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : (
      <Input style={{ textAlign: "center" }} />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: "0 auto",
            maxWidth: "150px",
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const CharacterTable = () => {
  //表单功能的引用
  const [form] = Form.useForm();

  //引入信息提示
  const [messageApi, contextHolder] = message.useMessage();
  const [isDelSuccess, setIsDelSuccess] = useState(false);
  const [data, setData] = useState<DataType[]>([]);

  // 获取角色数据
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`http://localhost:3000/api/character`, {
        cache: "no-cache",
        method: "GET",
      });
      const data = await result.json();      
      const tempData = data.character.map((item: DataType) => {
        return {
          key: item.id,
          name: item.name,
          age: item.age,
          gender: item.gender,
          address: item.address,
          originName: item.originName,
        };
      });
      setData(tempData);
    };
    
    if (isDelSuccess) {
      messageApi.open({
        type: "success",
        content: "删除学生成功",
      });
    }
    fetchData();
  }, [isDelSuccess, messageApi]);

  
  
  

  //编辑功能的启动，取消，及保存提交

  
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(newData[index]);
        const result = await fetch("http://localhost:3000/api/character", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id:newData[index].key,
            name: newData[index].name,
            age: +newData[index].age,
            gender:newData[index].gender,
            address: newData[index].address,
            originName:newData[index].originName
          }),
        });
        await result.json();
        form.resetFields();        
        setEditingKey("");
      } else {
        newData.push(row);
        // setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  //定义姓名的搜索功能
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //表单结构定义
  const columns = [
    {
      title: "Num",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "20px",
      render: (text, record, index) =>
        `${(pageOption.pageNo - 1) * 10 + (index + 1)}`,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      editable: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      align: "center",
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: [
        {
          text: "男",
          value: "男",
        },
        {
          text: "女",
          value: "女",
        },
      ],
      key: "gender",
      align: "center",
      editable: true,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.gender.startsWith(value),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
      editable: true,
    },
    {
      title: "Origin",
      dataIndex: "originName",
      key: "originName",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (item, record) => {
        // console.log(item)
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginInlineEnd: 6,
              }}
            >
              保存
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              编辑
            </Typography.Link>
            {/* 删除功能 */}
            <Popconfirm
              title="是否确定删除?"
              onConfirm={async () => {
                const result = await fetch(`http://localhost:3000/api/character?id=${item.key}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },                  
                });
                await result.json();                
                setIsDelSuccess(true);
                form.resetFields();
              }}
            >
              <Typography.Link>删除</Typography.Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  //页面设置
  const [pageOption, setPageOption] = useState({
    pageNo: 1,
    pageSize: 10,
  });
  // 定义分页信息
  const pagination = {
    total: data?.length,
    pageSize: pageOption.pageSize,
    current: pageOption.pageNo,
    onChange: (pageNo:number) => {
      setPageOption({ ...pageOption, pageNo });
    },
  };
  //定义可修改的新的列
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      {contextHolder}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: editableCell,
            },
          }}
          bordered
          columns={mergedColumns}
          pagination={pagination}
          dataSource={data}
          size={"small"}
          // rowKey="key"
        />
      </Form>
    </>
  );
};

export default CharacterTable;
