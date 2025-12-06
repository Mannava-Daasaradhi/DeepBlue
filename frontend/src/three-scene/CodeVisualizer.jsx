import React, { useRef, Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- Configuration for Node Styling based on Type ---
const NODE_STYLE_MAP = {
  'function': { color: '#3B82F6', size: 1.0, text: 'Function' },    // Blue
  'loop': { color: '#10B981', size: 0.8, text: 'Loop' },          // Emerald
  'decision': { color: '#F59E0B', size: 0.7, text: 'Decision' },      // Amber
  'statement': { color: '#F9FAFB', size: 0.5, text: 'Statement' },    // Gray
  'operation': { color: '#EC4899', size: 0.6, text: 'Operation' }, // Pink (New type added in AST Parser)
  'default': { color: '#ef4444', size: 0.5, text: 'Error' }        // Red
};

// =================================================================
// 3D Utility Components and Hooks
// =================================================================

/**
 * Custom Hook for a simple Force-Directed Layout Simulation.
 * Replaces heavy external libraries with light, controllable physics.
 */
const useForceLayout = (initialNodes, initialLinks) => {
    const [positionedNodes, setPositionedNodes] = useState([]);
    const nodesRef = useRef(new Map());

    // Initialize positions randomly on first data load
    useEffect(() => {
        const newNodes = initialNodes.map(node => {
            const existing = nodesRef.current.get(node.id);
            // Initialize or reuse last known position for smooth transitions
            const position = existing ? existing.position : [
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 6
            ];
            
            // Velocity for physics simulation
            const velocity = existing ? existing.velocity : [0, 0, 0];
            
            return {
                ...node,
                position,
                velocity,
            };
        });
        setPositionedNodes(newNodes);
        newNodes.forEach(node => nodesRef.current.set(node.id, node));
    }, [initialNodes]); // Re-run when incoming nodes data changes

    // Physics Update Loop
    useFrame((_, delta) => {
        if (positionedNodes.length === 0) return;

        // Prevent delta spiking causing explosions
        const safeDelta = Math.min(delta, 0.05); 

        const simulationNodes = [...positionedNodes];
        const k = 0.05; // Force scale factor
        const damping = 0.9; // Friction/damping

        // Create a temporary map for fast lookups
        const nodeMap = new Map(simulationNodes.map(n => [n.id, n]));

        // 1. Repulsion Force (Nodes repel each other)
        for (let i = 0; i < simulationNodes.length; i++) {
            const nodeA = simulationNodes[i];
            let forceX = 0, forceY = 0, forceZ = 0;

            for (let j = 0; j < simulationNodes.length; j++) {
                if (i === j) continue;
                const nodeB = simulationNodes[j];
                
                const dx = nodeA.position[0] - nodeB.position[0];
                const dy = nodeA.position[1] - nodeB.position[1];
                const dz = nodeA.position[2] - nodeB.position[2];
                const distanceSq = dx * dx + dy * dy + dz * dz;

                if (distanceSq > 0.001) {
                    const distance = Math.sqrt(distanceSq);
                    // Repulsion force inverse square law
                    const strength = -k * 2 / distance; 
                    forceX += strength * dx / distance;
                    forceY += strength * dy / distance;
                    forceZ += strength * dz / distance;
                }
            }

            // 2. Center/Drag Force (Pulls nodes toward the origin to prevent drift)
            forceX -= nodeA.position[0] * 0.01;
            forceY -= nodeA.position[1] * 0.01;
            forceZ -= nodeA.position[2] * 0.01;
            
            // 3. Update Velocity (Euler integration)
            nodeA.velocity[0] = (nodeA.velocity[0] + forceX * safeDelta) * damping;
            nodeA.velocity[1] = (nodeA.velocity[1] + forceY * safeDelta) * damping;
            nodeA.velocity[2] = (nodeA.velocity[2] + forceZ * safeDelta) * damping;
        }
        
        // 4. Attraction Force (Links pull nodes together)
        initialLinks.forEach(link => {
            const source = nodeMap.get(link.source);
            const target = nodeMap.get(link.target);

            if (source && target) {
                const dx = source.position[0] - target.position[0];
                const dy = source.position[1] - target.position[1];
                const dz = source.position[2] - target.position[2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // Attraction force linear law
                const strength = k * 0.5 * distance; 
                const scale = strength * safeDelta / distance;

                source.velocity[0] -= dx * scale;
                source.velocity[1] -= dy * scale;
                source.velocity[2] -= dz * scale;
                
                target.velocity[0] += dx * scale;
                target.velocity[1] += dy * scale;
                target.velocity[2] += dz * scale;
            }
        });

        // 5. Update Position
        const movedNodes = simulationNodes.map(node => ({
            ...node,
            position: [
                node.position[0] + node.velocity[0] * safeDelta * 10,
                node.position[1] + node.velocity[1] * safeDelta * 10,
                node.position[2] + node.velocity[2] * safeDelta * 10,
            ],
            velocity: node.velocity
        }));

        setPositionedNodes(movedNodes);
        movedNodes.forEach(node => nodesRef.current.set(node.id, node));
    });

    return positionedNodes;
};

/**
 * Renders a line between two dynamically positioned nodes.
 */
const GraphLink = React.memo(({ startPos, endPos }) => {
    // Only draw if both positions are valid
    if (!startPos || !endPos) return null;

    const points = [
        new THREE.Vector3(...startPos),
        new THREE.Vector3(...endPos)
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial attach="material" color="#334155" linewidth={1} transparent opacity={0.7} />
        </lineSegments>
    );
});

/**
 * Renders a single node with type-specific styling.
 */
const GraphNode = React.memo(({ position, type, label }) => {
    const style = NODE_STYLE_MAP[type?.toLowerCase()] || NODE_STYLE_MAP.default;
    const meshRef = useRef();
    
    // Slight rotation for visual interest
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef} position={[0, 0, 0]}>
                {/* Safe Sphere Geometry */}
                <sphereGeometry args={[style.size * 0.3, 16, 16]} />
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
                fontSize={0.2}
                color="#FFFFFF"
                anchorX="center"
                anchorY="top"
                position={[0, -style.size * 0.3 - 0.1, 0]} // Position text below node
                maxWidth={3}
            >
                {/* Clean up the label: removes the prefix e.g., "Func: " */}
                {label.split(':').slice(1).join(':').trim()}
            </Text>
        </group>
    );
});


/**
 * The main 3D scene that processes and renders the AST data using force layout.
 */
const DynamicASTVisualization = ({ data }) => {
    // Use the force layout hook to calculate node positions
    const positionedNodes = useForceLayout(data.nodes, data.links);

    // Create a map for quick lookups of node positions by ID
    const positionedNodesMap = new Map(positionedNodes.map(n => [n.id, n]));
    
    // Prepare link data
    const renderableLinks = data.links.map(link => {
        const sourceNode = positionedNodesMap.get(link.source);
        const targetNode = positionedNodesMap.get(link.target);

        return {
            key: `${link.source}-${link.target}`,
            startPos: sourceNode ? sourceNode.position : null,
            endPos: targetNode ? targetNode.position : null,
        };
    }).filter(link => link.startPos && link.endPos); // Filter out links with missing nodes

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

            {/* Render Links */}
            {renderableLinks.map((link) => (
                <GraphLink
                    key={link.key}
                    startPos={link.startPos}
                    endPos={link.endPos}
                />
            ))}

            {/* Orbital Controls */}
            <OrbitControls enableDamping dampingFactor={0.05} />
        </>
    );
};

const CodeVisualizer = ({ data }) => {
  // Check for valid data or error messages from the backend
  const isValidData = data && data.nodes && data.nodes.length > 0 && !data.error;

  if (!isValidData) {
    const message = data && data.error 
        ? `Visualization Error: ${data.error}`
        : 'Hit "Analyze" to generate a structure.';
        
    return (
      <div className="absolute inset-0 flex items-center justify-center text-slate-500">
        <div className="text-center p-4">
            <p className="text-4xl mb-2">🧊</p>
            <p>{message}</p>
            {data && data.error && (
                 <p className="text-sm opacity-50 mt-2">Check code for syntax errors.</p>
            )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }} 
        // Set background to transparent so the parent div's color shows through
        style={{ background: '#00000000' }} 
      >
        <Suspense fallback={<Text color="white">Loading 3D Scene...</Text>}>
          <DynamicASTVisualization data={data} /> 
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CodeVisualizer;