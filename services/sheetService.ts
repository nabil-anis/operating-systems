
export interface SheetRow {
  [key: string]: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  voicemail: {
    sent: number;
    replied: number;
    idle: number;
    pending: number;
    failed: number;
  };
  email: {
    sent: number;
    replied: number;
    idle: number;
    pending: number;
    failed: number;
  };
}

const SHEET_ID = '1BXRWBGhhu1eF_vkv9NYYzogKM-OySG1c1yAe7ddZUjQ';
const GOOGLE_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

const PROXIES = [
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
];

export const fetchSheetData = async (): Promise<DashboardMetrics> => {
  let lastError;

  for (const proxy of PROXIES) {
    try {
      const proxyUrl = proxy(GOOGLE_CSV_URL);
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }
      const text = await response.text();
      // Validate that we actually got CSV-like data and not an HTML error page
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error('Received HTML instead of CSV');
      }
      
      const rows = parseCSV(text);
      return calculateMetrics(rows);
    } catch (error) {
      console.warn(`Proxy failed:`, error);
      lastError = error;
      // Continue to next proxy
    }
  }

  console.error('All proxies failed. Last error:', lastError);
  // Return zeroed metrics on error to prevent crash
  return {
    totalLeads: 0,
    voicemail: { sent: 0, replied: 0, idle: 0, pending: 0, failed: 0 },
    email: { sent: 0, replied: 0, idle: 0, pending: 0, failed: 0 }
  };
};

const parseCSV = (text: string): SheetRow[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    // Basic CSV parsing handling quotes
    const values: string[] = [];
    let inQuote = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"|"$/g, ''));

    const row: SheetRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
};

const calculateMetrics = (rows: SheetRow[]): DashboardMetrics => {
  const metrics: DashboardMetrics = {
    totalLeads: rows.length,
    voicemail: { sent: 0, replied: 0, idle: 0, pending: 0, failed: 0 },
    email: { sent: 0, replied: 0, idle: 0, pending: 0, failed: 0 }
  };

  rows.forEach(row => {
    // Voicemail Status (Column: "Status")
    const vStatus = (row['Status'] || '').toLowerCase();
    if (vStatus.includes('sent') || vStatus.includes('success') || vStatus.includes('active')) metrics.voicemail.sent++;
    else if (vStatus.includes('replied') || vStatus.includes('response')) metrics.voicemail.replied++;
    else if (vStatus.includes('pending') || vStatus.includes('queue')) metrics.voicemail.pending++;
    else if (vStatus.includes('fail') || vStatus.includes('error')) metrics.voicemail.failed++;
    else metrics.voicemail.idle++;

    // Email Status (Column: "E-Status")
    const eStatus = (row['E-Status'] || '').toLowerCase();
    if (eStatus.includes('sent') || eStatus.includes('success') || eStatus.includes('active')) metrics.email.sent++;
    else if (eStatus.includes('replied') || eStatus.includes('response')) metrics.email.replied++;
    else if (eStatus.includes('pending') || eStatus.includes('queue')) metrics.email.pending++;
    else if (eStatus.includes('fail') || eStatus.includes('error')) metrics.email.failed++;
    else metrics.email.idle++;
  });

  return metrics;
};
