function LayoutContaner({ children, addSytle = '' }) {
  return (
    <div
      className={`${addSytle} p-4 bg-white rounded-xl border border-slate-200`}
    >
      {children}
    </div>
  );
}

export default LayoutContaner;
