
const AppLoader = () => {
  return (
    <div
      role="status"
      aria-label="Loading KinkLink"
      className="fixed inset-0 z-[9] flex flex-col items-center justify-center bg-white"
    >
      {/* Spinning Activity Ring */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-40 w-40 animate-spin rounded-full border-[3px] border-brand-500/20 border-t-brand-600" />

        <img src="./images/logo/logoicon.png" alt="" width={120} />
      </div>

      {/* Loading Text */}
      <p className="mt-10 text-sm font-medium tracking-wide text-brand-500 dark:text-white">
        Loading KinkLink…
      </p>
    </div>
  );
};

export default AppLoader;
