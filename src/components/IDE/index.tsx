import React, { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import OpenTofuLogo from "./OpenTofuLogo";
import { useColorMode } from "@docusaurus/theme-common";
import CopyIcon from "./CopyIcon";
import CheckIcon from "./CheckIcon";
import DefaultFileIcon from "./DefaultFileIcon";

interface IDEHeaderProps {
  filename?: string;
}

const tfFileExtensions = [".tf", ".tfvars", ".tofu"];

function IDEHeader({ filename = "main.tf" }: IDEHeaderProps) {
  const { colorMode } = useColorMode();
  const isTofuFile = tfFileExtensions.some((ext) => filename.endsWith(ext));

  return (
    <div
      className={`flex items-center px-4 py-2 ${
        colorMode === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4">
          {isTofuFile ? <OpenTofuLogo /> : <DefaultFileIcon />}
        </div>
        <span className="text-sm font-mono">{filename}</span>
      </div>
    </div>
  );
}

interface IDEProps {
  code: string;
  language?: string;
  filename?: string;
}

export function IDE({ code, language = "hcl", filename }: IDEProps) {
  const [copied, setCopied] = useState(false);
  const { colorMode } = useColorMode();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-xl">
      <IDEHeader filename={filename} />
      <div className="relative overflow-x-auto">
        <button
          onClick={copyToClipboard}
          className={`absolute right-2 top-2 z-10 p-1.5 ${
            colorMode === "dark"
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-800"
          } transition-colors`}
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <Highlight
          theme={colorMode === "dark" ? themes.oneDark : themes.oneLight}
          code={code}
          language={language}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className="px-4 py-3 text-sm"
              style={{
                ...style,
                margin: 0,
                maxWidth: "100%",
                overflowX: "auto",
                borderRadius: "0",
              }}
            >
              <code
                style={{
                  display: "block",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
