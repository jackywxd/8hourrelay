function LayoutMdx({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex justify-center min-h-full w-full">
      <div className="flex w-full justify-center">{children}</div>
    </div>
  );
}

export default LayoutMdx;
