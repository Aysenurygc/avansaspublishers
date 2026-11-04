import { defineRailway, github, project, service } from "railway/iac";
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "avansaspublishers";
export default defineRailway(() => {
  const avansaspublishers = service("avansaspublishers", {
    source: github("Aysenurygc/avansaspublishers", { branch: "main", checkSuites: false }),
    build: { buildEnvironment: "V3", builder: "NIXPACKS" },
    // npm start applies pending Prisma migrations before booting the server.
    start: "npm start",
    replicas: { "sfo": 1 },
  });

  return project("cooperative-luck", {
    variables: { managed: false },
    resources: [avansaspublishers],
  });
});
