import Image from "next/image";

export default function VolunteeringSection() {
  return (
    <div className="marathon-bg relative">
      <Image
        className="object-cover w-full h-full"
        src="/img/marathon_ppl.jpg"
        alt="marathon image"
        fill
        quality={70}
      />
      <section className="volunteering relative z-10" id="volunteering">
        <div className="content-container">
          <div className="landing-section-title">Volunteering</div>
          <h3 className="tight">
            Experience the power of community and wellness at the Vancouver 8
            Hour Relay!
          </h3>
          <p className="mb-20 deck">
            By becoming a sponsor, you’re not just supporting a race; you’re
            actively contributing to a shared passion for running and the
            promotion of physical and mental health. Contact us at
            8hourrelay@gmail.com for more details on sponsorship packages and
            opportunities. Join us in creating an unforgettable event together!
          </p>
          {/* <button className="btn-primary btn-large">
            <div className="small">I want to</div>
            <div className="big">Volunteer</div>
          </button> */}
        </div>
      </section>
      <section className="sponsorship relative z-10" id="sponsorship">
        <div className="content-container large">
          <div className="landing-section-title">Sponsorship</div>
          <h3 className="tight">
            Support the Vancouver 8 Hour Relay - Unite for health and unity!
          </h3>
          <p className="deck">
            Align your brand with our values and reach a diverse audience of
            athletes and spectators. Choose from Gold, Silver, Bronze, or
            In-Kind sponsorship levels. Join us in promoting physical and mental
            well-being through running and community!
          </p>

          <section className="grid mb-20">
            <div className="grid-item">
              <h4>Why Sponsor</h4>
              <div className="group">
                <h5>Brand Visibility</h5>
                Sponsorship of the Vancouver 8 Hour Relay offers extensive brand
                exposure, reaching a diverse audience as participants come from
                various cities.
              </div>
              <div className="group">
                <h5>Community Engagement</h5>
                Sponsorship of the Vancouver 8 Hour Relay offers extensive brand
                exposure, reaching a diverse audience as participants come from
                various cities.
              </div>
              <div className="group">
                <h5>Networking Opportunities</h5>
                The relay goes beyond a race; it brings together individuals who
                share a passion for running and community. As a sponsor, you’ll
                have the chance to network with participants, fellow sponsors,
                and community leaders.
              </div>
            </div>

            <div className="grid-item">
              <h4>Sponsorship Levels</h4>
              <div className="group">
                <h5><b>Title Sponsor (1 stand) $2000</b></h5>
                The name and logo will be on athletes’ T-shirts and the arch
                <br />
                Athletes number plate (with investor logo attached)
                <br />
                Independent tent booth(10’× 10’)
                <br />
                Lawn billboard displays all days(2’× 6’)
                <br />
                The host thanks and introduces the company
                <br />
                Social Media promotion
                <br />
              </div>
              <div className="group">
                <h5><b>King Sponsors(3stands) $1000</b></h5>
                Athletes number plate (with investor logo attached)
                <br />
                Independent tent booth(10’× 10’)
                <br />
                Lawn billboard displays all days(2’× 6’)
                <br />
                The host thanks and introduces the company
                <br />
                Social Media promotion
                <br />
              </div>
              <div className="group">
                <h5><b>Diamond Sponsors(5 stands) $500</b></h5>
                Independent tent booth(10’× 10’)
                <br />
                Lawn billboard displays all days(2’× 6’)
                <br />
                The host thanks and introduces the company
                <br />
                Social Media promotion
                <br />
              </div>
            </div>

            <div className="grid-item">
              <h4>Join Us</h4>
              <div>
                Join the Vancouver 8 Hour Relay, where we unite people with a
                shared passion for running and the promotion of physical and
                mental well-being. By becoming a sponsor, you’re not only
                supporting a race, but also a vibrant community. For more
                information on sponsorship packages and opportunities, please
                reach out to us at 8hourrelay@gmail.com. We eagerly anticipate
                partnering with you to create a successful event!
              </div>
            </div>
          </section>

          {/* <button className="btn-primary btn-large">
            <div className="small">I want to</div>
            <div className="big">Sponsor</div>
          </button> */}
        </div>
      </section>
    </div>
  );
}
