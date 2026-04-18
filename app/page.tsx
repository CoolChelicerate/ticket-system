'use client';

import { useEffect, useState } from "react";
import "./globals.css";

import { LineChart, PieChart } from 'react-chartkick'
import "chartkick/chart.js"

type Log = {
  name: string;
  group: string;
  description: string;
  status: string;
  dateReported: string;
  dateResolved: string;
}

const initialLogs: Log[] = [];

const emptyForm: Log = {
  name: "", group: "", description: "", status: "New",
  dateReported: "", dateResolved: "N/A",
};
 
export default function Home() {
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Log>(emptyForm);

  const urgentLogs = logs.filter(log => log.status === "Urgent").length;
  const newLogs = logs.filter(log => log.status === "New").length;
  const openLogs = logs.filter(log => log.status === "Open").length;
  const closedLogs = logs.filter(log => log.status === "Resolved").length;

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const statusChartData = {
    "Urgent": urgentLogs,
    "New": newLogs,
    "Open": openLogs,
    "Closed": closedLogs,
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
    setForm({...form, [e.target.name]: e.target.value});
  }

  function handleSubmit(e: React.ChangeEvent) {
    e.preventDefault();

    const now = new Date();
    const dateReported = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (editIndex !== null) {
      const updated = [...logs];
      updated[editIndex] = {...form, dateReported: logs[editIndex].dateReported};
      setLogs(updated);
      setEditIndex(null);
    } else {
    setLogs([...logs, {...form, dateReported}]);
    }

    setForm(emptyForm);
    setShowModal(false);
  }
  return (
    <div>
      <h1>Customer Interaction Logger Application</h1>
      <hr className="header-hr"/>

      <div className="dashboard">
        <div className="dash-col">Report Status
          <PieChart data={statusChartData} />
        </div>
        <div className="dash-col">Frequent Issues</div>
        <div className="dash-col">Frequent Issues by Department</div>
      </div>
      
      <hr className="log-summary-hr"/>
      <div className="log-summary">
        <div className="log-col" id="urgent-log-col">Urgent Logs: {urgentLogs}</div>
        <div className="log-col" id="new-log-col">New Logs: {newLogs}</div>
        <div className="log-col"id="open-log-col">Open Logs: {openLogs}</div>
        <div className="log-col" id="closed-log-col">Closed Logs: {closedLogs}</div>     
      </div>
      
      <h2>Logs</h2>
        <table className="log-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Group</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date/Time Reported</th>
              <th>Date/Time Resolved</th>
              <th><button onClick={() => setShowModal(true)}>+</button></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{log.name}</td>
                <td>{log.group}</td>
                <td>{log.description}</td>
                <td>{log.status}</td>
                <td>{log.dateReported}</td>
                <td>{log.dateResolved}</td>
                <td><button onClick={() => {
                  setForm(logs[i]);
                  setEditIndex(i);
                  setShowModal(true);
                }}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>New Log</h3>
              <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />

                <label>Group</label>
                <select name="group" value={form.group} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  <option value="Employee">Employee</option>
                  <option value="Customer">Customer</option>
                </select>

                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required />

                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="New">New</option>
                  <option value="Open">Open</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <label>Date/Time Resolved</label>
                <input name="dateResolved" value={form.dateResolved} onChange={handleChange} placeholder="N/A" />

                <div className="modal-actions">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
    
      <h2>Agents</h2>
      <table className="agent-table">
      <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th><button>+</button></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Custodian</td>
            <td>Sanitation</td>
            <td><button>Edit</button></td>
          </tr>
          <tr>
            <td>Jane Doe</td>
            <td>Manager</td>
            <td>Front End</td>
            <td><button>Edit</button></td>
          </tr>
          <tr>
            <td>Mary Alvarez</td>
            <td>Cashier</td>
            <td>Front End</td>
            <td><button>Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
