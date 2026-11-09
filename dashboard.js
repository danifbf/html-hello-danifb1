const DashboardModel = (() => {
  const endDate = new Date("2026-11-08T12:00:00Z");
  const platforms = [
    { id: "instagram", name: "Instagram", color: "#d45a86", factor: 1.2 },
    { id: "tiktok", name: "TikTok", color: "#168c89", factor: 1.5 },
    { id: "youtube", name: "YouTube", color: "#db6657", factor: 0.9 },
    { id: "spotify", name: "Spotify", color: "#6c9340", factor: 0.65 },
  ];
  const products = [
    { id: "coffee", name: "Café signature", price: 22, commissionRate: 0.12 },
    {
      id: "matcha",
      name: "Matcha ceremonial",
      price: 28,
      commissionRate: 0.15,
    },
    { id: "kit", name: "Kit découverte", price: 48, commissionRate: 0.18 },
    {
      id: "club",
      name: "Club café · abonnement",
      price: 18,
      commissionRate: 0.1,
    },
  ];
  const campaigns = [
    { id: "ritual", name: "Rituel du matin", product: "coffee" },
    { id: "green", name: "Matcha moments", product: "matcha" },
    { id: "discovery", name: "Discovery edit", product: "kit" },
    { id: "community", name: "Coffee club", product: "club" },
  ];
  const dateAt = (offset) =>
    new Date(endDate.getTime() - offset * 86400000).toISOString().slice(0, 10);
  const records = [];
  for (let day = 119; day >= 0; day -= 1) {
    platforms.forEach((platform, platformIndex) => {
      products.forEach((product, productIndex) => {
        const wave =
          1 + Math.sin(day * 0.37 + productIndex + platformIndex) * 0.13;
        const growth = 1 + (119 - day) * 0.003;
        const impressions = Math.round(
          (1700 + productIndex * 280) * platform.factor * wave * growth,
        );
        const clicks = Math.round(
          impressions * (0.031 + platformIndex * 0.005),
        );
        const leads = Math.round(clicks * (0.54 + productIndex * 0.025));
        const qualified = Math.round(leads * (0.57 + platformIndex * 0.025));
        let conversionRate = 0.33 + productIndex * 0.025 + platformIndex * 0.01;
        if (platform.id === "instagram" && product.id === "matcha" && day < 7)
          conversionRate *= 0.38;
        if (platform.id === "tiktok" && product.id === "kit" && day < 7)
          conversionRate *= 1.9;
        const orders = Math.min(
          qualified,
          Math.round(qualified * conversionRate),
        );
        const subscriptions = product.id === "club" ? orders : 0;
        const salesRevenue = orders * product.price * 0.8;
        const commissions =
          orders * product.price * 0.2 * product.commissionRate;
        const investment = clicks * (0.3 + platformIndex * 0.06);
        const fulfillment = salesRevenue * 0.32;
        const likes = Math.round(impressions * 0.034 * wave);
        const comments = Math.round(impressions * 0.004);
        const shares = Math.round(
          impressions * 0.007 * (platformIndex === 1 ? 1.4 : 1),
        );
        const saves = Math.round(impressions * 0.005);
        const cohort = product.id === "club" ? 12 + platformIndex * 3 : 0;
        const churned = cohort
          ? Math.round(cohort * (0.06 + productIndex * 0.005))
          : 0;
        const surveyCount = Math.max(1, Math.round(orders * 0.55));
        const promoters = Math.round(surveyCount * 0.68);
        const detractors = Math.round(surveyCount * 0.14);
        const satisfied = Math.round(surveyCount * 0.88);
        const eventRegistrations = Math.round(leads * 0.25);
        const attended = Math.round(
          eventRegistrations * (0.7 + platformIndex * 0.03),
        );
        const passed = Math.round(attended * 0.82);
        const checkoutStarts = Math.min(qualified, Math.round(orders / 0.78));
        const activeUserIds = Array.from(
          { length: Math.round(clicks * 0.65) },
          (_, userIndex) =>
            `user-${(day * 61 + productIndex * 107 + platformIndex * 79 + userIndex) % 7200}`,
        );
        records.push({
          date: dateAt(day),
          platform: platform.id,
          product: product.id,
          campaign: campaigns[productIndex].id,
          impressions,
          clicks,
          leads,
          qualified,
          orders,
          subscriptions,
          salesRevenue,
          commissions,
          investment,
          fulfillment,
          likes,
          comments,
          shares,
          saves,
          cohort,
          churned,
          surveyCount,
          promoters,
          detractors,
          satisfied,
          eventRegistrations,
          attended,
          passed,
          checkoutStarts,
          activeUserIds,
          processHours: orders * (3.4 + platformIndex * 0.8),
          activeSubscriptions:
            product.id === "club"
              ? 90 + Math.round((119 - day) * 0.6) + platformIndex * 15
              : 0,
          posts: platformIndex === 0 && day % 3 === productIndex % 3 ? 1 : 0,
          stories: platformIndex === 0 && day % 2 === productIndex % 2 ? 2 : 0,
          reels: platformIndex < 2 && day % 4 === productIndex ? 1 : 0,
          videos: platformIndex >= 2 && day % 5 === productIndex ? 1 : 0,
        });
      });
    });
  }
  const ratio = (numerator, denominator) =>
    denominator ? numerator / denominator : 0;
  const sum = (rows, field) =>
    rows.reduce((total, row) => total + row[field], 0);
  function aggregate(rows) {
    const fields = [
      "impressions",
      "clicks",
      "leads",
      "qualified",
      "orders",
      "subscriptions",
      "salesRevenue",
      "commissions",
      "investment",
      "fulfillment",
      "likes",
      "comments",
      "shares",
      "saves",
      "cohort",
      "churned",
      "surveyCount",
      "promoters",
      "detractors",
      "satisfied",
      "eventRegistrations",
      "attended",
      "passed",
      "checkoutStarts",
      "processHours",
      "posts",
      "stories",
      "reels",
      "videos",
    ];
    const totals = Object.fromEntries(
      fields.map((field) => [field, sum(rows, field)]),
    );
    const latest = rows.reduce(
      (date, row) => (row.date > date ? row.date : date),
      "",
    );
    totals.activeUsers = new Set(rows.flatMap((row) => row.activeUserIds)).size;
    totals.activeSubscriptions = sum(
      rows.filter((row) => row.date === latest),
      "activeSubscriptions",
    );
    totals.revenue = totals.salesRevenue + totals.commissions;
    totals.mrr =
      totals.activeSubscriptions *
      products.find((product) => product.id === "club").price;
    totals.interactions =
      totals.likes + totals.comments + totals.shares + totals.saves;
    totals.profit = totals.revenue - totals.investment - totals.fulfillment;
    totals.averagePrice = ratio(totals.salesRevenue, totals.orders * 0.8);
    totals.engagement = ratio(totals.interactions, totals.impressions);
    totals.conversion = ratio(totals.orders, totals.leads);
    totals.churn = ratio(totals.churned, totals.cohort);
    totals.retention = totals.cohort ? 1 - totals.churn : 0;
    totals.completion = ratio(totals.orders, totals.checkoutStarts);
    totals.ctr = ratio(totals.clicks, totals.impressions);
    totals.impactConversion = ratio(totals.orders, totals.impressions);
    totals.nps =
      ratio(totals.promoters - totals.detractors, totals.surveyCount) * 100;
    totals.csat = ratio(totals.satisfied, totals.surveyCount);
    totals.cpa = ratio(totals.investment, totals.orders);
    totals.cpl = ratio(totals.investment, totals.leads);
    totals.margin = ratio(totals.profit, totals.revenue);
    totals.averageHours = ratio(totals.processHours, totals.orders);
    totals.quality = ratio(totals.qualified, totals.leads);
    totals.attendance = ratio(totals.attended, totals.eventRegistrations);
    totals.passRate = ratio(totals.passed, totals.attended);
    totals.roi = ratio(totals.profit, totals.investment);
    return totals;
  }
  function select(filters = {}, previous = false) {
    const days = Number(filters.days || 30);
    const start = dateAt(previous ? days * 2 - 1 : days - 1);
    const end = dateAt(previous ? days : 0);
    return records.filter(
      (row) =>
        row.date >= start &&
        row.date <= end &&
        (!filters.platform || row.platform === filters.platform) &&
        (!filters.product || row.product === filters.product) &&
        (!filters.campaign || row.campaign === filters.campaign),
    );
  }
  function group(rows, dimension, items) {
    return items
      .map((item) => {
        const matched = rows.filter((row) => row[dimension] === item.id);
        return {
          ...item,
          ...aggregate(matched),
          start: matched[0]?.date,
          end: matched.at(-1)?.date,
        };
      })
      .filter((item) => item.impressions > 0);
  }
  function alerts(rows) {
    const latest = rows.reduce(
      (date, row) => (row.date > date ? row.date : date),
      "",
    );
    if (!latest) return [];
    const cutoff = new Date(`${latest}T12:00:00Z`);
    cutoff.setUTCDate(cutoff.getUTCDate() - 6);
    const start = cutoff.toISOString().slice(0, 10);
    const findings = [];
    platforms.forEach((platform) =>
      products.forEach((product) => {
        const segment = rows.filter(
          (row) => row.platform === platform.id && row.product === product.id,
        );
        const current = aggregate(segment.filter((row) => row.date >= start));
        const baseline = aggregate(segment.filter((row) => row.date < start));
        if (
          baseline.leads >= 100 &&
          current.leads >= 100 &&
          baseline.conversion
        ) {
          const change = current.conversion / baseline.conversion - 1;
          if (Math.abs(change) >= 0.3)
            findings.push({
              type: change < 0 ? "danger" : "info",
              title:
                change < 0
                  ? "Caída de conversión"
                  : "Pico atípico de conversión",
              detail: `${platform.name} · ${product.name}`,
              change,
              product: product.id,
              platform: platform.id,
              campaign: campaigns.find(
                (campaign) => campaign.product === product.id,
              ).id,
              recommendation:
                change < 0
                  ? "Revisar checkout y coherencia del anuncio."
                  : "Validar atribución y capacidad de entrega.",
            });
        }
        const total = aggregate(segment);
        if (total.orders > 0 && total.margin < 0.2)
          findings.push({
            type: "warning",
            title: "Margen por debajo del 20%",
            detail: `${platform.name} · ${product.name}`,
            product: product.id,
            platform: platform.id,
            campaign: campaigns.find(
              (campaign) => campaign.product === product.id,
            ).id,
            recommendation: "Revisar inversión, precio y costes de entrega.",
          });
      }),
    );
    return findings;
  }
  return {
    platforms,
    products,
    campaigns,
    records,
    aggregate,
    select,
    group,
    alerts,
    ratio,
    dateAt,
  };
})();

if (typeof module !== "undefined" && module.exports)
  module.exports = DashboardModel;

if (typeof document !== "undefined") {
  const model = DashboardModel;
  const currency = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const preciseCurrency = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const number = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 });
  const percent = new Intl.NumberFormat("es-ES", {
    style: "percent",
    maximumFractionDigits: 1,
  });
  const dateFormat = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const formatDate = (value) =>
    dateFormat.format(new Date(`${value}T12:00:00Z`));
  const byId = (id) => document.getElementById(id);
  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  const format = (value, type = "number") =>
    type === "unitMoney"
      ? preciseCurrency.format(value)
      : type === "money"
        ? currency.format(value)
        : type === "rate"
          ? percent.format(value)
          : type === "hours"
            ? `${decimal.format(value)} h`
            : type === "points"
              ? decimal.format(value)
              : number.format(value);
  const metric = (
    key,
    label,
    type = "number",
    lowerIsBetter = false,
    definition = "",
  ) => ({ key, label, type, lowerIsBetter, definition });
  const groups = [
    {
      name: "Ingresos",
      icon: "wallet",
      featured: true,
      metrics: [
        metric(
          "revenue",
          "Revenue total",
          "money",
          false,
          "Ventas propias + comisiones de afiliación",
        ),
        metric("salesRevenue", "Ventas propias", "money"),
        metric("commissions", "Comisiones", "money"),
        metric(
          "mrr",
          "MRR · suscripciones",
          "money",
          false,
          "Facturación mensual recurrente al cierre",
        ),
        metric("averagePrice", "Precio medio de venta", "unitMoney"),
      ],
    },
    {
      name: "Volumen",
      icon: "shopping-bag",
      metrics: [
        metric("orders", "Ventas totales"),
        metric("leads", "Inscripciones · MQL"),
        metric("activeUsers", "Usuarios activos"),
        metric("impressions", "Impresiones"),
      ],
    },
    {
      name: "Engagement",
      icon: "heart",
      metrics: [
        metric(
          "engagement",
          "Tasa de engagement",
          "rate",
          false,
          "Interacciones / impresiones",
        ),
        metric("interactions", "Interacciones totales"),
        metric(
          "conversion",
          "Conversión general",
          "rate",
          false,
          "Compras / leads MQL",
        ),
      ],
    },
    {
      name: "Retención",
      icon: "repeat-2",
      metrics: [
        metric("retention", "Tasa de permanencia", "rate"),
        metric("churn", "Tasa de bajas · churn", "rate", true),
        metric(
          "completion",
          "Compleción del proceso",
          "rate",
          false,
          "Compras / checkouts iniciados",
        ),
      ],
    },
    {
      name: "Rendimiento",
      icon: "mouse-pointer-click",
      metrics: [
        metric("orders", "Conversiones totales"),
        metric("ctr", "CTR · tasa de clics", "rate"),
        metric("impactConversion", "Conversión por impacto", "rate"),
      ],
    },
    {
      name: "Satisfacción",
      icon: "smile",
      metrics: [
        metric("nps", "NPS · lealtad", "points"),
        metric("csat", "CSAT · satisfacción", "rate"),
      ],
    },
    {
      name: "Eficiencia",
      icon: "gauge",
      metrics: [
        metric("cpa", "CPA · coste por compra", "unitMoney", true),
        metric("cpl", "CPL · coste por lead", "unitMoney", true),
        metric("margin", "Margen de beneficio", "rate"),
        metric("averageHours", "Tiempo medio de proceso", "hours", true),
      ],
    },
  ];
  const state = {
    filters: { days: 30, platform: "", product: "", campaign: "" },
    table: "products",
    ranking: "products",
    sort: "roi",
    direction: -1,
    page: 1,
    rows: [],
    previous: [],
    totals: {},
    productRows: [],
    platformRows: [],
    campaignRows: [],
    alerts: [],
  };
  const charts = new Map();
  let reviewed;
  try {
    reviewed = new Set(
      JSON.parse(localStorage.getItem("ec-reviewed-alerts") || "[]"),
    );
  } catch {
    reviewed = new Set();
  }
  let notificationTimer;
  const notify = (message) => {
    clearTimeout(notificationTimer);
    byId("notification").textContent = message;
    byId("notification").hidden = false;
    notificationTimer = setTimeout(() => {
      byId("notification").hidden = true;
    }, 4500);
  };
  const icons = () => {
    if (window.lucide) window.lucide.createIcons();
  };
  function comparison(current, previous, descriptor) {
    if (!state.previous.length) return { text: "Sin base", kind: "neutral" };
    const difference = current - previous;
    const good = descriptor.lowerIsBetter ? difference < 0 : difference > 0;
    let text;
    if (descriptor.type === "rate")
      text = `${difference > 0 ? "+" : ""}${decimal.format(difference * 100)} pp`;
    else if (descriptor.type === "points")
      text = `${difference > 0 ? "+" : ""}${decimal.format(difference)} pts`;
    else if (!previous)
      return { text: current ? "Sin base" : "Sin cambio", kind: "neutral" };
    else
      text = `${difference > 0 ? "+" : ""}${percent.format(difference / Math.abs(previous))}`;
    return {
      text,
      kind: Math.abs(difference) < 0.000001 ? "neutral" : good ? "good" : "bad",
    };
  }
  function chart(id, configuration) {
    if (!window.Chart) return;
    charts.get(id)?.destroy();
    charts.set(id, new window.Chart(byId(id), configuration));
  }
  const chartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          boxWidth: 7,
          boxHeight: 7,
          padding: 12,
          font: { size: 9 },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#738078", font: { size: 9 } },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "#e6ebe3" },
        ticks: { color: "#738078", font: { size: 9 }, maxTicksLimit: 5 },
      },
    },
  });
  function renderKpis() {
    [...charts.keys()]
      .filter((id) => id.startsWith("spark-"))
      .forEach((id) => {
        charts.get(id).destroy();
        charts.delete(id);
      });
    const current = state.totals;
    const previous = model.aggregate(state.previous);
    byId("kpi-grid").innerHTML = groups
      .map((group, groupIndex) => {
        const primary = group.metrics[0];
        const delta = comparison(
          current[primary.key],
          previous[primary.key],
          primary,
        );
        return `<article class="kpi-card ${group.featured ? "featured" : ""}" aria-labelledby="kpi-title-${groupIndex}">
        <div class="kpi-heading"><span class="kpi-icon"><i data-lucide="${group.icon}" aria-hidden="true"></i></span><h3 id="kpi-title-${groupIndex}">${group.name}</h3></div>
        <div class="kpi-primary"><div><span class="metric-label" title="${escapeHtml(primary.definition)}">${primary.label}</span><strong class="primary-value" data-metric="${primary.key}">${state.rows.length ? format(current[primary.key], primary.type) : "—"}</strong><span class="metric-delta ${delta.kind}">${delta.text}</span></div><div class="sparkline"><canvas id="spark-${groupIndex}" role="img" aria-label="Tendencia de ${primary.label}"></canvas></div></div>
        ${group.metrics
          .slice(1)
          .map((descriptor) => {
            const change = comparison(
              current[descriptor.key],
              previous[descriptor.key],
              descriptor,
            );
            return `<div class="metric-row"><span class="metric-label" title="${escapeHtml(descriptor.definition)}">${descriptor.label}</span><div class="metric-values"><span class="metric-value" data-metric="${descriptor.key}">${state.rows.length ? format(current[descriptor.key], descriptor.type) : "—"}</span><span class="metric-delta ${change.kind}">${change.text}</span></div></div>`;
          })
          .join("")}</article>`;
      })
      .join("");
    const dates = [...new Set(state.rows.map((row) => row.date))];
    const bucketCount = Math.min(10, dates.length);
    groups.forEach((group, groupIndex) => {
      const buckets = Array.from({ length: bucketCount }, (_, bucketIndex) =>
        dates.slice(
          Math.floor((bucketIndex * dates.length) / bucketCount),
          Math.floor(((bucketIndex + 1) * dates.length) / bucketCount),
        ),
      );
      const values = buckets.map(
        (bucket) =>
          model.aggregate(
            state.rows.filter((row) => bucket.includes(row.date)),
          )[group.metrics[0].key],
      );
      chart(`spark-${groupIndex}`, {
        type: "line",
        data: {
          labels: buckets.map((bucket) => bucket.at(-1)),
          datasets: [
            {
              data: values,
              borderColor: group.featured ? "#b8daa4" : "#518261",
              borderWidth: 1.8,
              pointRadius: 0,
              tension: 0.4,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => format(context.raw, group.metrics[0].type),
              },
            },
          },
          scales: { x: { display: false }, y: { display: false } },
        },
      });
    });
  }
  function renderDrivers() {
    const totals = state.totals;
    const stages = [
      ["Impresiones", totals.impressions],
      ["Clics", totals.clicks],
      ["Leads · MQL", totals.leads],
      ["Cualificados · SQL", totals.qualified],
      ["Checkout iniciado", totals.checkoutStarts],
      ["Compra / suscripción", totals.orders],
    ];
    byId("funnel").innerHTML = stages
      .map(([name, count], stageIndex) => {
        const loss =
          stageIndex && stages[stageIndex - 1][1]
            ? percent.format(1 - count / stages[stageIndex - 1][1])
            : "—";
        const width = totals.impressions
          ? (count / totals.impressions) * 100
          : 0;
        return `<div class="funnel-step"><div class="funnel-label"><span>${name}</span><strong>${number.format(count)}</strong></div><div class="funnel-track"><div class="funnel-fill" style="width:${width}%"></div></div><span class="funnel-loss">${stageIndex ? `Pérdida frente a etapa anterior: ${loss}` : "Entrada del embudo"}</span></div>`;
      })
      .join("");
    const quality = [
      [
        "SQL / MQL",
        totals.quality,
        `${number.format(totals.qualified)} / ${number.format(totals.leads)} leads`,
      ],
      [
        "Attendance rate · asistencia",
        totals.attendance,
        `${number.format(totals.attended)} / ${number.format(totals.eventRegistrations)} inscritos`,
      ],
      [
        "Pass rate · aprobados",
        totals.passRate,
        `${number.format(totals.passed)} / ${number.format(totals.attended)} asistentes`,
      ],
    ];
    byId("quality").innerHTML = quality
      .map(
        ([label, value, detail]) =>
          `<div class="quality-row"><div class="quality-label"><span title="${detail}">${label}</span><strong>${state.rows.length ? percent.format(value) : "—"}</strong></div><progress value="${value}" max="1" aria-label="${label}">${percent.format(value)}</progress></div>`,
      )
      .join("");
    byId("quality-summary").textContent = quality
      .map(([label, , detail]) => `${label}: ${detail}`)
      .join(" · ");
    const platformMetric = byId("platform-metric").value;
    const platformType =
      platformMetric === "revenue"
        ? "money"
        : platformMetric === "engagement"
          ? "rate"
          : "number";
    const previousPlatforms = model.group(
      state.previous,
      "platform",
      model.platforms,
    );
    const platformOptions = chartOptions();
    platformOptions.scales.y.ticks.callback = (value) =>
      platformMetric === "engagement"
        ? percent.format(value)
        : platformMetric === "revenue"
          ? `${decimal.format(value / 1000)}k €`
          : number.format(value);
    platformOptions.plugins.tooltip = {
      callbacks: {
        label: (context) =>
          `${context.dataset.label}: ${format(context.raw, platformType)}`,
      },
    };
    chart("platform-chart", {
      type: "bar",
      data: {
        labels: state.platformRows.map((row) => row.name),
        datasets: [
          {
            label: "Período actual",
            data: state.platformRows.map((row) => row[platformMetric]),
            backgroundColor: "#427856",
            borderRadius: 3,
            maxBarThickness: 28,
          },
          {
            label: "Período anterior",
            data: state.platformRows.map(
              (row) =>
                previousPlatforms.find((previous) => previous.id === row.id)?.[
                  platformMetric
                ] || 0,
            ),
            backgroundColor: "#d3ddd0",
            borderRadius: 3,
            maxBarThickness: 28,
          },
        ],
      },
      options: platformOptions,
    });
    byId("platform-summary").textContent =
      state.platformRows
        .map(
          (row) => `${row.name}: ${format(row[platformMetric], platformType)}`,
        )
        .join(" · ") || "Sin datos";
    byId("platform-chart").setAttribute(
      "aria-label",
      byId("platform-summary").textContent,
    );
    const dates = [...new Set(state.rows.map((row) => row.date))];
    const qualityOptions = chartOptions();
    qualityOptions.plugins.legend.display = false;
    qualityOptions.scales.y.ticks.callback = (value) => percent.format(value);
    qualityOptions.scales.x.ticks.maxTicksLimit = 4;
    chart("quality-chart", {
      type: "line",
      data: {
        labels: dates.map(formatDate),
        datasets: [
          {
            label: "SQL / MQL",
            data: dates.map(
              (date) =>
                model.aggregate(state.rows.filter((row) => row.date === date))
                  .quality,
            ),
            borderColor: "#427856",
            backgroundColor: "#42785615",
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: qualityOptions,
    });
    const productOptions = chartOptions();
    productOptions.scales.y.ticks.callback = (value) =>
      `${number.format(value)} €`;
    productOptions.scales.conversion = {
      position: "right",
      min: 0,
      max: 1,
      grid: { display: false },
      border: { display: false },
      ticks: {
        callback: (value) => percent.format(value),
        font: { size: 9 },
        maxTicksLimit: 5,
      },
    };
    productOptions.plugins.tooltip = {
      callbacks: {
        label: (context) =>
          `${context.dataset.label}: ${format(context.raw, context.dataset.yAxisID === "conversion" ? "rate" : "money")}`,
      },
    };
    chart("product-chart", {
      type: "bar",
      data: {
        labels: state.productRows.map((row) => row.name.split(" · ")[0]),
        datasets: [
          {
            label: "Comisiones",
            data: state.productRows.map((row) => row.commissions),
            backgroundColor: "#8eaa75",
            maxBarThickness: 28,
            borderRadius: 3,
          },
          {
            type: "line",
            label: "Conversión",
            data: state.productRows.map((row) => row.conversion),
            yAxisID: "conversion",
            borderColor: "#c89142",
            pointBackgroundColor: "#c89142",
            borderWidth: 2,
            pointRadius: 3,
          },
        ],
      },
      options: productOptions,
    });
    byId("product-summary").textContent =
      state.productRows
        .map(
          (row) =>
            `${row.name}: ${currency.format(row.commissions)}, ${percent.format(row.conversion)}`,
        )
        .join(" · ") || "Sin datos";
    const stacked = (id, fields) => {
      const options = chartOptions();
      options.scales.x.stacked = true;
      options.scales.y.stacked = true;
      chart(id, {
        type: "bar",
        data: {
          labels: state.platformRows.map((row) => row.name),
          datasets: fields.map(([field, label, color]) => ({
            label,
            data: state.platformRows.map((row) => row[field]),
            backgroundColor: color,
            maxBarThickness: 32,
            borderRadius: 2,
          })),
        },
        options,
      });
    };
    stacked("activity-chart", [
      ["posts", "Posts", "#365f49"],
      ["stories", "Stories", "#8eaa75"],
      ["reels", "Reels", "#c89142"],
      ["videos", "Vídeos", "#658f96"],
    ]);
    stacked("engagement-chart", [
      ["likes", "Me gusta", "#365f49"],
      ["comments", "Comentarios", "#8eaa75"],
      ["shares", "Compartidos", "#c89142"],
      ["saves", "Guardados", "#658f96"],
    ]);
    byId("activity-summary").textContent =
      state.platformRows
        .map(
          (row) =>
            `${row.name}: ${number.format(row.posts)} posts, ${number.format(row.stories)} stories, ${number.format(row.reels)} reels, ${number.format(row.videos)} vídeos`,
        )
        .join(" · ") || "Sin datos";
    byId("engagement-summary").textContent =
      state.platformRows
        .map(
          (row) =>
            `${row.name}: ${number.format(row.likes)} me gusta, ${number.format(row.comments)} comentarios, ${number.format(row.shares)} compartidos, ${number.format(row.saves)} guardados`,
        )
        .join(" · ") || "Sin datos";
    ["product", "activity", "engagement", "quality"].forEach((name) =>
      byId(`${name}-chart`).setAttribute(
        "aria-label",
        byId(`${name}-summary`).textContent,
      ),
    );
  }
  const columns = {
    products: [
      { key: "name", label: "Producto" },
      { key: "price", label: "Precio", type: "unitMoney" },
      { key: "commissions", label: "Comisiones generadas", type: "money" },
      { key: "orders", label: "Conversiones" },
      { key: "conversion", label: "Conversión", type: "rate" },
      { key: "roi", label: "ROI por producto", type: "rate" },
    ],
    platforms: [
      { key: "name", label: "Plataforma" },
      { key: "activeUsers", label: "Alcance", best: true },
      {
        key: "engagement",
        label: "Tasa de engagement",
        type: "rate",
        best: true,
      },
      { key: "orders", label: "Conversiones totales", best: true },
      { key: "roi", label: "ROI", type: "rate", best: true },
    ],
    campaigns: [
      { key: "name", label: "Campaña" },
      { key: "start", label: "Inicio", type: "date" },
      { key: "end", label: "Fin", type: "date" },
      { key: "productName", label: "Producto promocionado" },
      { key: "orders", label: "Resultados · compras" },
      { key: "revenue", label: "Ingresos", type: "money" },
      { key: "roi", label: "ROI", type: "rate" },
      { key: "relative", label: "vs. anterior", type: "change" },
    ],
  };
  const rowsFor = (table) =>
    table === "products"
      ? state.productRows
      : table === "platforms"
        ? state.platformRows
        : state.campaignRows;
  function filteredTableRows() {
    const query = byId("table-search").value.trim().toLocaleLowerCase("es");
    return rowsFor(state.table)
      .filter(
        (row) =>
          (!query ||
            `${row.name} ${row.productName || ""}`
              .toLocaleLowerCase("es")
              .includes(query)) &&
          (!byId("positive-roi").checked || row.roi > 0),
      )
      .sort((left, right) => {
        const first = left[state.sort],
          second = right[state.sort];
        return (
          state.direction *
          (typeof first === "string"
            ? first.localeCompare(second, "es")
            : (first ?? -Infinity) - (second ?? -Infinity))
        );
      });
  }
  function renderTable() {
    const rows = filteredTableRows();
    const pageSize = Number(byId("page-size").value);
    const pages = Math.max(1, Math.ceil(rows.length / pageSize));
    state.page = Math.min(state.page, pages);
    const schema = columns[state.table];
    const table = byId("data-table");
    table.querySelector("thead").innerHTML =
      `<tr>${schema.map((column) => `<th scope="col" aria-sort="${state.sort === column.key ? (state.direction > 0 ? "ascending" : "descending") : "none"}"><button data-sort="${column.key}" title="Ordenar por ${column.label}">${column.label}<i data-lucide="${state.sort === column.key ? (state.direction > 0 ? "arrow-up" : "arrow-down") : "chevrons-up-down"}" aria-hidden="true"></i></button></th>`).join("")}</tr>`;
    const pageRows = rows.slice(
      (state.page - 1) * pageSize,
      state.page * pageSize,
    );
    table.querySelector("tbody").innerHTML = pageRows.length
      ? pageRows
          .map(
            (row) =>
              `<tr>${schema
                .map((column) => {
                  const value = row[column.key];
                  const content =
                    column.type === "date"
                      ? formatDate(value)
                      : column.type === "change"
                        ? value === null
                          ? "Sin base"
                          : `${value > 0 ? "+" : ""}${percent.format(value)}`
                        : column.key === "name" || column.key === "productName"
                          ? escapeHtml(value)
                          : format(value, column.type);
                  const best =
                    column.best &&
                    value ===
                      Math.max(
                        ...state.platformRows.map((item) => item[column.key]),
                      );
                  return `<td class="${column.key === "roi" || column.type === "change" ? (value < 0 ? "negative" : "positive") : ""}">${content}${best ? '<span class="best-badge">Mejor</span>' : ""}</td>`;
                })
                .join("")}</tr>`,
          )
          .join("")
      : `<tr><td colspan="${schema.length}" class="empty-state">No se encontraron resultados.</td></tr>`;
    const label = {
      products: "productos",
      platforms: "plataformas",
      campaigns: "campañas",
    }[state.table];
    byId("table-caption").textContent = `Tabla de ${label}`;
    byId("table-panel").setAttribute("aria-labelledby", `tab-${state.table}`);
    byId("table-count").textContent = rows.length
      ? `${(state.page - 1) * pageSize + 1}–${Math.min(state.page * pageSize, rows.length)} de ${rows.length} ${label}`
      : `0 ${label}`;
    byId("page-label").textContent = `${state.page} / ${pages}`;
    byId("previous-page").disabled = state.page <= 1;
    byId("next-page").disabled = state.page >= pages;
    document.querySelectorAll("[data-table]").forEach((button) => {
      button.setAttribute(
        "aria-selected",
        String(button.dataset.table === state.table),
      );
      button.tabIndex = button.dataset.table === state.table ? 0 : -1;
    });
    icons();
  }
  const alertKey = (alert) =>
    `${model.dateAt(0)}|${state.filters.days}|${alert.type}|${alert.platform}|${alert.product}`;
  function renderAlerts() {
    const active = state.alerts.filter(
      (alert) => !reviewed.has(alertKey(alert)),
    );
    byId("alert-count").textContent = `${active.length} alertas pendientes`;
    const visible = byId("show-reviewed").checked ? state.alerts : active;
    byId("alerts-list").innerHTML = visible.length
      ? visible
          .map((alert) => {
            const isReviewed = reviewed.has(alertKey(alert));
            const index = state.alerts.indexOf(alert);
            return `<article class="alert-item ${alert.type} ${isReviewed ? "alert-reviewed" : ""}"><div class="alert-title"><i data-lucide="${alert.type === "danger" ? "trending-down" : alert.type === "info" ? "trending-up" : "triangle-alert"}" aria-hidden="true"></i><span>${alert.title}</span></div><p>${escapeHtml(alert.detail)}${alert.change !== undefined ? ` · ${alert.change > 0 ? "+" : ""}${percent.format(alert.change)}` : ""}</p><p>${alert.recommendation}</p><div class="alert-actions"><button class="text-button" data-alert-focus="${index}">Ver segmento<i data-lucide="arrow-up-right" aria-hidden="true"></i></button><button class="text-button" data-alert-review="${index}" aria-label="${isReviewed ? "Reabrir" : "Marcar revisada"}: ${escapeHtml(alert.detail)}">${isReviewed ? "Reabrir" : "Revisada"}<i data-lucide="${isReviewed ? "rotate-ccw" : "check"}" aria-hidden="true"></i></button></div></article>`;
          })
          .join("")
      : '<p class="empty-state">No hay alertas pendientes en esta selección.</p>';
    icons();
  }
  function readFilters() {
    state.filters = {
      days: Number(byId("period").value),
      platform: byId("platform").value,
      product: byId("product").value,
      campaign: byId("campaign").value,
    };
    state.page = 1;
  }
  function focusSegment(segment) {
    if (segment.platform) byId("platform").value = segment.platform;
    if (segment.product) byId("product").value = segment.product;
    if (segment.campaign) byId("campaign").value = segment.campaign;
    readFilters();
    render();
    byId("resultados").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    notify("Segmento aplicado a todos los indicadores.");
  }
  function renderRankings() {
    const rankingMetric = byId("ranking-metric").value;
    const type =
      rankingMetric === "roi"
        ? "rate"
        : rankingMetric === "revenue"
          ? "money"
          : "number";
    const ranked =
      state.ranking === "opportunities"
        ? state.alerts
        : [...rowsFor(state.ranking)]
            .sort((left, right) => right[rankingMetric] - left[rankingMetric])
            .slice(0, 3);
    byId("ranking-list").innerHTML = ranked.length
      ? ranked
          .map(
            (row, index) =>
              `<li class="ranking-entry"><span class="ranking-number">${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHtml(row.name || row.detail)}</strong><small>${state.ranking === "opportunities" ? row.recommendation : `${rankingMetric === "roi" ? "ROI" : rankingMetric === "revenue" ? "Ingresos" : "Conversiones"} ${format(row[rankingMetric], type)}`}</small></div><button class="icon-button" data-rank-focus="${index}" title="Filtrar por ${escapeHtml(row.name || row.detail)}" aria-label="Filtrar por ${escapeHtml(row.name || row.detail)}"><i data-lucide="arrow-up-right" aria-hidden="true"></i></button></li>`,
          )
          .join("")
      : '<li class="empty-state">Sin resultados para esta selección.</li>';
    byId("ranking-list")
      .querySelectorAll("[data-rank-focus]")
      .forEach((button) =>
        button.addEventListener("click", () => {
          const row = ranked[Number(button.dataset.rankFocus)];
          if (state.ranking === "opportunities") focusSegment(row);
          else {
            ["platform", "product", "campaign"].forEach((id) => {
              byId(id).value = "";
            });
            const dimension = {
              products: "product",
              platforms: "platform",
              campaigns: "campaign",
            }[state.ranking];
            byId(dimension).value = row.id;
            readFilters();
            render();
            notify(`${row.name}: filtro aplicado.`);
          }
        }),
      );
    byId("ranking-metric").disabled = state.ranking === "opportunities";
    document.querySelectorAll("[data-ranking]").forEach((button) => {
      const selected = button.dataset.ranking === state.ranking;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    icons();
  }
  function render() {
    state.rows = model.select(state.filters);
    state.previous = model.select(state.filters, true);
    state.totals = model.aggregate(state.rows);
    state.productRows = model.group(state.rows, "product", model.products);
    state.platformRows = model.group(state.rows, "platform", model.platforms);
    const previousCampaigns = model.group(
      state.previous,
      "campaign",
      model.campaigns,
    );
    state.campaignRows = model
      .group(state.rows, "campaign", model.campaigns)
      .map((row) => {
        const previous = previousCampaigns.find((item) => item.id === row.id);
        return {
          ...row,
          productName: model.products.find(
            (product) => product.id === row.product,
          ).name,
          relative: previous?.revenue
            ? row.revenue / previous.revenue - 1
            : null,
        };
      });
    state.alerts = model.alerts(state.rows);
    byId("date-range").textContent =
      `${formatDate(model.dateAt(state.filters.days - 1))} – ${formatDate(model.dateAt(0))} 2026`;
    byId("comparison-label").textContent =
      `vs. ${formatDate(model.dateAt(state.filters.days * 2 - 1))} – ${formatDate(model.dateAt(state.filters.days))}`;
    byId("global-empty").hidden = state.rows.length > 0;
    renderKpis();
    renderDrivers();
    renderTable();
    renderAlerts();
    renderRankings();
    icons();
  }
  function downloadCsv(filename, rows) {
    const serialize = (value) => {
      let text = String(value ?? "");
      if (typeof value === "string" && /^[=+\-@]/.test(text)) text = `'${text}`;
      return `"${text.replace(/"/g, '""')}"`;
    };
    const blob = new Blob(
      ["\uFEFF" + rows.map((row) => row.map(serialize).join(";")).join("\r\n")],
      { type: "text/csv;charset=utf-8;" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Exportación CSV completada · datos de demostración.");
  }
  model.platforms.forEach((platform) =>
    byId("platform").add(new Option(platform.name, platform.id)),
  );
  model.products.forEach((product) =>
    byId("product").add(new Option(product.name, product.id)),
  );
  model.campaigns.forEach((campaign) =>
    byId("campaign").add(new Option(campaign.name, campaign.id)),
  );
  byId("filters").addEventListener("submit", (event) => event.preventDefault());
  byId("filters").addEventListener("change", () => {
    readFilters();
    render();
  });
  byId("filters").addEventListener("reset", () => {
    setTimeout(() => {
      readFilters();
      render();
    }, 0);
  });
  byId("platform-metric").addEventListener("change", renderDrivers);
  ["table-search", "positive-roi", "page-size"].forEach((id) =>
    byId(id).addEventListener(
      id === "table-search" ? "input" : "change",
      () => {
        state.page = 1;
        renderTable();
      },
    ),
  );
  document.querySelectorAll("[data-table]").forEach((button) => {
    button.addEventListener("click", () => {
      state.table = button.dataset.table;
      state.sort = "roi";
      state.direction = -1;
      state.page = 1;
      byId("table-search").value = "";
      renderTable();
    });
    button.addEventListener("keydown", (event) => {
      const tabs = [...document.querySelectorAll("[data-table]")],
        position = tabs.indexOf(button);
      const next =
        event.key === "ArrowRight"
          ? tabs[(position + 1) % tabs.length]
          : event.key === "ArrowLeft"
            ? tabs[(position + tabs.length - 1) % tabs.length]
            : event.key === "Home"
              ? tabs[0]
              : event.key === "End"
                ? tabs.at(-1)
                : null;
      if (next) {
        event.preventDefault();
        next.click();
        next.focus();
      }
    });
  });
  byId("data-table").addEventListener("click", (event) => {
    const button = event.target.closest("[data-sort]");
    if (!button) return;
    state.direction = state.sort === button.dataset.sort ? -state.direction : 1;
    state.sort = button.dataset.sort;
    renderTable();
    byId("data-table").querySelector(`[data-sort="${state.sort}"]`).focus();
  });
  byId("previous-page").addEventListener("click", () => {
    state.page -= 1;
    renderTable();
  });
  byId("next-page").addEventListener("click", () => {
    state.page += 1;
    renderTable();
  });
  byId("show-reviewed").addEventListener("change", renderAlerts);
  byId("alerts-list").addEventListener("click", (event) => {
    const focus = event.target.closest("[data-alert-focus]");
    if (focus) {
      focusSegment(state.alerts[Number(focus.dataset.alertFocus)]);
      return;
    }
    const review = event.target.closest("[data-alert-review]");
    if (!review) return;
    const key = alertKey(state.alerts[Number(review.dataset.alertReview)]);
    if (reviewed.has(key)) reviewed.delete(key);
    else reviewed.add(key);
    try {
      localStorage.setItem("ec-reviewed-alerts", JSON.stringify([...reviewed]));
    } catch {
      notify("Revisión guardada solo en esta sesión.");
    }
    renderAlerts();
  });
  document.querySelectorAll("[data-ranking]").forEach((button) =>
    button.addEventListener("click", () => {
      state.ranking = button.dataset.ranking;
      renderRankings();
    }),
  );
  byId("ranking-metric").addEventListener("change", renderRankings);
  byId("export-table").addEventListener("click", () =>
    downloadCsv(`emma-demo-${state.table}.csv`, [
      columns[state.table].map((column) => column.label),
      ...filteredTableRows().map((row) =>
        columns[state.table].map((column) => row[column.key]),
      ),
    ]),
  );
  byId("export-all").addEventListener("click", () => {
    const rows = [
      ["Fuente", "Datos sintéticos · no resultados reales"],
      [
        "Período",
        `${model.dateAt(state.filters.days - 1)} / ${model.dateAt(0)}`,
      ],
      ["Plataforma", state.filters.platform || "Todas"],
      ["Producto", state.filters.product || "Todos"],
      ["Campaña", state.filters.campaign || "Todas"],
      ["Bloque", "Entidad", "Métrica", "Actual", "Anterior"],
    ];
    const previous = model.aggregate(state.previous);
    Object.entries(state.totals).forEach(([key, value]) =>
      rows.push(["Indicadores y calidad", "Total", key, value, previous[key]]),
    );
    ["products", "platforms", "campaigns"].forEach((table) =>
      rowsFor(table).forEach((row) =>
        columns[table].forEach((column) =>
          rows.push(["Detalles", row.name, column.label, row[column.key], ""]),
        ),
      ),
    );
    state.platformRows.forEach((row) =>
      [
        "posts",
        "stories",
        "reels",
        "videos",
        "likes",
        "comments",
        "shares",
        "saves",
      ].forEach((key) => rows.push(["Drivers", row.name, key, row[key], ""])),
    );
    state.alerts.forEach((alert) =>
      rows.push([
        "Alertas",
        alert.detail,
        alert.title,
        alert.change ?? "",
        alert.recommendation,
      ]),
    );
    downloadCsv("emma-demo-informe.csv", rows);
  });
  byId("open-profile").addEventListener("click", () =>
    byId("profile-dialog").showModal(),
  );
  byId("open-methodology").addEventListener("click", () =>
    byId("methodology-dialog").showModal(),
  );
  document
    .querySelectorAll(".close-dialog")
    .forEach((button) =>
      button.addEventListener("click", () => button.closest("dialog").close()),
    );
  document.querySelectorAll("dialog").forEach((dialog) =>
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          dialog.close();
      }
    }),
  );
  document.querySelectorAll(".app-header nav a").forEach((link) =>
    link.addEventListener("click", () => {
      document
        .querySelectorAll(".app-header nav a")
        .forEach((item) => item.classList.toggle("active", item === link));
    }),
  );
  if (window.Chart) {
    window.Chart.defaults.font.family = "DM Sans";
    window.Chart.defaults.color = "#738078";
  } else
    notify(
      "Gráficos no disponibles. Los datos siguen accesibles en los resúmenes y tablas.",
    );
  render();
}
