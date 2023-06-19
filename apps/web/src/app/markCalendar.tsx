import Link from "next/link";
import TimeCard from "@/components/TimeCard";

export default function MarkCalendarSection() {
	return (
		<section className="mark-calendar">
			<div className="landing-section-title">Mark Your Calendar</div>
			<section className="content-container large">
				<div className="event-info-item entry-fee">
					<div className="label">Entry Fee</div>
					<div className="fee-container">
						<div className="fee1">
							<div className="fee">$30</div>
							<div className="category">Adult</div>
						</div>
						<div className="fee2">
							<div className="fee">$10</div>
							<div className="category">Youth</div>
						</div>
					</div>
				</div>
				<div className="event-info-item">
					<div className="label">When</div>
					<div className="value">
						8:00am – 4:00pm
						<br />
						September 10, 2023
					</div>
				</div>
				<div className="event-info-item">
					<div className="label">Where</div>
					<div className="value">
						Minoru Oval
						<br />
						Athletic field in Richmond,
						<br />
						British Columbia
					</div>
					<div className="notes">To Be Confirmed</div>
				</div>
				<div className="event-info-item">
					<div className="label">Entry Deadline</div>
					<div className="value">Aug 31, 2023</div>
				</div>
			</section>
		</section>
	);
}
