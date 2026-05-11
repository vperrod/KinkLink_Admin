import { useState } from "react";
import ReportedUsers from "../../components/moderation/ReportedUsers";
import { IoFileTrayOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";

type TabType = "Users" | "Content" | "Comments";

const ModerationPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Users");

  const EmptyState = ({ type }: { type: string }) => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="bg-gray-50 p-6 rounded-full mb-4">
        {type === "Content" ? (
          <IoFileTrayOutline className="text-5xl text-gray-300" />
        ) : (
          <IoChatbubbleEllipsesOutline className="text-5xl text-gray-300" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-700">
        {type} Not Available
      </h3>
      <p className="text-gray-400 text-sm max-w-xs mx-auto">
        There is currently no {type.toLowerCase()} data to display in this
        section.
      </p>
    </div>
  );

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
        {activeTab === "Users" && <ReportedUsers />}
        {activeTab === "Content" && <EmptyState type="Content" />}
        {activeTab === "Comments" && <EmptyState type="Comments" />}
      </div>
    </div>
  );
};

export default ModerationPage;
