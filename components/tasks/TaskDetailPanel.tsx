"use client";
import { useState, useRef } from "react";
import { Task, taskMembers } from "../../dummy-data/tasks";
import { useTheme } from "../hooks/useTheme";

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  selectedList?: any; // Add selectedList to get sharing info
}

export default function TaskDetailPanel({
  task,
  onClose,
  onUpdateTask,
  selectedList,
}: TaskDetailPanelProps) {
  const { theme, mode } = useTheme();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
  );
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  if (!task) return null;

  const handleTitleChange = (newTitle: string) => {
    // Limit title to 30 characters
    if (newTitle.length <= 30) {
      setTitle(newTitle);
      onUpdateTask(task.id, { title: newTitle });
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
    onUpdateTask(task.id, { description: newDescription });
  };

  const handleDateChange = (newDate: string) => {
    setDueDate(newDate);
    onUpdateTask(task.id, {
      dueDate: newDate ? new Date(newDate) : null,
    });
  };

  const handleDateFieldClick = () => {
    dateInputRef.current?.showPicker?.();
  };

  const handleAssigneeToggle = (memberId: string) => {
    const currentAssignees = task.responsiblePeople;
    const newAssignees = currentAssignees.includes(memberId)
      ? currentAssignees.filter((id) => id !== memberId)
      : [...currentAssignees, memberId];

    onUpdateTask(task.id, { responsiblePeople: newAssignees });
  };

  // Filter assignees based on list sharing
  const getAvailableAssignees = () => {
    if (!selectedList) return [taskMembers[0]]; // Default to first user

    if (selectedList.isShared) {
      // For shared lists, include owner and all shared members
      const ownerMember = taskMembers.find((m) => m.id === selectedList.owner);
      const sharedMembers = taskMembers.filter((m) => selectedList.sharedWith.includes(m.id));
      return [ownerMember, ...sharedMembers].filter(Boolean);
    } else {
      // For personal lists, only the current user (owner)
      const ownerMember = taskMembers.find((m) => m.id === selectedList.owner);
      return ownerMember ? [ownerMember] : [taskMembers[0]]; // Fallback to first user
    }
  };

  const availableAssignees = getAvailableAssignees();

  const assignedMembers = task.responsiblePeople
    .map((id) => taskMembers.find((m) => m.id === id))
    .filter(Boolean);

  return (
    <div
      className="h-full flex flex-col bg-slate-900"
      onClick={(e) => {
        // Close dropdown when clicking outside
        if (!(e.target as Element)?.closest?.(".assignee-dropdown")) {
          setShowAssigneeDropdown(false);
        }
      }}
    >
      {/* Header */}
      <div className={`p-4 border-b ${theme.headerDivider}`}>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          maxLength={30}
          className={`w-full font-semibold text-lg px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
            mode === "dark"
              ? "bg-slate-800 border-slate-600 text-white focus:border-slate-500 focus:ring-blue-500/20"
              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
          }`}
          placeholder="Task title..."
        />
        <div className="text-xs text-gray-400 mt-1 text-right">{title.length}/30</div>
      </div>

      {/* Content */}
      <div
        className="flex-1 p-6 overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#64748b #1e293b",
        }}
      >
        <div className="space-y-6">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className={`w-full p-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-colors ${
                  mode === "dark"
                    ? "bg-slate-800 border-slate-600 text-white focus:border-slate-500 focus:ring-blue-500/20"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
                rows={10}
                style={{
                  maxHeight: "240px", // 10 lines * 24px line height
                  overflowY: "auto",
                }}
                placeholder="Add task description..."
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
              <div
                onClick={handleDateFieldClick}
                className={`w-full rounded-xl px-3 py-2 border text-sm cursor-pointer transition-colors ${
                  mode === "dark"
                    ? "bg-slate-800 border-slate-600 text-white hover:border-slate-500"
                    : "bg-white border-gray-300 text-gray-900 hover:border-gray-400"
                }`}
              >
                <input
                  ref={dateInputRef}
                  type="date"
                  value={dueDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={`w-full bg-transparent border-none outline-none cursor-pointer ${
                    mode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                  style={{
                    colorScheme: mode === "dark" ? "dark" : "light",
                  }}
                />
              </div>
            </div>

            {/* Responsible People */}
            <div className="relative assignee-dropdown">
              <label className="block text-sm font-medium text-gray-300 mb-2">Assignees</label>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAssigneeDropdown(!showAssigneeDropdown);
                }}
                className={`w-full rounded-xl px-3 py-2 border text-sm cursor-pointer transition-colors min-h-[40px] flex items-center justify-between ${
                  mode === "dark"
                    ? "bg-slate-800 border-slate-600 text-white hover:border-slate-500"
                    : "bg-white border-gray-300 text-gray-900 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  {assignedMembers.length > 0 ? (
                    assignedMembers.map((member) => (
                      <div
                        key={member?.id}
                        className={`flex items-center gap-1 rounded px-2 py-1 ${
                          mode === "dark" ? "bg-slate-700" : "bg-gray-200"
                        }`}
                      >
                        <span className="text-xs">{member?.avatar}</span>
                        <span
                          className={`text-xs ${mode === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {member?.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className={mode === "dark" ? "text-gray-400" : "text-gray-500"}>
                      Select assignees...
                    </span>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Assignee Dropdown */}
              {showAssigneeDropdown && (
                <div
                  className={`absolute top-full left-0 right-0 mt-1 border rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto ${
                    mode === "dark" ? "bg-slate-800 border-slate-600" : "bg-white border-gray-300"
                  }`}
                >
                  {availableAssignees.map((member) => (
                    <div
                      key={member.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssigneeToggle(member.id);
                      }}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                        mode === "dark" ? "hover:bg-slate-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.responsiblePeople.includes(member.id)}
                        onChange={() => {}} // Handled by onClick
                        className={`rounded focus:ring-2 ${
                          mode === "dark"
                            ? "border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                            : "border-gray-300 bg-white text-blue-600 focus:ring-blue-500"
                        }`}
                      />
                      <span className="text-sm">{member.avatar}</span>
                      <span
                        className={`text-sm ${mode === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Attachments ({task.attachments.length})
                </label>
                <button className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white">
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
                        <button
                          className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          title="Download"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                          </svg>
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Remove"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                        </button>
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
