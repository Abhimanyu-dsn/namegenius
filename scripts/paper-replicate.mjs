/**
 * Replicate NameGenius web design in Paper (Project-anatomy-project).
 * Run: node scripts/paper-replicate.mjs
 */

const T = {
  bg: "#000000",
  fg: "#ffffff",
  muted: "#888888",
  accent: "#39ff14",
  accentMuted: "rgba(57, 255, 20, 0.2)",
  danger: "#ef4444",
  ctaBg: "#ffffff",
  ctaFg: "#000000",
  border: "rgba(255, 255, 255, 0.3)",
  borderStrong: "rgba(255, 255, 255, 0.8)",
};

let sessionId = null;
let callId = 0;

async function parseSSE(text) {
  for (const line of text.split("\n")) {
    if (line.startsWith("data: ")) return JSON.parse(line.slice(6));
  }
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function mcpCall(method, params = {}) {
  callId += 1;
  const res = await fetch("http://127.0.0.1:29979/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: callId, method, params }),
  });
  const s = res.headers.get("mcp-session-id");
  if (s) sessionId = s;
  return parseSSE(await res.text());
}

async function tool(name, args = {}) {
  const r = await mcpCall("tools/call", { name, arguments: args });
  const text = r.result?.content?.[0]?.text;
  if (!text) return r;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function writeHtml(targetNodeId, html, mode = "insert-children") {
  const result = await tool("write_html", { html, targetNodeId, mode });
  return result;
}

async function createArtboard(name, width, height) {
  const result = await tool("create_artboard", {
    name,
    styles: {
      display: "flex",
      flexDirection: "column",
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: T.bg,
      color: T.fg,
      padding: "32px",
      boxSizing: "border-box",
      fontFamily: "Inter, system-ui, sans-serif",
    },
  });
  const nodeId = result.nodeId ?? result.id ?? result.artboardId;
  if (!nodeId) throw new Error(`Failed to create artboard ${name}: ${JSON.stringify(result)}`);
  return nodeId;
}

function headerHtml(tagline = "") {
  return `
<div layer-name="Header" style="display:flex; flex-direction:row; align-items:center; justify-content:space-between; width:100%; padding-bottom:32px; box-sizing:border-box;">
  <div style="display:flex; flex-direction:row; align-items:baseline; gap:16px;">
    <span style="font-family:Inter,system-ui,sans-serif; font-size:24px; font-weight:700; font-style:italic; color:${T.fg};">NameGenius</span>
    ${tagline ? `<span style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:${T.muted};">${tagline}</span>` : ""}
  </div>
  <div style="display:flex; flex-direction:row; align-items:center; gap:24px;">
    <div style="display:flex; flex-direction:row; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.2em; text-transform:uppercase; color:${T.fg};">
      <span>Shortlist</span>
      <span style="display:flex; align-items:center; justify-content:center; width:28px; height:28px; border:1px solid ${T.fg}; border-radius:999px; font-size:11px;">0</span>
    </div>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${T.fg}" stroke-width="1.5"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
  </div>
</div>`;
}

function landingFooterHtml() {
  return `
<div layer-name="Footer" style="display:flex; flex-direction:row; align-items:flex-end; justify-content:space-between; width:100%; padding-top:24px; box-sizing:border-box;">
  <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${T.muted}; line-height:1.6;">
    <div>Domain checked · AI assisted</div>
    <div>Globally relevant</div>
  </div>
  <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${T.muted}; line-height:1.6; text-align:right;">
    <div>Simple</div>
    <div>Memorable</div>
    <div>Meaningful</div>
  </div>
</div>`;
}

function briefFooterHtml(step) {
  const footers = {
    1: { left: ["You can start with just this.", "We'll take it from here."], right: ["A little context", "goes a long way."] },
    2: { left: ["You can start with just this.", "We'll take it from here."], right: ["A little context", "goes a long way."] },
    3: { left: ["Real ideas", "lead to", "bolder names."], right: ["Or skip now.", "We'll still", "find great names."] },
    4: { left: ["Popular extensions.", "Bigger possibilities."], right: ["We'll check", "availability", "in real time."] },
  };
  const f = footers[step];
  return `
<div layer-name="Footer" style="display:flex; flex-direction:row; align-items:flex-end; justify-content:space-between; width:100%; padding-top:32px; box-sizing:border-box;">
  <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${T.muted}; line-height:1.6;">
    ${f.left.map((l) => `<div>${l}</div>`).join("")}
  </div>
  <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${T.muted}; line-height:1.6; text-align:right;">
    ${f.right.map((l) => `<div>${l}</div>`).join("")}
  </div>
</div>`;
}

function resultsFooterHtml() {
  return `
<div layer-name="Footer" style="display:flex; flex-direction:row; align-items:flex-end; justify-content:space-between; width:100%; padding-top:24px; border-top:1px solid rgba(255,255,255,0.1); box-sizing:border-box;">
  <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${T.muted}; line-height:1.6;">
    <div>A better name</div>
    <div>a brighter tomorrow.</div>
  </div>
  <div style="display:flex; flex-direction:row; align-items:center; gap:12px; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:${T.fg};">
    <span>Generate 5 more</span>
    <span style="display:flex; align-items:center; justify-content:center; width:32px; height:32px; border:1px solid ${T.fg}; border-radius:999px;">↻</span>
  </div>
</div>`;
}

function shortlistFooterHtml() {
  return `
<div layer-name="Footer" style="display:flex; flex-direction:row; align-items:flex-end; justify-content:space-between; width:100%; padding-top:24px; border-top:1px solid rgba(255,255,255,0.1); box-sizing:border-box;">
  <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${T.muted}; line-height:1.6;">
    <div>Simple</div>
    <div>Memorable</div>
    <div>Meaningful</div>
  </div>
  <div style="display:flex; flex-direction:row; align-items:center; gap:12px; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:${T.fg};">
    <span>Find more names</span>
    <span style="display:flex; align-items:center; justify-content:center; width:32px; height:32px; border:1px solid ${T.fg}; border-radius:999px;">→</span>
  </div>
</div>`;
}

function briefProgressHtml(step) {
  const pct = (step / 4) * 100;
  return `
<div layer-name="Progress" style="display:flex; flex-direction:column; width:100%; max-width:768px; padding-bottom:40px; box-sizing:border-box;">
  <div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.2em; text-transform:uppercase; color:${T.fg};">${String(step).padStart(2, "0")} / 04</div>
  <div style="display:flex; flex-direction:row; width:100%; height:1px; background:rgba(255,255,255,0.2); margin-top:12px;">
    <div style="width:${pct}%; height:1px; background:${T.fg};"></div>
  </div>
</div>`;
}

function inputFieldHtml(value, multiline = false) {
  const h = multiline ? "120px" : "56px";
  return `
<div style="display:flex; flex-direction:row; width:100%; max-width:768px; min-height:${h}; border:1px solid rgba(255,255,255,0.8); border-radius:12px; padding:16px 20px; box-sizing:border-box; margin-top:32px;">
  <span style="font-family:'JetBrains Mono',monospace; font-size:14px; color:${T.fg}; white-space:pre-wrap;">${value}</span>
</div>`;
}

function chipHtml(label, selected) {
  return `
<div style="display:flex; align-items:center; justify-content:center; padding:10px 16px; border-radius:999px; border:1px solid ${selected ? T.fg : "rgba(255,255,255,0.3)"}; background:${selected ? "rgba(255,255,255,0.1)" : "transparent"}; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:${T.fg};">${label}</div>`;
}

function ctaPillHtml(label) {
  return `
<div style="display:flex; align-items:center; justify-content:center; align-self:flex-start; padding:16px 32px; border-radius:999px; background:${T.ctaBg}; color:${T.ctaFg}; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; font-weight:500; margin-top:40px;">${label} →</div>`;
}

function domainRowHtml(index, slug, tld, selected = false, dimmed = true) {
  const opacity = selected ? "1" : dimmed ? "0.5" : "0.35";
  const border = selected ? `1px solid ${T.fg}` : "1px solid transparent";
  return `
<div style="display:flex; flex-direction:row; align-items:center; gap:12px; width:100%; padding:16px 20px; border-radius:12px; border:${border}; opacity:${opacity}; box-sizing:border-box;">
  <span style="font-family:'JetBrains Mono',monospace; font-size:12px; color:${T.muted}; width:24px;">${String(index).padStart(2, "0")}</span>
  <span style="font-family:Inter,system-ui,sans-serif; font-size:${selected ? "28px" : "20px"}; font-weight:900; text-transform:uppercase; flex:1; color:${T.fg};">${slug}</span>
  <span style="font-family:'JetBrains Mono',monospace; font-size:12px; color:${T.muted};">${tld}</span>
  <span style="display:flex; flex-direction:row; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:${T.muted};">
    <span style="width:8px; height:8px; border-radius:999px; background:${T.accent};"></span>
    Available
  </span>
</div>`;
}

async function buildHome(artboardId) {
  await writeHtml(artboardId, headerHtml());
  await writeHtml(
    artboardId,
    `<div layer-name="Main" style="display:flex; flex-direction:row; align-items:flex-start; justify-content:space-between; flex:1; width:100%; gap:64px; box-sizing:border-box;">
      <div style="display:flex; flex-direction:column; flex:1; max-width:640px;">
        <div style="font-family:Inter,system-ui,sans-serif; font-size:72px; font-weight:900; text-transform:uppercase; line-height:0.92; letter-spacing:-0.04em; color:${T.fg}; white-space:pre-line;">Ideas\nDeserve\nGreat\nNames.</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:${T.muted}; line-height:1.6; margin-top:32px; white-space:pre-line;">Turn your idea\ninto a name people\nremember.</div>
        ${ctaPillHtml("Start your brief")}
      </div>
      <div style="display:flex; flex-direction:column; flex:1; max-width:520px; min-height:520px;">
        ${["brandforge", "ideavault", "ownmark", "securemint", "vaultory"].map((slug, i) => domainRowHtml(i + 1, slug, ".com", i === 1)).join("")}
      </div>
    </div>`
  );
  await writeHtml(artboardId, landingFooterHtml());
}

async function buildBrief(artboardId, step, contentHtml) {
  await writeHtml(artboardId, headerHtml());
  await writeHtml(
    artboardId,
    `<div layer-name="Main" style="display:flex; flex-direction:column; flex:1; width:100%; max-width:768px; box-sizing:border-box;">
      ${briefProgressHtml(step)}
      ${contentHtml}
    </div>`
  );
  await writeHtml(artboardId, briefFooterHtml(step));
}

async function buildResults(artboardId) {
  await writeHtml(artboardId, headerHtml("Turn ideas into iconic names."));
  await writeHtml(
    artboardId,
    `<div layer-name="Main" style="display:flex; flex-direction:row; flex:1; width:100%; gap:40px; box-sizing:border-box;">
      <div style="display:flex; flex-direction:column; flex:1; min-width:180px;">
        <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:${T.muted};">Results</div>
        <div style="width:48px; height:1px; background:rgba(255,255,255,0.3); margin-top:8px;"></div>
        <div style="font-family:Inter,system-ui,sans-serif; font-size:36px; font-weight:900; text-transform:uppercase; line-height:0.95; letter-spacing:-0.03em; color:${T.fg}; margin-top:32px; white-space:pre-line;">Your names\nare ready.</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:${T.muted}; line-height:1.6; margin-top:24px; white-space:pre-line;">Scroll to explore\nfind the one that fits.</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:${T.muted}; text-decoration:underline; margin-top:24px;">Edit search</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:${T.muted}; line-height:1.6; margin-top:auto; padding-top:48px; white-space:pre-line;">5 names generated\nbased on your brief</div>
      </div>
      <div style="display:flex; flex-direction:column; flex:1.15; align-items:center; min-width:260px;">
        <span style="color:${T.muted}; font-size:20px; padding-bottom:8px;">⌃</span>
        ${[
          ["brandforge", false],
          ["namecraft", false],
          ["ideavault", true],
          ["ownmark", false],
          ["vaultline", false],
        ].map(([slug, sel], i) => domainRowHtml(i + 1, slug, ".com", sel)).join("")}
        <span style="color:${T.muted}; font-size:20px; padding-top:8px;">⌄</span>
      </div>
      <div style="display:flex; flex-direction:column; flex:1.35; min-width:300px; border-left:1px solid rgba(255,255,255,0.1); padding-left:32px; box-sizing:border-box;">
        <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <span style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:${T.muted};">Selected name</span>
          <span style="color:${T.muted};">⊟</span>
        </div>
        <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-family:Inter,system-ui,sans-serif; font-size:32px; font-weight:900; text-transform:uppercase; color:${T.fg};">ideavault <span style="font-family:'JetBrains Mono',monospace; font-size:16px; font-weight:400; color:${T.muted};">.com</span></div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:${T.muted}; margin-top:12px;">Enterprise · Vault · Secure</div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:96px; height:96px; border-radius:999px; border:4px solid ${T.accentMuted}; position:relative;">
            <div style="font-family:Inter,system-ui,sans-serif; font-size:20px; font-weight:900; color:${T.fg};">85%</div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:0.1em; text-transform:uppercase; color:${T.muted}; text-align:center;">Brand match</div>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:32px;">
          ${["Relevant to your idea", "Memorable and distinctive", "Easy to pronounce", "Matches your keywords", ".com available"].map((item) => `
          <div style="display:flex; flex-direction:row; align-items:center; gap:12px; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:${T.fg};">
            <span style="color:${T.accent};">✓</span> ${item}
          </div>`).join("")}
        </div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:${T.muted}; margin-top:32px; margin-bottom:16px;">Domain availability</div>
        ${[
          [".com", true],
          [".ai", false],
          [".co", false],
          [".io", false],
          [".app", false],
        ].map(([tld, ok]) => `
        <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; padding:4px 0;">
          <span>${tld}</span>
          <span style="display:flex; flex-direction:row; align-items:center; gap:8px; color:${T.muted};">
            <span style="width:8px; height:8px; border-radius:999px; background:${ok ? T.accent : T.danger};"></span>
            ${ok ? "Available" : "Taken"}
          </span>
        </div>`).join("")}
        <div style="display:flex; align-items:center; justify-content:center; width:100%; padding:16px 24px; border-radius:999px; background:${T.ctaBg}; color:${T.ctaFg}; font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; font-weight:500; margin-top:40px;">+ Shortlist</div>
      </div>
    </div>`
  );
  await writeHtml(artboardId, resultsFooterHtml());
}

function shortlistCardHtml(slug, score) {
  return `
<div style="display:flex; flex-direction:column; flex:1; min-width:280px; max-width:400px; padding:24px; border:1px solid rgba(255,255,255,0.25); border-radius:12px; box-sizing:border-box;">
  <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:center; margin-bottom:20px;">
    <span style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:${T.muted};">Saved name</span>
    <span style="color:${T.muted};">×</span>
  </div>
  <div style="font-family:Inter,system-ui,sans-serif; font-size:24px; font-weight:900; text-transform:uppercase; color:${T.fg};">${slug} <span style="font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:400; color:${T.muted};">.com</span></div>
  <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:flex-start; margin-top:24px;">
    <div style="display:flex; flex-direction:column; gap:8px; flex:1;">
      <div style="display:flex; flex-direction:row; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:10px; text-transform:uppercase; color:${T.muted};"><span>.com</span><span style="display:flex; align-items:center; gap:6px;"><span style="width:8px;height:8px;border-radius:999px;background:${T.accent};"></span>Available</span></div>
      <div style="display:flex; flex-direction:row; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:10px; text-transform:uppercase; color:${T.muted};"><span>.ai</span><span style="display:flex; align-items:center; gap:6px;"><span style="width:8px;height:8px;border-radius:999px;background:${T.danger};"></span>Taken</span></div>
    </div>
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:72px; height:72px; border-radius:999px; border:3px solid ${T.accentMuted};">
      <span style="font-family:Inter,system-ui,sans-serif; font-size:16px; font-weight:900;">${score}%</span>
      <span style="font-family:'JetBrains Mono',monospace; font-size:7px; text-transform:uppercase; color:${T.muted}; text-align:center;">Brand match</span>
    </div>
  </div>
  <div style="display:flex; align-items:center; justify-content:center; width:100%; padding:12px 24px; border-radius:999px; border:1px solid rgba(255,255,255,0.4); font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:${T.fg}; margin-top:24px;">Remove from shortlist</div>
</div>`;
}

async function buildShortlist(artboardId) {
  await writeHtml(artboardId, headerHtml("Names worth keeping."));
  await writeHtml(
    artboardId,
    `<div layer-name="Main" style="display:flex; flex-direction:column; flex:1; width:100%; box-sizing:border-box;">
      <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:${T.muted};">Shortlist</div>
      <div style="width:48px; height:1px; background:rgba(255,255,255,0.3); margin-top:8px;"></div>
      <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:flex-end; margin-top:32px;">
        <div>
          <div style="font-family:Inter,system-ui,sans-serif; font-size:40px; font-weight:900; text-transform:uppercase; line-height:0.95; letter-spacing:-0.03em; color:${T.fg}; white-space:pre-line;">Your\nfavorites.</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:${T.muted}; margin-top:24px;">3 names saved for later.</div>
        </div>
        <span style="font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:${T.muted}; text-decoration:underline;">Clear all</span>
      </div>
      <div style="display:flex; flex-direction:row; flex-wrap:wrap; gap:24px; margin-top:48px;">
        ${shortlistCardHtml("ideavault", 85)}
        ${shortlistCardHtml("brandforge", 92)}
        ${shortlistCardHtml("vaultory", 78)}
      </div>
    </div>`
  );
  await writeHtml(artboardId, shortlistFooterHtml());
}

async function main() {
  await mcpCall("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "paper-replicate", version: "1.0" },
  });
  await mcpCall("notifications/initialized", {}, 0);

  const info = await tool("get_basic_info");
  console.log("File:", info.fileName, "| Existing artboards:", info.artboardCount);

  const briefSteps = [
    {
      name: "Brief — 01 Your idea",
      step: 1,
      content: `
        <div style="font-family:Inter,system-ui,sans-serif; font-size:48px; font-weight:900; text-transform:uppercase; line-height:0.92; letter-spacing:-0.03em; color:${T.fg};">Your idea</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:${T.fg}; line-height:1.6; margin-top:16px; max-width:520px;">What are you naming? The name you already have, or the core concept you want to name.</div>
        ${inputFieldHtml("an AI tool for designers")}
        <div style="display:flex; flex-direction:row; flex-wrap:wrap; gap:12px; margin-top:24px;">
          ${chipHtml("Company", false)}${chipHtml("Product", true)}${chipHtml("App", false)}${chipHtml("Project", false)}${chipHtml("Website", false)}
        </div>
        ${ctaPillHtml("Continue")}`,
    },
    {
      name: "Brief — 02 What you're building",
      step: 2,
      content: `
        <div style="font-family:Inter,system-ui,sans-serif; font-size:48px; font-weight:900; text-transform:uppercase; line-height:0.92; letter-spacing:-0.03em; color:${T.fg}; white-space:pre-line;">What you're\nbuilding</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:${T.fg}; line-height:1.6; margin-top:16px;">Tell us what the company, product or project does.</div>
        ${inputFieldHtml("Helps designers generate UI ideas using AI", true)}
        ${ctaPillHtml("Continue")}`,
    },
    {
      name: "Brief — 03 Competitors",
      step: 3,
      content: `
        <div style="font-family:Inter,system-ui,sans-serif; font-size:48px; font-weight:900; text-transform:uppercase; line-height:0.92; letter-spacing:-0.03em; color:${T.fg}; white-space:pre-line;">Competitors\n&amp; keywords</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:${T.fg}; line-height:1.6; margin-top:16px;">Add relevant competitors, words, concepts or references. (optional)</div>
        ${inputFieldHtml("Figma, Framer, design, AI")}
        <div style="display:flex; flex-direction:row; gap:24px; margin-top:32px;">
          <span style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:${T.muted}; text-decoration:underline;">Skip</span>
        </div>
        ${ctaPillHtml("Continue")}`,
    },
    {
      name: "Brief — 04 Domains",
      step: 4,
      content: `
        <div style="font-family:Inter,system-ui,sans-serif; font-size:48px; font-weight:900; text-transform:uppercase; line-height:0.92; letter-spacing:-0.03em; color:${T.fg}; white-space:pre-line;">Preferred\ndomains</div>
        <div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:${T.fg}; line-height:1.6; margin-top:16px;">Which domain extensions do you want to prioritize?</div>
        <div style="display:flex; flex-direction:row; flex-wrap:wrap; gap:12px; margin-top:32px;">
          ${chipHtml(".com", true)}${chipHtml(".ai", true)}${chipHtml(".io", false)}${chipHtml(".co", false)}${chipHtml(".app", false)}${chipHtml("+ More", false)}
        </div>
        ${ctaPillHtml("Find names")}`,
    },
  ];

  const created = [];

  const homeId = await createArtboard("Home — Landing", 1440, 900);
  await buildHome(homeId);
  created.push({ name: "Home — Landing", id: homeId });

  for (const brief of briefSteps) {
    const id = await createArtboard(brief.name, 1440, 900);
    await buildBrief(id, brief.step, brief.content);
    created.push({ name: brief.name, id });
  }

  const resultsId = await createArtboard("Results", 1440, 1024);
  await buildResults(resultsId);
  created.push({ name: "Results", id: resultsId });

  const shortlistId = await createArtboard("Shortlist", 1440, 1024);
  await buildShortlist(shortlistId);
  created.push({ name: "Shortlist", id: shortlistId });

  console.log("\nCreated artboards:");
  for (const a of created) {
    console.log(`  - ${a.name} (${a.id})`);
  }

  const final = await tool("get_basic_info");
  console.log("\nTotal artboards:", final.artboardCount);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
