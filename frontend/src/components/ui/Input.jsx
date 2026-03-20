import { cn } from "../../utils";

export function Input({ className, label, id, error, ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <input
        id={id}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-blue-400 transition-colors",
          error && "border-red-500 focus:ring-red-500 dark:border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
