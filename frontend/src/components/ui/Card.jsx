import { cn } from "../../utils";

export function Card({ className, children, ...props }) {
  return <div className={cn("bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden", className)} {...props}>{children}</div>;
}

export function CardHeader({ className, children, ...props }) {
  return <div className={cn("p-6 flex flex-col space-y-1.5", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }) {
  return <h3 className={cn("text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-white", className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }) {
  return <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  return <div className={cn("p-6 pt-0 flex items-center", className)} {...props}>{children}</div>;
}
