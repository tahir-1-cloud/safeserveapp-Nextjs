"use client";

import { useEffect, useState } from "react";
import { Table, Card, Tag, DatePicker, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getCompletedTask } from "@/services/staffsideservices";
import { TaskOccurrencedto, SubTaskdto } from "@/types/taskhistorystaffsidedto";

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function TaskHistoryPage() {
  const [tasks, setTasks] = useState<TaskOccurrencedto[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskOccurrencedto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getCompletedTask();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = (dates: any) => {
    if (!dates) {
      setFilteredTasks(tasks);
      return;
    }

    const [start, end] = dates;

    const filtered = tasks.filter((task) => {
      const taskDate = dayjs(task.occurrenceDate);
      return (
        taskDate.isAfter(start.startOf("day")) &&
        taskDate.isBefore(end.endOf("day"))
      );
    });

    setFilteredTasks(filtered);
  };

  const columns: ColumnsType<TaskOccurrencedto> = [
    {
      title: "Task",
      dataIndex: "taskName",
      key: "taskName",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Date",
      dataIndex: "occurrenceDate",
      key: "occurrenceDate",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) =>
        status === 1 ? (
          <Tag color="green">Completed</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
  ];

  const expandedRowRender = (record: TaskOccurrencedto) => {
    const subColumns: ColumnsType<SubTaskdto> = [
      {
        title: "Sub Task",
        dataIndex: "subTaskName",
        key: "subTaskName",
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status) =>
          status === 1 ? (
            <Tag color="green">Completed</Tag>
          ) : (
            <Tag color="orange">Pending</Tag>
          ),
      },
    ];

    return (
      <Table
        columns={subColumns}
        dataSource={record.subTasks}
        pagination={false}
        rowKey="subTaskOccurrenceId"
      />
    );
  };

  return (
    <div className="p-6">
      <Card>
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Title level={4}>Task History</Title>
          <RangePicker onChange={handleDateFilter} />
        </Space>

        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="taskOccurrenceId"
          loading={loading}
          expandable={{ expandedRowRender }}
          bordered
        />
      </Card>
    </div>
  );
}