import "chartkick/chart.js";
import dynamic from "next/dynamic";
import { Log } from "../types";

type PieChartProps = {
  data: Record<string, number>;
  colors?: string[];
};

const PieChart = dynamic<PieChartProps>(
  () => import("react-chartkick").then(({ PieChart }) => PieChart),
  { ssr: false },
);

type DashboardProps = {
  logs: Log[];
  statusChartData: Record<string, number>;
  statusChartColors: string[];
  categoryCounts: Record<string, number>;
  isChartReady: boolean;
  loadSampleData: () => void;
  urgentLogs: number;
  newLogs: number;
  openLogs: number;
  closedLogs: number;
};

export default function Dashboard({
  logs,
  statusChartData,
  statusChartColors,
  categoryCounts,
  isChartReady,
  loadSampleData,
  urgentLogs,
  newLogs,
  openLogs,
  closedLogs,
}: DashboardProps) {
  return (
    <>
      <button
        onClick={loadSampleData}
        style={{ marginBottom: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Load Sample Data
      </button>
      <div className="dashboard">
        {/* Report Status pie chart */}
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

        <div className="dash-col" id="dash-freq">
          Frequent Issues by Category
          {logs.length > 0 ? (
            <ul>
              {Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count], i) => (
                  <li key={i}>
                    <span
                      className={`category-pill ${category.toLowerCase().replace("-", "")}`}
                    >
                      {category}
                    </span>
                    : {count}
                  </li>
                ))}
            </ul>
          ) : (
            <p style={{ fontSize: "14px" }}>No data yet</p>
          )}
        </div>
      </div>
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
    </>
  );
}
