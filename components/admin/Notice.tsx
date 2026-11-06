export default function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="mb-6 rounded-2xl bg-blush px-4 py-3 text-sm font-medium text-primary-dark">
      {children}
    </p>
  );
}
