/** @format */

import React, { useState } from "react";
import { Copy, Check, Terminal, Quote, List } from "lucide-react";

interface Props {
  content: string;
}

// --- SYNTAX HIGHLIGHTING LOGIC ---
const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "import",
  "export",
  "from",
  "default",
  "class",
  "extends",
  "implements",
  "interface",
  "type",
  "public",
  "private",
  "protected",
  "static",
  "void",
  "int",
  "float",
  "double",
  "char",
  "bool",
  "boolean",
  "string",
  "String",
  "new",
  "this",
  "super",
  "try",
  "catch",
  "finally",
  "throw",
  "async",
  "await",
  "def",
  "print",
  "include",
  "using",
  "namespace",
  "std",
  "cout",
  "cin",
  "printf",
  "scanf",
  "struct",
  "union",
  "enum",
  "template",
  "typename",
  "operator",
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "main",
  "#include",
  "#define",
]);

const TYPES = new Set([
  "int",
  "float",
  "double",
  "char",
  "void",
  "bool",
  "boolean",
  "string",
  "String",
  "vector",
  "map",
  "set",
  "list",
  "Promise",
  "Object",
  "Array",
]);

const highlightLine = (line: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let remaining = line;
  let i = 0;

  // Simple tokenization regex
  // 1. Strings ( "..." or '...' )
  // 2. Comments ( //... or #... )
  // 3. Preprocessor/Keywords (#include, etc)
  // 4. Words (identifiers)
  // 5. Numbers
  // 6. Symbols

  // Note: This is a lightweight approximation for performance
  const regex =
    /(\/\/.*$|#.*$|\/\*.*?\*\/)|(".*?"|'.*?'|`.*?`)|(\b\d+\b)|([a-zA-Z_]\w*)|([^\s\w])/g;

  let match;
  let lastIndex = 0;

  while ((match = regex.exec(line)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      nodes.push(
        <span key={i++} className="text-[#d4d4d4]">
          {line.substring(lastIndex, match.index)}
        </span>,
      );
    }

    const [fullMatch, comment, str, num, word, symbol] = match;

    if (comment) {
      nodes.push(
        <span key={i++} className="text-[#6A9955] italic">
          {comment}
        </span>,
      );
    } else if (str) {
      nodes.push(
        <span key={i++} className="text-[#CE9178]">
          {str}
        </span>,
      );
    } else if (num) {
      nodes.push(
        <span key={i++} className="text-[#B5CEA8]">
          {num}
        </span>,
      );
    } else if (word) {
      if (KEYWORDS.has(word) || word.startsWith("#")) {
        nodes.push(
          <span key={i++} className="text-[#C586C0] font-bold">
            {word}
          </span>,
        );
      } else if (TYPES.has(word)) {
        nodes.push(
          <span key={i++} className="text-[#4EC9B0]">
            {word}
          </span>,
        );
      } else if (line[match.index + word.length] === "(") {
        nodes.push(
          <span key={i++} className="text-[#DCDCAA]">
            {word}
          </span>,
        ); // Function call
      } else {
        nodes.push(
          <span key={i++} className="text-[#9CDCFE]">
            {word}
          </span>,
        ); // Variable/Other
      }
    } else if (symbol) {
      nodes.push(
        <span key={i++} className="text-[#d4d4d4]">
          {symbol}
        </span>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(
      <span key={i++} className="text-[#d4d4d4]">
        {line.substring(lastIndex)}
      </span>,
    );
  }

  return nodes;
};

// --- SUB-COMPONENT: Professional Code Block ---
const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="my-8 rounded-xl border-2 border-black dark:border-zinc-700 overflow-hidden bg-[#1e1e1e] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_#333] transition-all mx-1 md:mx-0 group">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-white/10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
          <Terminal size={12} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest font-mono pt-0.5">
            {language || "CODE"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors uppercase tracking-wider">
          {copied ? (
            <Check size={12} className="text-acid" />
          ) : (
            <Copy size={12} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code Body with Syntax Highlighting */}
      <div className="p-5 overflow-x-auto custom-scrollbar bg-[#1e1e1e]">
        <pre className="font-mono text-sm leading-relaxed text-[#d4d4d4] font-medium">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell text-right select-none text-[#555] pr-4 text-xs w-8">
                  {i + 1}
                </span>
                <span className="table-cell">{highlightLine(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  // Helper to parse bold, inline code, italics
  const parseInline = (text: string) => {
    // Split by bold (**...**) and inline code (`...`)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-black text-black dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 px-1.5 py-0.5 rounded-md text-pink-600 dark:text-pink-400 font-bold font-mono text-sm mx-0.5 shadow-sm">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Helper to render a table
  const renderTable = (rows: string[], key: number) => {
    if (rows.length < 2) return null;

    const parseRow = (r: string) =>
      r
        .split("|")
        .map(c => c.trim())
        .filter((c, i, arr) => {
          if (i === 0 && c === "") return false;
          if (i === arr.length - 1 && c === "") return false;
          return true;
        });

    const headerCells = parseRow(rows[0]);
    const bodyRows = rows.slice(2).map(row => parseRow(row));

    return (
      <div
        key={key}
        className="overflow-x-auto my-8 rounded-xl border-2 border-black dark:border-zinc-700 shadow-[4px_4px_0px_0px_#000] dark:shadow-none bg-white dark:bg-zinc-900">
        <table className="min-w-full divide-y-2 divide-black dark:divide-zinc-700 text-sm">
          <thead className="bg-acid text-black">
            <tr>
              {headerCells.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left font-black uppercase tracking-wider border-r border-black/20 last:border-r-0 whitespace-nowrap">
                  {parseInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {bodyRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-gray-50 dark:hover:bg-black/20 transition-colors">
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium border-r border-gray-100 dark:border-zinc-800 last:border-r-0 leading-relaxed min-w-[150px]">
                    {parseInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Split content by code blocks
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose-custom max-w-none text-slate-800 dark:text-slate-200">
      {blocks.map((block, blockIndex) => {
        if (block.startsWith("```")) {
          // --- RENDER CODE BLOCK ---
          const lines = block.split("\n");
          const lang = lines[0].replace("```", "").trim();
          const codeContent = lines.slice(1, -1).join("\n");
          return (
            <CodeBlock key={blockIndex} language={lang} code={codeContent} />
          );
        } else {
          // --- RENDER TEXT CONTENT ---
          const lines = block.split("\n");
          const elements: React.ReactNode[] = [];

          let i = 0;
          while (i < lines.length) {
            const line = lines[i];
            const trimmed = line.trim();

            // 1. Table Detection
            const isTableStart =
              trimmed.includes("|") &&
              lines[i + 1]?.trim().match(/^\|?(\s*:?-+:?\s*\|?)+\s*$/);

            if (isTableStart) {
              const tableRows: string[] = [];
              while (
                i < lines.length &&
                (lines[i].trim().includes("|") || lines[i].trim() === "")
              ) {
                if (lines[i].trim() !== "") tableRows.push(lines[i]);
                i++;
              }
              elements.push(renderTable(tableRows, blockIndex * 10000 + i));
              continue;
            }

            // 2. Blockquote Detection (> Text)
            if (trimmed.startsWith("> ")) {
              const quoteContent = trimmed.replace(/^>\s*/, "");
              elements.push(
                <div
                  key={i}
                  className="my-6 pl-6 border-l-4 border-acid bg-gray-50 dark:bg-zinc-900/50 py-4 pr-4 rounded-r-lg italic text-slate-700 dark:text-slate-300 flex gap-3">
                  <Quote
                    size={20}
                    className="text-acid shrink-0 fill-current mt-1"
                  />
                  <div>{parseInline(quoteContent)}</div>
                </div>,
              );
              i++;
              continue;
            }

            // 3. List Detection
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              const listItems: React.ReactNode[] = [];
              while (
                i < lines.length &&
                (lines[i].trim().startsWith("- ") ||
                  lines[i].trim().startsWith("* "))
              ) {
                const content = lines[i].trim().replace(/^[-*]\s/, "");
                listItems.push(
                  <li
                    key={i}
                    className="ml-2 mb-2 font-medium flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black dark:bg-acid shrink-0"></span>
                    <span className="flex-1">{parseInline(content)}</span>
                  </li>,
                );
                i++;
              }
              elements.push(
                <ul key={blockIndex * 1000 + i} className="my-4 pl-2 space-y-1">
                  {listItems}
                </ul>,
              );
              continue;
            }

            // 4. Headings
            if (trimmed.startsWith("#")) {
              const level = trimmed.match(/^#+/)?.[0].length || 0;
              const text = trimmed.replace(/^#+\s/, "");

              if (level === 1) {
                elements.push(
                  <h1
                    key={i}
                    className="text-3xl md:text-4xl font-black mt-12 mb-6 uppercase tracking-tight text-black dark:text-white border-b-4 border-black dark:border-white pb-2">
                    {text}
                  </h1>,
                );
              } else if (level === 2) {
                elements.push(
                  <h2
                    key={i}
                    className="text-2xl font-black mt-10 mb-4 text-black dark:text-white flex items-center gap-2">
                    <span className="text-acid">#</span> {text}
                  </h2>,
                );
              } else {
                elements.push(
                  <h3
                    key={i}
                    className="text-lg md:text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-slate-100">
                    {text}
                  </h3>,
                );
              }
              i++;
              continue;
            }

            // 5. Paragraphs
            if (trimmed.length > 0) {
              elements.push(
                <p key={i} className="mb-4 leading-7 text-base md:text-lg">
                  {parseInline(line)}
                </p>,
              );
            }

            i++;
          }
          return <div key={blockIndex}>{elements}</div>;
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;
