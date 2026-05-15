export default function Spinner() {
  return (
    <div className="flex justify-center items-center fixed inset-0">
      <div
        role="status"
        aria-label="Loading"
        className="h-10 w-10 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground animate-spin"
      />
    </div>
  );
}
