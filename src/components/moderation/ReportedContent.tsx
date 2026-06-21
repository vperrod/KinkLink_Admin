const ReportedContent = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="bg-gray-50 p-6 rounded-full mb-4">
        <svg
          className="text-5xl text-gray-300"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-700">
        Reported Content
      </h3>
      <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">
        There is currently no reported content to display in this section.
      </p>
    </div>
  );
};

export default ReportedContent;
