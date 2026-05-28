const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="mt-4 text-sm text-textSecondary">{text}</p>
    </div>
  </div>
);

export default LoadingSpinner;
