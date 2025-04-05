import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidDiagram = ({ content }) => {
  const containerRef = useRef(null);
  const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      });

      try {
        // Clear previous content
        containerRef.current.innerHTML = '';
        
        // Create a div for mermaid to render into
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = content;
        containerRef.current.appendChild(div);
        
        // Render the diagram
        mermaid.init(undefined, div);
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error);
        containerRef.current.innerHTML = `<pre>${content}</pre>`;
      }
    }
  }, [content]);

  return <div ref={containerRef} className="mermaid-container"></div>;
};

export default MermaidDiagram;