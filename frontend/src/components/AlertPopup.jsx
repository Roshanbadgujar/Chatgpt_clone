const AlertPopup = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="fixed top-4 right-4 z-[100] max-w-sm">
      <div
        className={`rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
          isError
            ? 'border-red-400/50 bg-red-600/25 text-red-100'
            : 'border-emerald-300/50 bg-emerald-600/25 text-emerald-100'
        }`}
      >
        <div className="flex items-start gap-3">
          <p className="text-sm font-medium leading-5">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-xs opacity-80 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;
