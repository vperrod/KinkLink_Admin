import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

/* ================= TYPES ================= */

interface AdminAction {
  id: number;
  action: string;
  target: string;
  targetType: "User" | "Business" | "Content" | "Event";
  admin: string;
  time: string;
  status: "Completed" | "Pending" | "Escalated";
}

/* ================= STATIC DATA ================= */

const tableData: AdminAction[] = [
  {
    id: 1,
    action: "User Suspended",
    target: "@john_doe",
    targetType: "User",
    admin: "Admin_01",
    time: "2 hours ago",
    status: "Completed",
  },
  {
    id: 2,
    action: "Business Verified",
    target: "Dungeon Club NYC",
    targetType: "Business",
    admin: "Admin_02",
    time: "4 hours ago",
    status: "Completed",
  },
  {
    id: 3,
    action: "Content Removed",
    target: "IMG-23981",
    targetType: "Content",
    admin: "Moderator_01",
    time: "6 hours ago",
    status: "Escalated",
  },
  {
    id: 4,
    action: "Event Cancelled",
    target: "EVT-8821",
    targetType: "Event",
    admin: "Admin_03",
    time: "Yesterday",
    status: "Completed",
  },
  {
    id: 5,
    action: "Report Under Review",
    target: "RPT-10293",
    targetType: "Content",
    admin: "Support_01",
    time: "Yesterday",
    status: "Pending",
  },

];

/* ================= COMPONENT ================= */

export default function RecentAdminActions() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Admin Actions
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Latest moderation and administrative activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
            See all
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="py-3 text-xs font-medium text-gray-500">
                Action
              </TableCell>
              <TableCell isHeader className="py-3 text-xs font-medium text-gray-500">
                Target
              </TableCell>
              <TableCell isHeader className="py-3 text-xs font-medium text-gray-500">
                Type
              </TableCell>
              <TableCell isHeader className="py-3 text-xs font-medium text-gray-500">
                Performed By
              </TableCell>
              <TableCell isHeader className="py-3 text-xs font-medium text-gray-500">
                Time
              </TableCell>
              <TableCell isHeader className="py-3 text-xs font-medium text-gray-500">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="py-3 font-medium text-gray-800 dark:text-white/90">
                  {row.action}
                </TableCell>

                <TableCell className="py-3 text-gray-600 dark:text-gray-400">
                  {row.target}
                </TableCell>

                <TableCell className="py-3 text-gray-600 dark:text-gray-400">
                  {row.targetType}
                </TableCell>

                <TableCell className="py-3 text-gray-600 dark:text-gray-400">
                  {row.admin}
                </TableCell>

                <TableCell className="py-3 text-gray-600 dark:text-gray-400">
                  {row.time}
                </TableCell>

                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={
                      row.status === "Completed"
                        ? "success"
                        : row.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
