import TabbedNav from "./TabbedNav";

function ProfileLayout({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<TabbedNav children={children} />
		</>
	);
}

export default ProfileLayout;
