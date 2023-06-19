"use client";
import { observer } from "mobx-react-lite";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import ShowRaceEntry from "./ShowRaceEntry";
import { registerStore } from "@8hourrelay/store";
import { RaceEntry } from "@8hourrelay/models";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function ConfirmForm() {
	const [confirm, setConfirm] = useState(false);

	const onSubmit = async () => {
		const [stripe, sessionId] = await Promise.all([
			stripePromise,
			registerStore.submitRaceForm()
		]);
		// redirect user to Stripe Checkout for payment
		if (stripe && sessionId) {
			stripe.redirectToCheckout({ sessionId: (sessionId as any).id });
		}
	};

	const raceEntry = new RaceEntry(registerStore.form!);

	return (
		<div className="w-full">
			<p>
				Please review your registration information carefully and accept
				race polices. Race entry cannot be change after submitted
			</p>
			<div className="divider">Race Entry</div>
			<ShowRaceEntry raceEntry={raceEntry} />
			<div className="flex flex-col mt-5">
				<div className="divider">Race Policies</div>
				<div>
					Entry fees are non-refundable, non-deferrable, and
					non-transferable.
				</div>
				<div className="form-control mt-3">
					<label className="label cursor-pointer gap-3">
						<span className="">ACCEPT</span>
						<input
							type="checkbox"
							checked={confirm}
							className="checkbox checkbox-md checkbox-primary"
							onChange={() => {
								setConfirm(!confirm);
							}}
						/>
					</label>
				</div>
			</div>
			<div className="flex gap-10 justify-between w-full mt-10">
				<button
					disabled={!confirm || registerStore.isLoading}
					type="submit"
					onClick={onSubmit}
					className="btn btn-primary">
					Payment
				</button>
				<button
					onClick={() => {
						registerStore.setTeamValidated(false);
						registerStore.setState("RE_EDIT");
					}}
					className="btn btn-secondary">
					EDIT
				</button>
			</div>
		</div>
	);
}

export default observer(ConfirmForm);
