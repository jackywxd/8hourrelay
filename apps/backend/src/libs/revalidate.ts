import https from "https";

const HOST_NAME =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? "8hourrelay.com"
    : "staging.8hourrelay.com";

const SECRET = process.env.PATH_SECRET;

export const revalidate: (path: string) => Promise<boolean> = (
  path: string
) => {
  const url = `https://${HOST_NAME}/api/revalidate/?path=${path}&secret=${SECRET}`;
  console.log(`Revalidating path ${url}`);
  return new Promise((resolve, reject) => {
    return https
      .get(url, (res) => {
        let data: Uint8Array[] = [];
        res.on("data", (chunk) => {
          data.push(chunk);
        });
        res.on("end", () => {
          const response = Buffer.concat(data).toString();
          console.log(`Path ${path} revalidated!`, { response });
          resolve(true);
        });
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      });
  });
};
