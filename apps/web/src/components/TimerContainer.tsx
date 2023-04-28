import { NumberBox } from "./NumberBox";

interface timeProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const TimerContainer = ({
  days,
  hours,
  minutes,
  seconds,
}: timeProps) => {
  let daysFlip = false;
  let hoursFlip = false;
  let minutesFlip = false;
  let secondsFlip = true;

  if (seconds <= 0 && minutes <= 0 && hours <= 0 && days <= 0) {
    daysFlip = false;
    hoursFlip = false;
    minutesFlip = false;
    secondsFlip = false;
  }

  if (seconds == 0) {
    if (minutes != 0) {
      seconds = 59;
    }

    secondsFlip = false;
    minutesFlip = true;
  }
  if (minutes == 0) {
    if (hours != 0) {
      minutes = 59;
    }

    minutesFlip = false;
    hoursFlip = true;
  }

  if (hours == 0) {
    hoursFlip = false;
    if (days != 0) {
      daysFlip = true;
    }
  }

  let daysStr = days.toString();
  let hoursStr = hours.toString();
  let minutesStr = minutes.toString();
  let secondsStr = seconds.toString();
  if (days < 10) {
    daysStr = "0" + days;
  }

  if (hours < 10) {
    hoursStr = "0" + hours;
  }

  if (minutes < 10) {
    minutesStr = "0" + minutes;
  }

  if (seconds < 10) {
    secondsStr = "0" + seconds;
  }

  return (
    <div className=" mt-2 md:mt-20  rounded-xl">
      <div className="grid grid-cols-2 gap-4 py-6 px-10 md:flex md:items-center md:justify-between md:mt-2  rounded-xl md:px-6 md:py-8 ">
        <NumberBox num={daysStr} unit="Days" flip={daysFlip} />
        <span className=" hidden text-5xl -mt-8 md:inline-block md:text-7xl font-normal text-gray-50 ">
          :
        </span>
        <NumberBox num={hoursStr} unit="Hours" flip={hoursFlip} />
        <span className="hidden text-5xl -mt-8 md:inline-block md:text-7xl font-normal text-gray-50 ">
          :
        </span>
        <NumberBox num={minutesStr} unit="Minutes" flip={minutesFlip} />
        <span className="hidden text-5xl -mt-8 md:inline-block md:text-7xl font-normal text-gray-50 ">
          :
        </span>
        <NumberBox num={secondsStr} unit="Seconds" flip={secondsFlip} />
      </div>
    </div>
  );
};
