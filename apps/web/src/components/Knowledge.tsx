"use client"; // Ensure this is a client component

import { useState, useEffect } from "react";
import Card from "./Card";
import { cn } from "@/lib/utils";
import { MoreHorizontal, X, Loader2 } from "lucide-react";

export const Knowledge = () => {
  // Toggle States
  const [customBaseOn, setCustomBaseOn] = useState(false);
  const [websitesOn, setWebsitesOn] = useState(false);

  // Data States
  const [customContext, setCustomContext] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");

  // UI States
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showWebsiteDialog, setShowWebsiteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch data on initial load
  useEffect(() => {
    fetch("/api/knowledge")
      .then((res) => res.json())
      .then((data) => {
        setCustomBaseOn(data.customBaseOn);
        setWebsitesOn(data.websitesOn);
        setCustomContext(data.customContext || "");
        setWebsiteLink(data.websiteLink || "");
      })
      .catch((err) => console.error("Failed to load knowledge settings", err))
      .finally(() => setLoading(false));
  }, []);

  // Helper to save state to backend
  const saveToBackend = async (payload: any) => {
    setSaving(true);
    try {
      await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to save", error);
    } finally {
      setSaving(false);
    }
  };

  // 2. Handle Toggles (save immediately)
  const handleCustomToggle = (val: boolean) => {
    setCustomBaseOn(val);
    saveToBackend({ customBaseOn: val }); // Save toggle state immediately
    if (val) setShowCustomDialog(true);
  };

  const handleWebsiteToggle = (val: boolean) => {
    setWebsitesOn(val);
    saveToBackend({ websitesOn: val }); // Save toggle state immediately
    if (val) setShowWebsiteDialog(true);
  };

  // 3. Handle Dialog Saves
  const handleCustomSave = async () => {
    await saveToBackend({ customContext: customContext });
    setShowCustomDialog(false);
  };

  const handleWebsiteSave = async () => {
    await saveToBackend({ websiteLink: websiteLink });
    setShowWebsiteDialog(false);
  };

  if (loading) {
    return (
      <Card>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-teal-600" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-10">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          {saving && <span className="text-xs text-gray-400">Saving...</span>}
        </div>
        <p className="text-gray-600 mb-8">
          Add any additional content here for your Robin to use when answering
          questions.
        </p>
        <hr className="mb-8 border-gray-200" />

        {/* Custom Knowledge Base Section */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Custom Knowledge Base
          </h2>
          <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
            {customContext
              ? customContext
              : "Add any additional content here for your Robin to use when answering questions."}
          </p>
          <div className="flex items-center justify-between mt-4">
            <ToggleSwitch
              checked={customBaseOn}
              onChange={handleCustomToggle}
            />
            {/* Click icon to edit if already enabled */}
            <button
              onClick={() => setShowCustomDialog(true)}
              className="p-1 hover:bg-gray-200 rounded-full transition"
            >
              <MoreHorizontal className="text-gray-500 size-5" />
            </button>
          </div>
        </div>

        {/* Website Section */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Consult These Websites For Answers
          </h2>
          <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-2">
            {websiteLink ? (
              <a
                href={websiteLink}
                target="_blank"
                rel="noreferrer"
                className="text-teal-600 hover:underline"
              >
                {websiteLink}
              </a>
            ) : (
              "Robin will load and analyze content from websites to answer questions with up-to-date information."
            )}
          </p>
          <div className="flex items-center justify-between mt-4">
            <ToggleSwitch checked={websitesOn} onChange={handleWebsiteToggle} />
            <button
              onClick={() => setShowWebsiteDialog(true)}
              className="p-1 hover:bg-gray-200 rounded-full transition"
            >
              <MoreHorizontal className="text-gray-500 size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Context Dialog */}
      {showCustomDialog && (
        <Dialog
          title="Custom Knowledge Context"
          onClose={() => setShowCustomDialog(false)}
          onSave={handleCustomSave}
          isSaving={saving}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter the context or info you want Robin to use:
          </label>
          <textarea
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            rows={5}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
            placeholder="Example: Robin should know details about our 2025 AI Expo..."
          />
        </Dialog>
      )}

      {/* Website Link Dialog */}
      {showWebsiteDialog && (
        <Dialog
          title="Add Website Link"
          onClose={() => setShowWebsiteDialog(false)}
          onSave={handleWebsiteSave}
          isSaving={saving}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter a website Robin should consult:
          </label>
          <input
            type="url"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
            placeholder="https://example.com"
          />
        </Dialog>
      )}
    </Card>
  );
};

/* --- Subcomponents --- */

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
        checked ? "bg-teal-500" : "bg-gray-300"
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

function Dialog({
  title,
  children,
  onClose,
  onSave,
  isSaving,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mb-6">{children}</div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
