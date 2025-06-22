"use client";

import { textToHtml } from "@/utils/text-convertor";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/app/auth-provider";

export default function Editor({ filename }: { filename: string }) {
  const [text, setText] = useState("");
  const [markdown, setMarkdown] = useState("");

  const { userToken } = useLocalStorage();

  useEffect(() => {
    const convertMarkdownToHtml = async () => {
      const DOMPurify = (await import("dompurify")).default;
      const html = textToHtml(text);
      const cleanHtml = DOMPurify.sanitize(html);
      setMarkdown(cleanHtml);
    };

    convertMarkdownToHtml();
    getHtmlFromFile();
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const getHtmlFromFile = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/files/${filename}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    const data = await response.json();
    setText(data.content);
  };

  return (
    <div className="flex h-screen p-4 gap-4 flex-grow-1">
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
