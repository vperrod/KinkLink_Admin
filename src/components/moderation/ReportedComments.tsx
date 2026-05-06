const ReportedComments = () => {
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-700">
        Reported Comments
      </h3>
      <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">
        There is currently no reported comments to display in this section.
      </p>
    </div>
  );
};

export default ReportedComments;
