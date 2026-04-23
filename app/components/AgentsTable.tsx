import { Agent } from "../types";

type AgentTableProps = {
  agents: Agent[];
};

export default function AgentTable({ agents }: AgentTableProps) {
  return (
    <>
      <h2 className="agents-header">
        <i className="fa-solid fa-user-tie"></i> Agents
      </h2>
      <table className="agent-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent, i) => (
            <tr key={i}>
              <td>{agent.name}</td>
              <td>{agent.position}</td>
              <td>{agent.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
