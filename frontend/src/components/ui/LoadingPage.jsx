export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-blue-100/50 flex flex-col items-center justify-center text-black p-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-blue-500/50 animate-bounce">
          <img
            src="/olms_logo.png"
            alt="olms logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <div className="absolute -inset-2 rounded-2xl border-2 border-blue-700/50 animate-ping"></div>
      </div>
      <h2 className="mt-6 text-xl font-bold tracking-wide flex gap-1">
        <div className="flex">
          <span className="text-[#fa5a07]">Onno</span>
          <span className="text-[#031e4e]">rokom</span>
        </div>
        <div className="flex">
          <span className="text-[#031e4e]">L</span>
          <span className="text-[#fa5a07]">M</span>
          <span className="text-[#031e4e]">S</span>
        </div>
      </h2>
      <p className="mt-1 text-sm text-slate-400">Loading your workspace...</p>
    </div>
  );
}
