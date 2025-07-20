import React from 'react';

interface SettingsPanelProps {
  text: string;
  onChange: (value: string) => void;
}

// Sidebar for editing the selected node's text
const SettingsPanel: React.FC<SettingsPanelProps> = ({ text, onChange }) => {
  return (
    <aside className="w-56 p-4 border-l bg-white h-full flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Message</h2>
      <label className="text-sm font-medium mb-1" htmlFor="node-text">Text</label>
      <textarea
        id="node-text"
        className="border rounded p-2 min-h-[80px] resize-none text-sm"
        value={text}
        onChange={e => onChange(e.target.value)}
      />
    </aside>
  );
};

export default SettingsPanel; 