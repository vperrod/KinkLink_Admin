import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllReportsApi, takeReportActionApi } from "../../api/usersapi";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "../ui/pagination/Pagination";
import {
  IoSearchOutline,
  IoChevronDownOutline,
  IoTriangle,
  IoCloseOutline,
} from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";

const IMAGE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/profileImage/`;

const getReasonStyles = (reason: string) => {
  const r = reason?.toLowerCase();
  if (r?.includes("bullying")) return "bg-[#FEF3C7] text-[#D97706]";
  if (r?.includes("fake") || r?.includes("catfish")) return "bg-[#FEE2E2] text-[#EF4444]";
  if (r?.includes("spam")) return "bg-[#FFEDD5] text-[#9A3412]";
  if (r?.includes("underage")) return "bg-[#F3E8FF] text-[#7E22CE]";
  if (r?.includes("hooker") || r?.includes("money")) return "bg-[#ECFCCB] text-[#4D7C0F]";
  if (r?.includes("promote")) return "bg-[#FFEDD5] text-[#9A3412]";
  if (r?.includes("asking for fake")) return "bg-[#FCE7F3] text-[#BE185D]";
  return "bg-[#F5F5F4] text-[#44403C]";
};

const ReportedUsers = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [activePanelTab, setActivePanelTab] = useState<"Profile" | "Report">("Profile");
  const [suspensionDays, setSuspensionDays] = useState<number>(30);
  const [actionLoading, setActionLoading] = useState(false);

  const limit = 10;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllReportsApi({
        page: currentPage,
        limit,
        search: searchQuery,
      });
      if (response.success) {
        setReports(response.data || []);
        setTotalPages(response.pagination.totalPages || 0);
        setTotalItems(response.pagination.totalCount || (response.pagination.totalPages * limit));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleAction = async (action: "Dismiss" | "Warning_1" | "Warning_2" | "Suspension" | "Permanent_Ban") => {
    if (!selectedReport) return;

    setActionLoading(true);
    try {
      const response = await takeReportActionApi({
        reportId: selectedReport._id,
        action,
        reason: selectedReport.reason,
        suspensionDays: action === "Suspension" ? suspensionDays : undefined
      });

      if (response.success) {
        toast.success(response.message);
        setSelectedReport(null);
        fetchReports(); // Refresh list
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to take action");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "pending" || s === "under review")
      return "bg-[#FEF3C7] text-[#D97706]";
    if (s === "verified" || s === "approved" || s === "resolved")
      return "bg-[#DCFCE7] text-[#16A34A]";
    return "bg-[#FEE2E2] text-[#EF4444]";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* TABLE SECTION */}
      <div className={`space-y-6 transition-all duration-300 ${selectedReport ? 'lg:w-[65%]' : 'w-full'}`}>
        <div className="relative mb-6 max-w-md">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search reported users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-full shadow-sm focus:outline-none text-sm"
          />
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden pb-4 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-20 italic text-gray-400">
              Loading reported users...
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <svg className="text-5xl text-gray-300" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">No Reported Users</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">There are currently no reported users to review.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white border-b border-gray-50">
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="w-16 px-6 py-5 text-center">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-red-500" />
                      </TableCell>
                      {["Username", "Type", "Status", "Reason", "Reported by", "When", "Reports"].map((head) => (
                        <TableCell key={head} isHeader className="px-4 py-5 text-[#6B7280] font-normal text-sm">
                          <div className={`flex items-center gap-1 ${head === "Reports" ? "justify-end" : ""}`}>
                            {head}
                            {head !== "When" && head !== "Reports" && <IoChevronDownOutline className="text-gray-400" />}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {reports.map((report: any, index: number) => {
                      const user = report.reportedUser || {};
                      const reporter = report.reportedBy || {};
                      const displayName = user.role === "Business" ? user.businessProfile?.businessName || user.businessName || user.username || user.name || "N/A" : user.username || user.name || "N/A";
                      const profileImg = user.role === "Business" ? user.businessProfile?.profileImg : user.personProfile?.profileImg;
                      const status = report.status || user.verification?.overallStatus || user.status || "Pending";

                      return (
                        <TableRow
                          key={report._id}
                          onClick={() => {
                            setSelectedReport(report);
                            setActivePanelTab("Profile");
                          }}
                          className={`cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${selectedReport?._id === report._id ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}
                        >
                          <TableCell className="px-6 py-4 text-center">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#22D3EE] overflow-hidden flex items-center justify-center">
                                {profileImg ? <img src={`${IMAGE_BASE_URL}${profileImg}`} alt={displayName} className="w-full h-full object-cover" /> : <span className="text-white font-bold text-xs uppercase">{String(displayName).substring(0, 2)}</span>}
                              </div>
                              <span className="text-[#374151] font-medium text-sm truncate max-w-[120px]">{displayName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-[#4B5563] text-sm">{report.type || user.role || "User"}</TableCell>
                          <TableCell className="px-4 py-4">
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight ${getStatusStyles(status)}`}>{status}</span>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${getReasonStyles(report.reason)}`}>{report.reason || "Other"}</span>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-[#4B5563] text-sm">{reporter.name || reporter.username || "System"}</TableCell>
                          <TableCell className="px-4 py-4 text-[#9CA3AF] text-sm">{report.createdAt ? `${formatDistanceToNow(new Date(report.createdAt))} ago` : "-"}</TableCell>
                          <TableCell className="px-4 py-4 pr-10">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[#374151] font-medium">{user.totalReportCount || 1}</span>
                              {(user.totalReportCount > 3 || index === 2) && <IoTriangle className="text-[#EF4444] text-lg bg-[#FEE2E2] rounded p-0.5" />}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {reports.length > 0 && (
                <div className="mt-4 px-4">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={totalItems} itemsPerPage={limit} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* SIDE PANEL SECTION */}
      {selectedReport && (
        <div className="w-full lg:w-[35%] animate-in slide-in-from-right duration-300">
          <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden sticky top-8">
            {/* Header */}
            <div className="p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#22D3EE] overflow-hidden flex items-center justify-center">
                  <span className="text-white font-bold text-lg uppercase">
                    {(selectedReport.reportedUser?.username || selectedReport.reportedUser?.name || "U")[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedReport.reportedUser?.username || selectedReport.reportedUser?.name}</h3>
                  <p className="text-gray-500 text-sm">Male</p>
                  <p className="text-gray-400 text-xs mt-0.5">Created {formatDistanceToNow(new Date(selectedReport.reportedUser?.createdAt || Date.now()))} ago</p>
                </div>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <IoCloseOutline size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 flex border-b border-gray-100">
              {["Profile", "Report"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePanelTab(tab as any)}
                  className={`flex-1 py-4 text-sm font-medium transition-all relative ${activePanelTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab}
                  {activePanelTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="p-6 h-[450px] overflow-y-auto custom-scrollbar">
              {activePanelTab === "Profile" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 text-xs font-medium text-gray-400 uppercase tracking-wider px-2">
                    <div>Reason</div>
                    <div>When</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { reason: "Harassment", when: "29.12.25", action: "Warning 1", color: "text-[#D97706] bg-[#FEF3C7]" },
                      { reason: "Other", when: "20.12.25", action: "Dismiss report", color: "text-[#16A34A] bg-[#DCFCE7]" }
                    ].map((item, idx) => (
                      <div key={idx} className="grid grid-cols-3 items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                        <div className="text-sm text-gray-700 font-medium">{item.reason}</div>
                        <div className="text-sm text-gray-500">{item.when}</div>
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${item.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.color.split(' ')[0].replace('text-', 'bg-')}`} />
                            {item.action}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Reported by</p>
                    <div className="flex flex-wrap gap-2">
                      {["username1", "username2", "username3", "username4", "username5"].map((u, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-700 border border-gray-100">
                          <div className={`w-2 h-2 rounded-full ${['bg-[#22D3EE]', 'bg-[#16A34A]', 'bg-[#D97706]', 'bg-[#EF4444]', 'bg-[#8B5CF6]'][i]}`} />
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Reason</p>
                    <p className="text-[#D97706] font-bold">{selectedReport.reason}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Message</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedReport.message || "No additional comments provided."}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Attachment</p>
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      <img src="https://via.placeholder.com/150" alt="attachment" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {activePanelTab === "Report" && (
              <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-4">
                {actionLoading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent animate-spin rounded-full" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("Dismiss")}
                    className="flex-1 bg-[#DCFCE7] text-[#16A34A] py-3 rounded-xl text-sm font-bold transition-transform active:scale-95 disabled:opacity-50"
                  >
                    Dismiss
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("Warning_1")}
                    className="flex-1 bg-[#FEF3C7] text-[#D97706] py-3 rounded-xl text-sm font-bold transition-transform active:scale-95 disabled:opacity-50"
                  >
                    Warning 1
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("Warning_2")}
                    className="flex-1 bg-[#FFEDD5] text-[#9A3412] py-3 rounded-xl text-sm font-bold transition-transform active:scale-95 disabled:opacity-50"
                  >
                    Warning 2
                  </button>
                </div>
                <div className="flex gap-2">
                  <select
                    disabled={actionLoading}
                    value={suspensionDays}
                    onChange={(e) => setSuspensionDays(Number(e.target.value))}
                    className="flex-1 bg-[#FEE2E2] text-[#EF4444] px-4 py-3 rounded-xl text-sm font-bold appearance-none outline-none cursor-pointer disabled:opacity-50"
                  >
                    <option value={1}>1 Day</option>
                    <option value={7}>7 Days</option>
                    <option value={30}>30 Days</option>
                    <option value={90}>90 Days</option>
                  </select>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("Suspension")}
                    className="flex-1 bg-[#EF4444] text-white py-3 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors active:scale-95 disabled:opacity-50"
                  >
                    Suspend
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("Permanent_Ban")}
                    className="flex-1 bg-[#374151] text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors active:scale-95 disabled:opacity-50"
                  >
                    Delete/Ban
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedUsers;
