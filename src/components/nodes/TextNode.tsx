import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Trash2, MessageSquare, Circle } from 'lucide-react';

interface TextNodeData {
  text: string;
  selected?: boolean;
  onDelete?: () => void;
}

// The custom node component for 'Message' nodes
const TextNode: React.FC<NodeProps<TextNodeData>> = ({ data, selected }) => {
  return (
    <div className={`rounded-lg shadow-md bg-teal-100 border border-teal-200 px-4 py-2 min-w-[200px] relative transition-all ${selected ? 'ring-2 ring-blue-400' : ''}`}> 
      {/* Node label */}
      <div className="font-semibold flex items-center gap-2 mb-1">
        <MessageSquare className="inline-block text-teal-700 w-5 h-5" />
        <span className="inline-block text-teal-700">Send Message</span>
        {/* WhatsApp icon placeholder */}
        <span className="ml-auto text-green-500">
          <Circle className="w-4 h-4" fill="currentColor" />
        </span>
      </div>
      {/* Message text */}
      <div className="text-gray-800 text-sm whitespace-pre-line">{data.text || 'New message'}</div>
      {/* Trash button if selected */}
      {selected && (
        <button
          className="absolute top-1 right-1 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow"
          title="Delete node"
          onClick={data.onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      {/* Source handle (right) - only one outgoing edge allowed */}
      <Handle type="source" position={Position.Right} id="a" className="!bg-teal-400" />
      {/* Target handle (left) - multiple incoming edges allowed */}
      <Handle type="target" position={Position.Left} id="b" className="!bg-teal-400" />
    </div>
  );
};

export default TextNode; 