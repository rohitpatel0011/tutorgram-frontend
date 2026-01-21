import React from 'react';

interface Props {
  content: string;
}

// A simple regex-based renderer to avoid heavy dependencies for this demo.
// In a full production app, usage of 'react-markdown' is recommended.
const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  
  // Basic sanitization and processing
  const processLine = (line: string, index: number) => {
    // Headings
    if (line.startsWith('### ')) return <h3 key={index}>{line.replace('### ', '')}</h3>;
    if (line.startsWith('## ')) return <h2 key={index}>{line.replace('## ', '')}</h2>;
    if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold mb-4">{line.replace('# ', '')}</h1>;
    
    // List items
    if (line.startsWith('- ')) return <li key={index}>{parseInline(line.replace('- ', ''))}</li>;
    
    // Empty lines
    if (line.trim() === '') return <br key={index} />;

    return <p key={index}>{parseInline(line)}</p>;
  };

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  // Split by code blocks first
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose-custom">
      {blocks.map((block, i) => {
        if (block.startsWith('```')) {
          // Extract language if present (e.g., ```js)
          const lines = block.split('\n');
          const codeContent = lines.slice(1, -1).join('\n'); // remove first (```lang) and last (```)
          return (
            <pre key={i}>
              <code>{codeContent}</code>
            </pre>
          );
        } else {
            // Text block, handle lists correctly
            const lines = block.split('\n');
            const elements: React.ReactNode[] = [];
            let inList = false;
            let listItems: React.ReactNode[] = [];

            lines.forEach((line, idx) => {
                 if (line.trim().startsWith('- ')) {
                     if (!inList) inList = true;
                     listItems.push(processLine(line, i * 1000 + idx));
                 } else {
                     if (inList) {
                         elements.push(<ul key={`ul-${i}-${idx}`}>{listItems}</ul>);
                         listItems = [];
                         inList = false;
                     }
                     if (line.trim().length > 0) {
                        elements.push(processLine(line, i * 1000 + idx));
                     }
                 }
            });
            if (inList) {
                elements.push(<ul key={`ul-end-${i}`}>{listItems}</ul>);
            }

            return <div key={i}>{elements}</div>;
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;
