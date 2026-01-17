import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function globalTeardown() {
  try {
    // Kill processes on all emulator ports
    await execAsync("lsof -ti:8080,9099 | xargs kill -9 2>/dev/null || true");
  } catch (error) {
    console.log("Cleanup completed");
  }
}

export default globalTeardown;
