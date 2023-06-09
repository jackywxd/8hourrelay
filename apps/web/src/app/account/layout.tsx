import Sidebar from "./Sidebar";
import TabbedNav from "./TabbedNav";

function ProfileLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full md:w-[800px] flex-1 pt-5">
      <>
        <div className="hidden md:block h-full w-full">
          <Sidebar children={children} />
        </div>
        <div className="md:hidden block flex-1 w-full">
          <TabbedNav children={children} />
        </div>
      </>
    </div>
  );
}

export default ProfileLayout;
