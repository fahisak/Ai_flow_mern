import React, {useState} from "react";
import ReactFlow, {useNodesState, useEdgesState} from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";
import axios from "axios";

const placeholderPrompt = "Prompt will appear here";
const placeholderResponse = "AI response will appear here.";

const initialNodes = [
  {
    id: "1",
    position: {x: 100, y: 100},
    type: "input",
    className: "node-input",
    data: {label: placeholderPrompt, content: ""},
  },
  {
    id: "2",
    position: {x: 500, y: 100},
    className: "node-output",
    data: {label: placeholderResponse, content: ""},
  },
];

const initialEdges = [{id: "e1-2", source: "1", target: "2", animated: true}];

function App() {
  const [prompt, setPrompt] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Run AI flow
  const runFlow = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt!");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ask-ai", {
        prompt,
      });
      const answer = res.data.answer.replace(/<[^>]*>/g, "").trim();

      setNodes([
        {
          id: "1",
          position: {x: 100, y: 100},
          type: "input",
          className: "node-input",
          data: {label: prompt, content: prompt},
        },
        {
          id: "2",
          position: {x: 500, y: 100},
          className: "node-output",
          data: {label: answer || placeholderResponse, content: answer || ""},
        },
      ]);

      // Clear input box after running
      setPrompt("");
    } catch (err) {
      console.error(err);
      alert("Error fetching AI response");
    } finally {
      setLoading(false);
    }
  };

  // Save AI response
  const saveData = async () => {
    const responseNode = nodes.find((n) => n.id === "2")?.data?.content || "";
    const promptNode = nodes.find((n) => n.id === "1")?.data?.content || "";

    if (!promptNode.trim() || !responseNode.trim()) {
      return alert("Cannot save: Prompt and AI Response are required!");
    }

    setSaving(true);
    try {
      await axios.post("http://localhost:5000/api/save", {
        prompt: promptNode,
        response: responseNode,
      });
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container">
      <div className="controls">
        <input
          className="prompt-input"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runFlow();
          }}
        />
        <button
          className="btn-run"
          onClick={runFlow}
          disabled={loading || !prompt.trim()}
        >
          {loading ? "Running..." : "Run Flow"}
        </button>
        <button
          className="btn-save"
          onClick={saveData}
          disabled={saving || loading}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="none"
        />
      </div>
    </div>
  );
}

export default App;
