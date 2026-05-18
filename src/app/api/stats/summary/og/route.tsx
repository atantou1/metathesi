import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const division = searchParams.get('division') || 'Πρωτοβάθμια Γενικής';
    const specialty = searchParams.get('specialty') || 'ΠΕ70';

    const v1 = searchParams.get('v1') || '0';
    const v2 = searchParams.get('v2') || '0';
    const v3 = searchParams.get('v3') || '0';
    const v4 = searchParams.get('v4') || '0';
    const v5 = searchParams.get('v5') || '0';
    const v6 = searchParams.get('v6') || '0';

    const safeGetHistory = (paramName: string): [string, number][] => {
      const historyStr = searchParams.get(paramName);
      if (!historyStr) return [];
      try {
        const obj = JSON.parse(historyStr);
        return Object.entries(obj)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-5) as [string, number][];
      } catch {
        return [];
      }
    };

    const h1 = safeGetHistory('h1');
    const h2 = safeGetHistory('h2');
    const h3 = safeGetHistory('h3');
    const h4 = safeGetHistory('h4');
    const h5 = safeGetHistory('h5');
    const h6 = safeGetHistory('h6');

    const getMax = (history: [string, number][]) =>
      Math.max(...history.map(([, v]) => Number(v) || 0), 1);

    const m1 = getMax(h1);
    const m2 = getMax(h2);
    const m3 = getMax(h3);
    const m4 = getMax(h4);
    const m5 = getMax(h5);
    const m6 = getMax(h6);

    const getBarH = (v: any, max: number) =>
      `${Math.max(((Number(v) || 0) / max) * 50, 4)}px`;

    // Render a single bar column — always a valid flex column div
    const Bar = ({ year, val, max, suffix }: { year: string; val: number; max: number; suffix: string }) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '35px' }}>
        <div style={{ fontSize: '10px', color: '#0f172a', fontWeight: 'bold' }}>{`${val}${suffix}`}</div>
        <div style={{ width: '15px', height: getBarH(val, max), backgroundColor: '#0ea5e9' }}></div>
        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{year}</div>
      </div>
    );

    // Pad history to always 5 entries so we never have conditional children
    const padHistory = (h: [string, number][]): [string, number, boolean][] => {
      const result: [string, number, boolean][] = h.map(([y, v]) => [y, v, true]);
      while (result.length < 5) {
        result.push(['', 0, false]);
      }
      return result;
    };

    const pad1 = padHistory(h1);
    const pad2 = padHistory(h2);
    const pad3 = padHistory(h3);
    const pad4 = padHistory(h4);
    const pad5 = padHistory(h5);
    const pad6 = padHistory(h6);

    const Bars = ({ padded, max, suffix }: { padded: [string, number, boolean][]; max: number; suffix: string }) => (
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px', width: '100%' }}>
        {padded[0][2]
          ? <Bar year={padded[0][0]} val={padded[0][1]} max={max} suffix={suffix} />
          : <div style={{ display: 'flex', width: '35px' }}></div>
        }
        {padded[1][2]
          ? <Bar year={padded[1][0]} val={padded[1][1]} max={max} suffix={suffix} />
          : <div style={{ display: 'flex', width: '35px' }}></div>
        }
        {padded[2][2]
          ? <Bar year={padded[2][0]} val={padded[2][1]} max={max} suffix={suffix} />
          : <div style={{ display: 'flex', width: '35px' }}></div>
        }
        {padded[3][2]
          ? <Bar year={padded[3][0]} val={padded[3][1]} max={max} suffix={suffix} />
          : <div style={{ display: 'flex', width: '35px' }}></div>
        }
        {padded[4][2]
          ? <Bar year={padded[4][0]} val={padded[4][1]} max={max} suffix={suffix} />
          : <div style={{ display: 'flex', width: '35px' }}></div>
        }
      </div>
    );

    const Card = ({
      title,
      value,
      padded,
      max,
      suffix,
    }: {
      title: string;
      value: string;
      padded: [string, number, boolean][];
      max: number;
      suffix: string;
    }) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '32%',
          height: '190px',
          backgroundColor: '#f8fafc',
          padding: '15px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>{title}</div>
        <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px' }}>{`${value}${suffix}`}</div>
        <Bars padded={padded} max={max} suffix={suffix} />
      </div>
    );

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            padding: '30px',
          }}
        >
          {/* Top Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>
              ΣΤΑΤΙΣΤΙΚΑ ΜΕΤΑΘΕΣΕΩΝ
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{specialty}</div>
              <div style={{ display: 'flex', fontSize: '20px', color: '#64748b', marginLeft: '10px' }}>{division}</div>
            </div>
          </div>

          {/* Row 1 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
            <Card title="ΑΡΙΘΜΟΣ ΜΕΤΑΘΕΣΕΩΝ" value={v1} padded={pad1} max={m1} suffix="" />
            <Card title="ΠΟΣΟΣΤΟ ΕΠΙΤΥΧΙΑΣ" value={v2} padded={pad2} max={m2} suffix="%" />
            <Card title="ΑΙΤΗΣΕΙΣ ΜΕΤΑΘΕΣΗΣ" value={v3} padded={pad3} max={m3} suffix="" />
          </div>

          {/* Row 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Card title="ΓΕΩΓΡΑΦΙΚΗ ΔΙΑΣΠΟΡΑ" value={v4} padded={pad4} max={m4} suffix="%" />
            <Card title="ΕΙΔΙΚΕΣ ΚΑΤΗΓΟΡΙΕΣ" value={v5} padded={pad5} max={m5} suffix="%" />
            <Card title="ΑΠΟΧΩΡΗΣΕΙΣ" value={v6} padded={pad6} max={m6} suffix="" />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
            <div style={{ display: 'flex', fontSize: '14px', fontWeight: 'bold' }}>
              <div style={{ display: 'flex', color: '#0ea5e9' }}>meta</div>
              <div style={{ display: 'flex', color: '#0f172a' }}>Thesi.gr</div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e: any) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}
