import { useState } from "react";
import "./dashboard.css";
const TABS = ["Tables", "Charts", "Graphs"];
import Table from './table/index';
import Graph from './graph/index';
import Chart from './chart/index';
const TAB_COMPONENTS = {
  Tables: Table,
  Charts: Chart,
  Graphs: Graph,
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const ActiveComponent = TAB_COMPONENTS[activeTab];
  const handleClick = (e) => {
    setActiveTab(e.target.textContent);
  };
  return (
    <div>
      <h2>Dashboard</h2>

      <div className="tabs-container">
        <div className="tabs-header">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={(e) => handleClick(e)}
            >
              {tab}

              {activeTab === tab && <span className="active-indicator" />}
            </button>
          ))}
        </div>

        <div className="tab-content" key={activeTab}>
         <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
