const SectionHeading = ({ badge, title, description }) => (
  <div className="mx-auto mb-12 max-w-2xl text-center">
    {badge && (
      <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
        {badge}
      </span>
    )}
    <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
    <p className="mt-4 text-textSecondary">{description}</p>
  </div>
);

export default SectionHeading;
