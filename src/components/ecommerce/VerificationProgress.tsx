
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { getDashboardVerificationStats } from "../../api/dashboardapis";

export default function VerificationProgress() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [range, setRange] = useState<"1D" | "7D">("7D");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardVerificationStats(range);
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [range]);

  const chartData = dashboardData?.chartData || {
    approved: dashboardData?.stats?.approve || 0,
    pendingLT24: dashboardData?.stats?.pending || 0,
    pending24_72: 0,
    pendingGT72: 0,
    rejected: 0,
  };

  const hasData =
    chartData.approved > 0 ||
    chartData.pendingLT24 > 0 ||
    chartData.pending24_72 > 0 ||
    chartData.pendingGT72 > 0 ||
    chartData.rejected > 0;

  const series = hasData
    ? [
      chartData.approved,
      chartData.pendingLT24,
      chartData.pending24_72,
      chartData.pendingGT72,
      chartData.rejected,
    ]
    : [1];

  const colors = hasData
    ? ["#58C96C", "#F4CD43", "#F8A033", "#E04B4B", "#697280"]
    : ["#E5E7EB"];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    colors: colors,
    labels: hasData
      ? [
        "Approved",
        "Pending < 24h",
        "Pending 24-72h",
        "Pending > 72h",
        "Rejected",
      ]
      : ["No Data"],
    dataLabels: {
      enabled: hasData,
      style: {
        fontSize: "14px",
        fontFamily: "Outfit, sans-serif",
        fontWeight: 600,
        colors: ["#fff"],
      },
      dropShadow: { enabled: false },
      background: { enabled: false },
      formatter: function (_val, opts) {
        const value = opts.w.globals.seriesTotals[opts.seriesIndex];
        const label = opts.w.globals.labels[opts.seriesIndex];

        if (label === "Pending 24-72h" && value > 0) return "!";
        if (label === "Pending > 72h" && value > 0) return "!";
        if (label === "Rejected" && value > 0) return value.toString();
        return "";
      },
    },
    stroke: { show: true, width: 3, colors: ["#ffffff"] },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: hasData,
              fontSize: "32px",
              fontWeight: 600,
              color: "#111827",
              offsetY: 10,
              formatter: () => chartData.approved.toLocaleString(),
            },
            total: {
              show: hasData,
              showAlways: hasData,
              label: "",
              formatter: () => chartData.approved.toLocaleString(),
            },
          },
        },
      },
    },
    legend: { show: false },
    tooltip: { enabled: hasData },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-col h-full">
      <div className="p-6 pb-2">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Verification Progress
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Users + Business
            </p>
          </div>
          <div className="flex bg-gray-50 dark:bg-gray-800 rounded-lg p-1 border border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setRange("1D")}
              className={`px-3 py-1.5 text-[15px] font-medium rounded-md transition-colors ${range === "1D"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              1D
            </button>
            <button
              onClick={() => setRange("7D")}
              className={`px-3 py-1.5 text-[15px] font-medium rounded-md transition-colors ${range === "7D"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
            >
              7D
            </button>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-gray-800" />
      </div>

      <div className="p-6 pt-4 flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-[260px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row items-center gap-8">
            <div className="relative w-full max-w-[260px] h-[260px] flex-shrink-0 flex items-center justify-center drop-shadow-sm">
              <Chart
                options={options}
                series={series}
                type="donut"
                width="100%"
                height="300px"
              />
            </div>

            <div className="flex-grow w-full space-y-3.5 mt-4 xl:mt-0 xl:pl-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100/80 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#58C96C" />
                    <path d="M6 10.5L8.5 13L14 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[15px] text-gray-700 dark:text-gray-300">Approved</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-[17px]">
                  {chartData.approved.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100/80 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#F4CD43]" />
                  <span className="text-[15px] text-gray-700 dark:text-gray-300">Pending &lt; 24h</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-[17px]">
                  {chartData.pendingLT24.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100/80 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#F8A033]" />
                  <span className="text-[15px] text-gray-700 dark:text-gray-300">Pending 24-72h</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-[17px]">
                  {chartData.pending24_72.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100/80 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#E04B4B" />
                    <path d="M10 5L5 13.5H15L10 5Z" fill="white" />
                    <path d="M10 8V11" stroke="#E04B4B" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="10" cy="12.5" r="0.8" fill="#E04B4B" />
                  </svg>
                  <span className="text-[15px] text-gray-700 dark:text-gray-300">Pending &gt; 72h</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-[17px]">
                  {chartData.pendingGT72.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#697280]" />
                  <span className="text-[15px] text-gray-700 dark:text-gray-300">Rejected</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-[17px]">
                  {chartData.rejected.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 flex justify-between border-t border-gray-100 dark:border-gray-800 mt-auto bg-gray-50/30 dark:bg-gray-800/20">
        <div>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Avg review time:</p>
          <p className="text-[17px] font-medium text-gray-900 dark:text-white">
            {dashboardData?.avgReviewTime || "0h"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Last approval:</p>
          <p className="text-[17px] font-medium text-gray-900 dark:text-white">
            {dashboardData?.lastApproval || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
