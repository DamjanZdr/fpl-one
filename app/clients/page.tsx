"use client";
import { useState, useEffect, useRef } from "react";
import { clients, Client } from "../../dummy-data/clients";
import { useTheme } from "../../components/hooks/useTheme";
import Card from "../../components/ui/Card";

const columns = [
  { key: "id", label: "Client ID" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "dateCreated", label: "Date Created" },
];

const sortOptions: Record<string, string[]> = {
  id: ["A-Z", "Z-A"],
  firstName: ["A-Z", "Z-A"],
  lastName: ["A-Z", "Z-A"],
  dateCreated: ["Oldest-Newest", "Newest-Oldest"],
};

export default function ClientsPage() {
  const { theme, mode } = useTheme();
  const [searchId, setSearchId] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDir, setSortDir] = useState<string>("");
  const [sortPopup, setSortPopup] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setSortPopup(null);
      }
    };

    if (sortPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [sortPopup]);

  // Filter and sort logic
  let filtered = clients.filter((c) => {
    const matchesId = searchId === "" || c.id.toLowerCase().includes(searchId.toLowerCase());
    const matchesFirstName =
      searchFirstName === "" || c.firstName.toLowerCase().includes(searchFirstName.toLowerCase());
    const matchesLastName =
      searchLastName === "" || c.lastName.toLowerCase().includes(searchLastName.toLowerCase());

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const clientDate = new Date(c.dateCreated);
      // Set time to start of day for comparison
      clientDate.setHours(0, 0, 0, 0);

      if (dateFrom && dateTo) {
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999); // Include the entire "to" day
        matchesDate = clientDate >= fromDate && clientDate <= toDate;
      } else if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDate = clientDate >= fromDate;
      } else if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // Include the entire "to" day
        matchesDate = clientDate <= toDate;
      }
    }

    return matchesId && matchesFirstName && matchesLastName && matchesDate;
  });
  if (sortBy && sortDir) {
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "dateCreated") {
        return sortDir === "Oldest-Newest"
          ? new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
          : new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      } else {
        const valA = String(a[sortBy as keyof Client]).toLowerCase();
        const valB = String(b[sortBy as keyof Client]).toLowerCase();
        if (sortDir === "A-Z") return valA.localeCompare(valB);
        else return valB.localeCompare(valA);
      }
    });
  }

  return (
    <div className="fixed top-20 left-60 right-4 bottom-4">
      <Card
        themeClass={theme.cardChrome}
        headerDivider={theme.headerDivider}
        titleClass={theme.titleText}
        className="h-full overflow-hidden [&>div:last-child]:p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${theme.headerDivider} relative`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-[13px] font-semibold tracking-wider uppercase ${theme.titleText}`}
              >
                Clients
              </span>
              <span className="bg-slate-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {filtered.length} of {clients.length}
              </span>
            </div>
            <button
              onClick={() => {
                setSearchId("");
                setSearchFirstName("");
                setSearchLastName("");
                setDateFrom("");
                setDateTo("");
                setSortBy("");
                setSortDir("");
              }}
              className="text-xs bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-lg text-white"
            >
              Clear Filters
            </button>
            <div className={`absolute bottom-0 left-0 right-0 h-px bg-slate-700`} />
          </div>

          {/* Filters */}
          <div className="p-4 space-y-3 border-b border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${theme.titleText}`}>
                  Client ID
                </label>
                <input
                  className={`w-full rounded-xl px-3 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none text-xs ${
                    mode === "dark"
                      ? "text-white placeholder-gray-400"
                      : "text-black placeholder-gray-500"
                  }`}
                  placeholder="e.g., CLIENT-001"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${theme.titleText}`}>
                  First Name
                </label>
                <input
                  className={`w-full rounded-xl px-3 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none text-xs ${
                    mode === "dark"
                      ? "text-white placeholder-gray-400"
                      : "text-black placeholder-gray-500"
                  }`}
                  placeholder="e.g., Anna"
                  value={searchFirstName}
                  onChange={(e) => setSearchFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${theme.titleText}`}>
                  Last Name
                </label>
                <input
                  className={`w-full rounded-xl px-3 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none text-xs ${
                    mode === "dark"
                      ? "text-white placeholder-gray-400"
                      : "text-black placeholder-gray-500"
                  }`}
                  placeholder="e.g., Kowalski"
                  value={searchLastName}
                  onChange={(e) => setSearchLastName(e.target.value)}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${theme.titleText}`}>
                  Date Created (Range)
                </label>
                <div className="flex gap-1">
                  <input
                    type="date"
                    className={`flex-1 rounded-xl px-3 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none text-xs cursor-pointer ${
                      mode === "dark"
                        ? "text-white [color-scheme:dark]"
                        : "text-black [color-scheme:light]"
                    }`}
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                      appearance: "none",
                    }}
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    onClick={(e) => {
                      e.currentTarget.showPicker && e.currentTarget.showPicker();
                    }}
                    title="From Date (inclusive)"
                  />
                  <input
                    type="date"
                    className={`flex-1 rounded-xl px-3 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none text-xs cursor-pointer ${
                      mode === "dark"
                        ? "text-white [color-scheme:dark]"
                        : "text-black [color-scheme:light]"
                    }`}
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                      appearance: "none",
                    }}
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    onClick={(e) => {
                      e.currentTarget.showPicker && e.currentTarget.showPicker();
                    }}
                    title="To Date (inclusive)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div
            className="flex-1 overflow-y-scroll"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#64748b #1e293b",
            }}
          >
            <div className="p-4">
              <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-700">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className={`${theme.tableHead} sticky top-0 backdrop-blur-sm`}>
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-3 font-semibold cursor-pointer relative text-xs tracking-wider uppercase"
                          onClick={() => setSortPopup(col.key)}
                        >
                          {col.label}
                          {sortPopup === col.key && (
                            <div
                              ref={popupRef}
                              className="absolute left-0 top-full mt-2 bg-black/90 text-white rounded-xl shadow-lg p-2 z-10 min-w-[160px]"
                            >
                              <div className="mb-2 font-bold text-sm">Sort by {col.label}</div>
                              {sortOptions[col.key].map((opt) => (
                                <button
                                  key={opt}
                                  className={`block w-full text-left px-3 py-1 rounded hover:bg-white/10 text-sm ${
                                    sortBy === col.key && sortDir === opt ? "bg-red-700/90" : ""
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSortBy(col.key);
                                    setSortDir(opt);
                                    setSortPopup(null);
                                  }}
                                >
                                  {opt}
                                </button>
                              ))}
                              <button
                                className="block w-full text-left px-3 py-1 rounded mt-2 text-xs opacity-70 hover:bg-white/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSortPopup(null);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <tr
                        key={c.id}
                        className={`${i % 2 === 0 ? theme.zebraEven : theme.zebraOdd} ${
                          theme.rowHover
                        } cursor-pointer transition-colors`}
                        onClick={() => alert(`Open client view for ${c.id}`)}
                      >
                        <td className="px-4 py-3 font-mono text-sm">{c.id}</td>
                        <td className="px-4 py-3 text-sm">{c.firstName}</td>
                        <td className="px-4 py-3 text-sm">{c.lastName}</td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(c.dateCreated).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
