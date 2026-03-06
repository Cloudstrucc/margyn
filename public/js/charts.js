// Charts for Margyn dashboard
const data = window.MARGYN_CHART_DATA;
if (!data) { console.warn('No chart data'); }

const CHART_DEFAULTS = {
  color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#506480',
  gridColor: 'rgba(255,255,255,0.04)',
  cyan: '#00D4FF',
  green: '#00E676',
  purple: '#7B2FBE',
};

Chart.defaults.color = CHART_DEFAULTS.color;
Chart.defaults.font.family = "'JetBrains Mono', monospace";
Chart.defaults.font.size = 11;

// ── Sales Trend Chart ─────────────────────────────────────
const salesCtx = document.getElementById('salesChart');
let salesChart;

function buildSalesChart(type = 'revenue') {
  if (salesChart) salesChart.destroy();

  const isRevenue = type === 'revenue';
  const values = isRevenue ? data.salesTrend.revenue : data.salesTrend.units;
  const label = isRevenue ? 'Revenue ($)' : 'Units Sold';
  const color = isRevenue ? CHART_DEFAULTS.cyan : CHART_DEFAULTS.green;

  salesChart = new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: data.salesTrend.labels,
      datasets: [{
        label,
        data: values,
        borderColor: color,
        backgroundColor: color + '15',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: '#0A1628',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d1e36',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#E8F0FE',
          bodyColor: '#8FA8C8',
          padding: 12,
          callbacks: {
            label: (ctx) => isRevenue
              ? ` $${ctx.raw.toLocaleString()}`
              : ` ${ctx.raw.toLocaleString()} units`
          }
        }
      },
      scales: {
        x: {
          grid: { color: CHART_DEFAULTS.gridColor },
          border: { color: 'transparent' },
          ticks: { color: CHART_DEFAULTS.color }
        },
        y: {
          grid: { color: CHART_DEFAULTS.gridColor },
          border: { color: 'transparent', dash: [4, 4] },
          ticks: {
            color: CHART_DEFAULTS.color,
            callback: (v) => isRevenue ? '$' + (v / 1000).toFixed(0) + 'K' : v.toLocaleString()
          }
        }
      }
    }
  });
}

if (salesCtx && data) {
  buildSalesChart('revenue');
  window.updateSalesChart = buildSalesChart;
}

// ── Margin Distribution Donut ─────────────────────────────
const marginCtx = document.getElementById('marginChart');

if (marginCtx && data) {
  new Chart(marginCtx, {
    type: 'doughnut',
    data: {
      labels: data.marginDistribution.labels,
      datasets: [{
        data: data.marginDistribution.values,
        backgroundColor: [
          'rgba(0,230,118,0.8)',
          'rgba(0,230,118,0.5)',
          'rgba(0,212,255,0.7)',
          'rgba(255,159,67,0.7)',
          'rgba(255,82,82,0.6)',
        ],
        borderColor: '#0A1628',
        borderWidth: 2,
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#8FA8C8',
            boxWidth: 10,
            boxHeight: 10,
            borderRadius: 3,
            padding: 12,
            font: { size: 11 }
          }
        },
        tooltip: {
          backgroundColor: '#0d1e36',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#E8F0FE',
          bodyColor: '#8FA8C8',
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw} products`
          }
        }
      }
    }
  });
}
