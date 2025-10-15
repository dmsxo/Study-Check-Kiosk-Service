function ScreenFrame({ children }) {
  return (
    <div className="bg-gray-50 min-h-full h-fit">
      <div className="min-w-fit max-w-3xl p-4 space-y-3 ml-auto mr-auto">
        {children}
      </div>
    </div>
  );
}

export default ScreenFrame;
