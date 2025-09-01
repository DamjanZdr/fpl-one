"use client";
import { useState } from "react";
import { useTheme } from "../../components/hooks/useTheme";
import TaskListPanel from "../../components/tasks/TaskListPanel";
import TaskBoard from "../../components/tasks/TaskBoard";
import TaskDetailPanel from "../../components/tasks/TaskDetailPanel";
import {
  taskLists,
  taskMembers,
  defaultStages,
  TaskList,
  Task,
  TaskStage,
} from "../../dummy-data/tasks";

export default function TasksPage() {
  const { theme } = useTheme();
  const [allTaskLists, setAllTaskLists] = useState<TaskList[]>(taskLists);
  const [selectedList, setSelectedList] = useState<TaskList | null>(taskLists[0] || null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<"personal" | "shared">("personal");

  const handleListSelect = (list: TaskList) => {
    setSelectedList(list);
  };

  const handleCreateList = (name: string) => {
    const newList: TaskList = {
      id: `list_${Date.now()}`,
      name,
      isShared: activeTab === "shared",
      owner: "user-1",
      sharedWith: [],
      stages: [...defaultStages],
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAllTaskLists((prev) => [...prev, newList]);
    setSelectedList(newList);
  };

  const handleRenameList = (listId: string, newName: string) => {
    setAllTaskLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, name: newName, updatedAt: new Date() } : list
      )
    );

    if (selectedList?.id === listId) {
      setSelectedList((prev) => (prev ? { ...prev, name: newName } : null));
    }
  };

  const handleDeleteList = (listId: string) => {
    setAllTaskLists((prev) => prev.filter((list) => list.id !== listId));
    if (selectedList?.id === listId) {
      const remainingLists = allTaskLists.filter((list) => list.id !== listId);
      setSelectedList(remainingLists[0] || null);
    }
  };

  const handleCreateTask = (task: Omit<Task, "id" | "createdAt">) => {
    if (!selectedList) return;

    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date(),
    };

    setAllTaskLists((prev) =>
      prev.map((list) =>
        list.id === selectedList.id
          ? {
              ...list,
              tasks: [...list.tasks, newTask],
              updatedAt: new Date(),
            }
          : list
      )
    );

    // Update selected list state
    setSelectedList((prev) =>
      prev
        ? {
            ...prev,
            tasks: [...prev.tasks, newTask],
          }
        : null
    );
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setAllTaskLists((prev) =>
      prev.map((list) =>
        list.id === selectedList?.id
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
              updatedAt: new Date(),
            }
          : list
      )
    );

    // Update selected list state
    setSelectedList((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
          }
        : null
    );

    // Update selected task if it's the one being edited
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleMoveTask = (taskId: string, targetStageId: string, position: number) => {
    if (!selectedList) return;

    const task = selectedList.tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Remove task from current position
    const tasksWithoutDragged = selectedList.tasks.filter((t) => t.id !== taskId);

    // Get tasks in target stage (excluding the dragged task)
    const targetStageTasks = tasksWithoutDragged.filter((t) => t.stage === targetStageId);

    // Insert task at specified position
    const updatedTask = { ...task, stage: targetStageId };
    targetStageTasks.splice(position, 0, updatedTask);

    // Combine with tasks from other stages
    const otherStageTasks = tasksWithoutDragged.filter((t) => t.stage !== targetStageId);
    const reorderedTasks = [...otherStageTasks, ...targetStageTasks];

    setAllTaskLists((prev) =>
      prev.map((list) =>
        list.id === selectedList.id
          ? {
              ...list,
              tasks: reorderedTasks,
              updatedAt: new Date(),
            }
          : list
      )
    );

    // Update selected list state
    setSelectedList((prev) =>
      prev
        ? {
            ...prev,
            tasks: reorderedTasks,
          }
        : null
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setAllTaskLists((prev) =>
      prev.map((list) =>
        list.id === selectedList?.id
          ? {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== taskId),
              updatedAt: new Date(),
            }
          : list
      )
    );

    // Update selected list state
    setSelectedList((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.filter((task) => task.id !== taskId),
          }
        : null
    );
  };

  const handleUpdateStages = (stages: TaskStage[]) => {
    if (!selectedList) return;

    setAllTaskLists((prev) =>
      prev.map((list) =>
        list.id === selectedList.id ? { ...list, stages, updatedAt: new Date() } : list
      )
    );

    setSelectedList((prev) => (prev ? { ...prev, stages } : null));
  };

  const handleToggleShare = (listId: string) => {
    setAllTaskLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              isShared: !list.isShared,
              updatedAt: new Date(),
            }
          : list
      )
    );

    if (selectedList?.id === listId) {
      setSelectedList((prev) => (prev ? { ...prev, isShared: !prev.isShared } : null));
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="fixed top-20 left-60 right-4 bottom-4 flex">
      {/* Left Panel - Task Lists */}
      <div className="w-80 flex-shrink-0">
        <TaskListPanel
          taskLists={allTaskLists}
          selectedList={selectedList}
          onListSelect={handleListSelect}
          onCreateList={handleCreateList}
          onDeleteList={handleDeleteList}
          onRenameList={handleRenameList}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Content - Task Board */}
      <div className="flex-1 ml-4">
        {selectedList ? (
          <TaskBoard
            selectedList={selectedList}
            onUpdateTask={handleUpdateTask}
            onMoveTask={handleMoveTask}
            onCreateTask={handleCreateTask}
            onDeleteTask={handleDeleteTask}
            onUpdateStages={handleUpdateStages}
            onToggleShare={handleToggleShare}
            onTaskClick={handleTaskClick}
          />
        ) : (
          <div
            className={`h-full rounded-xl ${theme.cardBg} ${theme.border} flex items-center justify-center`}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-medium text-lg mb-2 text-white">No Task List Selected</h3>
              <p className="text-gray-400 text-sm">
                Select a task list from the left panel to start managing tasks
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailPanel
        task={selectedTask}
        isVisible={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
}
