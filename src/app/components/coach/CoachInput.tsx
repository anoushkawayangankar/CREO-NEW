'use client';

type CoachInputProps = {
  value: string;
  onChange: (next: string) => void;
  onSend: () => void;
  pending?: boolean;
  disabled?: boolean;
};

export default function CoachInput({ value, onChange, onSend, pending, disabled }: CoachInputProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!pending && !disabled) {
          onSend();
        }
      }}
      className="flex items-end gap-2"
    >
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask me anything about this module…"
        className="w-full resize-none rounded-2xl border border-[#f0e2db] bg-white px-3 py-2 text-sm text-[#1f120f] shadow-inner focus:border-[#c24f63] focus:outline-none focus:ring-2 focus:ring-[#c24f63]/20"
        rows={2}
        disabled={pending || disabled}
      />
      <button
        type="submit"
        disabled={pending || disabled || !value.trim()}
        className={`h-10 shrink-0 rounded-xl px-4 text-sm font-semibold transition ${
          pending || disabled || !value.trim()
            ? 'bg-[#f6e7e0] text-[#b8998a] cursor-not-allowed'
            : 'bg-[#c24f63] text-white shadow-[0_10px_25px_rgba(194,79,99,0.35)] hover:-translate-y-0.5'
        }`}
      >
        {pending ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
