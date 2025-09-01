"use client";
import { useState } from "react";
import { Task, taskMembers } from "../../dummy-data/tasks";
import { useTheme } from "../hooks/useTheme";

interface TaskDetailPanelProps {
  task: Task | null;
  isVisible: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export default function TaskDetailPanel({
  task,
  isVisible,
  onClose,
  onUpdateTask,
}: TaskDetailPanelProps) {
  const { theme } = useTheme();
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
  );

  if (!isVisible || !task) return null;

  const handleSaveDescription = () => {
    onUpdateTask(task.id, { description });
    setEditingDescription(false);
  };

  const handleDateChange = (newDate: string) => {
    setDueDate(newDate);
    onUpdateTask(task.id, {
      dueDate: newDate ? new Date(newDate) : null,
    });
  };

  const assignedMembers = task.responsiblePeople
    .map((id) => taskMembers.find((m) => m.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden mx-4">
        {/* Header */}
        <div className={`p-4 border-b ${theme.headerDivider} flex items-center justify-between`}>
          <h2 className="font-semibold text-lg text-white">{task.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded">
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#64748b #1e293b",
            maxHeight: "calc(80vh - 120px)",
          }}
        >
          <div className="space-y-6">
            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                {!editingDescription ? (
                  <button
                    onClick={() => {
                      setEditingDescription(true);
                      setDescription(task.description);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDescription}
                      className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingDescription(false);
                        setDescription(task.description);
                      }}
                      className="text-xs bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-white"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              {editingDescription ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-600 text-white resize-none"
                  rows={4}
                  placeholder="Add task description..."
                />
              ) : (
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-gray-300 min-h-[100px]">
                  {task.description || (
                    <span className="text-gray-500 italic">No description yet</span>
                  )}
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="rounded-xl px-3 py-2 bg-slate-800 border border-slate-600 text-white text-sm"
              />
            </div>

            {/* Responsible People */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Responsible People
              </label>
              <div className="flex flex-wrap gap-2">
                {assignedMembers.map((member) => (
                  <div
                    key={member?.id}
                    className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm">{member?.avatar}</span>
                    <span className="text-sm text-white">{member?.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Attachments ({task.attachments.length})
                </label>
                <button className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white">
                  + Attach File
                </button>
              </div>
              <div className="space-y-2">
                {task.attachments.length > 0 ? (
                  task.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400">📎</span>
                        <span className="text-sm text-white">{attachment}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-400 hover:text-blue-300">
                          Download
                        </button>
                        <button className="text-xs text-red-400 hover:text-red-300">Remove</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 bg-slate-800 border border-slate-700 rounded-xl">
                    <p className="text-sm">No attachments yet</p>
                    <p className="text-xs mt-1">Click "Attach File" to add documents</p>
                  </div>
                )}
              </div>
            </div>

            {/* Task Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Created</label>
                <p className="text-sm text-gray-300">
                  {task.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              {task.completedAt && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Completed</label>
                  <p className="text-sm text-gray-300">
                    {task.completedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
