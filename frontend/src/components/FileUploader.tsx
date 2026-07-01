import { useRef, useState } from "react";

interface Props {
  accept?: string;
  onUpload: (file: File) => Promise<void>;
  label?: string;
}

export default function FileUploader({ accept, onUpload, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      await onUpload(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
      <button
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {busy ? "Загрузка…" : (label ?? "Загрузить файл")}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
