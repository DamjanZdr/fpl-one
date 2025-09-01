"use client";
import { messageTemplates } from "../../dummy-data/inbox";

interface MessageTemplatesModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: string) => void;
}

export default function MessageTemplatesModal({
  isVisible,
  onClose,
  onSelectTemplate,
}: MessageTemplatesModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="font-semibold mb-4">Select Template Message</h3>
        <div className="space-y-2 mb-4">
          {messageTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectTemplate(template);
                onClose();
              }}
              className="w-full text-left p-3 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-white/5 text-sm"
            >
              {template}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
