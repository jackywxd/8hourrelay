function TeamsLayout({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="teams content-container large">{children}</section>
	);
}

export default TeamsLayout;
