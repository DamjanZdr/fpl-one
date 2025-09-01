"use client";
import { useState } from "react";

interface PhoneNumberModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
}

export default function PhoneNumberModal({ isVisible, onClose, onSubmit }: PhoneNumberModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      onSubmit(phoneNumber.trim());
      setPhoneNumber("");
      onClose();
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="font-semibold mb-4 text-white">Start New WhatsApp Conversation</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., +48 123 456 789"
              className="w-full rounded-xl px-4 py-2 ring-1 focus:ring-2 focus:ring-red-500/40 bg-transparent border border-slate-700 outline-none text-sm text-white"
              autoFocus
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#64748b #1e293b",
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!phoneNumber.trim()}
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg text-sm text-white"
            >
              Start Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
