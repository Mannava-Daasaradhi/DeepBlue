import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';

// --- Configuration for Node Styling based on Type ---
const NODE_STYLE_MAP = {
  // Key Structural Components (Large, Bright Blue)
  'function': { color: '#3B82F6', size: 1.0, text: 'Function' },    // Blue 500
  // Control Flow (Medium, Green/Yellow)
  'loop': { color: '#10B981', size: 0.8, text: 'Loop' },          // Emerald 500
  'decision': { color: '#F59E0B', size: 0.7, text: 'Decision' },      // Amber 500
  // Basic Operations (Small, Base Color)
  'statement': { color: '#F9FAFB', size: 0.5, text: 'Statement' },    // Gray 50
  // Default/Error
  'default': { color: '#ef4444', size: 0.5, text: 'Error' }        // Red 500
};

/**
 * Renders a single node with type-specific styling.
 */
const GraphNode = ({ position, type, label }) => {
    const style = NODE_STYLE_MAP[type?.toLowerCase()] || NODE_STYLE_MAP.default;
    const meshRef = useRef();
    
    // Simple rotation animation for visual interest
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                {/* Changed to SphereGeometry to fix potential undefined geometry errors */}
                <sphereGeometry args={[style.size * 0.5, 32, 32]} />
                <meshStandardMaterial 
                    color={style.color} 
                    emissive={style.color} 
                    emissiveIntensity={0.6} 
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
            
            {/* Displaying the node label */}
            <Text
                fontSize={0.3}
                color="#FFFFFF"
                anchorX="center"
                anchorY="top"
                position={[0, -style.size * 0.6, 0]} // Position text below node
            >
                {label.split(':').pop().trim()}
            </Text>
        </group>
    );
};

/**
 * A basic scene to visualize the AST data.
 */
const BasicASTVisualization = ({ data }) => {
    const nodes = data.nodes || [];

    // Simple fixed positions for visualization of the initial structure
    // In the future, we can use a layout algorithm here
    const nodePositions = [
        [0, 2, 0],   // Top Center
        [0, 0, 0],   // Center
        [-2, -2, 0], // Bottom Left
        [2, -2, 0],  // Bottom Right
        [-3, 0, 0],  // Left
        [3, 0, 0]    // Right
    ];

    // Map your nodes to the fixed positions
    const positionedNodes = nodes.slice(0, 6).map((node, index) => ({
        ...node,
        position: nodePositions[index] || [Math.random()*4-2, Math.random()*4-2, Math.random()*4-2],
    }));

    return (
        <>
            {/* Lighting Setup */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
            
            {/* Background Stars */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Render Nodes */}
            {positionedNodes.map((node) => (
                <GraphNode
                    key={node.id}
                    position={node.position}
                    type={node.type}
                    label={node.label}
                />
            ))}

            {/* Connection Lines */}
            {/* (Optional: Add Line components here connecting the positions) */}

            <OrbitControls enableDamping dampingFactor={0.05} />
        </>
    );
};

const CodeVisualizer = ({ data }) => {
  // Use data validation before proceeding to render
  const isValidData = data && data.nodes && data.nodes.length > 0;

  // Render the Canvas only if we have valid visualization data
  if (!isValidData) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-slate-500">
        <div className="text-center">
            <p className="text-4xl mb-2">🧊</p>
            <p>No valid AST data available.</p>
            <p className="text-sm opacity-50">Hit "Analyze" to generate a scene.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }} 
        style={{ background: '#00000000' }} // Transparent so parent div color shows
      >
        <Suspense fallback={<Text color="white">Loading 3D Scene...</Text>}>
          <BasicASTVisualization data={data} /> 
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CodeVisualizer;