import { findMatches } from './src/lib/matching'
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
    console.log("Running matching for Profile 52...")
    await findMatches(52)
    console.log("Running matching for Profile 53...")
    await findMatches(53)
    console.log("Done!")
}

main().catch(console.error)
