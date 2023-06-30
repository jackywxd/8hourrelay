import { Team } from "@8hourrelay/models";

export function getTeamLogoUrl(team: Team) {
  const url = process.env.NEXT_PUBLIC_HOST_NAME;

  const ogUrl = new URL(`${url}api/og`);
  ogUrl.searchParams.set("heading", team.displayName);
  ogUrl.searchParams.set("slogan", team.slogan);
  ogUrl.searchParams.set("type", "website");
  ogUrl.searchParams.set("mode", "dark");

  return ogUrl.toString();
}
