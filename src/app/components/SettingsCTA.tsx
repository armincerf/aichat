export default function SettingsCTA({
  showSettings,
  settingsOpen,
}: {
  showSettings: () => void;
  settingsOpen: boolean;
}) {
  return (
    <div className="absolute bottom-10 left-0 p-2 z-20">
      {!settingsOpen && (
        <div className="w-min drop-shadow flex flex-row space-x-2 bg-red-200 p-2 rounded justify-between">
          <div className="p-1 whitespace-nowrap">Set Your Name To Chat</div>
          <button
            onClick={() => showSettings()}
            className="px-2 py-1 bg-white/60 hover:bg-white whitespace-nowrap"
          >
            Open Settings
          </button>
        </div>
      )}
    </div>
  );
}
