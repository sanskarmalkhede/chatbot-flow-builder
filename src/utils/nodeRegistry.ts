// Node registry for extensibility
import TextNode from '../components/nodes/TextNode';

// Registry object for node types
export const nodeRegistry: Record<string, {
  type: string;
  label: string;
  component: any;
  defaultData: { text: string };
}> = {
  text: {
    type: 'text',
    label: 'Message',
    component: TextNode,
    defaultData: { text: 'New message' },
  },
};

// Helper to get node type by id
export function getNodeType(type: string) {
  return nodeRegistry[type];
} 