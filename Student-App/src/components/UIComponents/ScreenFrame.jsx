function ScreenFrame({ children, bgColor = 'bg-gray-50' }) {
  return (
    <div className={`${bgColor} min-h-full h-fit`}>
      <div className="min-w-fit max-w-3xl p-4 space-y-3 ml-auto mr-auto">
        {children}
      </div>
    </div>
  );
}

export default ScreenFrame;
