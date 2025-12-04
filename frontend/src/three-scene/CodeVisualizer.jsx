import React, { useRef } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const CodeVisualizer = ({ data }) => {
  const fgRef = useRef();

  // SAMPLE DATA if none is provided (for testing)
  const initialData = data || {
    nodes: [
      { id: 'Func: main', group: 1 },
      { id: 'Loop: for i', group: 2 },
      { id: 'Decision: if', group: 3 },
      { id: 'Print: result', group: 1 }
    ],
    links: [
      { source: 'Func: main', target: 'Loop: for i' },
      { source: 'Loop: for i', target: 'Decision: if' },
      { source: 'Decision: if', target: 'Print: result' }
    ]
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={initialData}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalParticles={2} // Cool effect: particles flowing along lines
        linkDirectionalParticleSpeed={0.005}
        backgroundColor="#0f172a" // Matches your Deep Blue theme
        nodeResolution={16}
        onNodeClick={node => {
          // Aim at node on click
          const distance = 40;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

          fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
          );
        }}
      />
    </div>
  );
};

export default CodeVisualizer;