export default function LayoutMdx({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <div className="flex justify-center">{children}</div>;
}
