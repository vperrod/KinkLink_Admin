import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { getAllUsersApi } from "../../api/usersapi";
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
  IoFileTrayOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";

type TabType = "Users" | "Content" | "Comments";
const IMAGE_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/profileImage/`;

const AllUsersComponent = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("Users");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    if (activeTab !== "Users") return;
    setLoading(true);
    try {
      const response = await getAllUsersApi({
        page: currentPage,
        limit,
        search: searchQuery,
      });
      setUsers(response.users);
      setTotalUsers(response.totalUsers);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, activeTab]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "under review" || s === "verification requested" || s === "pending")
      return "bg-[#FEF3C7] text-[#D97706]";
    if (s === "verified" || s === "approved") return "bg-[#DCFCE7] text-[#16A34A]";
    return "bg-[#FEE2E2] text-[#EF4444]";
  };

  const totalPages = Math.ceil(totalUsers / limit);

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
      <div className="relative mb-6 max-w-md">
        <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-full shadow-sm focus:outline-none text-sm"
        />
      </div>

      <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1 mb-8 w-fit overflow-hidden">
        {(["Users", "Content", "Comments"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-3 rounded-xl transition-all text-sm font-medium ${
              activeTab === tab
                ? "bg-[#FEE2E2] text-[#B91C1C]"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden pb-4 min-h-[400px]">
        {activeTab === "Users" ? (
          <>
            {loading ? (
              <div className="flex justify-center py-20 italic text-gray-400">
                Loading users...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white border-b border-gray-50">
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="w-16 px-6 py-5 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 accent-red-500"
                        />
                      </TableCell>
                      {[
                        "Username",
                        "Type",
                        "Status",
                        "Role",
                        "Note",
                      ].map((head) => (
                        <TableCell
                          key={head}
                          isHeader
                          className="px-4 py-5 text-[#6B7280] font-normal text-sm"
                        >
                          <div className="flex items-center gap-1">
                            {head}
                            <IoChevronDownOutline className="text-gray-400" />
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {users.map((user) => {
                      const displayName =
                        user.role === "Business"
                          ? user.businessProfile?.businessName || user.businessName || user.username || user.name || "N/A"
                          : user.username || user.name || "N/A";

                      const profileImg =
                        user.role === "Business"
                          ? user.businessProfile?.profileImg
                          : user.personProfile?.profileImg;

                      const status =
                        user.verification?.overallStatus || user.status || "Unverified";

                      return (
                        <TableRow
                          key={user._id}
                          onClick={() => navigate(`/users/details/${user._id}`)}
                          className={`cursor-pointer border-b border-gray-50 last:border-0`}
                        >
                          <TableCell className="px-6 py-4 text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300"
                            />
                          </TableCell>

                          <TableCell className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#22D3EE] overflow-hidden flex items-center justify-center">
                                {profileImg ? (
                                  <img
                                    src={`${IMAGE_BASE_URL}${profileImg}`}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white font-bold text-xs uppercase">
                                    {displayName.substring(0, 2)}
                                  </span>
                                )}
                              </div>

                              <span className="text-[#374151] font-medium text-sm truncate max-w-[120px]">
                                {displayName}
                              </span>
                            </div>
                          </TableCell>
                          
                          <TableCell className="px-4 py-4 text-[#4B5563] text-sm">
                            {user.role}
                          </TableCell>

                          <TableCell className="px-4 py-4">
                            <span
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight ${getStatusStyles(status)}`}
                            >
                              {status}
                            </span>
                          </TableCell>

                          <TableCell className="px-4 py-4">
                            <span className="bg-[#FFEDD5] text-[#9A3412] px-3 py-1.5 rounded-lg text-[11px] font-bold">
                              {user.registrationRole || "Other"}
                            </span>
                          </TableCell>

                          <TableCell className="px-4 py-4 text-[#4B5563] text-sm">
                            {user.adminNote ? user.adminNote : "Not Available"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && users.length > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={totalUsers}
                  itemsPerPage={limit}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState type={activeTab} />
        )}
      </div>
    </div>
  );
};

export default AllUsersComponent;
