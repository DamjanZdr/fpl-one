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
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("firstName");
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
  let filtered = clients.filter((c) =>
    c[searchBy as keyof Client].toLowerCase().includes(search.toLowerCase())
  );
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
    <div className="max-w-5xl mx-auto mt-12">
      <Card
        title={
          <div className="flex gap-2 items-center">
            <input
              className="rounded-xl px-4 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none"
              placeholder={`Search by ${columns.find((c) => c.key === searchBy)?.label}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: 180 }}
            />
            <select
              className={`rounded-xl px-2 py-2 ring-1 border border-slate-700 bg-black/90 text-white focus:ring-2 focus:ring-red-500/40 outline-none`}
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              {columns.map((col) => (
                <option key={col.key} value={col.key} className="bg-black/90 text-white">
                  {col.label}
                </option>
              ))}
            </select>
          </div>
        }
        themeClass={theme.cardChrome}
        headerDivider={theme.headerDivider}
        titleClass={theme.titleText}
      >
        <div className="overflow-x-auto rounded-2xl ring-1">
          <table className="min-w-full text-left">
            <thead>
              <tr className={`${theme.tableHead} sticky top-0 backdrop-blur-sm`}>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 font-semibold cursor-pointer relative"
                    onClick={() => setSortPopup(col.key)}
                  >
                    {col.label}
                    {sortPopup === col.key && (
                      <div
                        ref={popupRef}
                        className="absolute left-0 top-full mt-2 bg-black/90 text-white rounded-xl shadow-lg p-2 z-10 min-w-[160px]"
                      >
                        <div className="mb-2 font-bold">Sort by {col.label}</div>
                        {sortOptions[col.key].map((opt) => (
                          <button
                            key={opt}
                            className={`block w-full text-left px-3 py-1 rounded hover:bg-white/10 ${
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
                  } cursor-pointer`}
                  onClick={() => alert(`Open client view for ${c.id}`)}
                >
                  <td className="px-4 py-3 font-mono">{c.id}</td>
                  <td className="px-4 py-3">{c.firstName}</td>
                  <td className="px-4 py-3">{c.lastName}</td>
                  <td className="px-4 py-3">{new Date(c.dateCreated).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
