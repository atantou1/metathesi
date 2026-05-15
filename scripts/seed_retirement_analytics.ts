import { prisma } from '../src/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  const csvPath = path.join(__dirname, '../docs/retirement_analytics.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  
  // Split by newline and remove empty lines
  const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
  
  // Skip the header
  const dataLines = lines.slice(1);
  
  console.log(`Found ${dataLines.length} records to import.`);
  
  let importedCount = 0;

  for (const line of dataLines) {
    const cols = parseCSVRow(line);
    
    // Columns:
    // 0: Specialty
    // 1: Division
    // 2: Total_Retirements
    // 3: Total_Retirements_History
    // 4: Total_Retirements_Diff
    // 5: Total_New_Hires
    // 6: Total_New_Hires_History
    // 7: Total_New_Hires_Diff
    // 8: Net_Staffing_Balance
    // 9: Net_Staffing_Balance_History
    // 10: Net_Staffing_Balance_Diff

    const specialty = cols[0];
    const division = cols[1];
    const totalRetirements = parseInt(cols[2], 10);
    const totalRetirementsHistory = cols[3] ? JSON.parse(cols[3]) : null;
    const totalRetirementsDiff = parseInt(cols[4], 10);
    
    const totalNewHires = cols[5] !== '' ? parseInt(cols[5], 10) : null;
    const totalNewHiresHistory = cols[6] !== '' ? JSON.parse(cols[6]) : null;
    const totalNewHiresDiff = cols[7] !== '' ? parseInt(cols[7], 10) : null;
    
    const netStaffingBalance = cols[8] !== '' ? parseInt(cols[8], 10) : null;
    const netStaffingBalanceHistory = cols[9] !== '' ? JSON.parse(cols[9]) : null;
    const netStaffingBalanceDiff = cols[10] !== '' ? parseInt(cols[10], 10) : null;

    // @ts-ignore - The IDE might need a TS Server restart to pick up the new Prisma types
    await prisma.retirementAnalytics.upsert({
      where: {
        specialty_division: {
          specialty,
          division
        }
      },
      update: {
        totalRetirements,
        totalRetirementsHistory,
        totalRetirementsDiff,
        totalNewHires,
        totalNewHiresHistory,
        totalNewHiresDiff,
        netStaffingBalance,
        netStaffingBalanceHistory,
        netStaffingBalanceDiff
      },
      create: {
        specialty,
        division,
        totalRetirements,
        totalRetirementsHistory,
        totalRetirementsDiff,
        totalNewHires,
        totalNewHiresHistory,
        totalNewHiresDiff,
        netStaffingBalance,
        netStaffingBalanceHistory,
        netStaffingBalanceDiff
      }
    });

    importedCount++;
  }
  
  console.log(`Successfully imported ${importedCount} records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
