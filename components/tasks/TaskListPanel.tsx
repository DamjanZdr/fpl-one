"use client";
import { useState, useEffect, useRef } from "react";
import { TaskList, taskMembers } from "../../dummy-data/tasks";
import { useTheme } from "../hooks/useTheme";

interface TaskListPanelProps {
  taskLists: TaskList[];
  selectedList: TaskList | null;
  onListSelect: (list: TaskList) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (listId: string) => void;
  onRenameList: (listId: string, newName: string) => void;
  onToggleShare: (listId: string) => void;
  onUpdateSharing: (listId: string, sharedWith: string[]) => void;
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
  onToggleShare,
  onUpdateSharing,
  activeTab,
  onTabChange,
}: TaskListPanelProps) {
  const { theme, mode } = useTheme();
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListError, setNewListError] = useState("");
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [deletingList, setDeletingList] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sharingList, setSharingList] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const addFormRef = useRef<HTMLDivElement>(null);
  const editFormRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLists = taskLists.filter((list) =>
    activeTab === "personal" ? !list.isShared : list.isShared
  );

  const handleCreateList = () => {
    if (newListName.trim().length >= 1) {
      onCreateList(newListName.trim());
      setNewListName("");
      setNewListError("");
      setShowAddList(false);
    } else {
      setNewListError("Please name this list");
    }
  };

  const handleCancelAddList = () => {
    setShowAddList(false);
    setNewListName("");
    setNewListError("");
  };

  const handleRename = (listId: string) => {
    console.log("handleRename called with:", listId, editName);
    if (editName.trim().length >= 1) {
      onRenameList(listId, editName.trim());
      setEditingList(null);
      setEditName("");
      setEditError("");
    } else {
      setEditError("Please name this list");
    }
  };

  const handleCancelEdit = () => {
    console.log("handleCancelEdit called");
    setEditingList(null);
    setEditName("");
    setEditError("");
  };

  const startRename = (list: TaskList) => {
    console.log("startRename called for list:", list.id, list.name);
    setEditingList(list.id);
    setEditName(list.name);
    setEditError("");
  };

  const confirmDelete = (listId: string) => {
    console.log("confirmDelete called for list:", listId);
    onDeleteList(listId);
    setDeletingList(null);
    setOpenDropdown(null);
  };

  const cancelDelete = () => {
    setDeletingList(null);
  };

  const startSharing = (list: TaskList) => {
    setSharingList(list.id);
    setSelectedUsers([...list.sharedWith]);
    setOpenDropdown(null);
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const confirmSharing = () => {
    if (sharingList) {
      onUpdateSharing(sharingList, selectedUsers);
      setSharingList(null);
      setSelectedUsers([]);
    }
  };

  const cancelSharing = () => {
    setSharingList(null);
    setSelectedUsers([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Handle dropdown clicks
      if (openDropdown && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenDropdown(null);
        setDeletingList(null); // Reset delete confirmation when closing dropdown
      }

      // Handle click away for add list form
      if (showAddList && addFormRef.current && !addFormRef.current.contains(target)) {
        handleCancelAddList();
      }

      // Handle click away for edit form
      if (editingList && editFormRef.current && !editFormRef.current.contains(target)) {
        handleCancelEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, showAddList, editingList]);

  return (
    <div className="flex flex-col h-full">
      {/* Task Lists */}
      <div
        className="flex-1 overflow-y-scroll p-4 space-y-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#64748b #1e293b",
        }}
      >
        {/* Add List Item - Only in Personal tab */}
        {activeTab === "personal" && (
          <div
            onClick={() => setShowAddList(true)}
            className="group p-3 rounded-xl cursor-pointer border border-dashed border-slate-600 hover:border-slate-500 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1 text-gray-400">+ Add New List</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Create a new task list</span>
                </div>
              </div>
              <div className="text-gray-500">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="opacity-50 group-hover:opacity-100 transition-opacity"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Add List Form */}
        {showAddList && (
          <div ref={addFormRef} className="p-3 rounded-xl border border-blue-500 bg-slate-800/50">
            <input
              type="text"
              placeholder="List name..."
              value={newListName}
              onChange={(e) => {
                setNewListName(e.target.value);
                if (newListError) setNewListError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateList();
                } else if (e.key === "Escape") {
                  handleCancelAddList();
                }
              }}
              className="w-full rounded-xl px-3 py-2 ring-1 focus:ring-2 focus:ring-blue-500/40 bg-transparent border border-slate-700 outline-none text-sm"
              autoFocus
            />
            {newListError && <p className="text-red-400 text-xs mt-2">{newListError}</p>}
          </div>
        )}

        {/* Existing Lists */}
        {filteredLists.map((list) => (
          <div
            key={list.id}
            onClick={() => onListSelect(list)}
            className={
              "group p-3 rounded-xl cursor-pointer border transition-colors " +
              (selectedList?.id === list.id
                ? "bg-red-500/20 border-red-500/50"
                : "border-slate-700 hover:border-slate-600 hover:bg-white/5")
            }
          >
            <div className="flex items-center justify-between">
              {editingList === list.id ? (
                <div className="flex-1 mr-2">
                  <input
                    ref={editFormRef}
                    type="text"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      if (editError) setEditError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRename(list.id);
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                    className="w-full rounded px-2 py-1 bg-slate-800 border border-slate-600 text-sm"
                    autoFocus
                  />
                  {editError && <p className="text-red-400 text-xs mt-1">{editError}</p>}
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
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === list.id ? null : list.id);
                      }}
                      className={
                        theme.pageText + " hover:bg-slate-700 p-1 rounded transition-colors"
                      }
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <circle cx="8" cy="3" r="1.5" />
                        <circle cx="8" cy="8" r="1.5" />
                        <circle cx="8" cy="13" r="1.5" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === list.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 top-8 bg-slate-800 border border-slate-600 rounded-lg shadow-lg py-1 z-10 min-w-40"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Rename clicked for list:", list.id);
                            startRename(list);
                            setOpenDropdown(null);
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            startSharing(list);
                          }}
                          className={
                            "w-full text-left px-3 py-2 text-xs " +
                            theme.pageText +
                            " hover:bg-slate-700 transition-colors flex items-center gap-2"
                          }
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                          </svg>
                          Share
                        </button>

                        {deletingList === list.id ? (
                          <div className="flex">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(list.id);
                              }}
                              className={
                                "w-1/2 px-3 py-2 text-xs " +
                                theme.pageText +
                                " hover:bg-slate-700 transition-colors flex items-center justify-center"
                              }
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelDelete();
                              }}
                              className={
                                "w-1/2 px-3 py-2 text-xs " +
                                theme.pageText +
                                " hover:bg-slate-700 transition-colors flex items-center justify-center"
                              }
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Delete clicked for list:", list.id);
                              setDeletingList(list.id);
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
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredLists.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            {activeTab === "personal" ? (
              <>
                <p className="text-sm">No personal task lists yet</p>
                <p className="text-xs mt-1">Click "Add New List" above to create your first list</p>
              </>
            ) : (
              <>
                <p className="text-sm">No shared task lists yet</p>
                <p className="text-xs mt-1">Share a personal list to see it here</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Sharing Modal */}
      {sharingList && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className={"text-lg font-semibold " + theme.pageText}>Share List</h3>
              <button
                onClick={cancelSharing}
                className={theme.iconColor + " hover:bg-white/10 p-1 rounded"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <p className={"text-sm " + theme.pageText + " mb-4"}>
              Select people to share this list with:
            </p>

            <div className="space-y-2 mb-6">
              {taskMembers
                .filter((member) => member.id !== "user-1")
                .map((member) => (
                  <div
                    key={member.id}
                    className={
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all " +
                      (selectedUsers.includes(member.id)
                        ? "bg-red-600/20 border border-red-500 ring-1 ring-red-500"
                        : "bg-slate-700 border border-slate-600 hover:border-slate-500 hover:bg-slate-650")
                    }
                    onClick={() => handleUserToggle(member.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {selectedUsers.includes(member.id) && (
                        <div className="text-red-500">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        </div>
                      )}
                      <span className="text-2xl">{member.avatar}</span>
                      <div>
                        <div className={"text-sm font-medium " + theme.pageText}>{member.name}</div>
                        <div className="text-xs text-gray-400">{member.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelSharing}
                className={
                  "flex-1 px-4 py-2 rounded-lg border " +
                  theme.border +
                  " " +
                  theme.pageText +
                  " hover:bg-white/5"
                }
              >
                Cancel
              </button>
              <button
                onClick={confirmSharing}
                className="flex-1 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: "#AB1604" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B1203")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#AB1604")}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
