function TeamsLayout({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="padding-large content-container large">
			{children}
		</section>
	);
}

export default TeamsLayout;
