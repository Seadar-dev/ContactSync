import auth from "./auth.js"


async function main() {
  const token = await auth();
  console.log(token);

  const res = await fetch("https://graph.microsoft.com/v1.0/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  // console.log(res);
}

main()