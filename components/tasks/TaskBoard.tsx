"use client";
import { useState } from "react";
import { TaskList, Task, TaskStage, taskMembers } from "../../dummy-data/tasks";
import { useTheme } from "../hooks/useTheme";

interface TaskBoardProps {
  selectedList: TaskList | null;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onMoveTask: (taskId: string, targetStageId: string, position: number) => void;
  onCreateTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateStages: (stages: TaskStage[]) => void;
  onToggleShare: (listId: string) => void;
  onTaskClick: (task: Task) => void;
}

export default function TaskBoard({
  selectedList,
  onUpdateTask,
  onMoveTask,
  onCreateTask,
  onDeleteTask,
  onUpdateStages,
  onToggleShare,
  onTaskClick,
}: TaskBoardProps) {
  const { theme } = useTheme();
  const [newTaskStage, setNewTaskStage] = useState<string>("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<{
    stageId: string;
    position: number;
  } | null>(null);

  if (!selectedList) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p>Select a task list to view tasks</p>
        </div>
      </div>
    );
  }

  const handleCreateTask = () => {
    if (newTaskTitle.trim() && newTaskStage) {
      onCreateTask({
        title: newTaskTitle.trim(),
        description: "",
        dueDate: null,
        stage: newTaskStage,
        responsiblePeople: ["user-1"],
        attachments: [],
      });
      setNewTaskTitle("");
      setNewTaskStage("");
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverStage(null);
    setDropIndicator(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageId);

    // Calculate drop position based on mouse Y coordinate
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;

    // Get all task elements in this stage (excluding the dragged one)
    const taskElements = Array.from(container.querySelectorAll("[data-task-id]")) as HTMLElement[];
    const tasks = getTasksByStage(stageId).filter((t) => t.id !== draggedTask?.id);

    let dropPosition = tasks.length; // Default to end

    for (let i = 0; i < taskElements.length; i++) {
      const taskElement = taskElements[i];
      const taskId = taskElement.getAttribute("data-task-id");

      // Skip if this is the dragged task
      if (taskId === draggedTask?.id) continue;

      const taskRect = taskElement.getBoundingClientRect();
      const taskY = taskRect.top - rect.top;
      const taskHeight = taskRect.height;

      // If mouse is in the top half of this task, insert before it
      if (mouseY < taskY + taskHeight / 2) {
        dropPosition = tasks.findIndex((t) => t.id === taskId);
        break;
      }
    }

    setDropIndicator({ stageId, position: dropPosition });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverStage(null);
      setDropIndicator(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(null);

    if (draggedTask && dropIndicator) {
      onMoveTask(draggedTask.id, stageId, dropIndicator.position);
    }

    setDraggedTask(null);
    setDropIndicator(null);
  };

  const formatDueDate = (date: Date | null) => {
    if (!date) return "No due date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const getTasksByStage = (stageId: string) => {
    return selectedList.tasks.filter((task) => task.stage === stageId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b ${theme.headerDivider} relative`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[13px] font-semibold tracking-wider uppercase ${theme.titleText}`}>
            {selectedList.name}
          </span>
          <div className="flex gap-2">
            {selectedList.isShared ? (
              <button
                onClick={() => onToggleShare(selectedList.id)}
                className="text-xs bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-lg text-white"
              >
                Make Private
              </button>
            ) : (
              <button
                onClick={() => onToggleShare(selectedList.id)}
                className="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-white"
              >
                Share List
              </button>
            )}
          </div>
        </div>

        {/* Shared Info */}
        {selectedList.isShared && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1">Shared with:</p>
            <div className="flex gap-1 flex-wrap">
              {selectedList.sharedWith.map((userId) => {
                const member = taskMembers.find((m) => m.id === userId);
                return member ? (
                  <span
                    key={userId}
                    className="text-xs bg-slate-700 text-white px-2 py-0.5 rounded"
                  >
                    {member.avatar} {member.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className={`absolute bottom-0 left-0 right-0 h-px bg-slate-700`} />
      </div>

      {/* Task Board */}
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden p-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#64748b #1e293b",
        }}
      >
        <div className="flex gap-4 h-full min-w-max">
          {selectedList.stages.map((stage) => (
            <div key={stage.id} className="w-72 flex flex-col" data-stage-id={stage.id}>
              {/* Stage Header */}
              <div
                className={`p-3 rounded-t-xl border-l-4 bg-slate-800 transition-colors ${
                  dragOverStage === stage.id ? "bg-slate-700" : ""
                }`}
                style={{ borderLeftColor: stage.color }}
              >
                <h3 className="font-semibold text-sm text-white">{stage.name}</h3>
                <p className="text-xs text-gray-400">{getTasksByStage(stage.id).length} tasks</p>
              </div>

              {/* Tasks Container */}
              <div
                className={`flex-1 bg-slate-800/50 rounded-b-xl p-3 overflow-y-auto border border-slate-700 border-t-0 transition-all duration-200 ${
                  dragOverStage === stage.id && draggedTask?.stage !== stage.id
                    ? "bg-blue-500/10 border-blue-500/50 shadow-lg"
                    : ""
                }`}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#64748b #1e293b",
                  minHeight: "300px",
                }}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="space-y-2">
                  {getTasksByStage(stage.id).map((task, index) => (
                    <div key={task.id}>
                      {/* Drop Indicator Above */}
                      {draggedTask &&
                        dropIndicator?.stageId === stage.id &&
                        dropIndicator.position === index &&
                        draggedTask.id !== task.id && (
                          <div className="h-0.5 bg-blue-500 rounded-full mx-2 mb-2 animate-pulse shadow-md" />
                        )}

                      {/* Task Card */}
                      <div
                        data-task-id={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                          if (!isDragging) {
                            onTaskClick(task);
                          }
                        }}
                        className={`group bg-slate-900 border border-slate-600 rounded-xl p-3 cursor-grab hover:border-slate-500 transition-all select-none ${
                          draggedTask?.id === task.id
                            ? "opacity-50 rotate-1 shadow-lg"
                            : "hover:shadow-md hover:scale-[1.02]"
                        } active:cursor-grabbing`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-white flex-1">{task.title}</h4>
                          <div className="text-gray-500 text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            ⋮⋮
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            {task.responsiblePeople.map((userId) => {
                              const member = taskMembers.find((m) => m.id === userId);
                              return member ? (
                                <span key={userId} className="text-xs" title={member.name}>
                                  {member.avatar}
                                </span>
                              ) : null;
                            })}
                          </div>

                          <div className="text-right">
                            <p
                              className={`text-xs ${
                                task.dueDate && task.dueDate < new Date()
                                  ? "text-red-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {formatDueDate(task.dueDate)}
                            </p>
                            {task.attachments.length > 0 && (
                              <p className="text-xs text-blue-400">📎 {task.attachments.length}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Drop Indicator at End */}
                  {draggedTask &&
                    dropIndicator?.stageId === stage.id &&
                    dropIndicator.position === getTasksByStage(stage.id).length && (
                      <div className="h-0.5 bg-blue-500 rounded-full mx-2 mt-2 animate-pulse shadow-md" />
                    )}
                </div>

                {/* Add Task Form */}
                {newTaskStage === stage.id ? (
                  <div className="bg-slate-900 border border-blue-500 rounded-xl p-3 mt-2">
                    <input
                      type="text"
                      placeholder="Task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleCreateTask()}
                      className="w-full bg-transparent border-none outline-none text-sm text-white mb-2"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateTask}
                        disabled={!newTaskTitle.trim()}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-xs"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setNewTaskStage("");
                          setNewTaskTitle("");
                        }}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setNewTaskStage(stage.id)}
                    className="w-full p-3 border border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors text-sm mt-2"
                  >
                    + Add task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
