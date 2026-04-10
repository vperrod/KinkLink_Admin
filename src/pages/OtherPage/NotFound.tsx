// import GridShape from "../../components/common/GridShape";
// import { Link } from "react-router";
// import PageMeta from "../../components/common/PageMeta";

// export default function NotFound() {
//   return (
//     <>
//       <PageMeta
//         title="404 Dashboard | kinklink - Admin Dashboard Template"
//         description="This is  404 Dashboard page for kinklink - Admin Dashboard Template"
//       />
//       <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
//         <GridShape />
//         <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
//           <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
//             ERROR
//           </h1>

//           <img src="/images/error/404.svg" alt="404" className="dark:hidden" />
//           <img
//             src="/images/error/404-dark.svg"
//             alt="404"
//             className="hidden dark:block"
//           />

//           <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
//             We can’t seem to find the page you are looking for!
//           </p>

//           <Link
//             to="/"
//             className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
//           >
//             Back to Home Page
//           </Link>
//         </div>
//         {/* <!-- Footer --> */}
//         <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
//           &copy; {new Date().getFullYear()} - kinklink
//         </p>
//       </div>
//     </>
//   );
// }
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="404 | kinklink Admin"
        description="Page not found – kinklink admin dashboard"
      />

      <div className="relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        <GridShape />

        <div className="mx-auto w-full max-w-xl text-center">
          {/* 404 Text */}
          <h1 className="mb-4 text-[120px] font-extrabold leading-none
            bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-600)]
            bg-clip-text text-transparent sm:text-[160px]"
          >
            404
          </h1>

          <h2 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Page Not Found
          </h2>

          <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
            The page you’re trying to access doesn’t exist or has been moved.
            Let’s get you back on track.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg
                bg-[var(--color-brand-500)] px-6 py-3 text-sm font-medium text-white
                shadow-theme-sm transition hover:bg-[var(--color-brand-600)]"
            >
              Go to Dashboard
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center rounded-lg
                border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700
                transition hover:bg-gray-100 dark:border-gray-700
                dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} kinklink
        </p>
      </div>
    </>
  );
}
