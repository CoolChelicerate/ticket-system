'use client';

import { useEffect, useState } from "react";
import "./globals.css";

export default function Home() {
  let urgentLogs = 9, newLogs = 5, openLogs = 17, closedLogs = 184;
  return (
    <div>
      <h1>Customer Interaction Logger Application</h1>
      <hr />
      <div className="dashboard">
        <div className="dash-col">Report Status</div>
        <div className="dash-col">Frequent Issues</div>
        <div className="dash-col">Frequent Issues by Department</div>
      </div>
      <hr />
      <div className="log-summary">
        <div className="log-col">Urgent Logs: {urgentLogs}</div>
        <div className="log-col">New Logs: {newLogs}</div>
        <div className="log-col">Open Logs: {openLogs}</div>
        <div className="log-col">Closed Logs: {closedLogs}</div>     
      </div>
      <div>
        <h2>Logs</h2>
      </div>
      <div>
        <table className="log-table">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Group</th>
              <th>Report</th>
              <th>Status</th>
              <th>Date/Time Reported</th>
              <th>Date/Time Resolved</th>
              <th><button>+</button></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Employee</td>
              <td>Customer complains regarding restroom cleanliness</td>
              <td>Pending</td>
              <td>4/10/2026 9:21</td>
              <td>N/A</td>
              <td><button>Edit</button></td>
            </tr>
            <tr>
              <td>Jane Doe</td>
              <td>Employee</td>
              <td>Customer unhappy with current pinpad system</td>
              <td>Resolved</td>
              <td>3/23/2026 14:23</td>
              <td>3/28/2026 7:00</td>
              <td><button>Edit</button></td>
            </tr>
            <tr>
              <td>John Johnson</td>
              <td>Customer</td>
              <td>Water leaking near deli</td>
              <td>Urgent</td>
              <td>4/14/2026 20:04</td>
              <td>N/A</td>
              <td><button>Edit</button></td>
            </tr>
            </tbody>
          </table>
      </div>
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
