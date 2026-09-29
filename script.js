const $=s=>document.querySelector(s),rp=n=>'Rp'+Math.round(n).toLocaleString('id-ID');
const jt=n=>'Rp'+(n/1e6).toFixed(2).replace('.',',')+' jt';
// Data contoh. Harga grade A sesuai business plan (Rp25.000); harga B/C/Afkir adalah contoh, konfirmasi ke client.
const G=[{n:'Grade A',c:'#16a34a',p:25000,w:120},{n:'Grade B',c:'#f59e0b',p:20000,w:60},{n:'Grade C',c:'#0ea5e9',p:17000,w:25},{n:'Afkir',c:'#f43f5e',p:8000,w:8}];
const kg=()=>G.reduce((s,g)=>s+g.w,0),tot=()=>G.reduce((s,g)=>s+g.w*g.p,0);
const SL=['06.00–08.00','08.00–10.00','14.00–16.00'];
let tab='home',slot=1,tray=40,end=Date.now()+44.3*36e5,tm;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>t.classList.remove('on'),2200)};
const row=(a,b)=>`<div class="row"><span>${a}</span><span>${b}</span></div>`;

const home=()=>`<div class="hi">Halo, Pak Hasan 👋</div>
<div class="hero"><small>Pencairan dana kamu</small><div class="big" id="sla">--:--:--</div><div class="bar"><i id="bar"></i></div><small>Batas pembayaran 3×24 jam sejak penimbangan</small></div>
<div class="stats"><div class="tile tg"><small>Setoran</small><b>${kg()} kg</b></div><div class="tile ty"><small>Nilai</small><b>${jt(tot())}</b></div><div class="tile ts"><small>Harga A/kg</small><b>${rp(G[0].p)}</b></div></div>
<h3>Riwayat setoran</h3><div class="card">${row('<b>30 Sep</b> · '+kg()+' kg','<span class="b by">Menunggu transfer</span>')+row('<b>23 Sep</b> · 198 kg','<span class="b bg">Lunas</span>')+row('<b>16 Sep</b> · 205 kg','<span class="b bg">Lunas</span>')}</div>`;

const panen=()=>`<h2>Lapor panen besok</h2><div class="card"><small class="mut">${new Date(Date.now()+864e5).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'})}</small>
<label>Estimasi panen (tray)</label><div class="step"><button onclick="tr(-5)">−</button><b id="tv">${tray}</b><button onclick="tr(5)">+</button></div><p class="mut c" id="est">≈ ${Math.round(tray*1.8)} kg</p>
<label>Slot jam penjemputan</label><div class="chips">${SL.map((s,i)=>`<button class="chip${i==slot?' on':''}" onclick="sl(${i})">${s}</button>`).join('')}</div>
<button class="btn" onclick="kirim()">Kirim laporan</button><div id="ok"></div></div>`;
const tr=d=>{tray=Math.max(0,tray+d);$('#tv').textContent=tray;$('#est').textContent='≈ '+Math.round(tray*1.8)+' kg'};
const sl=i=>{slot=i;show('panen')};
const kirim=()=>{$('#ok').innerHTML=`<div class="okbox">✅ Terkirim. Penjemputan besok ${SL[slot]}, estimasi ${tray} tray.</div>`;toast('Laporan panen terkirim')};

const grading=()=>`<h2>Hasil grading & harga</h2><div class="card">${G.map(g=>`<div class="gr"><div class="row" style="padding:0;border:0"><span><i class="dot" style="background:${g.c}"></i><b>${g.n}</b></span><b>${rp(g.w*g.p)}</b></div><div class="mut">${g.w} kg × ${rp(g.p)}</div><div class="sb"><i style="width:${g.w/kg()*100}%;background:${g.c}"></i></div></div>`).join('')}
<div class="row tot"><span>Total dibayarkan</span><b>${rp(tot())}</b></div></div>
<div class="note">🔒 Harga dihitung otomatis dari harga dasar kontrak dan tidak bisa diubah manual oleh petugas. Bagi hasil berlaku jika harga pasar di atas Rp28.000/kg.</div>`;

const qrsvg=()=>{let c='';for(let i=0;i<21;i++)for(let j=0;j<21;j++){const f=(i<7&&j<7)||(i<7&&j>13)||(i>13&&j<7),a=i%14,b=j%14;if(f?(a==0||a==6||b==0||b==6||(a>1&&a<5&&b>1&&b<5)):(i*7+j*13+i*j)%3==0)c+=`<rect x="${j}" y="${i}" width="1" height="1"/>`}return`<svg viewBox="0 0 21 21" width="150" fill="currentColor">${c}</svg>`};
const qr=()=>`<h2>Keterlacakan batch</h2><div class="card c"><div class="qrbox">${qrsvg()}</div><br><b>BT-0929-017</b><p class="mut">Pembeli scan kode ini untuk melihat asal telur (pratinjau, QR asli dibuat backend)</p></div>
<div class="card"><label style="margin-top:0">Cek kode batch</label><input id="bc" value="BT-0929-017"><button class="btn" style="margin-top:12px" onclick="trace()">Lacak</button><div id="tr"></div></div>`;
const trace=()=>{$('#tr').innerHTML=$('#bc').value.trim().toUpperCase()=='BT-0929-017'?`<ul class="tl">${[['Panen','29 Sep · Kandang Pak Hasan, Sidrap'],['Dijemput','30 Sep · 06.40'],['Grading','Grade A · 120 kg'],['Dikemas','Tray berlabel QR'],['Dikirim','Ke pembeli institusi']].map(s=>`<li><b>${s[0]}</b><div class="mut" style="margin:0">${s[1]}</div></li>`).join('')}</ul>`:'<p class="mut">Kode tidak ditemukan.</p>'};

const T=[['home','🏠','Beranda',home],['panen','🥚','Panen',panen],['grading','⚖️','Grading',grading],['qr','🔎','Lacak',qr]];
const show=t=>{tab=t;$('#main').innerHTML=T.find(x=>x[0]==t)[3]();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));if(t=='qr')trace();scrollTo(0,0);tick()};
const tick=()=>{const e=$('#sla');if(!e)return;const ms=Math.max(0,end-Date.now()),s=ms/1e3|0;e.textContent=[s/3600|0,(s/60|0)%60,s%60].map(x=>String(x).padStart(2,'0')).join(':');$('#bar').style.width=(100-ms/2592e5*100)+'%'};
setInterval(tick,1000);

const app=()=>{$('#app').innerHTML=`<header class="top"><div class="in"><span class="brand">🥚 MitraKu</span><button onclick="login()" style="border:1px solid var(--line);background:var(--card);border-radius:10px;padding:6px 12px">Keluar</button></div></header><main class="wrap" id="main"></main><nav><div class="in">${T.map(x=>`<button data-t="${x[0]}" onclick="show('${x[0]}')"><span>${x[1]}</span>${x[2]}</button>`).join('')}</div></nav>`;show('home')};
const login=()=>{$('#app').innerHTML=`<div class="auth"><div class="authbox"><h1>🥚 MitraKu</h1><p>Harga adil, bayar maksimal 3×24 jam.</p><section class="card" id="lg"><label style="margin-top:0">Nomor HP</label><input value="0812 3456 7890"><button class="btn" onclick="otp()">Kirim OTP</button></section></div></div>`};
const otp=()=>{$('#lg').innerHTML=`<label style="margin-top:0">Kode OTP (demo: isi 6 angka apa saja)</label><input id="ot" inputmode="numeric" maxlength="6" placeholder="••••••"><button class="btn" onclick="verify()">Verifikasi & masuk</button>`};
const verify=()=>$('#ot').value.length==6?app():toast('Masukkan 6 angka OTP');
login();