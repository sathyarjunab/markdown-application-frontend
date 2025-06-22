"use client";

import { textToHtml } from "@/utils/text-convertor";
import { useEffect, useState } from "react";

export default function Editor() {
  const [text, setText] = useState("");
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const convertMarkdownToHtml = async () => {
      const DOMPurify = (await import("dompurify")).default;
      const html = textToHtml(text);
      const cleanHtml = DOMPurify.sanitize(html);
      setMarkdown(cleanHtml);
    };

    convertMarkdownToHtml();
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="flex h-screen p-4 gap-4">
      {/* Left side - Input */}
      <textarea
        value={text}
        onChange={handleChange}
        className="w-1/2 h-full border rounded p-2 font-mono resize-none"
        placeholder="Type your markdown here..."
      />
      {/* Right side - Output */}
      <div className="w-1/2 h-full border rounded p-4 overflow-auto prose max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: markdown,
          }}
        ></div>
      </div>
    </div>
  );
}
