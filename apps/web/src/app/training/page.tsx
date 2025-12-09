"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Knowledge } from "@/components/Knowledge";
import { History } from "@/components/History";

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<
    "Personality" | "Knowledge Base" | "History"
  >("Personality");
  const [casualness, setCasualness] = useState(10);
  const [verbosity, setVerbosity] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved values initially
  useEffect(() => {
    fetch("/api/personality")
      .then((res) => res.json())
      .then((data) => {
        setCasualness(data.casualness ?? 10);
        setVerbosity(data.verbosity ?? 10);
      });
  }, []);

  // Debounced save to backend
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setIsSaving(true);
      fetch("/api/personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ casualness, verbosity }),
        signal: controller.signal,
      })
        .then(() => console.log("Saved personality:", casualness, verbosity))
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error(err);
        })
        .finally(() => setIsSaving(false));
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [casualness, verbosity]);

  return (
    <>
      {/* Top Navigation */}
      <div className="flex gap-3 justify-end p-5  mb-6">
        {["Personality", "Knowledge Base", "History"].map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "relative gap-2 text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-none border-b-2 border-transparent",
              activeTab === tab && "font-semibold  border-teal-600"
            )}
          >
            {tab}
          </Button>
        ))}
      </div>

      {activeTab === "Personality" && (
        <Card>
          <div className="h-full p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Personality
            </h1>
            <p className="text-gray-600 mb-8">
              Shape your Robin's responses and tone.
            </p>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side */}
              <div className="flex-1 bg-gray-50 rounded-xl p-10 flex flex-col items-center text-center">
                <Image
                  src="https://wallpapers.com/images/hd/animated-robin-teen-titans-avatar-8uu9xxf8z18i12fp.jpg"
                  alt="Featherworth"
                  width={120}
                  height={160}
                  className="egg"
                />
                <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                  Featherworth
                </h2>
                <p className="text-gray-500">Hatched on August 16, 2025</p>
              </div>

              {/* Right side */}
              <div className="flex-[1.5] space-y-8">
                <Slider
                  labelLeft="Casual"
                  labelRight="Formal"
                  value={casualness}
                  step={10}
                  onChange={setCasualness}
                  description="Communicate casually using slang, abbreviations, or informal expressions."
                />

                <Slider
                  labelLeft="Verbose"
                  labelRight="Concise"
                  value={verbosity}
                  step={10}
                  onChange={setVerbosity}
                  description="Provide either detailed or concise responses depending on the setting."
                />

                <div className="border rounded-lg p-4 flex items-center gap-5">
                  <Image
                    src={"https://tinyurl.com/yc7ztk3y"}
                    alt="open ai"
                    width={40}
                    height={40}
                  />
                  <span className="font-medium text-gray-800">GPT-4o Mini</span>
                  {isSaving && (
                    <span className="text-sm text-gray-500 ml-2">
                      Saving...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "Knowledge Base" && <Knowledge />}

      {activeTab === "History" && <History />}
    </>
  );
}

function Slider({
  labelLeft,
  labelRight,
  value,
  onChange,
  description,
  step,
}: any) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
        <span>{labelLeft}</span>
        <span>{labelRight}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal-600 appearance-none bg-gray-50 rounded-lg"
      />
      <p className="text-gray-500 text-sm mt-2">{description}</p>
      <p className="text-xs text-gray-400 mt-1">Current: {value}%</p>
    </div>
  );
}
