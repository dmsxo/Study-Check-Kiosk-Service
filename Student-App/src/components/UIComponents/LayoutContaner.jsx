function LayoutContaner({ children, className = '' }) {
  return (
    <div
      className={`${className} p-4 bg-white rounded-xl border border-slate-200`}
    >
      {children}
    </div>
  );
}

export default LayoutContaner;
