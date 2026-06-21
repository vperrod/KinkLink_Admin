import { useState } from "react";
import ReportedUsers from "../../components/moderation/ReportedUsers";

type TabType = "Users" | "Content" | "Comments";

const ModerationPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Users");

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-8 w-fit overflow-hidden">
        {(["Users", "Content", "Comments"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === tab
              ? "bg-[#FEE2E2] text-[#B91C1C]"
              : "text-gray-500 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "Users" && <ReportedUsers key="Users" filter="User" />}
        {activeTab === "Content" && <ReportedUsers key="Content" filter="Content" />}
        {activeTab === "Comments" && <ReportedUsers key="Comments" filter="Comment" />}
      </div>
    </div>
  );
};

export default ModerationPage;
