/** @format */

import React from "react";

interface Props {
  content: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  // Helper to parse bold, code, italics inside text
  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-acid-dark dark:text-acid font-bold font-mono text-sm">
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

    // Row 0 is Header
    // Row 1 is Separator (|---|) -> Skip
    // Row 2+ are Body

    const headerCells = rows[0]
      .split("|")
      .map(c => c.trim())
      .filter((c, i, arr) => (i !== 0 && i !== arr.length - 1) || c !== "");

    // Filter body rows to remove empty ones and split
    const bodyRows = rows.slice(2).map(row =>
      row
        .split("|")
        .map(c => c.trim())
        .filter((c, i, arr) => (i !== 0 && i !== arr.length - 1) || c !== ""),
    );

    return (
      <div
        key={key}
        className="overflow-x-auto my-8 rounded-xl border-4 border-black dark:border-zinc-700 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#555]">
        <table className="min-w-full divide-y-4 divide-black dark:divide-zinc-700 text-sm">
          <thead className="bg-acid text-black">
            <tr>
              {headerCells.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left font-black uppercase tracking-wider border-r-2 border-black last:border-r-0">
                  {parseInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black dark:divide-zinc-700 bg-white dark:bg-zinc-900">
            {bodyRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium border-r-2 border-gray-200 dark:border-zinc-700 last:border-r-0 leading-relaxed">
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

  // Split content by code blocks to avoid parsing markdown inside code
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose-custom max-w-none text-black dark:text-gray-200">
      {blocks.map((block, blockIndex) => {
        if (block.startsWith("```")) {
          // Code Block Rendering
          const lines = block.split("\n");
          const lang = lines[0].replace("```", "").trim();
          const codeContent = lines.slice(1, -1).join("\n");
          return (
            <div key={blockIndex} className="my-8 relative group">
              {lang && (
                <span className="absolute top-0 right-0 px-3 py-1 text-xs font-black text-white bg-black dark:bg-zinc-700 rounded-bl-lg border-l-2 border-b-2 border-white/10 uppercase tracking-widest">
                  {lang}
                </span>
              )}
              <pre className="!mt-0 !mb-0 !p-6 !rounded-xl !bg-black !text-acid !border-4 !border-black dark:!border-zinc-700 shadow-[6px_6px_0px_0px_#888] dark:shadow-none">
                <code className="!bg-transparent !p-0 !text-sm md:!text-base">
                  {codeContent}
                </code>
              </pre>
            </div>
          );
        } else {
          // Text Block Processing (Tables, Lists, Headings)
          const lines = block.split("\n");
          const elements: React.ReactNode[] = [];

          let i = 0;
          while (i < lines.length) {
            const line = lines[i];
            const trimmed = line.trim();

            // 1. Table Detection
            // Condition: Current line starts with | AND next line is separator |---|
            if (
              trimmed.startsWith("|") &&
              lines[i + 1]?.trim().startsWith("|") &&
              lines[i + 1].includes("---")
            ) {
              const tableRows: string[] = [];
              // Collect all table rows
              while (i < lines.length && lines[i].trim().startsWith("|")) {
                tableRows.push(lines[i]);
                i++;
              }
              elements.push(renderTable(tableRows, blockIndex * 1000 + i));
              continue;
            }

            // 2. List Detection (Bulleted)
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              const listItems: React.ReactNode[] = [];
              while (
                i < lines.length &&
                (lines[i].trim().startsWith("- ") ||
                  lines[i].trim().startsWith("* "))
              ) {
                const content = lines[i].trim().replace(/^[-*]\s/, "");
                listItems.push(
                  <li key={i} className="ml-2 pl-2 mb-2 font-medium">
                    <span className="mr-2 text-acid-dark dark:text-acid">
                      ●
                    </span>
                    {parseInline(content)}
                  </li>,
                );
                i++;
              }
              elements.push(
                <ul key={blockIndex * 1000 + i} className="my-4 pl-2">
                  {listItems}
                </ul>,
              );
              continue;
            }

            // 3. Headings
            if (trimmed.startsWith("#")) {
              const level = trimmed.match(/^#+/)?.[0].length || 0;
              const text = trimmed.replace(/^#+\s/, "");

              if (level === 1) {
                elements.push(
                  <h1
                    key={i}
                    className="text-4xl font-black mt-10 mb-6 uppercase tracking-tight">
                    {text}
                  </h1>,
                );
              } else if (level === 2) {
                elements.push(
                  <h2
                    key={i}
                    className="text-2xl font-black mt-8 mb-4 border-b-4 border-acid inline-block pr-6 py-1 text-black dark:text-white">
                    {text}
                  </h2>,
                );
              } else {
                elements.push(
                  <h3
                    key={i}
                    className="text-xl font-bold mt-6 mb-2 text-gray-800 dark:text-gray-100">
                    {text}
                  </h3>,
                );
              }
              i++;
              continue;
            }

            // 4. Paragraphs / Empty Lines
            if (trimmed.length > 0) {
              elements.push(
                <p key={i} className="mb-4 leading-relaxed text-lg">
                  {parseInline(line)}
                </p>,
              );
            } else {
              // Render line break for empty lines to maintain spacing
              // elements.push(<br key={i}/>);
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
