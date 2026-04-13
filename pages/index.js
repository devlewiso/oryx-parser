import { useEffect } from 'react';
import Head from 'next/head';

function switchTab(btn, id) {
  document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.code-block').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}

function switchApi(item, id) {
  document.querySelectorAll('.api-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.api-snippet').forEach(s => s.classList.remove('active'));
  item.classList.add('active');
  document.getElementById('api-' + id).classList.add('active');
}

function copyInstall(el) {
  navigator.clipboard?.writeText('npm install oryx-parser');
  const orig = el.innerHTML;
  el.innerHTML = '<span class="prompt">✓</span> <span>copied!</span>';
  setTimeout(() => { el.innerHTML = orig; }, 1500);
}

const heroCodeHTML = `
<div class="code-block active" id="tab-oryx"><pre><span class="tok-cmt"># 88 tokens vs 148 in JSON</span>
<span class="tok-dir">@alias</span><span class="tok-op">{</span><span class="tok-key">firstName</span><span class="tok-op">:</span> <span class="tok-val">fn</span><span class="tok-op">,</span> <span class="tok-key">lastName</span><span class="tok-op">:</span> <span class="tok-val">ln</span><span class="tok-op">}</span>

<span class="tok-key">users</span><span class="tok-op">[</span><span class="tok-num">3</span><span class="tok-op">]{</span><span class="tok-val">id</span><span class="tok-op">,</span><span class="tok-val">fn</span><span class="tok-op">,</span><span class="tok-val">ln</span><span class="tok-op">,</span><span class="tok-val">role</span><span class="tok-op">}:</span>
  <span class="tok-num">1</span><span class="tok-op">,</span> Alice<span class="tok-op">,</span> Smith<span class="tok-op">,</span> admin
  <span class="tok-num">2</span><span class="tok-op">,</span> Bob<span class="tok-op">,</span> Jones<span class="tok-op">,</span> user
  <span class="tok-num">3</span><span class="tok-op">,</span> Carol<span class="tok-op">,</span> Lee<span class="tok-op">,</span> editor

<span class="tok-key">config</span><span class="tok-op">:</span>
  <span class="tok-key">host</span><span class="tok-op">:</span> <span class="tok-val">localhost</span>
  <span class="tok-key">port</span><span class="tok-op">:</span> <span class="tok-num">3000</span>
  <span class="tok-key">active</span><span class="tok-op">:</span> <span class="tok-bool">true</span>
  <span class="tok-key">secret</span><span class="tok-op">:</span> <span class="tok-null">null</span></pre></div>

<div class="code-block" id="tab-json"><pre><span class="tok-op">{</span>
  <span class="tok-str">"users"</span><span class="tok-op">: [</span>
    <span class="tok-op">{</span> <span class="tok-str">"id"</span><span class="tok-op">:</span> <span class="tok-num">1</span><span class="tok-op">,</span> <span class="tok-str">"firstName"</span><span class="tok-op">:</span> <span class="tok-str">"Alice"</span><span class="tok-op">,</span>
      <span class="tok-str">"lastName"</span><span class="tok-op">:</span> <span class="tok-str">"Smith"</span><span class="tok-op">,</span> <span class="tok-str">"role"</span><span class="tok-op">:</span> <span class="tok-str">"admin"</span> <span class="tok-op">},</span>
    <span class="tok-op">{</span> <span class="tok-str">"id"</span><span class="tok-op">:</span> <span class="tok-num">2</span><span class="tok-op">,</span> <span class="tok-str">"firstName"</span><span class="tok-op">:</span> <span class="tok-str">"Bob"</span><span class="tok-op">,</span>
      <span class="tok-str">"lastName"</span><span class="tok-op">:</span> <span class="tok-str">"Jones"</span><span class="tok-op">,</span> <span class="tok-str">"role"</span><span class="tok-op">:</span> <span class="tok-str">"user"</span> <span class="tok-op">},</span>
    <span class="tok-op">{</span> <span class="tok-str">"id"</span><span class="tok-op">:</span> <span class="tok-num">3</span><span class="tok-op">,</span> <span class="tok-str">"firstName"</span><span class="tok-op">:</span> <span class="tok-str">"Carol"</span><span class="tok-op">,</span>
      <span class="tok-str">"lastName"</span><span class="tok-op">:</span> <span class="tok-str">"Lee"</span><span class="tok-op">,</span> <span class="tok-str">"role"</span><span class="tok-op">:</span> <span class="tok-str">"editor"</span> <span class="tok-op">}</span>
  <span class="tok-op">],</span>
  <span class="tok-str">"config"</span><span class="tok-op">: {</span>
    <span class="tok-str">"host"</span><span class="tok-op">:</span> <span class="tok-str">"localhost"</span><span class="tok-op">,</span>
    <span class="tok-str">"port"</span><span class="tok-op">:</span> <span class="tok-num">3000</span><span class="tok-op">,</span>
    <span class="tok-str">"active"</span><span class="tok-op">:</span> <span class="tok-bool">true</span><span class="tok-op">,</span>
    <span class="tok-str">"secret"</span><span class="tok-op">:</span> <span class="tok-null">null</span>
  <span class="tok-op">}</span>
<span class="tok-op">}</span></pre></div>

<div class="code-block" id="tab-usage"><pre><span class="tok-fn">import</span> <span class="tok-op">{</span> <span class="tok-val">parse</span><span class="tok-op">,</span> <span class="tok-val">encode</span><span class="tok-op">,</span> <span class="tok-val">get</span><span class="tok-op">,</span> <span class="tok-val">schema</span> <span class="tok-op">}</span>
  <span class="tok-fn">from</span> <span class="tok-str">'oryx-parser'</span><span class="tok-op">;</span>

<span class="tok-cmt">// Parse ORYX → JSON</span>
<span class="tok-fn">const</span> data <span class="tok-op">=</span> <span class="tok-val">parse</span><span class="tok-op">(</span>oryxString<span class="tok-op">);</span>

<span class="tok-cmt">// Access nested values</span>
<span class="tok-val">get</span><span class="tok-op">(</span>data<span class="tok-op">,</span> <span class="tok-str">'users.0.firstName'</span><span class="tok-op">);</span>
<span class="tok-cmt">// → "Alice"</span>

<span class="tok-cmt">// Validate shape</span>
<span class="tok-val">schema</span><span class="tok-op">(</span>data<span class="tok-op">, {</span>
  <span class="tok-key">users</span><span class="tok-op">: [{</span> <span class="tok-key">id</span><span class="tok-op">:</span> <span class="tok-str">'number'</span><span class="tok-op">,</span> <span class="tok-key">firstName</span><span class="tok-op">:</span> <span class="tok-str">'string'</span> <span class="tok-op">}],</span>
<span class="tok-op">});</span>

<span class="tok-cmt">// Encode JSON → ORYX</span>
<span class="tok-fn">const</span> oryx <span class="tok-op">=</span> <span class="tok-val">encode</span><span class="tok-op">(</span>data<span class="tok-op">,</span> <span class="tok-op">{</span> <span class="tok-key">aliases</span><span class="tok-op">:</span> <span class="tok-bool">true</span> <span class="tok-op">});</span></pre></div>
`;

const apiSnippetsHTML = `
<div class="api-snippet active" id="api-parse"><pre><span class="tok-fn">import</span> <span class="tok-op">{</span> <span class="tok-val">parse</span> <span class="tok-op">}</span> <span class="tok-fn">from</span> <span class="tok-str">'oryx-parser'</span><span class="tok-op">;</span>

<span class="tok-cmt">// throws OryxError on bad input</span>
<span class="tok-fn">const</span> data <span class="tok-op">=</span> <span class="tok-val">parse</span><span class="tok-op">(\`</span>
  <span class="tok-key">users</span><span class="tok-op">[</span><span class="tok-num">2</span><span class="tok-op">]{</span><span class="tok-val">id</span><span class="tok-op">,</span><span class="tok-val">name</span><span class="tok-op">}:</span>
    <span class="tok-num">1</span><span class="tok-op">,</span> Alice
    <span class="tok-num">2</span><span class="tok-op">,</span> Bob
<span class="tok-op">\`);</span>

<span class="tok-cmt">// safe mode — returns null instead</span>
<span class="tok-fn">const</span> safe <span class="tok-op">=</span> <span class="tok-val">parse</span><span class="tok-op">(</span>untrusted<span class="tok-op">, {</span> <span class="tok-key">safe</span><span class="tok-op">:</span> <span class="tok-bool">true</span> <span class="tok-op">});</span></pre></div>

<div class="api-snippet" id="api-encode"><pre><span class="tok-fn">import</span> <span class="tok-op">{</span> <span class="tok-val">encode</span> <span class="tok-op">}</span> <span class="tok-fn">from</span> <span class="tok-str">'oryx-parser'</span><span class="tok-op">;</span>

<span class="tok-fn">const</span> oryx <span class="tok-op">=</span> <span class="tok-val">encode</span><span class="tok-op">({</span>
  <span class="tok-key">users</span><span class="tok-op">: [</span>
    <span class="tok-op">{</span> <span class="tok-key">id</span><span class="tok-op">:</span> <span class="tok-num">1</span><span class="tok-op">,</span> <span class="tok-key">name</span><span class="tok-op">:</span> <span class="tok-str">'Alice'</span> <span class="tok-op">},</span>
    <span class="tok-op">{</span> <span class="tok-key">id</span><span class="tok-op">:</span> <span class="tok-num">2</span><span class="tok-op">,</span> <span class="tok-key">name</span><span class="tok-op">:</span> <span class="tok-str">'Bob'</span> <span class="tok-op">},</span>
  <span class="tok-op">],</span>
<span class="tok-op">}, {</span>
  <span class="tok-key">indent</span><span class="tok-op">:</span>  <span class="tok-num">2</span><span class="tok-op">,</span>
  <span class="tok-key">tabular</span><span class="tok-op">:</span> <span class="tok-bool">true</span><span class="tok-op">,</span>
  <span class="tok-key">aliases</span><span class="tok-op">:</span> <span class="tok-bool">false</span><span class="tok-op">,</span>
<span class="tok-op">});</span>
<span class="tok-cmt">// → users[2]{id,name}:\n  1, Alice\n  2, Bob</span></pre></div>

<div class="api-snippet" id="api-validate"><pre><span class="tok-fn">import</span> <span class="tok-op">{</span> <span class="tok-val">validate</span> <span class="tok-op">}</span> <span class="tok-fn">from</span> <span class="tok-str">'oryx-parser'</span><span class="tok-op">;</span>

<span class="tok-fn">const</span> result <span class="tok-op">=</span> <span class="tok-val">validate</span><span class="tok-op">(</span><span class="tok-str">'host [bad'</span><span class="tok-op">);</span>

<span class="tok-cmt">// {</span>
<span class="tok-cmt">//   valid: false,</span>
<span class="tok-cmt">//   error: "[ORYX] Expected array size or ]</span>
<span class="tok-cmt">//     host [bad</span>
<span class="tok-cmt">//          ^",</span>
<span class="tok-cmt">//   line: 1, column: 7</span>
<span class="tok-cmt">// }</span></pre></div>

<div class="api-snippet" id="api-get"><pre><span class="tok-fn">import</span> <span class="tok-op">{</span> <span class="tok-val">get</span> <span class="tok-op">}</span> <span class="tok-fn">from</span> <span class="tok-str">'oryx-parser'</span><span class="tok-op">;</span>

<span class="tok-fn">const</span> data <span class="tok-op">=</span> <span class="tok-val">parse</span><span class="tok-op">(\`</span>
  <span class="tok-key">users</span><span class="tok-op">[]{</span><span class="tok-val">id</span><span class="tok-op">,</span><span class="tok-val">name</span><span class="tok-op">}:</span>
    <span class="tok-num">1</span><span class="tok-op">,</span> Alice
<span class="tok-op">\`);</span>

<span class="tok-val">get</span><span class="tok-op">(</span>data<span class="tok-op">,</span> <span class="tok-str">'users.0.name'</span><span class="tok-op">);</span>    <span class="tok-cmt">// "Alice"</span>
<span class="tok-val">get</span><span class="tok-op">(</span>data<span class="tok-op">,</span> <span class="tok-str">'users.5.name'</span><span class="tok-op">, </span><span class="tok-str">'?'</span><span class="tok-op">)</span><span class="tok-op">;</span> <span class="tok-cmt">// "?"</span>
<span class="tok-val">get</span><span class="tok-op">(</span>data<span class="tok-op">,</span> <span class="tok-str">'missing'</span><span class="tok-op">)</span><span class="tok-op">;</span>          <span class="tok-cmt">// null</span></pre></div>

<div class="api-snippet" id="api-has"><pre><span class="tok-fn">import</span> <span class="tok-op">{</span> <span class="tok-val">has</span> <span class="tok-op">}</span> <span class="tok-fn">from</span> <span class="tok-str">'oryx-parser'</span><span class="tok-op">;</span>

<span class="tok-fn">const</span> data <span class="tok-op">=</span> <span class="tok-val">parse</span><span class="tok-op">(</span><span class="tok-str">'key: value\nnullKey: null'</span><span class="tok-op">);</span>

<span class="tok-val">has</span><span class="tok-op">(</span>data<span class="tok-op">,</span> <span class="tok-str">'key'</span><span class="tok-op">)</span><span class="tok-op">;</span>     <span class="tok-cmt">// true</span>
<span class="tok-val">has</span><span class="tok-op">(</span>data<span class="tok-op">,</span> <span class="tok-str">'nullKey'</span><span class="tok-op">)</span><span class="tok-op">;</span> <span class="tok-cmt">// true (null exists)</span>
<span class="tok-val">has</span><span class="tok-op">(</span>data<span class="tok-op">,</span> <span class="tok-str">'missing'</span><span class="tok-op">)</span><span class="tok-op">;</span> <span class="tok-cmt">// false</span></pre></div>

<div class="api-snippet" id="api-schema"><pre><span class="tok-fn">import</span> <span class="tok-op">{</span> <span class="tok-val">schema</span> <span class="tok-op">}</span> <span class="tok-fn">from</span> <span class="tok-str">'oryx-parser'</span><span class="tok-op">;</span>

<span class="tok-fn">const</span> result <span class="tok-op">=</span> <span class="tok-val">schema</span><span class="tok-op">(</span>data<span class="tok-op">, {</span>
  <span class="tok-key">users</span><span class="tok-op">: [{</span>
    <span class="tok-key">id</span><span class="tok-op">:</span>   <span class="tok-str">'number'</span><span class="tok-op">,</span>
    <span class="tok-key">name</span><span class="tok-op">:</span> <span class="tok-str">'string'</span><span class="tok-op">,</span>
    <span class="tok-key">role</span><span class="tok-op">:</span> <span class="tok-str">'any'</span><span class="tok-op">,</span>
  <span class="tok-op">}],</span>
<span class="tok-op">});</span>

<span class="tok-cmt">// { valid: true, errors: [] }</span></pre></div>

<div class="api-snippet" id="api-stringify"><pre><span class="tok-fn">import</span> <span class="tok-op">{</span> <span class="tok-val">stringify</span> <span class="tok-op">}</span> <span class="tok-fn">from</span> <span class="tok-str">'oryx-parser'</span><span class="tok-op">;</span>

<span class="tok-cmt">// Same as encode() — familiar name</span>
<span class="tok-cmt">// for JSON.stringify() users</span>

<span class="tok-fn">const</span> out <span class="tok-op">=</span> <span class="tok-val">stringify</span><span class="tok-op">({</span>
  <span class="tok-key">host</span><span class="tok-op">:</span> <span class="tok-str">'localhost'</span><span class="tok-op">,</span>
  <span class="tok-key">port</span><span class="tok-op">:</span> <span class="tok-num">3000</span><span class="tok-op">,</span>
<span class="tok-op">});</span>
<span class="tok-cmt">// → host: localhost\nport: 3000</span></pre></div>
`;

const quickstartHTML = `<pre><span class="tok-fn">import</span> <span class="tok-op">{</span>
  <span class="tok-val">parse</span><span class="tok-op">,</span> <span class="tok-val">encode</span><span class="tok-op">,</span> <span class="tok-val">validate</span><span class="tok-op">,</span>
  <span class="tok-val">get</span><span class="tok-op">,</span> <span class="tok-val">schema</span>
<span class="tok-op">}</span> <span class="tok-fn">from</span> <span class="tok-str">'oryx-parser'</span><span class="tok-op">;</span>

<span class="tok-fn">const</span> src <span class="tok-op">=</span> <span class="tok-op">\`</span>
<span class="tok-key">products</span><span class="tok-op">[]{</span><span class="tok-val">id</span><span class="tok-op">,</span><span class="tok-val">name</span><span class="tok-op">,</span><span class="tok-val">price</span><span class="tok-op">}:</span>
  <span class="tok-num">1</span><span class="tok-op">,</span> Laptop<span class="tok-op">,</span> <span class="tok-num">1299</span>
  <span class="tok-num">2</span><span class="tok-op">,</span> Mouse<span class="tok-op">,</span>  <span class="tok-num">49</span>
<span class="tok-op">\`</span><span class="tok-op">;</span>

<span class="tok-cmt">// 1. Validate before parsing</span>
<span class="tok-fn">const</span> <span class="tok-op">{</span> valid <span class="tok-op">}</span> <span class="tok-op">=</span> <span class="tok-val">validate</span><span class="tok-op">(</span>src<span class="tok-op">);</span>

<span class="tok-cmt">// 2. Parse</span>
<span class="tok-fn">const</span> data <span class="tok-op">=</span> <span class="tok-val">parse</span><span class="tok-op">(</span>src<span class="tok-op">)!</span><span class="tok-op">;</span>

<span class="tok-cmt">// 3. Access</span>
<span class="tok-val">get</span><span class="tok-op">(</span>data<span class="tok-op">,</span> <span class="tok-str">'products.0.name'</span><span class="tok-op">)</span><span class="tok-op">;</span> <span class="tok-cmt">// "Laptop"</span>

<span class="tok-cmt">// 4. Validate shape</span>
<span class="tok-val">schema</span><span class="tok-op">(</span>data<span class="tok-op">, {</span>
  <span class="tok-key">products</span><span class="tok-op">: [{</span> <span class="tok-key">price</span><span class="tok-op">:</span> <span class="tok-str">'number'</span> <span class="tok-op">}],</span>
<span class="tok-op">});</span>

<span class="tok-cmt">// 5. Re-encode with aliases</span>
<span class="tok-val">encode</span><span class="tok-op">(</span>data<span class="tok-op">, {</span> <span class="tok-key">aliases</span><span class="tok-op">:</span> <span class="tok-bool">true</span> <span class="tok-op">});</span></pre>`;

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelector('.bar-fill')?.style.setProperty('animation-play-state', 'running');
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.savings-bar').forEach(el => barObserver.observe(el));

    return () => {
      observer.disconnect();
      barObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <title>ORYX — Token-Efficient Format for LLMs</title>
      </Head>

      {/* NAV */}
      <nav>
        <span className="nav-logo">ORYX</span>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#playground">Playground</a>
          <a href="#api">API</a>
          <a href="#compare">Compare</a>
          <a href="#install">Install</a>
        </div>
        <a className="nav-playground" href="https://oryx-studio.neuralcodelab.com/" target="_blank" rel="noreferrer">Try it live ↗</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-left">
          <div className="hero-badge">v0.3.0 — now with encode, validate &amp; schema</div>
          <h1>
            Data format<br />
            built for<br />
            <span className="accent">LLMs.</span>
          </h1>
          <p className="hero-sub">
            ORYX cuts token usage by 30–60% versus JSON, while staying human-readable.
            Parse, encode, validate and access structured data — designed from the ground up for AI pipelines.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="https://oryx-studio.neuralcodelab.com/" target="_blank" rel="noreferrer">Try the playground →</a>
            <a
              href="#install"
              style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', padding: '0.75rem 1.6rem', borderRadius: '6px', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--text)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >Get started</a>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div className="install-cmd" onClick={(e) => copyInstall(e.currentTarget)}>
              <span className="prompt">$</span>
              <span>npm install oryx-parser</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <span className="saving-badge">~42% fewer tokens</span>
          <div className="code-panel">
            <div className="code-panel-header">
              <div className="dots">
                <div className="dot dot-r"></div>
                <div className="dot dot-y"></div>
                <div className="dot dot-g"></div>
              </div>
              <div className="code-tabs">
                <button className="code-tab active" onClick={(e) => switchTab(e.currentTarget, 'oryx')}>ORYX</button>
                <button className="code-tab" onClick={(e) => switchTab(e.currentTarget, 'json')}>JSON</button>
                <button className="code-tab" onClick={(e) => switchTab(e.currentTarget, 'usage')}>Usage</button>
              </div>
              <span></span>
            </div>
            <div className="code-body" dangerouslySetInnerHTML={{ __html: heroCodeHTML }} />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stats-inner">
          <div className="stat-item fade-up">
            <div className="stat-num">42%</div>
            <div className="stat-label">avg token reduction</div>
          </div>
          <div className="stat-item fade-up">
            <div className="stat-num">40</div>
            <div className="stat-label">tests passing</div>
          </div>
          <div className="stat-item fade-up">
            <div className="stat-num">7</div>
            <div className="stat-label">API functions</div>
          </div>
          <div className="stat-item fade-up">
            <div className="stat-num">12kb</div>
            <div className="stat-label">package size</div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features">
        <div className="section-tag">What's included</div>
        <h2 className="section-title">Everything you need.<br />Nothing you don't.</h2>
        <p className="section-sub">v0.3.0 ships a complete toolkit — parser, encoder, validator, schema checker and CLI all in one 12 kB package.</p>

        <div className="features-grid">
          <div className="feature-card fade-up">
            <div className="feature-icon">parse()</div>
            <div className="feature-title">Full-featured parser</div>
            <div className="feature-desc">Tabular arrays, nested objects, @alias compression, pipe strings, inline arrays, null values and scientific notation.</div>
          </div>
          <div className="feature-card fade-up">
            <div className="feature-icon">encode()</div>
            <div className="feature-title">JSON → ORYX encoder <span className="feature-new">v0.3</span></div>
            <div className="feature-desc">Converts any JS object to compact ORYX. Auto-detects uniform arrays for tabular format. Generates @alias blocks for long field names.</div>
          </div>
          <div className="feature-card fade-up">
            <div className="feature-icon">validate()</div>
            <div className="feature-title">Error messages with caret <span className="feature-new">v0.3</span></div>
            <div className="feature-desc">Validate without throwing. Returns line, column and a <code>^</code> pointer to the exact error — like TypeScript or Rust.</div>
          </div>
          <div className="feature-card fade-up">
            <div className="feature-icon">get()</div>
            <div className="feature-title">Dot-path accessor <span className="feature-new">v0.3</span></div>
            <div className="feature-desc"><code>get(data, 'users.0.name', fallback)</code> — supports array indices, null-safe traversal and default values.</div>
          </div>
          <div className="feature-card fade-up">
            <div className="feature-icon">schema()</div>
            <div className="feature-title">Shape validation <span className="feature-new">v0.3</span></div>
            <div className="feature-desc">Validate LLM output against an expected shape. Supports nested objects, typed arrays and <code>'any'</code> wildcards.</div>
          </div>
          <div className="feature-card fade-up">
            <div className="feature-icon">$ oryx</div>
            <div className="feature-title">CLI tool <span className="feature-new">v0.3</span></div>
            <div className="feature-desc"><code>npx oryx parse</code>, <code>encode</code>, <code>validate</code> and <code>roundtrip</code>. Flags for indent, aliases and safe mode.</div>
          </div>
        </div>
      </section>

      {/* API */}
      <section id="api" style={{ paddingTop: 0 }}>
        <div className="section-tag">Reference</div>
        <h2 className="section-title">Simple API surface.</h2>
        <p className="section-sub">Seven functions. Fully typed. Works in Node.js, Deno, Bun and any modern bundler via ESM.</p>

        <div className="api-grid">
          <div className="api-list">
            <div className="api-item active" onClick={(e) => switchApi(e.currentTarget, 'parse')}>
              <div className="api-name">parse(input, opts?)</div>
              <div className="api-sig">string → OryxObject | null</div>
            </div>
            <div className="api-item" onClick={(e) => switchApi(e.currentTarget, 'encode')}>
              <div className="api-name">encode(data, opts?)</div>
              <div className="api-sig">OryxObject → string</div>
            </div>
            <div className="api-item" onClick={(e) => switchApi(e.currentTarget, 'validate')}>
              <div className="api-name">validate(input)</div>
              <div className="api-sig">string → ValidationResult</div>
            </div>
            <div className="api-item" onClick={(e) => switchApi(e.currentTarget, 'get')}>
              <div className="api-name">get(data, path, default?)</div>
              <div className="api-sig">OryxObject → OryxValue</div>
            </div>
            <div className="api-item" onClick={(e) => switchApi(e.currentTarget, 'has')}>
              <div className="api-name">has(data, path)</div>
              <div className="api-sig">OryxObject → boolean</div>
            </div>
            <div className="api-item" onClick={(e) => switchApi(e.currentTarget, 'schema')}>
              <div className="api-name">schema(data, shape)</div>
              <div className="api-sig">OryxObject → SchemaResult</div>
            </div>
            <div className="api-item" onClick={(e) => switchApi(e.currentTarget, 'stringify')}>
              <div className="api-name">stringify(data, opts?)</div>
              <div className="api-sig">alias for encode()</div>
            </div>
          </div>

          <div className="api-code-panel">
            <div className="api-code-header">example</div>
            <div className="api-code-body" dangerouslySetInnerHTML={{ __html: apiSnippetsHTML }} />
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section id="compare" style={{ paddingTop: 0 }}>
        <div className="section-tag">Token efficiency</div>
        <h2 className="section-title">Less noise.<br />More signal.</h2>
        <p className="section-sub">Every character counts when you're paying per token. ORYX strips the structural overhead JSON was never designed to lose.</p>

        <div className="compare-wrap">
          <div className="compare-block">
            <div className="compare-header">
              <span className="compare-lang" style={{ color: 'var(--muted)' }}>JSON</span>
              <span className="compare-tokens tokens-bad">148 tokens</span>
            </div>
            <div className="compare-code"><pre><span className="tok-op">{'{'}</span>{'\n'}  <span className="tok-str">"products"</span><span className="tok-op">: [</span>{'\n'}    <span className="tok-op">{'{'}</span>{'\n'}      <span className="tok-str">"id"</span><span className="tok-op">:</span> <span className="tok-num">1</span><span className="tok-op">,</span>{'\n'}      <span className="tok-str">"name"</span><span className="tok-op">:</span> <span className="tok-str">"Laptop Pro"</span><span className="tok-op">,</span>{'\n'}      <span className="tok-str">"price"</span><span className="tok-op">:</span> <span className="tok-num">1299</span><span className="tok-op">,</span>{'\n'}      <span className="tok-str">"inStock"</span><span className="tok-op">:</span> <span className="tok-bool">true</span>{'\n'}    <span className="tok-op">{'}'}</span><span className="tok-op">,</span>{'\n'}    <span className="tok-op">{'{'}</span>{'\n'}      <span className="tok-str">"id"</span><span className="tok-op">:</span> <span className="tok-num">2</span><span className="tok-op">,</span>{'\n'}      <span className="tok-str">"name"</span><span className="tok-op">:</span> <span className="tok-str">"Wireless Mouse"</span><span className="tok-op">,</span>{'\n'}      <span className="tok-str">"price"</span><span className="tok-op">:</span> <span className="tok-num">49</span><span className="tok-op">,</span>{'\n'}      <span className="tok-str">"inStock"</span><span className="tok-op">:</span> <span className="tok-bool">true</span>{'\n'}    <span className="tok-op">{'}'}</span><span className="tok-op">,</span>{'\n'}    <span className="tok-op">{'{'}</span>{'\n'}      <span className="tok-str">"id"</span><span className="tok-op">:</span> <span className="tok-num">3</span><span className="tok-op">,</span>{'\n'}      <span className="tok-str">"name"</span><span className="tok-op">:</span> <span className="tok-str">"USB-C Hub"</span><span className="tok-op">,</span>{'\n'}      <span className="tok-str">"price"</span><span className="tok-op">:</span> <span className="tok-num">79</span><span className="tok-op">,</span>{'\n'}      <span className="tok-str">"inStock"</span><span className="tok-op">:</span> <span className="tok-bool">false</span>{'\n'}    <span className="tok-op">{'}'}</span>{'\n'}  <span className="tok-op">]</span>{'\n'}<span className="tok-op">{'}'}</span></pre></div>
          </div>

          <div className="compare-block">
            <div className="compare-header">
              <span className="compare-lang" style={{ color: 'var(--accent)' }}>ORYX</span>
              <span className="compare-tokens tokens-good">52 tokens</span>
            </div>
            <div className="compare-code"><pre><span className="tok-key">products</span><span className="tok-op">[3]{'{'}</span><span className="tok-val">id</span><span className="tok-op">,</span><span className="tok-val">name</span><span className="tok-op">,</span><span className="tok-val">price</span><span className="tok-op">,</span><span className="tok-val">inStock</span><span className="tok-op">{'}'}:</span>{'\n'}  <span className="tok-num">1</span><span className="tok-op">,</span> Laptop Pro<span className="tok-op">,</span>    <span className="tok-num">1299</span><span className="tok-op">,</span> <span className="tok-bool">true</span>{'\n'}  <span className="tok-num">2</span><span className="tok-op">,</span> Wireless Mouse<span className="tok-op">,</span> <span className="tok-num">49</span><span className="tok-op">,</span>   <span className="tok-bool">true</span>{'\n'}  <span className="tok-num">3</span><span className="tok-op">,</span> USB-C Hub<span className="tok-op">,</span>     <span className="tok-num">79</span><span className="tok-op">,</span>   <span className="tok-bool">false</span></pre></div>
          </div>
        </div>

        <div className="savings-bar">
          <div className="bar-label">Token savings — tabular data</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ '--fill-w': '64.9%' }}></div>
          </div>
          <div className="bar-meta">
            <span>JSON: 148 tokens</span>
            <span className="bar-pct">64.9% saved → 52 tokens</span>
          </div>
        </div>
      </section>

      {/* PLAYGROUND */}
      <div className="playground-section" id="playground">
        <div className="playground-inner">
          <div className="playground-cta">
            <div className="section-tag">ORYX Studio</div>
            <h2 className="section-title">Write ORYX.<br />See results <span style={{ color: 'var(--accent)' }}>instantly.</span></h2>
            <p className="section-sub" style={{ marginBottom: 0 }}>
              ORYX Studio is an interactive playground where you can write ORYX format, parse it to JSON, encode objects back, and measure token savings — all in the browser. No install needed.
            </p>
            <div className="playground-pills">
              <span className="pill pill-on">● Live parsing</span>
              <span className="pill pill-on">● Token counter</span>
              <span className="pill pill-on">● JSON ↔ ORYX</span>
              <span className="pill">Schema validator</span>
              <span className="pill">Share snippets</span>
              <span className="pill">Examples library</span>
            </div>
            <div>
              <a className="btn-playground" href="https://oryx-studio.neuralcodelab.com/" target="_blank" rel="noreferrer">
                Open ORYX Studio ↗
              </a>
              <a className="btn-playground-ghost" href="#install">
                or install locally
              </a>
            </div>
          </div>

          <div className="playground-visual">
            <div className="glow-dot"></div>
            <div className="playground-window">
              <div className="pw-bar">
                <div className="dots">
                  <div className="dot dot-r"></div>
                  <div className="dot dot-y"></div>
                  <div className="dot dot-g"></div>
                </div>
                <div className="pw-url">
                  <span className="pw-url-lock">🔒</span>
                  <span>oryx-studio.neuralcodelab.com</span>
                </div>
              </div>
              <div className="pw-panels">
                <div className="pw-panel">
                  <div className="pw-panel-label">ORYX input</div>
                  <pre><span className="tok-key">products</span><span className="tok-op">[]{'{'}</span><span className="tok-val">id</span><span className="tok-op">,</span><span className="tok-val">name</span><span className="tok-op">,</span><span className="tok-val">price</span><span className="tok-op">{'}'}:</span>{'\n'}  <span className="tok-num">1</span><span className="tok-op">,</span> Laptop<span className="tok-op">,</span> <span className="tok-num">1299</span>{'\n'}  <span className="tok-num">2</span><span className="tok-op">,</span> Mouse<span className="tok-op">,</span>  <span className="tok-num">49</span>{'\n'}  <span className="tok-num">3</span><span className="tok-op">,</span> Hub<span className="tok-op">,</span>    <span className="tok-num">79</span>{'\n\n'}<span className="tok-key">config</span><span className="tok-op">:</span>{'\n'}  <span className="tok-key">env</span><span className="tok-op">:</span> <span className="tok-val">production</span>{'\n'}  <span className="tok-key">debug</span><span className="tok-op">:</span> <span className="tok-bool">false</span></pre>
                </div>
                <div className="pw-panel">
                  <div className="pw-panel-label">JSON output</div>
                  <pre><span className="tok-op">{'{'}</span>{'\n'}  <span className="tok-str">"products"</span><span className="tok-op">: [</span>{'\n'}    <span className="tok-op">{'{'}</span><span className="tok-str">"id"</span><span className="tok-op">:</span><span className="tok-num">1</span><span className="tok-op">,</span><span className="tok-str">"name"</span><span className="tok-op">:</span>{'\n'}      <span className="tok-str">"Laptop"</span><span className="tok-op">,</span><span className="tok-str">"price"</span><span className="tok-op">:</span><span className="tok-num">1299</span><span className="tok-op">{'}'}</span><span className="tok-op">,</span>{'\n'}    <span className="tok-op">...</span>{'\n'}  <span className="tok-op">],</span>{'\n'}  <span className="tok-str">"config"</span><span className="tok-op">: {'{'}</span>{'\n'}    <span className="tok-str">"env"</span><span className="tok-op">:</span><span className="tok-str">"production"</span><span className="tok-op">,</span>{'\n'}    <span className="tok-str">"debug"</span><span className="tok-op">:</span><span className="tok-bool">false</span>{'\n'}  <span className="tok-op">{'}'}</span>{'\n'}<span className="tok-op">{'}'}</span></pre>
                </div>
              </div>
              <div className="pw-footer">
                <span className="pw-stat">ORYX: <span>38 tokens</span></span>
                <span className="pw-stat">JSON: <span style={{ color: '#ff5f56' }}>104 tokens</span></span>
                <span className="pw-stat">saved: <span>63.5%</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INSTALL */}
      <div className="install-section" id="install">
        <div className="install-inner">
          <div>
            <div className="section-tag">Get started</div>
            <h2 className="section-title">Up and running<br />in 60 seconds.</h2>
            <div className="install-steps">
              <div className="install-step">
                <div className="step-num">01</div>
                <div className="step-content">
                  <div className="step-title">Install</div>
                  <div className="step-cmd">npm install oryx-parser</div>
                </div>
              </div>
              <div className="install-step">
                <div className="step-num">02</div>
                <div className="step-content">
                  <div className="step-title">Import</div>
                  <div className="step-cmd">import {'{ parse, encode }'} from 'oryx-parser'</div>
                </div>
              </div>
              <div className="install-step">
                <div className="step-num">03</div>
                <div className="step-content">
                  <div className="step-title">Use the CLI</div>
                  <div className="step-cmd">npx oryx parse data.oryx</div>
                </div>
              </div>
            </div>
          </div>

          <div className="code-panel">
            <div className="code-panel-header">
              <div className="dots">
                <div className="dot dot-r"></div>
                <div className="dot dot-y"></div>
                <div className="dot dot-g"></div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>quickstart.ts</span>
              <span></span>
            </div>
            <div className="code-body" dangerouslySetInnerHTML={{ __html: quickstartHTML }} />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <span className="footer-logo">ORYX</span>
        <div className="footer-links">
          <a href="https://www.npmjs.com/package/oryx-parser" target="_blank" rel="noreferrer">npm</a>
          <a href="https://github.com/devlewiso/oryx-parser/blob/main/SPEC.md" target="_blank" rel="noreferrer">spec</a>
          <a href="https://github.com/devlewiso" target="_blank" rel="noreferrer">github</a>
        </div>
        <span className="footer-copy">MIT — oryx-parser v0.3.0</span>
      </footer>
    </>
  );
}
