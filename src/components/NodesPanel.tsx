import React from 'react';
import { nodeRegistry } from '../utils/nodeRegistry';
import { MessageSquareMore } from 'lucide-react';

// Sidebar for dragging node types onto the canvas
const NodesPanel: React.FC = () => {
  // Only one node type for now, but extensible
  const nodeTypes = Object.values(nodeRegistry);

  // React Flow uses 'reactflow__node-draggable' class for drag sources
  return (
    <aside className="w-56 p-4 border-l bg-white h-full flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Nodes</h2>
      {nodeTypes.map((type) => (
        <div
          key={type.type}
          className="border rounded-lg px-4 py-3 bg-gray-50 cursor-grab hover:bg-gray-100 flex items-center gap-2 reactflow__node-draggable"
          draggable
          onDragStart={(e) => {
            // Set node type for React Flow's onDrop
            e.dataTransfer.setData('application/reactflow', type.type);
            e.dataTransfer.effectAllowed = 'move';
          }}
        >
          <MessageSquareMore className="text-xl" />
          <span className="font-medium">{type.label}</span>
        </div>
      ))}
    </aside>
  );
};

export default NodesPanel; 