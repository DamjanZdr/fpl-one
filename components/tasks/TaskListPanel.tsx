"use client";
import { useState } from "react";
import { TaskList } from "../../dummy-data/tasks";
import { useTheme } from "../hooks/useTheme";

interface TaskListPanelProps {
  taskLists: TaskList[];
  selectedList: TaskList | null;
  onListSelect: (list: TaskList) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (listId: string) => void;
  onRenameList: (listId: string, newName: string) => void;
  activeTab: "personal" | "shared";
  onTabChange: (tab: "personal" | "shared") => void;
}

export default function TaskListPanel({
  taskLists,
  selectedList,
  onListSelect,
  onCreateList,
  onDeleteList,
  onRenameList,
  activeTab,
  onTabChange,
}: TaskListPanelProps) {
  const { theme } = useTheme();
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const filteredLists = taskLists.filter((list) =>
    activeTab === "personal" ? !list.isShared : list.isShared
  );

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName("");
      setShowAddList(false);
    }
  };

  const handleRename = (listId: string) => {
    if (editName.trim()) {
      onRenameList(listId, editName.trim());
      setEditingList(null);
      setEditName("");
    }
  };

  const startRename = (list: TaskList) => {
    setEditingList(list.id);
    setEditName(list.name);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b ${theme.headerDivider} relative`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[13px] font-semibold tracking-wider uppercase ${theme.titleText}`}>
            Task Lists
          </span>
          <button
            onClick={() => setShowAddList(true)}
            className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white"
          >
            + Add List
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 mb-3">
          <button
            onClick={() => onTabChange("personal")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "personal"
                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => onTabChange("shared")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "shared"
                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            Shared
          </button>
        </div>

        {/* Add List Form */}
        {showAddList && (
          <div className="mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="List name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateList()}
                className="flex-1 rounded-xl px-3 py-2 ring-1 focus:ring-2 focus:ring-blue-500/40 bg-transparent border border-slate-700 outline-none text-xs"
                autoFocus
              />
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl text-xs"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddList(false);
                  setNewListName("");
                }}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className={`absolute bottom-0 left-0 right-0 h-px bg-slate-700`} />
      </div>

      {/* Task Lists */}
      <div
        className="flex-1 overflow-y-scroll p-4 space-y-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#64748b #1e293b",
        }}
      >
        {filteredLists.map((list) => (
          <div
            key={list.id}
            onClick={() => onListSelect(list)}
            className={`p-3 rounded-xl cursor-pointer border transition-colors ${
              selectedList?.id === list.id
                ? "bg-red-500/20 border-red-500/50"
                : "border-slate-700 hover:border-slate-600 hover:bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between">
              {editingList === list.id ? (
                <div className="flex-1 flex gap-2 mr-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleRename(list.id)}
                    onBlur={() => handleRename(list.id)}
                    className="flex-1 rounded px-2 py-1 bg-slate-800 border border-slate-600 text-xs"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{list.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{list.tasks.length} tasks</span>
                      {list.isShared && (
                        <span className="bg-green-600 text-white px-2 py-0.5 rounded">Shared</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(list);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${list.name}"?`)) {
                          onDeleteList(list.id);
                        }
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredLists.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No {activeTab} task lists yet</p>
            <p className="text-xs mt-1">Click "Add List" to create your first list</p>
          </div>
        )}
      </div>
    </div>
  );
}
