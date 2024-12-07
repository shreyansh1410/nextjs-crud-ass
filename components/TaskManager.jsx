"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing && currentTask._id) {
        const response = await fetch(`/api/tasks/${currentTask._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: currentTask.title,
            description: currentTask.description,
            status: currentTask.status,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setIsEditing(false);
        } else {
          console.error("Failed to update task");
        }
      } else {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: currentTask.title,
            description: currentTask.description,
            status: currentTask.status,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          console.error("Failed to create task");
        }
      }

      setCurrentTask({ title: "", description: "", status: "pending" });
      fetchTasks();
    } catch (error) {
      console.error("Error handling task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchTasks();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusChange = (value) => {
    setCurrentTask({ ...currentTask, status: value });
  };

  const editTask = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Task" : "Add New Task"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Task Title"
              value={currentTask.title}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, title: e.target.value })
              }
              className="w-full"
              required
            />
            <Input
              placeholder="Task Description"
              value={currentTask.description}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, description: e.target.value })
              }
              className="w-full"
              required
            />
            <Select
              value={currentTask.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">
              {isEditing ? "Update Task" : "Add Task"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task._id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={() => editTask(task)}
                    variant="outline"
                    size="icon"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteTask(task._id)}
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
