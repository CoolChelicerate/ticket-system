"use client";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import LogTable from "./components/LogTable";
import LogModal from "./components/LogModal";
import Footer from "./components/Footer";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import "chartkick/chart.js";
import AgentTable from "./components/AgentsTable";

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
  category: string;
  description: string;
  status: string;
  dateReported: string;
  dateResolved: string;
};

const initialLogs: Log[] = [];

const emptyForm: Log = {
  name: "",
  category: "",
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

  const categoryCounts = logs.reduce(
    (acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  useEffect(() => {
    setIsChartReady(true);
  }, []);

  function loadSampleData() {
    fetch("data/sampleLogs.json")
      .then((res) => res.json())
      .then((data) => setLogs(data));

    fetch("/data/sampleAgents.json")
      .then((res) => res.json())
      .then((data) => setAgents(data));
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
      <Header />
      <Dashboard
        logs={logs}
        statusChartData={statusChartData}
        statusChartColors={statusChartColors}
        categoryCounts={categoryCounts}
        isChartReady={isChartReady}
        loadSampleData={loadSampleData}
        urgentLogs={urgentLogs}
        newLogs={newLogs}
        openLogs={openLogs}
        closedLogs={closedLogs}
      />
      <hr className="log-summary-hr" />
      <LogTable
        displayedLogs={displayedLogs}
        logs={logs}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={(i) => {
          setForm(logs[i]);
          setEditIndex(i);
          setShowModal(true);
        }}
        onAdd={() => setShowModal(true)}
      />
      <LogModal
        showModal={showModal}
        form={form}
        editIndex={editIndex}
        onSubmit={handleLogSubmit}
        onChange={handleObjectChange(setForm)}
        onClose={() => {
          setShowModal(false);
          setEditIndex(null);
          setForm(emptyForm);
        }}
      />
      <AgentTable agents={agents} />
      <Footer />
    </>
  );
}
