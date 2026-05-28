import { getStatusClasses } from "../utils/helpers";

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
      status
    )}`}
  >
    {status}
  </span>
);

export default StatusBadge;
