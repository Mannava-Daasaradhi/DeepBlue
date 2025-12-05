import React, { useRef, Suspense } from 'react';
<<<<<<< HEAD
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
=======
// Replacing 'react-force-graph-3d' with components from your existing stack:
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2

// --- Configuration for Node Styling based on Type ---
const NODE_STYLE_MAP = {
  // Key Structural Components (Large, Bright Blue)
  'function': { color: '#3B82F6', size: 1.0, text: 'Function' },    // Blue 500
  // Control Flow (Medium, Green/Yellow)
<<<<<<< HEAD
  'loop': { color: '#10B981', size: 0.8, text: 'Loop' },          // Emerald 500
  'decision': { color: '#F59E0B', size: 0.7, text: 'Decision' },      // Amber 500
  // Basic Operations (Small, Base Color)
  'statement': { color: '#F9FAFB', size: 0.5, text: 'Statement' },    // Gray 50
  // Default/Error
  'default': { color: '#ef4444', size: 0.5, text: 'Error' }        // Red 500
=======
  'loop': { color: '#10B981', size: 0.8, text: 'Loop' },         // Emerald 500
  'decision': { color: '#F59E0B', size: 0.7, text: 'Decision' },     // Amber 500
  // Basic Operations (Small, Base Color)
  'statement': { color: '#F9FAFB', size: 0.5, text: 'Statement' },    // Gray 50
  // Default/Error
  'default': { color: '#ef4444', size: 0.5, text: 'Error' }       // Red 500 for unhandled types
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2
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
<<<<<<< HEAD
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
=======
                <sphereGeometry args={[style.size * 0.1, 16, 16]} />
                <meshPhongMaterial color={style.color} emissive={style.color} emissiveIntensity={0.5} />
            </mesh>
            {/* Displaying the node label */}
            <Text
                fontSize={0.2}
                color="#FFFFFF"
                anchorX="center"
                anchorY="bottom"
                position={[0, style.size * 0.1 + 0.1, 0]}
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2
            >
                {label.split(':').pop().trim()}
            </Text>
        </group>
    );
};

/**
<<<<<<< HEAD
 * A basic scene to visualize the AST data.
=======
 * A basic scene to visualize the AST data using react-three-fiber.
 * This replaces the ForceGraph3D dependency to resolve the import error.
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2
 */
const BasicASTVisualization = ({ data }) => {
    const nodes = data.nodes || [];

    // Simple fixed positions for visualization of the initial structure
<<<<<<< HEAD
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
=======
    const nodePositions = [
        [0, 2, 0],   // Func: bubble_sort
        [0, 0, 0],   // Set n
        [-2, -2, 0], // Loop: i
        [2, -2, 0]   // Decision: If
    ];

    // Map your nodes to the fixed positions for a predictable, working display
    const positionedNodes = nodes.slice(0, 4).map((node, index) => ({
        ...node,
        position: nodePositions[index] || [0, 0, 0],
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2
    }));

    return (
        <>
<<<<<<< HEAD
            {/* Lighting Setup */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
            
            {/* Background Stars */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Render Nodes */}
=======
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2
            {positionedNodes.map((node) => (
                <GraphNode
                    key={node.id}
                    position={node.position}
                    type={node.type}
                    label={node.label}
                />
            ))}

<<<<<<< HEAD
            {/* Connection Lines */}
            {/* (Optional: Add Line components here connecting the positions) */}

=======
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2
            <OrbitControls enableDamping dampingFactor={0.05} />
        </>
    );
};

const CodeVisualizer = ({ data }) => {
  // Use data validation before proceeding to render
<<<<<<< HEAD
  const isValidData = data && data.nodes && data.nodes.length > 0;
=======
  const isValidData = data && data.nodes && data.links && data.nodes.length > 0;
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2

  // Render the Canvas only if we have valid visualization data
  if (!isValidData) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-slate-500">
<<<<<<< HEAD
        <div className="text-center">
            <p className="text-4xl mb-2">🧊</p>
            <p>No valid AST data available.</p>
            <p className="text-sm opacity-50">Hit "Analyze" to generate a scene.</p>
        </div>
=======
        <p>No valid AST data available. Hit "Analyze" to generate a scene.</p>
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Canvas 
<<<<<<< HEAD
        camera={{ position: [0, 0, 8], fov: 60 }} 
        style={{ background: '#00000000' }} // Transparent so parent div color shows
      >
        <Suspense fallback={<Text color="white">Loading 3D Scene...</Text>}>
=======
        camera={{ position: [0, 0, 5], fov: 75 }} 
        style={{ background: '#0f172a' }} // Deep Blue Background
      >
        <Suspense fallback={<Text color="white">Loading 3D Scene...</Text>}>
          {/* This uses our simple, compilation-safe visualization */}
>>>>>>> 865d223cebb83a68f882e37c16ef7c7021424db2
          <BasicASTVisualization data={data} /> 
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CodeVisualizer;