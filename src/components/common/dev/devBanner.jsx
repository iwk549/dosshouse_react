const DevBanner = () => {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      className="dark-bg text-center light-text main-border sticky-top"
      style={{ height: 25 }}
    >
      In {process.env.NODE_ENV} environment
    </div>
  );
};

export default DevBanner;
