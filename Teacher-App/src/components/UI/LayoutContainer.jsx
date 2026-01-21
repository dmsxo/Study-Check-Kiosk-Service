function LayoutContainer({ children, className = '' }) {
  return (
    <div className={`${className} p-6 bg-white rounded-xl border border-slate-200`}>{children}</div>
  );
}

export default LayoutContainer;
