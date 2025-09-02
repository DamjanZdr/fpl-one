"use client";
import { useState } from "react";
import { useTheme } from "../../components/hooks/useTheme";
import Card from "../../components/ui/Card";
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
  const { theme, mode } = useTheme();
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
    console.log("handleRenameList called with:", listId, newName);
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
    console.log("handleDeleteList called with:", listId);
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

  const handleUpdateSharing = (listId: string, sharedWith: string[]) => {
    const isShared = sharedWith.length > 0;

    setAllTaskLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              isShared,
              sharedWith,
              updatedAt: new Date(),
            }
          : list
      )
    );

    if (selectedList?.id === listId) {
      setSelectedList((prev) => (prev ? { ...prev, isShared, sharedWith } : null));
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  // Stage Management Handlers
  const handleCreateStage = (name: string) => {
    if (!selectedList) return;

    const newStage: TaskStage = {
      id: `stage-${Date.now()}`,
      name,
      color: "#64748b", // Default color
      order: selectedList.stages.length + 1,
    };

    const updatedStages = [...selectedList.stages, newStage];
    handleUpdateStages(updatedStages);
  };

  const handleDeleteStage = (stageId: string) => {
    if (!selectedList) return;

    // Move all tasks from deleted stage to first stage
    const firstStageId = selectedList.stages[0]?.id;
    if (firstStageId && firstStageId !== stageId) {
      setAllTaskLists((prev) =>
        prev.map((list) =>
          list.id === selectedList.id
            ? {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.stage === stageId ? { ...task, stage: firstStageId } : task
                ),
                stages: list.stages.filter((stage) => stage.id !== stageId),
                updatedAt: new Date(),
              }
            : list
        )
      );

      if (selectedList?.id) {
        setSelectedList((prev) =>
          prev
            ? {
                ...prev,
                tasks: prev.tasks.map((task) =>
                  task.stage === stageId ? { ...task, stage: firstStageId } : task
                ),
                stages: prev.stages.filter((stage) => stage.id !== stageId),
              }
            : null
        );
      }
    }
  };

  const handleRenameStage = (stageId: string, newName: string) => {
    if (!selectedList) return;

    const updatedStages = selectedList.stages.map((stage) =>
      stage.id === stageId ? { ...stage, name: newName } : stage
    );
    handleUpdateStages(updatedStages);
  };

  const handleReorderStages = (draggedStageId: string, targetIndex: number) => {
    if (!selectedList) return;

    const stages = [...selectedList.stages];
    const draggedStageIndex = stages.findIndex((stage) => stage.id === draggedStageId);

    if (draggedStageIndex === -1) return;

    const [draggedStage] = stages.splice(draggedStageIndex, 1);
    stages.splice(targetIndex, 0, draggedStage);

    // Update order property
    const updatedStages = stages.map((stage, index) => ({
      ...stage,
      order: index + 1,
    }));

    handleUpdateStages(updatedStages);
  };

  return (
    <div className="fixed top-20 left-60 right-4 bottom-4">
      <Card
        themeClass={theme.cardChrome}
        headerDivider={theme.headerDivider}
        titleClass={theme.titleText}
        className="h-full overflow-hidden"
      >
        {/* Top Panel - Header Row */}
        <div className="flex">
          {/* Left Header - Tabs */}
          <div className="w-80 flex-shrink-0">
            <div className={`p-4`}>
              <div
                className={`w-full overflow-hidden rounded-2xl border p-1 text-sm ${theme.cardChrome}`}
              >
                <button
                  className={`w-1/2 rounded-xl px-4 py-2 font-semibold shadow-inner ${
                    activeTab === "personal"
                      ? mode === "dark"
                        ? "bg-black/40 text-white ring-1 ring-white/10"
                        : "bg-black/10 text-black ring-1 ring-black/10"
                      : mode === "dark"
                      ? "text-white hover:bg-white/5 hover:text-white"
                      : "text-black hover:bg-black/5 hover:text-black"
                  }`}
                  onClick={() => setActiveTab("personal")}
                >
                  Personal
                </button>
                <button
                  className={`w-1/2 rounded-xl px-4 py-2 font-semibold ${
                    activeTab === "shared"
                      ? mode === "dark"
                        ? "bg-black/40 text-white ring-1 ring-white/10"
                        : "bg-black/10 text-black ring-1 ring-black/10"
                      : mode === "dark"
                      ? "text-white hover:bg-white/5 hover:text-white"
                      : "text-black hover:bg-black/5 hover:text-black"
                  }`}
                  onClick={() => setActiveTab("shared")}
                >
                  Shared
                </button>
              </div>
            </div>
          </div>

          {/* Right Header - List Title */}
          <div className="flex-1 ml-4">
            {selectedList && (
              <div className={`p-4 flex items-end h-full`}>
                <span
                  className={`text-[13px] font-semibold tracking-wider uppercase ${theme.titleText} pb-1`}
                >
                  {selectedList.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Full Width Divider */}
        <div className={`border-b ${theme.headerDivider}`}></div>

        {/* Bottom Panel - Content Row */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Task Lists */}
          <div className="w-80 flex-shrink-0 border-r border-slate-700">
            <TaskListPanel
              taskLists={allTaskLists}
              selectedList={selectedList}
              onListSelect={handleListSelect}
              onCreateList={handleCreateList}
              onDeleteList={handleDeleteList}
              onRenameList={handleRenameList}
              onToggleShare={handleToggleShare}
              onUpdateSharing={handleUpdateSharing}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Main Content - Task Board with proper overflow */}
          <div className="flex-1 h-full overflow-hidden">
            {selectedList ? (
              <TaskBoard
                selectedList={selectedList}
                onUpdateTask={handleUpdateTask}
                onMoveTask={handleMoveTask}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
                onUpdateStages={handleUpdateStages}
                onCreateStage={handleCreateStage}
                onDeleteStage={handleDeleteStage}
                onRenameStage={handleRenameStage}
                onReorderStages={handleReorderStages}
                onToggleShare={handleToggleShare}
                onTaskClick={handleTaskClick}
              />
            ) : (
              <div
                className={`h-full rounded-xl ${theme.cardBg} ${theme.border} flex items-center justify-center m-4`}
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
        </div>
      </Card>

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
