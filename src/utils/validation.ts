import type { Node, Edge } from 'reactflow';

// Returns true if adding the edge would create a cycle
export function wouldCreateCycle(_nodes: Node[], edges: Edge[], source: string, target: string): boolean {
  // Simple DFS to check if target can reach source
  const visited = new Set<string>();
  function dfs(nodeId: string): boolean {
    if (nodeId === source) return true;
    visited.add(nodeId);
    for (const edge of edges) {
      if (edge.source === nodeId && !visited.has(edge.target)) {
        if (dfs(edge.target)) return true;
      }
    }
    return false;
  }
  return dfs(target);
}

// Validates the flow for saving
export function validateFlow(nodes: Node[], edges: Edge[]): { valid: boolean; error?: string } {
  if (nodes.length <= 1) {
    return { valid: false, error: 'At least 2 nodes required.' };
  }
  // Count incoming and outgoing edges for each node
  const inCount: Record<string, number> = {};
  const outCount: Record<string, number> = {};
  nodes.forEach(n => {
    inCount[n.id] = 0;
    outCount[n.id] = 0;
  });
  edges.forEach(e => {
    inCount[e.target] = (inCount[e.target] || 0) + 1;
    outCount[e.source] = (outCount[e.source] || 0) + 1;
  });
  // Exactly one start node (zero incoming)
  const startNodes = nodes.filter(n => inCount[n.id] === 0);
  if (startNodes.length !== 1) {
    return { valid: false, error: 'There must be exactly one start node (zero incoming edges).' };
  }
  // Exactly one end node (zero outgoing)
  const endNodes = nodes.filter(n => outCount[n.id] === 0);
  if (endNodes.length !== 1) {
    return { valid: false, error: 'There must be exactly one end node (zero outgoing edges).' };
  }
  // All other nodes must have at least one incoming and one outgoing edge
  const middleNodes = nodes.filter(n => inCount[n.id] > 0 && outCount[n.id] > 0);
  if (middleNodes.length !== nodes.length - 2) {
    return { valid: false, error: 'All other nodes must have at least one incoming and one outgoing edge.' };
  }
  return { valid: true };
} 