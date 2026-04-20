"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import "./globals.css";

import { LineChart } from "react-chartkick";
import "chartkick/chart.js";

type PieChartProps = {
  data: Record<string, number>;
  colors?: string[];
};

const PieChart = dynamic<PieChartProps>(
  () => import("react-chartkick").then(({ PieChart }) => PieChart),
  { ssr: false },
);

type Agent = {
  name: string;
  position: string;
  department: string;
};

type Log = {
  name: string;
  group: string;
  description: string;
  status: string;
  dateReported: string;
  dateResolved: string;
};

const initialLogs: Log[] = [];

const emptyForm: Log = {
  name: "",
  group: "",
  description: "",
  status: "New",
  dateReported: "",
  dateResolved: "N/A",
};

export default function Home() {
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Log>(emptyForm);
  const [isChartReady, setIsChartReady] = useState(false);
  const [filterBy, setFilterBy] = useState("none");
  const [searchTerm, setSearchTerm] = useState("");

  const urgentLogs = logs.filter((log) => log.status === "Urgent").length;
  const newLogs = logs.filter((log) => log.status === "New").length;
  const openLogs = logs.filter((log) => log.status === "Open").length;
  const closedLogs = logs.filter((log) => log.status === "Resolved").length;

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleInputChange =
    (setter: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleSelectChange =
    (setter: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
    };

  const handleObjectChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    };

  const displayedLogs = logs
    .filter((log) => {
      if (filterBy === "urgent") return log.status === "Urgent";
      if (filterBy === "new") return log.status === "New";
      if (filterBy === "open") return log.status === "Open";
      if (filterBy === "resolved") return log.status === "Resolved";
      if (filterBy === "recent") {
        const reported = new Date(log.dateReported);
        const now = new Date();
        const diffHours =
          (now.getTime() - reported.getTime()) / (1000 * 60 * 60);
        return diffHours <= 24;
      }
      return true;
    })
    .filter(
      (log) =>
        log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const statusChartData = {
    Urgent: urgentLogs,
    New: newLogs,
    Open: openLogs,
    Closed: closedLogs,
  };

  const statusChartColors = ["#b22222", "#006400", "#00008b", "#daa520"];

  useEffect(() => {
    setIsChartReady(true);
  }, []);

  function loadSampleData() {
    const sampleLogs: Log[] = [
      {
        name: "John Smith",
        group: "",
        description: "Login issue",
        status: "Resolved",
        dateReported: "4/19/2026 10:00",
        dateResolved: "4/19/2026 11:00",
      },
      {
        name: "Jane Doe",
        group: "",
        description: "Payment failed",
        status: "Open",
        dateReported: "4/19/2026 9:30",
        dateResolved: "N/A",
      },
      {
        name: "Bob Johnson",
        group: "",
        description: "Account locked",
        status: "Urgent",
        dateReported: "4/19/2026 8:45",
        dateResolved: "N/A",
      },
      {
        name: "Alice Brown",
        group: "",
        description: "Password reset",
        status: "New",
        dateReported: "4/19/2026 12:00",
        dateResolved: "N/A",
      },
      {
        name: "Charlie Wilson",
        group: "",
        description: "App crashes",
        status: "Open",
        dateReported: "4/18/2026 15:20",
        dateResolved: "N/A",
      },
      {
        name: "Diana Prince",
        group: "",
        description: "Feature request",
        status: "New",
        dateReported: "4/18/2026 14:10",
        dateResolved: "N/A",
      },
      {
        name: "Eve Adams",
        group: "",
        description: "Billing inquiry",
        status: "Resolved",
        dateReported: "4/17/2026 11:30",
        dateResolved: "4/17/2026 12:00",
      },
      {
        name: "Frank Miller",
        group: "",
        description: "Slow performance",
        status: "Urgent",
        dateReported: "4/17/2026 10:15",
        dateResolved: "N/A",
      },
      {
        name: "Grace Lee",
        group: "",
        description: "Data sync issue",
        status: "Open",
        dateReported: "4/16/2026 16:45",
        dateResolved: "N/A",
      },
      {
        name: "Henry Ford",
        group: "",
        description: "UI bug",
        status: "New",
        dateReported: "4/16/2026 13:20",
        dateResolved: "N/A",
      },
      {
        name: "Ivy Chen",
        group: "",
        description: "Email not received",
        status: "Resolved",
        dateReported: "4/15/2026 9:00",
        dateResolved: "4/15/2026 9:30",
      },
      {
        name: "Jack Ryan",
        group: "",
        description: "Security concern",
        status: "Urgent",
        dateReported: "4/15/2026 8:30",
        dateResolved: "N/A",
      },
      {
        name: "Kate Moss",
        group: "",
        description: "Mobile app issue",
        status: "Open",
        dateReported: "4/14/2026 17:10",
        dateResolved: "N/A",
      },
      {
        name: "Liam Neeson",
        group: "",
        description: "Account upgrade",
        status: "New",
        dateReported: "4/14/2026 14:45",
        dateResolved: "N/A",
      },
      {
        name: "Mia Khalifa",
        group: "",
        description: "Refund request",
        status: "Resolved",
        dateReported: "4/13/2026 12:00",
        dateResolved: "4/13/2026 12:30",
      },
      {
        name: "Noah Ark",
        group: "",
        description: "API error",
        status: "Urgent",
        dateReported: "4/13/2026 11:15",
        dateResolved: "N/A",
      },
      {
        name: "Olivia Pope",
        group: "",
        description: "Login timeout",
        status: "Open",
        dateReported: "4/12/2026 15:30",
        dateResolved: "N/A",
      },
      {
        name: "Peter Parker",
        group: "",
        description: "Spider sense tingling",
        status: "New",
        dateReported: "4/12/2026 13:00",
        dateResolved: "N/A",
      },
      {
        name: "Quinn Fabray",
        group: "",
        description: "Voice call issue",
        status: "Resolved",
        dateReported: "4/11/2026 10:45",
        dateResolved: "4/11/2026 11:15",
      },
      {
        name: "Ryan Gosling",
        group: "",
        description: "Profile update",
        status: "New",
        dateReported: "4/11/2026 9:20",
        dateResolved: "N/A",
      },
    ];

    const sampleAgents: Agent[] = [
      { name: "John Doe", position: "Custodian", department: "Sanitation" },
      { name: "Jane Doe", position: "Manager", department: "Front End" },
      { name: "Mary Alvarez", position: "Cashier", department: "Front End" },
      { name: "Bob Smith", position: "Developer", department: "Back End" },
      { name: "Alice Johnson", position: "Designer", department: "UI/UX" },
      { name: "Charlie Brown", position: "Analyst", department: "Data" },
      {
        name: "Diana Ross",
        position: "Support Lead",
        department: "Customer Service",
      },
      {
        name: "Eve Wilson",
        position: "QA Tester",
        department: "Quality Assurance",
      },
      {
        name: "Frank Sinatra",
        position: "DevOps Engineer",
        department: "Infrastructure",
      },
      {
        name: "Grace Hopper",
        position: "Senior Developer",
        department: "Back End",
      },
      {
        name: "Henry Ford",
        position: "Product Manager",
        department: "Product",
      },
      { name: "Ivy League", position: "Intern", department: "Front End" },
      {
        name: "Jack Sparrow",
        position: "Security Specialist",
        department: "Security",
      },
    ];

    setLogs(sampleLogs);
    setAgents(sampleAgents);
  }

  function handleLogSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const now = new Date();
    const dateReported = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (editIndex !== null) {
      const updated = [...logs];
      updated[editIndex] = {
        ...form,
        dateReported: logs[editIndex].dateReported,
      };
      setLogs(updated);
      setEditIndex(null);
    } else {
      setLogs([...logs, { ...form, dateReported }]);
    }

    setForm(emptyForm);
    setShowModal(false);
  }
  return (
    <>
      <Script
        src="https://kit.fontawesome.com/32c2532505.js"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <div>
        <h1 id="app-title">Customer Interaction Logger Application</h1>
      </div>
      <div className="topnav">
        <a className="active" href="#home">
          Home
        </a>
        <a href="#about">About</a>
        <a href="#profile">Profile</a>
        <a href="#settings">Settings</a>
      </div>
      <hr className="header-hr" />
      <h1>Dashboard</h1>
      <button
        onClick={loadSampleData}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        Load Sample Data
      </button>
      <div className="dashboard">
        <div className="dash-col">
          Report Status
          {isChartReady && (
            <PieChart data={statusChartData} colors={statusChartColors} />
          )}
        </div>
        <div className="dash-col" id="dash-urgent">
          Urgent Issues
          {logs.filter((log) => log.status === "Urgent").length > 0 ? (
            <ul className="urgent-list">
              {logs
                .filter((log) => log.status === "Urgent")
                .map((log, i) => (
                  <li key={i}>
                    {log.name} - {log.description}
                  </li>
                ))}
            </ul>
          ) : (
            <p style={{ fontSize: "25px" }}>All urgent issues resolved!</p>
          )}
        </div>
        <div className="dash-col">Frequent Issues by Department</div>
      </div>
      <hr className="log-summary-hr" />
      <div className="log-summary">
        <div className="log-col" id="urgent-log-col">
          <i className="fa-solid fa-circle-exclamation"></i> Urgent Logs:{" "}
          {urgentLogs}
        </div>
        <div className="log-col" id="new-log-col">
          <i className="fa-solid fa-star"></i> New Logs: {newLogs}
        </div>
        <div className="log-col" id="open-log-col">
          <i className="fa-solid fa-folder-open"></i>
          Open Logs: {openLogs}
        </div>
        <div className="log-col" id="closed-log-col">
          <i className="fa-solid fa-lock"></i>Closed Logs: {closedLogs}
        </div>
      </div>
      <h2 className="logs-header">
        <i className="fa-solid fa-file-lines"></i> Logs
        <select
          className="logs-filter-dropdown"
          value={filterBy}
          onChange={handleSelectChange(setFilterBy)}
        >
          <option value="none">All</option>
          <option value="urgent">Urgent</option>
          <option value="new">New</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="recent">Recent (last 24 hours)</option>
        </select>
        <input
          className="log-searchbar"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange(setSearchTerm)}
        ></input>
      </h2>

      <table className="log-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Date/Time Reported</th>
            <th>Date/Time Resolved</th>
            <th>
              <button
                className="new-log-button"
                onClick={() => setShowModal(true)}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedLogs.map((log, i) => (
            <tr key={i}>
              <td>{log.name}</td>
              <td id="log-desc">{log.description}</td>
              <td>{log.status}</td>
              <td>{log.dateReported}</td>
              <td>{log.dateResolved}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setForm(logs[i]);
                    setEditIndex(i);
                    setShowModal(true);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>New Log</h3>
            <form onSubmit={handleLogSubmit}>
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleObjectChange(setForm)}
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleObjectChange(setForm)}
                required
              />

              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleObjectChange(setForm)}
              >
                <option value="New">New</option>
                <option value="Open">Open</option>
                <option value="Urgent">Urgent</option>
                <option value="Resolved">Resolved</option>
              </select>

              <label>Date/Time Resolved</label>
              <input
                name="dateResolved"
                value={form.dateResolved}
                onChange={handleObjectChange(setForm)}
                placeholder="N/A"
              />

              <div className="modal-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h2 className="agents-header">
        <i className="fa-solid fa-user-tie"></i> Agents
      </h2>
      <table className="agent-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent, i) => (
            <tr key={i}>
              <td>{agent.name}</td>
              <td>{agent.position}</td>
              <td>{agent.department}</td>
              <td>
                <button className="edit-btn">
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
