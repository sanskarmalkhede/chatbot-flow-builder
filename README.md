# Chatbot Flow Builder

A minimal, extensible chatbot flow builder built with React, TypeScript, Vite, React Flow, Tailwind CSS, and Lucide icons.

## ✨ Features
- **Drag-and-drop canvas** for building chatbot flows visually
- **Message nodes**: Add, connect, and edit text nodes
- **Sidebar**: Drag new nodes or edit selected node text
- **Connect nodes** with arrows (edges)
- **Validation**: Enforces exactly one start node (no incoming edges) and one end node (no outgoing edges)
- **Cycle prevention**: Cannot create loops in the flow
- **Delete nodes/edges**: Via keyboard (Del) or trash icon
- **Save**: Exports the flow as a `flow.json` file
- **Modern UI**: Styled with Tailwind CSS and Lucide icons

## 🛠️ Tech Stack
- [React](https://react.dev/) (with hooks & functional components)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (for fast dev/build)
- [React Flow](https://reactflow.dev/) (for the graph/canvas)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)
- [Lucide React](https://lucide.dev/) (for icons)

## 📦 Project Structure
```
src/
  components/
    FlowBuilder.tsx        # Main builder logic
    NodesPanel.tsx         # Sidebar for node types
    SettingsPanel.tsx      # Sidebar for editing node text
    nodes/
      TextNode.tsx         # Custom Message node component
  utils/
    validation.ts          # Flow validation and cycle prevention
    nodeRegistry.ts        # Node type registry for extensibility
  App.tsx                  # App entry point
```

## 🚀 Getting Started

### 1. **Install dependencies**
```sh
npm install
```

### 2. **Run the development server**
```sh
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) in your browser.


## 🧩 Usage
- **Add nodes**: Drag "Message" from the sidebar onto the canvas.
- **Connect nodes**: Drag from the right handle (source) of one node to the left handle (target) of another.
- **Edit text**: Click a node to open the settings panel and edit its message.
- **Delete**: Select a node/edge and press `Del`, or use the trash icon on a selected node.
- **Save**: Click "Save Changes" to validate and download your flow as `flow.json`.

## 🧪 Validation Rules
- **Exactly one start node** (zero incoming edges)
- **Exactly one end node** (zero outgoing edges)
- **No cycles** (loops)
- **All other nodes** must have at least one incoming and one outgoing edge

## 🖌️ Customization & Extensibility
- To add new node types, register them in `src/utils/nodeRegistry.ts` and create a corresponding component in `src/components/nodes/`.
- All icons are from [Lucide React](https://lucide.dev/). You can swap or add icons as needed.
- Styling is handled via Tailwind CSS utility classes.

## 📝 License
MIT
