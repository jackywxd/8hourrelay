function TeamsLayout({
	children // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="padding-large content-container large mt-10">
			{children}
		</section>
	);
}

export default TeamsLayout;
