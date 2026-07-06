/**
 * Configure GitHub Actions secrets for LeukemiaOmics Netlify deploy.
 * Run once after creating a NEW GitHub repo and NEW Netlify site.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const SITE_ID = process.env.NETLIFY_SITE_ID ?? "YOUR-NEW-NETLIFY-SITE-ID";

const configPath = path.join(
  os.homedir(),
  "AppData/Roaming/netlify/Config/config.json"
);

if (!fs.existsSync(configPath)) {
  console.error("Run `netlify login` first.");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const userId = config.userId;
const token = config.users[userId]?.auth?.token;

if (!token) {
  console.error("Run `netlify login` first.");
  process.exit(1);
}

function setSecret(name, value) {
  execSync(`gh secret set ${name} --body "${value}"`, {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
  console.log(`✓ ${name}`);
}

console.log("Setting GitHub repository secrets for LeukemiaOmics...");
setSecret("NETLIFY_AUTH_TOKEN", token);
setSecret("NETLIFY_SITE_ID", SITE_ID);
console.log("\nAlso set AUTH_SECRET, AUTH_USERNAME, AUTH_PASSWORD if using login.");
console.log("Push to master triggers .github/workflows/netlify-deploy.yml");
