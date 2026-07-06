/**
 * Netlify CI helpers — configure for YOUR NEW LeukemiaOmics Netlify site.
 * Replace SITE_ID after creating the site at https://app.netlify.com
 */
const { execSync } = require("child_process");

const SITE_ID = process.env.NETLIFY_SITE_ID ?? "YOUR-NEW-NETLIFY-SITE-ID";

function api(name, body) {
  const payload = JSON.stringify({ site_id: SITE_ID, ...body });
  return JSON.parse(
    execSync(`netlify api ${name} --data ${JSON.stringify(payload)}`, {
      encoding: "utf8",
    })
  );
}

console.log("Clearing stale publish-directory override...");
api("updateSite", {
  build_settings: {
    cmd: "npm run build",
    dir: "",
    base: "",
    provider: "manual",
  },
});

console.log("\nCreate a build hook in Netlify UI, then set NETLIFY_BUILD_HOOK in GitHub secrets.");
console.log("Primary auto-deploy: GitHub Actions (.github/workflows/netlify-deploy.yml)");
