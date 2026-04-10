import { Link } from "react-router";

interface BreadcrumbProps {
  pageTitle: string;
  description?: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  description,
}) => {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        {/* Title & Breadcrumb Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>

            {description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>

          <nav>
            <ol className="flex items-center gap-1.5">
              <li>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                >
                  Home
                  <svg
                    className="stroke-current"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
              <li className="text-sm text-gray-800 dark:text-white/90">
                {pageTitle}
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
