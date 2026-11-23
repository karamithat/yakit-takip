export const BRANDS = [
  { id: 'Opet', logo: '/logos/opet.png', bg: '#e7f3ff' },
  { id: 'Shell', logo: '/logos/shell.png', bg: '#fff8e6' },
  { id: 'Petrol Ofisi', logo: '/logos/petrol-ofisi.png', bg: '#fff0f1' },
  { id: 'BP', logo: '/logos/bp.svg', bg: '#f0f8ef' },
  { id: 'Total', logo: '/logos/total.svg', bg: '#eef4ff' },
];
export const FUEL_TYPES = ['Benzin', 'Motorin', 'LPG'];
export const money = (value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 }).format(Number(value) || 0);
export const num = (value, digits = 1) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(Number(value) || 0);
export const fmtDate = (iso) => iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
export const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const calcStats = (fills) => {
  const sorted = [...fills].sort((a,b) => Number(a.odometer)-Number(b.odometer) || a.date.localeCompare(b.date));
  let prevFull = null, litersSince = 0;
  const consumption = [];
  for (const f of sorted) {
    if (prevFull) litersSince += Number(f.liters);
    if (f.fullTank) {
      const distance = prevFull ? Number(f.odometer) - Number(prevFull.odometer) : 0;
      if (prevFull && distance > 0 && litersSince > 0) consumption.push({ id:f.id, date:f.date, odometer:Number(f.odometer), distance, liters:litersSince, l100:litersSince / distance * 100 });
      prevFull = f;
      litersSince = 0;
    }
  }
  const validKm = consumption.reduce((s,r)=>s+r.distance,0);
  const validLiters = consumption.reduce((s,r)=>s+r.liters,0);
  const totalLiters = fills.reduce((s,f)=>s+Number(f.liters),0);
  const totalAmount = fills.reduce((s,f)=>s+Number(f.total),0);
  return { consumption, avgConsumption: validKm ? validLiters/validKm*100 : null, totalLiters, totalAmount, avgPrice:totalLiters?totalAmount/totalLiters:0, lastKm:sorted.length?Number(sorted[sorted.length-1].odometer):null };
};
export const downloadCSV = (rows, filename) => {
  const header = ['Tarih','Marka','Yakıt türü','Kilometre','Litre','Litre fiyatı (TL)','Toplam (TL)','Depo tam','Not'];
  const escape = (v) => `"${String(v ?? '').replaceAll('"','""')}"`;
  const content = [header,...rows.map(f=>[f.date,f.brand,f.fuelType,f.odometer,f.liters,f.pricePerLiter,f.total,f.fullTank?'Evet':'Hayır',f.note||''])].map(r=>r.map(escape).join(';')).join('\r\n');
  const blob = new Blob(['\ufeff'+content], {type:'text/csv;charset=utf-8;'});
  const href = URL.createObjectURL(blob); const link = document.createElement('a'); link.href=href; link.download=filename; link.click(); URL.revokeObjectURL(href);
};
