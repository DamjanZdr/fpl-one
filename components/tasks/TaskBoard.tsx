"use client";
import React, { useState } from "react";
import { TaskList, Task, TaskStage, taskMembers } from "../../dummy-data/tasks";
import { useTheme } from "../hooks/useTheme";

interface TaskBoardProps {
  selectedList: TaskList | null;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onMoveTask: (taskId: string, targetStageId: string, position: number) => void;
  onCreateTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateStages: (stages: TaskStage[]) => void;
  onCreateStage: (name: string) => void;
  onDeleteStage: (stageId: string) => void;
  onRenameStage: (stageId: string, newName: string) => void;
  onReorderStages: (draggedStageId: string, targetIndex: number) => void;
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
  onCreateStage,
  onDeleteStage,
  onRenameStage,
  onReorderStages,
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

  // Stage management state
  const [draggedStage, setDraggedStage] = useState<TaskStage | null>(null);
  const [dragOverStageIndex, setDragOverStageIndex] = useState<number | null>(null);
  const [stageDropdowns, setStageDropdowns] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editStageName, setEditStageName] = useState("");
  const [addingStage, setAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  if (!selectedList) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p>Select a task list to view tasks</p>
        </div>
      </div>
    );
  }

  // Group tasks by stage for rendering
  const tasksByStage = selectedList.tasks.reduce((acc, task) => {
    if (!acc[task.stage]) {
      acc[task.stage] = [];
    }
    acc[task.stage].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

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
    const y = e.clientY - rect.top;
    const taskElements = container.querySelectorAll("[data-task-id]");

    let position = 0;
    for (let i = 0; i < taskElements.length; i++) {
      const taskRect = taskElements[i].getBoundingClientRect();
      const taskY = taskRect.top - rect.top + taskRect.height / 2;
      if (y < taskY) break;
      position = i + 1;
    }

    setDropIndicator({ stageId, position });
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedTask && dropIndicator) {
      onMoveTask(draggedTask.id, stageId, dropIndicator.position);
    }
    handleDragEnd();
  };

  // Stage drag handlers
  const handleStageDragStart = (e: React.DragEvent, stage: TaskStage, index: number) => {
    setDraggedStage(stage);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", stage.id);
  };

  const handleStageDragEnd = () => {
    setDraggedStage(null);
    setDragOverStageIndex(null);
  };

  const handleStageDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedStage) {
      setDragOverStageIndex(targetIndex);
    }
  };

  const handleStageDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedStage) {
      onReorderStages(draggedStage.id, targetIndex);
    }
    handleStageDragEnd();
  };

  const handleCreateStage = () => {
    if (newStageName.trim()) {
      onCreateStage(newStageName.trim());
      setNewStageName("");
      setAddingStage(false);
    }
  };

  const cancelCreateStage = () => {
    setNewStageName("");
    setAddingStage(false);
  };

  const handleRenameStage = (stageId: string) => {
    if (editStageName.trim()) {
      onRenameStage(stageId, editStageName.trim());
      setEditingStage(null);
      setEditStageName("");
    }
  };

  const startEditStage = (stage: TaskStage) => {
    setEditingStage(stage.id);
    setEditStageName(stage.name);
    setStageDropdowns(null);
  };

  const cancelEditStage = () => {
    setEditingStage(null);
    setEditStageName("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main board area with horizontal scroll */}
      <div
        className="flex-1 p-4 overflow-x-auto overflow-y-hidden"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#64748b #1e293b",
        }}
      >
        <div className="flex gap-4 h-full">
          {/* Render stages with drag reordering */}
          {selectedList.stages.map((stage, index) => {
            const stageTasks = tasksByStage[stage.id] || [];
            const isDraggedStage = draggedStage?.id === stage.id;
            const isDragOverStage =
              dragOverStageIndex === index && draggedStage && draggedStage.id !== stage.id;

            return (
              <React.Fragment key={stage.id}>
                {/* Stage drop zone indicator - only show when dragging stages */}
                {isDragOverStage && draggedStage && (
                  <div className="w-72 flex items-center justify-center">
                    <div className="w-full h-32 border-2 border-dashed border-blue-500 rounded-xl bg-blue-500/5 flex items-center justify-center">
                      <div className="text-blue-400 text-sm font-medium">Drop stage here</div>
                    </div>
                  </div>
                )}

                {/* Stage column */}
                <div className="w-72 flex flex-col flex-shrink-0">
                  <div
                    className={
                      "w-full bg-slate-800 rounded-xl border flex-shrink-0 flex flex-col transition-all " +
                      (isDraggedStage ? "opacity-50 scale-95 border-blue-500" : "border-slate-700")
                    }
                    style={{ height: "calc(100vh - 250px)" }}
                    onDragOver={(e) => handleStageDragOver(e, index)}
                    onDrop={(e) => handleStageDrop(e, index)}
                  >
                    {/* Stage header */}
                    <div
                      className="p-4 border-b border-slate-700 cursor-move"
                      draggable
                      onDragStart={(e) => handleStageDragStart(e, stage, index)}
                      onDragEnd={handleStageDragEnd}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {editingStage === stage.id ? (
                          <div className="flex-1 mr-2">
                            <input
                              type="text"
                              value={editStageName}
                              onChange={(e) => setEditStageName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleRenameStage(stage.id);
                                } else if (e.key === "Escape") {
                                  cancelEditStage();
                                }
                              }}
                              className="w-full px-2 py-1 text-sm bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <h3 className={"font-semibold " + theme.pageText}>{stage.name}</h3>
                        )}

                        <div className="relative">
                          <button
                            onClick={() =>
                              setStageDropdowns(stageDropdowns === stage.id ? null : stage.id)
                            }
                            className={
                              theme.pageText + " hover:bg-slate-700 p-1 rounded transition-colors"
                            }
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="opacity-60 hover:opacity-100 transition-opacity"
                            >
                              <circle cx="8" cy="3" r="1.5" />
                              <circle cx="8" cy="8" r="1.5" />
                              <circle cx="8" cy="13" r="1.5" />
                            </svg>
                          </button>

                          {stageDropdowns === stage.id && (
                            <div className="absolute right-0 top-8 bg-slate-800 border border-slate-600 rounded-lg shadow-lg py-1 z-10 min-w-32">
                              <button
                                onClick={() => startEditStage(stage)}
                                className={
                                  "w-full text-left px-3 py-2 text-xs " +
                                  theme.pageText +
                                  " hover:bg-slate-700 transition-colors flex items-center gap-2"
                                }
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                                Rename
                              </button>
                              <button
                                onClick={() => {
                                  onDeleteStage(stage.id);
                                  setStageDropdowns(null);
                                }}
                                className={
                                  "w-full text-left px-3 py-2 text-xs " +
                                  theme.pageText +
                                  " hover:bg-slate-700 transition-colors flex items-center gap-2"
                                }
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-gray-400">{stageTasks.length} tasks</div>
                    </div>

                    {/* Tasks area */}
                    <div
                      className="flex-1 p-4 space-y-3 overflow-y-auto"
                      onDragOver={(e) => handleDragOver(e, stage.id)}
                      onDrop={(e) => handleDrop(e, stage.id)}
                    >
                      {stageTasks.map((task, taskIndex) => {
                        const isDraggedTask = draggedTask?.id === task.id;
                        const showDropIndicator =
                          dropIndicator?.stageId === stage.id &&
                          dropIndicator?.position === taskIndex;

                        return (
                          <div key={task.id}>
                            {/* Drop indicator */}
                            {showDropIndicator && (
                              <div className="h-3 bg-blue-500/20 border border-blue-500 border-dashed rounded mb-3"></div>
                            )}

                            {/* Task card */}
                            <div
                              data-task-id={task.id}
                              className={
                                "p-3 rounded-lg border transition-all cursor-move " +
                                (isDraggedTask
                                  ? "opacity-50 scale-95 border-blue-500"
                                  : "border-slate-600 bg-slate-700 hover:border-slate-500")
                              }
                              draggable
                              onDragStart={(e) => handleDragStart(e, task)}
                              onDragEnd={handleDragEnd}
                              onClick={() => onTaskClick(task)}
                            >
                              <h4 className={"font-medium text-sm mb-2 " + theme.pageText}>
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-xs text-gray-400 mb-3">{task.description}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                  {task.dueDate && (
                                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">
                                      {new Date(task.dueDate).toISOString().split("T")[0]}
                                    </span>
                                  )}
                                </div>
                                {task.responsiblePeople.length > 0 && (
                                  <div className="flex -space-x-1">
                                    {task.responsiblePeople.slice(0, 3).map((personId) => {
                                      const member = taskMembers.find((m) => m.id === personId);
                                      return member ? (
                                        <span
                                          key={personId}
                                          className="text-lg border border-slate-600 rounded-full"
                                          title={member.name}
                                        >
                                          {member.avatar}
                                        </span>
                                      ) : null;
                                    })}
                                    {task.responsiblePeople.length > 3 && (
                                      <span className="text-xs text-gray-400 ml-2">
                                        +{task.responsiblePeople.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Drop indicator at end */}
                      {dropIndicator?.stageId === stage.id &&
                        dropIndicator?.position === stageTasks.length && (
                          <div className="h-3 bg-blue-500/20 border border-blue-500 border-dashed rounded"></div>
                        )}

                      {/* Add task form/button */}
                      {newTaskStage === stage.id ? (
                        <div className="p-3 bg-slate-700 border border-blue-500 rounded-lg">
                          <input
                            type="text"
                            placeholder="Task title..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateTask();
                              } else if (e.key === "Escape") {
                                setNewTaskStage("");
                                setNewTaskTitle("");
                              }
                            }}
                            className="w-full px-2 py-1 text-sm bg-slate-600 text-white border border-slate-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
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
                </div>
              </React.Fragment>
            );
          })}

          {/* Final Drop Zone After All Stages - only show when dragging stages */}
          {draggedStage && (
            <div
              className={
                "transition-all duration-200 ease-out flex items-center justify-center " +
                (dragOverStageIndex === selectedList.stages.length
                  ? "w-72 opacity-100"
                  : "w-2 opacity-50")
              }
              onDragOver={(e) => handleStageDragOver(e, selectedList.stages.length)}
              onDrop={(e) => handleStageDrop(e, selectedList.stages.length)}
            >
              {dragOverStageIndex === selectedList.stages.length && (
                <div className="w-full h-32 border-2 border-dashed border-blue-500 rounded-xl bg-blue-500/5 flex items-center justify-center">
                  <div className="text-blue-400 text-sm font-medium">Drop stage here</div>
                </div>
              )}
              {dragOverStageIndex !== selectedList.stages.length && (
                <div className="w-0.5 h-32 bg-blue-500/50 rounded-full" />
              )}
            </div>
          )}

          {/* Add Stage Button/Form */}
          <div className="w-72 flex flex-col flex-shrink-0">
            {addingStage ? (
              <div className="p-3 bg-slate-800 border border-blue-500 rounded-xl">
                <input
                  type="text"
                  placeholder="Stage name..."
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateStage();
                    } else if (e.key === "Escape") {
                      cancelCreateStage();
                    }
                  }}
                  className="w-full px-2 py-1 text-sm bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCreateStage}
                    disabled={!newStageName.trim()}
                    className="px-3 py-2 rounded text-white text-sm transition-colors"
                    style={{ backgroundColor: "#AB1604" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B1203")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#AB1604")}
                  >
                    Add
                  </button>
                  <button
                    onClick={cancelCreateStage}
                    className={
                      "px-3 py-2 rounded border " +
                      theme.border +
                      " " +
                      theme.pageText +
                      " hover:bg-white/5 text-sm"
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingStage(true)}
                className="group flex flex-col items-center justify-center bg-slate-800 border border-dashed border-slate-600 hover:border-slate-500 hover:bg-white/5 rounded-xl p-4 w-full transition-colors"
                style={{ height: "calc(100vh - 250px)" }}
              >
                <div className="text-gray-400 mb-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="opacity-50 group-hover:opacity-100 transition-opacity"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
                <h3 className="font-medium text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Add Stage
                </h3>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
