/**
 * seed-transfer-statistics.ts
 *
 * Βήμα 4: Διαβάζει το analytics_dashboard.csv και γεμίζει τον πίνακα
 * transfer_statistics. Χρησιμοποιεί pg απευθείας (χωρίς Prisma) για
 * bulk-insert μέσω COPY / batch INSERT, ώστε να είναι γρήγορο.
 *
 * Εκτέλεση:
 *   npx ts-node --project tsconfig.json scripts/seed-transfer-statistics.ts
 */

import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Ασφαλές parse JSON — επιστρέφει {} αν το string είναι άδειο/invalid */
function safeParseJson(raw: string | undefined): object {
  if (!raw || raw.trim() === '' || raw.trim() === 'null') return {}
  try {
    return JSON.parse(raw)
  } catch {
    // Μερικές φορές τα JSON strings μέσα σε CSV έχουν double-quoted quotes
    try {
      return JSON.parse(raw.replace(/""/g, '"'))
    } catch {
      return {}
    }
  }
}

/** Parse αριθμό — επιστρέφει null αν το string είναι άδειο */
function parseFloat_(raw: string | undefined): number | null {
  if (raw === undefined || raw.trim() === '' || raw.trim() === 'null') return null
  const n = parseFloat(raw.trim())
  return isNaN(n) ? null : n
}

function parseInt_(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === '' || raw.trim() === 'null') return 0
  const n = parseInt(raw.trim(), 10)
  return isNaN(n) ? 0 : n
}

// ---------------------------------------------------------------------------
// CSV parser — χειρίζεται quoted fields που περιέχουν κόμματα / newlines
// ---------------------------------------------------------------------------

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]

    if (insideQuotes) {
      if (ch === '"') {
        // Escaped quote: ""
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          insideQuotes = false
        }
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        insideQuotes = true
      } else if (ch === ',') {
        result.push(current)
        current = ''
      } else {
        current += ch
      }
    }
  }
  result.push(current)
  return result
}

/** Διαβάζει ολόκληρο το CSV λαμβάνοντας υπόψη quoted fields με newlines */
function parseCsvFile(filePath: string): { headers: string[]; rows: string[][] } {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines: string[] = []
  let currentLine = ''
  let insideQuotes = false

  for (let i = 0; i < content.length; i++) {
    const ch = content[i]
    if (ch === '"') {
      insideQuotes = !insideQuotes
      currentLine += ch
    } else if ((ch === '\r' || ch === '\n') && !insideQuotes) {
      if (ch === '\r' && content[i + 1] === '\n') i++ // CRLF
      if (currentLine.trim()) lines.push(currentLine)
      currentLine = ''
    } else {
      currentLine += ch
    }
  }
  if (currentLine.trim()) lines.push(currentLine)

  const [headerLine, ...dataLines] = lines
  const headers = parseCsvLine(headerLine).map(h => h.trim())
  const rows = dataLines.map(l => parseCsvLine(l))
  return { headers, rows }
}

// ---------------------------------------------------------------------------
// Column index map (case-insensitive match)
// ---------------------------------------------------------------------------

function buildColMap(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {}
  headers.forEach((h, i) => { map[h.toLowerCase()] = i })
  return map
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set in .env')

  const pool = new Pool({ connectionString })
  const client = await pool.connect()

  try {
    // -- Βήμα 1: DROP του παλιού πίνακα (αν υπάρχει ακόμα) -----------------
    console.log('▶  Dropping historical_transfer_data (if exists)...')
    await client.query('DROP TABLE IF EXISTS historical_transfer_data CASCADE')
    console.log('✓  historical_transfer_data dropped.')

    // -- Βήμα 2: Truncate (clean slate για re-runs) --------------------------
    console.log('▶  Truncating transfer_statistics...')
    await client.query('TRUNCATE TABLE transfer_statistics RESTART IDENTITY CASCADE')
    console.log('✓  transfer_statistics truncated.')

    // -- Βήμα 3: Parse CSV ---------------------------------------------------
    const csvPath = path.resolve(__dirname, '..', 'docs', 'analytics_dashboard.csv')
    console.log(`▶  Parsing CSV: ${csvPath}`)
    const { headers, rows } = parseCsvFile(csvPath)
    const col = buildColMap(headers)

    console.log(`   Found ${rows.length} data rows.`)

    // -- Βήμα 4: Batch INSERT ------------------------------------------------
    const BATCH_SIZE = 500
    let inserted = 0

    const insertSql = `
      INSERT INTO transfer_statistics (
        region,
        division,
        specialty,
        success_count,
        success_count_diff,
        success_count_history,
        base_score,
        base_score_diff,
        base_score_history,
        avg_score,
        avg_score_diff,
        avg_score_history,
        avg_score_applicants,
        avg_score_app_diff,
        avg_score_app_history,
        leaving_count,
        leaving_count_diff,
        leaving_count_history,
        targeting_1st_count,
        targeting_1st_count_diff,
        targeting_1st_count_history,
        inflow_origins_json,
        outflow_targets_json,
        popularity,
        popularity_history,
        difficulty_category,
        difficulty_category_history,
        difficulty_category_trend
      ) VALUES %PLACEHOLDERS%
    `

    const buildBatch = async (batch: string[][]) => {
      const valueSets: string[] = []
      const params: unknown[] = []
      let pIdx = 1

      for (const row of batch) {
        const get = (colName: string) => row[col[colName]]?.trim()

        const region    = get('region')    || ''
        const division  = get('division')  || ''
        const specialty = get('specialty') || ''

        if (!region && !division && !specialty) continue // skip empty rows

        const successCount            = parseInt_(get('success_count'))
        const successCountDiff        = parseInt_(get('success_count_diff'))
        const successCountHistory     = safeParseJson(get('success_count_history'))

        const baseScore               = parseFloat_(get('base_score'))
        const baseScoreDiff           = parseFloat_(get('base_score_diff'))
        const baseScoreHistory        = safeParseJson(get('base_score_history'))

        const avgScore                = parseFloat_(get('avg_score'))
        const avgScoreDiff            = parseFloat_(get('avg_score_diff'))
        const avgScoreHistory         = safeParseJson(get('avg_score_history'))

        const avgScoreApplicants      = parseFloat_(get('avg_score_applicants'))
        const avgScoreAppDiff         = parseFloat_(get('avg_score_app_diff'))
        const avgScoreAppHistory      = safeParseJson(get('avg_score_app_history'))

        const leavingCount            = parseInt_(get('leaving_count'))
        const leavingCountDiff        = parseInt_(get('leaving_count_diff'))
        const leavingCountHistory     = safeParseJson(get('leaving_count_history'))

        const targeting1stCount       = parseInt_(get('targeting_1st_count'))
        const targeting1stCountDiff   = parseInt_(get('targeting_1st_count_diff'))
        const targeting1stCountHistory = safeParseJson(get('targeting_1st_count_history'))

        const inflowOriginsJson       = safeParseJson(get('inflow_origins_json'))
        const outflowTargetsJson      = safeParseJson(get('outflow_targets_json'))

        const popularity              = parseFloat_(get('popularity'))
        const popularityHistory       = safeParseJson(get('popularity_history'))

        const difficultyCategory        = get('difficulty_category')        || 'Unknown'
        const difficultyCategoryHistory = safeParseJson(get('difficulty_category_history'))
        const difficultyCategoryTrend   = get('difficulty_category_trend')  || 'Unknown'

        const vals = [
          region, division, specialty,
          successCount, successCountDiff, JSON.stringify(successCountHistory),
          baseScore, baseScoreDiff, JSON.stringify(baseScoreHistory),
          avgScore, avgScoreDiff, JSON.stringify(avgScoreHistory),
          avgScoreApplicants, avgScoreAppDiff, JSON.stringify(avgScoreAppHistory),
          leavingCount, leavingCountDiff, JSON.stringify(leavingCountHistory),
          targeting1stCount, targeting1stCountDiff, JSON.stringify(targeting1stCountHistory),
          JSON.stringify(inflowOriginsJson), JSON.stringify(outflowTargetsJson),
          popularity, JSON.stringify(popularityHistory),
          difficultyCategory, JSON.stringify(difficultyCategoryHistory), difficultyCategoryTrend,
        ]

        const placeholders = vals.map(() => `$${pIdx++}`).join(', ')
        valueSets.push(`(${placeholders})`)
        params.push(...vals)
      }

      if (valueSets.length === 0) return 0

      const sql = insertSql.replace('%PLACEHOLDERS%', valueSets.join(',\n'))
      await client.query(sql, params)
      return valueSets.length
    }

    console.log('▶  Inserting rows in batches...')
    await client.query('BEGIN')

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE)
      const count = await buildBatch(batch)
      inserted += count
      process.stdout.write(`\r   Inserted ${inserted} / ${rows.length} rows...`)
    }

    await client.query('COMMIT')
    console.log(`\n✓  Done. Total rows inserted: ${inserted}`)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(err => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
