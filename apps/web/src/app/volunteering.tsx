export default function VolunteeringSection() {
	return (
		<div
			className="marathon-bg"
			style={{
				backgroundImage: `url("/img/marathon_ppl.jpg")`,
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "top center"
			}}>
			<section className="volunteering" id="volunteering">
				<div className="content-container">
					<h2>Volunteering</h2>
					<h3 className="tight">
						Experience the power of community and wellness at the
						Vancouver 8 Hour Relay!
					</h3>
					<p className="mb-20 deck">
						By becoming a sponsor, you’re not just supporting a
						race; you’re actively contributing to a shared passion
						for running and the promotion of physical and mental
						health. Contact us at 8hourrelay@gmail.com for more
						details on sponsorship packages and opportunities. Join
						us in creating an unforgettable event together!
					</p>
					<button className="btn-primary btn-large">
						<div className="small">I want to</div>
						<div className="big">Volunteer</div>
					</button>
				</div>
			</section>
			<section className="sponsorship" id="sponsorship">
				<div className="content-container large">
					<h2>Sponsorship</h2>
					<h3 className="tight">
						Support the Vancouver 8 Hour Relay - Unite for health
						and unity!
					</h3>
					<p className="deck">
						Align your brand with our values and reach a diverse
						audience of athletes and spectators. Choose from Gold,
						Silver, Bronze, or In-Kind sponsorship levels. Join us
						in promoting physical and mental well-being through
						running and community!
					</p>

					<section className="grid mb-20">
						<div className="grid-item">
							<h4>Why Sponsor</h4>
							<div className="group">
								<h5>Brand Visibility</h5>
								Sponsorship of the Vancouver 8 Hour Relay offers
								extensive brand exposure, reaching a diverse
								audience as participants come from various
								cities.
							</div>
							<div className="group">
								<h5>Community Engagement</h5>
								Sponsorship of the Vancouver 8 Hour Relay offers
								extensive brand exposure, reaching a diverse
								audience as participants come from various
								cities.
							</div>
							<div className="group">
								<h5>Networking Opportunities</h5>
								The relay goes beyond a race; it brings together
								individuals who share a passion for running and
								community. As a sponsor, you’ll have the chance
								to network with participants, fellow sponsors,
								and community leaders.
							</div>
						</div>

						<div className="grid-item">
							<h4>Sponsorship Levels</h4>
							<div className="group">
								<h5>Gold Sponsor</h5>
								Maximum brand exposure
								<br />
								Logo on participant t-shirts, banners, and
								website
								<br />
								Opportunity to set up a promotional booth at the
								event
								<br />
							</div>
							<div className="group">
								<h5>Silver Sponsor</h5>
								Logo displayed on the website
								<br />
								Opportunity to distribute promotional materials
								during the event
								<br />
							</div>
							<div className="group">
								<h5>Bronze Sponsor</h5>
								Company’s logo featured on the website
							</div>
							<div className="group">
								<h5>In-Kind Sponsor</h5>
								Welcome contributions of food, beverages, or
								services
								<br />
								Acknowledgment of contribution on website and
								during the event
								<br />
							</div>
						</div>

						<div className="grid-item">
							<h4>Join Us</h4>
							<div>
								Join the Vancouver 8 Hour Relay, where we unite
								people with a shared passion for running and the
								promotion of physical and mental well-being. By
								becoming a sponsor, you’re not only supporting a
								race, but also a vibrant community. For more
								information on sponsorship packages and
								opportunities, please reach out to us at
								8hourrelay@gmail.com. We eagerly anticipate
								partnering with you to create a successful
								event!
							</div>
						</div>
					</section>

					<button className="btn-primary btn-large">
						<div className="small">I want to</div>
						<div className="big">Sponsor</div>
					</button>
				</div>
			</section>
		</div>
	);
}
