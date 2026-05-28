const colorClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  danger: "text-danger"
};

const StatCard = ({ title, value, subtitle, color = "primary" }) => (
  <div className="card-style">
    <p className="text-sm font-medium text-textSecondary">{title}</p>
    <h3 className={`mt-3 text-3xl font-bold ${colorClasses[color] || "text-primary"}`}>
      {value}
    </h3>
    <p className="mt-2 text-sm text-textSecondary">{subtitle}</p>
  </div>
);

export default StatCard;
