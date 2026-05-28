const EmptyState = ({ title, description }) => (
  <div className="card-style text-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-sm text-textSecondary">{description}</p>
  </div>
);

export default EmptyState;
