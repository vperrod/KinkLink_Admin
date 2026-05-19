import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllReportsApi, takeReportActionApi, getReportUserDetailApi, getTargetUserReportApi } from "../../api/usersapi";
import ImageModal from "../users/shared/ImageModal";
import { ReportHistoryItem } from "../../types/user.types";
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
  IoWarningOutline,
  IoCloseOutline,
  IoPerson,
} from "react-icons/io5";
import { formatDistanceToNow, format } from "date-fns";

const getActionStyles = (action: string) => {
  const a = action?.toLowerCase();
  if (a?.includes("warning")) return "text-[#D97706] bg-[#FEF3C7]";
  if (a?.includes("dismiss")) return "text-[#16A34A] bg-[#DCFCE7]";
  if (a?.includes("suspension") || a?.includes("suspend")) return "text-[#EF4444] bg-[#FEE2E2]";
  if (a?.includes("ban") || a?.includes("permanent") || a?.includes("delete")) return "text-white bg-[#374151]";
  if (a?.includes("delete_content")) return "text-[#EF4444] bg-[#FEE2E2]";
  return "text-gray-600 bg-gray-100";
};

const getTypeStyles = (type: string) => {
  const t = type?.toLowerCase();
  if (t === "user") return "text-blue-600 bg-blue-50 border-blue-100";
  if (t === "media") return "text-purple-600 bg-purple-50 border-purple-100";
  if (t === "post") return "text-pink-600 bg-pink-50 border-pink-100";
  if (t === "comment") return "text-orange-600 bg-orange-50 border-orange-100";
  return "text-gray-600 bg-gray-50 border-gray-100";
};

const IMAGE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/profileImage/`;
const REPORT_IMAGE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/reportImg/`;

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

interface ReportedUsersProps {
  filter?: "User" | "Content" | "Comment";
}

const ReportedUsers = ({ filter = "User" }: ReportedUsersProps) => {
  const navigate = useNavigate();
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
  const [history, setHistory] = useState<ReportHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [reporters, setReporters] = useState<any[]>([]);
  const [customReportDetails, setCustomReportDetails] = useState<any>(null);
  const [customDetailsLoading, setCustomDetailsLoading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const handleReporterClick = async (reporterUserId: string) => {
    setCustomDetailsLoading(true);
    try {
      const reportedUserId = selectedReport?.reportedUser?._id || "";
      const response = await getTargetUserReportApi(reportedUserId, reporterUserId);
      if (response.success && response.data) {
        setCustomReportDetails(response.data);
        setActivePanelTab("Report");
      } else {
        toast.error("Failed to fetch report details for this user");
      }
    } catch (error: any) {
      console.error("Error fetching reporter details:", error);
      toast.error("Failed to load reporter details");
    } finally {
      setCustomDetailsLoading(false);
    }
  };

  const limit = 10;

  const fetchHistory = async (userId: string) => {
    setHistoryLoading(true);
    try {
      const response = await getReportUserDetailApi(userId);
      if (response.success) {
        setHistory(response.data.history || []);
        setReporters(response.data.reporters || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch user history", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (selectedReport?.reportedUser?._id) {
      fetchHistory(selectedReport.reportedUser._id);
    }
  }, [selectedReport]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      // Map filter to backend types
      let typeParam = "";
      if (filter === "User") {
        typeParam = "User";
      } else if (filter === "Comment") {
        typeParam = "Comment";
      }
      // Note: We don't send typeParam for "Content" (Media/Post) because the 
      // backend returns null for comma-separated values like "Media,Post".
      // Instead, we fetch all and rely on the ultra-strict client-side filter below.

      const response = await getAllReportsApi({
        page: currentPage,
        limit,
        search: searchQuery,
        ...(typeParam ? { type: typeParam } : {}),
      });

      if (response.success) {
        const rawReports = response.data || [];

        // Apply ultra-strict filtering before setting state
        const filteredData = rawReports.filter((report: any) => {
          const rt = String(report.type || "").toLowerCase().trim();
          const ft = String(filter || "User").toLowerCase().trim();

          if (ft === "user") {
            // Include if explicitly "user" OR if type is missing (default behavior)
            return rt === "user" || rt === "";
          }
          if (ft === "content") {
            return rt === "post" || rt === "media";
          }
          if (ft === "comment") {
            return rt === "comment";
          }
          return false;
        });

        setReports(filteredData);
        setTotalPages(response.pagination.totalPages || 0);
        // Adjust total items based on filtered result if backend returned extra
        const adjustedTotal = (response.pagination.totalCount || (response.pagination.totalPages * limit));
        setTotalItems(Math.min(adjustedTotal, filteredData.length + (currentPage - 1) * limit));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filter, limit]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleAction = async (action: "Dismiss" | "Warning_1" | "Warning_2" | "Suspension" | "Permanent_Ban" | "Delete_Content", overrideDays?: number) => {
    if (!selectedReport) return;

    setActionLoading(true);
    try {
      const response = await takeReportActionApi({
        reportId: selectedReport._id,
        action,
        reason: selectedReport.reason,
        suspensionDays: action === "Suspension" ? (overrideDays || suspensionDays) : undefined
      });

      if (response.success) {
        toast.success(response.message);
        setSelectedReport(null);
        setCustomReportDetails(null);
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

  const reportType = String(selectedReport?.type || "").toLowerCase();
  const isContentOrComment = ["media", "post", "comment"].includes(reportType);

  return (
    <div className="relative w-full">
      {/* TABLE SECTION */}
      <div className="space-y-6 w-full min-w-0">
        <div className="relative mb-6 max-w-md">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder={`Search reported ${filter.toLowerCase()}...`}
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
              Loading reported {filter.toLowerCase()}...
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                {filter === "User" ? (
                  <svg className="text-5xl text-gray-300" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ) : filter === "Content" ? (
                  <svg className="text-5xl text-gray-300" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                ) : (
                  <svg className="text-5xl text-gray-300" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-700">No Reported {filter}</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">There are currently no reported {filter.toLowerCase()} to review.</p>
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
                      const totalReportCount = report.contentId?.totalReportCount || user.totalReportCount || report.totalReports || 1;

                      return (
                        <TableRow
                          key={report._id}
                          onClick={() => {
                            setSelectedReport(report);
                            setActivePanelTab("Profile");
                            setCustomReportDetails(null);
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
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/users/details/${user._id}`);
                                }}
                                className="text-[#374151] font-medium text-sm truncate max-w-[120px] hover:text-red-600 hover:underline cursor-pointer"
                              >
                                {displayName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getTypeStyles(report.type || "User")}`}>
                              {report.type || "User"}
                            </span>
                          </TableCell>
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
                              <span className="text-[#374151] font-medium">{totalReportCount}</span>
                              {(totalReportCount > 3 || index === 2) && <IoWarningOutline className="text-[#EF4444] text-lg bg-[#FEE2E2] rounded p-0.5" />}
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

      {/* SIDE PANEL OVERLAY/DRAWER */}
      {selectedReport && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/35 backdrop-blur-[2px] z-40 transition-opacity animate-in fade-in duration-200"
            onClick={() => { setSelectedReport(null); setCustomReportDetails(null); }}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md sm:max-w-lg bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-100 h-screen">
            {/* Header */}
            <div className="p-6 flex items-start justify-between border-b border-gray-50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#22D3EE] overflow-hidden flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg uppercase">
                    {(selectedReport.reportedUser?.username || selectedReport.reportedUser?.name || "U")[0]}
                  </span>
                </div>
                <div>
                  <h3
                    onClick={() => navigate(`/users/details/${selectedReport.reportedUser?._id}`)}
                    className="text-lg font-bold text-gray-900 hover:text-red-600 hover:underline cursor-pointer transition-colors"
                  >
                    {selectedReport.reportedUser?.username || selectedReport.reportedUser?.name || "Report Details"}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeStyles(selectedReport.type || "User")}`}>
                      {selectedReport.type || "User"} Report
                    </span>
                    <span className="text-gray-400 text-xs">
                      • Created {selectedReport.createdAt ? formatDistanceToNow(new Date(selectedReport.createdAt)) : "some time"} ago
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => { setSelectedReport(null); setCustomReportDetails(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 flex-shrink-0">
                <IoCloseOutline size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 flex border-b border-gray-100 flex-shrink-0 bg-white">
              {["Profile", "Report"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActivePanelTab(tab as any);
                    if (tab === "Report" && !customReportDetails && reporters.length > 0) {
                      handleReporterClick(reporters[0].userId);
                    }
                  }}
                  className={`flex-1 py-4 text-sm font-medium transition-all relative ${activePanelTab === tab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab}
                  {activePanelTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B91C1C] rounded-full" />}
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              {activePanelTab === "Profile" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 text-xs font-medium text-gray-400 uppercase tracking-wider px-2">
                    <div>Reason</div>
                    <div>When</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="space-y-2">
                    {historyLoading ? (
                      <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent animate-spin rounded-full" />
                      </div>
                    ) : history.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 text-sm italic">
                        No previous admin actions recorded.
                      </div>
                    ) : (
                      history.map((item) => (
                        <div key={item._id} className="grid grid-cols-3 items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                          <div className="text-sm text-gray-700 font-medium truncate pr-2" title={item.reason}>
                            {item.reason || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.createdAt ? format(new Date(item.createdAt), "dd.MM.yy") : "-"}
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getActionStyles(item.actionType)}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${getActionStyles(item.actionType).split(' ')[0].replace('text-', 'bg-')}`} />
                              {item.actionType?.replace('_', ' ') || "Action"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Reported by</p>
                    <div className="flex flex-wrap gap-2">
                      {historyLoading ? (
                        <span className="text-gray-400 text-xs italic animate-pulse">Loading reporters...</span>
                      ) : reporters && reporters.length > 0 ? (
                        reporters.map((reporter: any) => (
                          <span
                            key={reporter.userId}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-700 border border-gray-100 transition-colors"
                          
                          >
                            <div
                              onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/users/details/${reporter.userId}`);
                              }}
                              className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden cursor-pointer hover:scale-110 active:scale-95 transition-transform flex-shrink-0 flex items-center justify-center border border-gray-300"
                              title="View user details profile page"
                            >
                              {reporter.profileImg ? (
                                <img
                                  src={`${IMAGE_BASE_URL}${reporter.profileImg}`}
                                  alt="profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <IoPerson className="text-gray-400 text-[10px]" />
                              )}
                            </div>
                            <span
                              onClick={() => handleReporterClick(reporter.userId)}
                              className="cursor-pointer hover:text-red-600 hover:underline font-semibold"
                            >
                              {reporter.username || reporter.name || "User"}
                            </span>
                          </span>
                        ))
                      ) : selectedReport.reportedBy ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-700 border border-gray-100 transition-colors"
                          title="Click username to view report, avatar to view profile"
                        >
                          <div
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/users/details/${selectedReport.reportedBy._id}`);
                            }}
                            className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden cursor-pointer hover:scale-110 active:scale-95 transition-transform flex-shrink-0 flex items-center justify-center border border-gray-300"
                            title="View user details profile page"
                          >
                            {(selectedReport.reportedBy.profileImg || selectedReport.reportedBy.profileImage || selectedReport.reportedBy.personProfile?.profileImg) ? (
                              <img
                                src={`${IMAGE_BASE_URL}${selectedReport.reportedBy.profileImg || selectedReport.reportedBy.profileImage || selectedReport.reportedBy.personProfile?.profileImg}`}
                                alt="profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <IoPerson className="text-gray-400 text-[10px]" />
                            )}
                          </div>
                          <span
                            onClick={() => {
                                setCustomReportDetails(null);
                                setActivePanelTab("Report");
                            }}
                            className="cursor-pointer hover:text-red-600 hover:underline font-semibold"
                          >
                            {selectedReport.reportedBy.username || selectedReport.reportedBy.name || "User"}
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Anonymous / System</span>
                      )}
                    </div>
                  </div>

                  {customDetailsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 italic text-gray-400">
                      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent animate-spin rounded-full mb-3" />
                      Loading report details...
                    </div>
                  ) : (
                    <>
                      {customReportDetails && (
                        <div className="flex items-center justify-end mb-3 border-b border-gray-100 pb-2">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">
                            {Array.isArray(customReportDetails) ? `${customReportDetails.length} reports` : '1 report'}
                          </span>
                        </div>
                      )}

                      {customReportDetails ? (
                        Array.isArray(customReportDetails) ? (
                          <div className="space-y-4">
                            {customReportDetails.map((rep: any, idx: number) => {
                              const details = rep.details || {};
                              const attachment = details.reportImg || details.image;
                              return (
                                <div key={rep.reportId || idx} className="p-4 bg-gray-50 border border-gray-200/60 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                    <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded">Report #{idx + 1}</span>
                                    {details.date && (
                                      <span className="text-[10px] text-gray-400">
                                        {format(new Date(details.date), 'MMM d, yyyy h:mm a')}
                                      </span>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reason</p>
                                    <p className="text-[#D97706] font-bold text-sm uppercase">{details.reason || "Other"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Message</p>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{details.message || "No comments."}</p>
                                  </div>
                                  {attachment && (
                                    <div className="space-y-1 mt-2">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attachment</p>
                                      <div className=" flex items-center ">
                                        <img
                                          src={`${REPORT_IMAGE_BASE_URL}${attachment}`}
                                          alt="attachment"
                                          className="w-10 object-contain cursor-pointer hover:scale-105 transition-transform"
                                          onClick={() => setPreviewImageUrl(`${REPORT_IMAGE_BASE_URL}${attachment}`)}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Reason</p>
                              <p className="text-[#D97706] font-bold">
                                {customReportDetails.reason || "Other"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Message</p>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {customReportDetails.message || "No additional comments provided."}
                              </p>
                              {(customReportDetails.reportImg || customReportDetails.image) && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Attachment</p>
                                  <div className="w-full max-h-60 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                      src={`${REPORT_IMAGE_BASE_URL}${customReportDetails.reportImg || customReportDetails.image}`}
                                      alt="attachment"
                                      className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                                      onClick={() => setPreviewImageUrl(`${REPORT_IMAGE_BASE_URL}${customReportDetails.reportImg || customReportDetails.image}`)}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Reason</p>
                            <p className="text-[#D97706] font-bold">{selectedReport.reason || "Other"}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Message</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{selectedReport.message || "No additional comments provided."}</p>
                            {(selectedReport.reportImg || selectedReport.image) && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Attachment</p>
                                <div className="w-full max-h-60 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                  <img
                                    src={`${REPORT_IMAGE_BASE_URL}${selectedReport.reportImg || selectedReport.image}`}
                                    alt="attachment"
                                    className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => setPreviewImageUrl(`${REPORT_IMAGE_BASE_URL}${selectedReport.reportImg || selectedReport.image}`)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {activePanelTab === "Report" && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4 flex-shrink-0 relative">
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

                {isContentOrComment && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction("Delete_Content")}
                    className="w-full bg-[#FEE2E2] text-[#EF4444] py-3 rounded-xl text-sm font-bold hover:bg-[#FCA5A5] transition-colors active:scale-95 disabled:opacity-50 border border-[#FCA5A5]"
                  >
                    Delete Content
                  </button>
                )}

                <div className="flex gap-2">
                  <div className="flex-[2] relative">
                    <select
                      disabled={actionLoading}
                      value=""
                      onChange={(e) => {
                        const days = Number(e.target.value);
                        if (days) {
                          setSuspensionDays(days);
                          handleAction("Suspension", days);
                        }
                      }}
                      className="w-full bg-[#F97572CC] text-white px-4 py-3 rounded-xl text-sm font-bold appearance-none outline-none cursor-pointer hover:bg-[#F97572] transition-colors disabled:opacity-50 text-center"
                    >
                      <option value="" disabled className="text-black">Suspend</option>
                      <option value={1} className="text-black">1 Day</option>
                      <option value={7} className="text-black">7 Days</option>
                      <option value={30} className="text-black">30 Days</option>
                      <option value={90} className="text-black">90 Days</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                      <IoChevronDownOutline size={16} />
                    </div>
                  </div>
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
        </>
      )}
      {previewImageUrl && (
        <ImageModal
          imageUrl={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />
      )}
    </div>
  );
};

export default ReportedUsers;
