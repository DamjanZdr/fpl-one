"use client";
import { useState } from "react";
import { clientDetails, cases, knowledgeBase } from "../../dummy-data/inbox";
import { useTheme } from "../hooks/useTheme";

interface SupportPanelProps {
  connectedClient: string | null;
  onClientConnect: (clientId: string | null) => void;
}

export default function SupportPanel({ connectedClient, onClientConnect }: SupportPanelProps) {
  const { theme } = useTheme();
  const [supportTab, setSupportTab] = useState<"connections" | "knowledge">("connections");
  const [knowledgeSearch, setKnowledgeSearch] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const filteredDocuments = knowledgeBase.filter(
    (doc) =>
      doc.title.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
      doc.content.toLowerCase().includes(knowledgeSearch.toLowerCase())
  );

  const getDocumentSnippet = (content: string, searchTerm: string) => {
    if (!searchTerm) return content.substring(0, 100) + "...";

    const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return content.substring(0, 100) + "...";

    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + searchTerm.length + 30);
    const snippet = content.substring(start, end);

    return `...${snippet}...`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Support Header */}
      <div className={`p-4 border-b ${theme.headerDivider} relative`}>
        <div className="flex">
          <button
            onClick={() => setSupportTab("connections")}
            className={`px-3 py-1 text-xs rounded-l-lg ${
              supportTab === "connections"
                ? "bg-red-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => setSupportTab("knowledge")}
            className={`px-3 py-1 text-xs rounded-r-lg ${
              supportTab === "knowledge"
                ? "bg-red-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Knowledge
          </button>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-slate-700`} />
      </div>

      {/* Support Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {supportTab === "connections" ? (
          <div className="space-y-4">
            {connectedClient ? (
              <div>
                {(() => {
                  const client = clientDetails.find((c) => c.id === connectedClient);
                  const clientCases = cases.filter((c) => c.clientId === connectedClient);

                  return client ? (
                    <div className="space-y-4">
                      <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">Connected Client</h4>
                          <button
                            onClick={() => onClientConnect(null)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Disconnect
                          </button>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p>
                            <strong>ID:</strong> {client.id}
                          </p>
                          <p>
                            <strong>Name:</strong> {client.firstName} {client.lastName}
                          </p>
                          <p>
                            <strong>Created:</strong> {client.dateCreated.toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Country:</strong> {client.country}
                          </p>
                          <p>
                            <strong>City:</strong> {client.cityInPoland}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-sm">Open Cases</h4>
                          <button
                            onClick={() => {
                              console.log("Creating new case for", connectedClient);
                            }}
                            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
                          >
                            + Case
                          </button>
                        </div>
                        <div className="space-y-2">
                          {clientCases.map((case_) => (
                            <div key={case_.id} className="bg-slate-800/50 rounded-lg p-2 text-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p>
                                    <strong>{case_.id}</strong>
                                  </p>
                                  <p>{case_.service}</p>
                                  <p className="text-gray-400">${case_.value}</p>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    case_.status === "open"
                                      ? "bg-green-600"
                                      : case_.status === "pending"
                                      ? "bg-yellow-600"
                                      : "bg-gray-600"
                                  }`}
                                >
                                  {case_.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            ) : (
              <div>
                <h4 className="font-semibold text-sm mb-3">Link Client</h4>
                <select
                  onChange={(e) => {
                    if (e.target.value === "create") {
                      const firstName = prompt("Enter client's first name:");
                      if (firstName) {
                        const newClientId = `client-${Date.now()}`;
                        onClientConnect(newClientId);
                        console.log("Created new client:", firstName);
                      }
                    } else if (e.target.value) {
                      onClientConnect(e.target.value);
                    }
                  }}
                  className="w-full rounded-xl px-3 py-2 ring-1 border border-slate-700 bg-black/90 text-white focus:ring-2 focus:ring-red-500/40 outline-none text-sm"
                  defaultValue=""
                >
                  <option value="">Select a client...</option>
                  <option value="create">+ Create New Client</option>
                  {clientDetails.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {!selectedDocument ? (
              <div>
                <input
                  className="w-full rounded-xl px-4 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none text-sm mb-4"
                  placeholder="Search knowledge base..."
                  value={knowledgeSearch}
                  onChange={(e) => setKnowledgeSearch(e.target.value)}
                />

                <div className="space-y-2 overflow-y-auto">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="bg-slate-800/50 rounded-lg p-3 text-xs">
                      <h5 className="font-semibold mb-1">{doc.title}</h5>
                      <p className="text-gray-400 mb-2">
                        {getDocumentSnippet(doc.content, knowledgeSearch)}
                      </p>
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white"
                      >
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-sm">{selectedDocument.title}</h4>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    ← Back to search
                  </button>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-xs overflow-y-auto">
                  <p className="whitespace-pre-wrap">{selectedDocument.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Last modified: {selectedDocument.lastModified.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
