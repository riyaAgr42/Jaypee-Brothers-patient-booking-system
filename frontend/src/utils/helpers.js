export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

export const getStatusClasses = (status) => {
  const statusMap = {
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    unavailable: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    cancelled: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
  };

  return statusMap[status] || statusMap.pending;
};
