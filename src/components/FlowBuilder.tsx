import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import type { Connection, Node, ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';
import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';
import { nodeRegistry } from '../utils/nodeRegistry';
import { validateFlow, wouldCreateCycle } from '../utils/validation';

// Helper to generate unique node ids
let nodeId = 1;
const getId = () => `node_${nodeId++}`;

const FlowBuilder: React.FC = () => {
  // State for nodes, edges, selection, warnings
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Handle drag from NodesPanel
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowInstance) return;
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - (bounds?.left || 0),
      y: event.clientY - (bounds?.top || 0),
    });
    const nodeType = nodeRegistry[type];
    const newNode: Node = {
      id: getId(),
      type,
      position,
      data: { ...nodeType.defaultData },
    };
    setNodes((nds) => nds.concat(newNode));
    setSelected(newNode.id);
  }, [reactFlowInstance, setNodes]);

  // Allow drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Edge connection logic (prevent cycles, only one outgoing edge per node)
  const onConnect = useCallback((params: Connection) => {
    // Only one outgoing edge per source
    if (edges.some(e => e.source === params.source)) {
      setWarning('A node can have only one outgoing edge.');
      return;
    }
    // Prevent cycles
    if (wouldCreateCycle(nodes, edges, params.source!, params.target!)) {
      setWarning('Cannot create cycles in the flow.');
      return;
    }
    setEdges((eds) => addEdge(params, eds));
    setWarning(null);
  }, [edges, nodes, setEdges]);

  // Node selection
  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelected(node.id);
  }, []);

  // Deselect on canvas click
  const onPaneClick = useCallback(() => {
    setSelected(null);
  }, []);

  // Node text update
  const updateNodeText = (id: string, text: string) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, text } } : n));
  };

  // Node deletion (keyboard or trash button)
  const deleteSelected = useCallback(() => {
    if (!selected) return;
    setNodes((nds) => nds.filter(n => n.id !== selected));
    setEdges((eds) => eds.filter(e => e.source !== selected && e.target !== selected));
    setSelected(null);
  }, [selected, setNodes, setEdges]);

  // Keyboard delete
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selected) {
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, deleteSelected]);

  // Save/validate
  const onSave = () => {
    const result = validateFlow(nodes, edges);
    if (!result.valid) {
      setWarning(result.error || 'Cannot save Flow');
      return;
    }
    setWarning(null);
    // Download JSON
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Custom node types for React Flow
  const nodeTypes = React.useMemo(() => {
    return {
      text: (props: any) => {
        // Pass onDelete to node for trash button
        return (
          <nodeRegistry.text.component
            {...props}
            data={{
              ...props.data,
              onDelete: () => {
                setSelected(props.id);
                deleteSelected();
              },
            }}
            selected={selected === props.id}
          />
        );
      },
    };
  }, [selected, deleteSelected]);

  // Render
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
        <span className="text-xl font-semibold text-shadow-2xs">BiteSpeed Frontend Task - Chatbot Flow Builder</span>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium border border-blue-700"
          onClick={onSave}
        >
          Save Changes
        </button>
      </header>
      {/* Warning banner */}
      {warning && (
        <div className="bg-red-100 text-red-700 text-center py-2 font-medium">{warning}</div>
      )}
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: NodesPanel or SettingsPanel */}
        {selected ? (
          (() => {
            const node = nodes.find(n => n.id === selected);
            if (!node) return <NodesPanel />;
            return (
              <SettingsPanel
                text={node.data.text}
                onChange={text => updateNodeText(node.id, text)}
              />
            );
          })()
        ) : (
          <NodesPanel />
        )}
        {/* Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            selectionOnDrag
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e0e7ef" gap={16} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder; 