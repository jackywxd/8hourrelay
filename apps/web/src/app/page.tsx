import { Suspense } from "react";
import MessageForm from "./message";
import HeroSection from "./hero";
import SponsorSection from "./sponsors";
import MarkCalendarSection from "./markCalendar";
import MissionSection from "./mission";
import RulesSection from "./rules";
import VolunteeringSection from "./volunteering";
import GallerySection from "./gallery";

import "@/styles/style.css";
import "@/styles/landing.css";
import "@/styles/form.css";
import "@/styles/main.css";

export default function Web() {
	return (
		<>
			<HeroSection />
			<SponsorSection />
			<MarkCalendarSection />
			<MissionSection />
			<RulesSection />
			<VolunteeringSection />
			<GallerySection />
			<section className="keep-in-touch">
				<h2>Keep in touch</h2>
				<Suspense>
					<MessageForm />
				</Suspense>
			</section>
			<div className="nav-link top">
				<a href="#root">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 hover:animate-bounce hover:delay-100">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
						/>
					</svg>
				</a>
			</div>
		</>
	);
}
