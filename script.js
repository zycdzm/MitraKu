const $=s=>document.querySelector(s),rp=n=>'Rp'+Math.round(n).toLocaleString('id-ID');
const jt=n=>'Rp'+(n/1e6).toFixed(2).replace('.',',')+' jt';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// ===== Data contoh (harga grade A sesuai business plan; sisanya contoh, konfirmasi ke client) =====
const G=[{n:'Grade A',c:'#16a34a',p:25000,w:120},{n:'Grade B',c:'#f59e0b',p:20000,w:60},{n:'Grade C',c:'#0ea5e9',p:17000,w:25},{n:'Afkir',c:'#f43f5e',p:8000,w:8}];
const kg=()=>G.reduce((s,g)=>s+g.w,0),tot=()=>G.reduce((s,g)=>s+g.w*g.p,0);
const SL=['06.00–08.00','08.00–10.00','14.00–16.00'];
const BATCH={'BT-0929-017':{p:'Pak Hasan',d:29,g:'Grade A',kg:120,s:'dikirim'},'BT-0921-009':{p:'Bu Rina',d:21,g:'Grade A',kg:96,s:'selesai'},'BT-0914-004':{p:'Pak Amir',d:14,g:'Grade A',kg:110,s:'selesai'}};
const ORD=[['BT-0929-017','Telur Grade A · 2 tray','30 Sep','Dikirim','by'],['BT-0921-009','Telur Grade A · 1 tray','22 Sep','Selesai','bg'],['BT-0914-004','Telur Grade A · 3 tray','15 Sep','Selesai','bg']];
const PROD=[['🥚','Telur segar Grade A','Tray 30 butir','Rp58.000','tg'],['🧂','Telur asin premium','Isi 6 butir','Rp30.000','ty'],['🍳','Telur curah Grade B','Per kg','Rp24.000','ts']];
// ===== Akun (disimpan di browser; di versi asli lewat database) =====
const DEMO={'produsen:081234567890':'Pak Hasan','konsumen:081311112222':'Bu Sari'};
const ACC={...DEMO};
try{Object.assign(ACC,JSON.parse(localStorage.getItem('mk_acc2')||'{}'))}catch(e){}
const persist=()=>{try{const o={};for(const k in ACC)if(!(k in DEMO))o[k]=ACC[k];localStorage.setItem('mk_acc2',JSON.stringify(o))}catch(e){}};
const RL={produsen:'Produsen',konsumen:'Konsumen'};
let role='produsen',user={name:''},pend=null,tab='home',slot=1,tray=40,lc='BT-0929-017',end=Date.now()+44.3*36e5,tm;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>t.classList.remove('on'),2200)};
const row=(a,b)=>`<div class="row"><span>${a}</span><span>${b}</span></div>`;

// ===== Lacak barang (dipakai Produsen & Konsumen) =====
const salin=t=>{try{navigator.clipboard.writeText(t)}catch(e){}toast('Nomor resi disalin')};
const traceHtml=code=>{const c=code.trim().toUpperCase(),b=BATCH[c];if(!b)return'<div class="card"><p class="mut" style="margin:0">Nomor resi / kode batch tidak ditemukan.</p></div>';
const o=esc(role=='produsen'&&c=='BT-0929-017'?user.name:b.p),d=b.d,s=b.s=='selesai',cur=s?3:2;
const E=[[d,'16:30','Panen tercatat oleh peternak di MitraKu'],[d,'20:15','Pesanan dibuat dan dikonfirmasi'],[d+1,'06:40','Telur dijemput dari Kandang '+o+', Sidrap'],[d+1,'08:10','Grading selesai: '+b.g+' · '+b.kg+' kg'],[d+1,'09:30','Telur dikemas dan diberi label QR batch'],[d+1,'11:05','Paket diserahkan ke armada pengiriman'],[d+1,'14:20','Paket dalam perjalanan ke alamat tujuan']];
if(s)E.push([d+2,'10:15','Pesanan diterima. Terima kasih! 🎉']);
return`<div class="stat"><small>${s?'Selesai':'Dalam pengiriman'}</small><b>${s?'Pesanan telah diterima':'Pesanan sedang dalam perjalanan'}</b><small>${s?'Diterima '+(d+2)+' Sep 2026':'Estimasi tiba 1 Okt 2026'}</small></div>
<div class="card"><div class="steps">${[['📝','Dipesan'],['📦','Dikemas'],['🚚','Dikirim'],['✅','Diterima']].map((x,i)=>`<div class="${i<cur?'on dn':i==cur?'on':''}"><i>${x[0]}</i>${x[1]}</div>`).join('')}</div></div>
<div class="card"><h3 style="margin:0 0 4px">Info pengiriman</h3>${row('<span class="mut">Kurir</span>','Armada MITRANAK · Box tertutup')}${row('<span class="mut">No. Resi</span>','<b>'+c+'</b> <button class="mini" onclick="salin(\''+c+'\')">Salin</button>')}${row('<span class="mut">Alamat</span>',(role=='konsumen'?esc(user.name)+' · ':'')+'Jl. Contoh No. 12, Makassar')}</div>
<div class="card"><h3 style="margin:0 0 12px">Status pengiriman</h3><ul class="ship">${E.slice().reverse().map(e=>`<li><div class="tm">${e[0]} Sep<br>${e[1]}</div><div class="dt"></div><div class="tx">${e[2]}</div></li>`).join('')}</ul></div>
<div class="card"><h3 style="margin:0 0 4px">Asal barang</h3>${row('<span class="mut">Peternak</span>','<b>'+o+'</b>')}${row('<span class="mut">Tanggal panen</span>',d+' Sep 2026')}${row('<span class="mut">Mutu</span>','<span class="b bg">'+b.g+'</span>')}${row('<span class="mut">Bobot batch</span>',b.kg+' kg')}</div>`};
const trace=()=>{lc=$('#bc').value;$('#tr').innerHTML=traceHtml(lc)};
const goLacak=c=>{lc=c;show('klacak')};

// ===== Produsen =====
const home0=()=>`<div class="hi">Halo, ${esc(user.name)} 👋</div>
<div class="hero"><small>Pencairan dana kamu</small><div class="big" id="sla">--:--:--</div><div class="bar"><i id="bar"></i></div><small>Batas pembayaran 3×24 jam sejak penimbangan</small></div>
<div class="stats"><div class="tile tg"><small>Setoran</small><b>${kg()} kg</b></div><div class="tile ty"><small>Nilai</small><b>${jt(tot())}</b></div><div class="tile ts"><small>Harga A/kg</small><b>${rp(G[0].p)}</b></div></div>
<div class="stats"><div class="tile tg"><small>Koin MitraKu</small><b>${coins}</b></div><div class="tile ty"><small>Belanja</small><b>${beli}x</b></div><div class="tile ts"><small>Scan telur</small><b>${scans}x</b></div></div><h3>Riwayat setoran</h3><div class="card">${row('<b>30 Sep</b> · '+kg()+' kg','<span class="b by">Menunggu transfer</span>')+row('<b>23 Sep</b> · 198 kg','<span class="b bg">Lunas</span>')+row('<b>16 Sep</b> · 205 kg','<span class="b bg">Lunas</span>')}</div>`;
const panen=()=>`<h2>Lapor panen besok</h2><div class="card"><small class="mut">${new Date(Date.now()+864e5).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'})}</small>
<label>Estimasi panen (tray)</label><div class="step"><button onclick="tr(-5)">−</button><b id="tv">${tray}</b><button onclick="tr(5)">+</button></div><p class="mut c" id="est">≈ ${Math.round(tray*1.8)} kg</p>
<label>Slot jam penjemputan</label><div class="chips">${SL.map((s,i)=>`<button class="chip${i==slot?' on':''}" onclick="sl(${i})">${s}</button>`).join('')}</div>
<button class="btn" onclick="kirim()">Kirim laporan</button><div id="ok"></div></div>`;
const tr=d=>{tray=Math.max(0,tray+d);$('#tv').textContent=tray;$('#est').textContent='≈ '+Math.round(tray*1.8)+' kg'};
const sl=i=>{slot=i;show('panen')};
const kirim=()=>{$('#ok').innerHTML=`<div class="okbox">✅ Terkirim. Penjemputan besok ${SL[slot]}, estimasi ${tray} tray.</div>`;toast('Laporan panen terkirim')};
const grading0=()=>`<h2>Hasil grading & harga</h2><div class="card">${G.map(g=>`<div class="gr"><div class="row" style="padding:0;border:0"><span><i class="dot" style="background:${g.c}"></i><b>${g.n}</b></span><b>${rp(g.w*g.p)}</b></div><div class="mut">${g.w} kg × ${rp(g.p)}</div><div class="sb"><i style="width:${g.w/kg()*100}%;background:${g.c}"></i></div></div>`).join('')}
<div class="row tot"><span>Total dibayarkan</span><b>${rp(tot())}</b></div></div>
<div class="note">🔒 Harga dihitung otomatis dari harga dasar kontrak dan tidak bisa diubah manual oleh petugas. Bagi hasil berlaku jika harga pasar di atas Rp28.000/kg.</div>`;
const qrsvg=()=>{let c='';for(let i=0;i<21;i++)for(let j=0;j<21;j++){const f=(i<7&&j<7)||(i<7&&j>13)||(i>13&&j<7),a=i%14,b=j%14;if(f?(a==0||a==6||b==0||b==6||(a>1&&a<5&&b>1&&b<5)):(i*7+j*13+i*j)%3==0)c+=`<rect x="${j}" y="${i}" width="1" height="1"/>`}return`<svg viewBox="0 0 21 21" width="150" fill="currentColor">${c}</svg>`};
const qr=()=>`<h2>QR batch</h2><div class="card c"><div class="qrbox">${qrsvg()}</div><br><b>BT-0929-017</b><p class="mut">Pembeli scan kode ini untuk melihat asal telur (pratinjau, QR asli dibuat backend)</p></div>
<div class="card"><label style="margin-top:0">Cek kode batch</label><input id="bc" value="${lc}"><button class="btn" style="margin-top:12px" onclick="trace()">Lacak</button></div><div id="tr"></div>`;

// ===== Konsumen =====
const khome=()=>`<div class="hi">Halo, ${esc(user.name)} 👋</div>
<div class="hero"><b style="font-size:20px">Lacak asal telurmu</b><p style="margin:6px 0 12px;opacity:.9">Masukkan kode batch di kemasan untuk melihat peternak, tanggal panen, dan mutunya.</p><button class="wb" onclick="show('klacak')">🔎 Lacak barang</button></div>
<h3>Katalog telur</h3>${PROD.map(p=>`<div class="card prod"><div class="pe t${p[4].slice(1)}">${p[0]}</div><div style="flex:1"><b>${p[1]}</b><div class="mut" style="margin:0">${p[2]} · ${p[3]}</div></div><button class="mini" onclick="toast('${p[1]} masuk keranjang')">Pesan</button></div>`).join('')}`;
const kpesanan=()=>`<h2>Pesanan saya</h2>${ORD.map(o=>`<div class="card"><div class="row" style="padding:0;border:0"><b>${o[1]}</b><span class="b ${o[4]}">${o[3]}</span></div><div class="mut">${o[2]} · Kode batch ${o[0]}</div><button class="mini" style="margin-top:10px" onclick="goLacak('${o[0]}')">Lacak barang</button></div>`).join('')}`;
const klacak=()=>`<h2>Lacak barang</h2><div class="card"><label style="margin-top:0">Nomor resi / kode batch (di kemasan atau hasil scan QR)</label><input id="bc" value="${lc}"><button class="btn" style="margin-top:12px" onclick="trace()">Lacak</button></div><div id="tr"></div>`;

// ===== Fitur dari prototipe klien (Masyarakat -> Produsen, Bank Sampah -> Konsumen) =====
// Data contoh: titik setor, produk, dan permintaan hanya ilustrasi, konfirmasi ke client.
const EG=[['Telur segar utuh','Grade A',60],['Telur retak halus','Grade B',40],['Telur ukuran kecil','Grade C',25],['Telur rusak','Afkir',10]];
const TS=[['Titik Setor Koperasi Maritengngae','Kec. Maritengngae, Sidrap','1,8 km'],['Titik Setor Panca Lagosi','Kec. Baranti, Sidrap','3,2 km'],['Titik Setor Watang Pulu','Kec. Watang Pulu, Sidrap','5,1 km']];
const MK=[{id:1,n:'Pakan ayam petelur 50 kg',p:420000,e:'🌾',v:'Koperasi Pakan Sidrap',sc:92,sp:'Protein 17%',q:'MK-2026-001'},{id:2,n:'Tray telur isi 30 (paket 50)',p:125000,e:'🥚',v:'UMKM Kemasan Lokal',sc:88,sp:'Karton kuat, bisa dipakai ulang',q:'MK-2026-002'},{id:3,n:'Paket vitamin & vaksin',p:85000,e:'💊',v:'Apotek Ternak Sidrap',sc:90,sp:'Untuk 100 ekor, 1 bulan',q:'MK-2026-003'}];
const PAY=['GoPay','OVO','DANA','Transfer Bank'];
const RW=[{k:'e',t:'Tukar ke E-Wallet',i:'💸',o:[[500,'Rp 50.000'],[1000,'Rp 100.000'],[2000,'Rp 200.000']]},{k:'v',t:'Voucher Belanja',i:'🎁',o:[[500,'Voucher Rp 25.000'],[1000,'Voucher Rp 50.000'],[2000,'Voucher Rp 100.000']]},{k:'d',t:'Donasi Tanam Pohon',i:'🌳',o:[[300,'5 Pohon'],[600,'10 Pohon'],[1200,'20 Pohon']]}];
const REQ=[{id:1,u:'Kebutuhan mingguan dapur SPPG',m:'Grade A',kg:500,dl:'5 Okt 2026',loc:'Jl. Contoh No. 12, Makassar',st:'matched',src:'Kandang Pak Hasan · Sidrap',sc:95,km:182,q:'Grade A',est:'1 hari',code:'BT-0929-017'},{id:2,u:'Stok restoran & hotel mitra',m:'Grade A',kg:300,dl:'8 Okt 2026',loc:'Jl. Contoh Raya No. 5, Makassar',st:'matched',src:'Kandang Bu Rina · Sidrap',sc:88,km:185,q:'Grade A',est:'1 hari',code:'BT-0921-009'},{id:3,u:'Pesanan ritel akhir bulan',m:'Grade B',kg:400,dl:'10 Okt 2026',loc:'Jl. Contoh Indah No. 8, Makassar',st:'pending'}];
let coins=1250,beli=12,scans=0,scr=null,sub='list',pid=null,pay='',rw=null,amt=0,cert=false;

// --- Produsen: scan telur, titik setor, belanja, dompet ---
const scanCard=()=>`<div class="card c"><h3>AI Scanner telur</h3><div style="font-size:52px">📷</div><p class="mut">Arahkan kamera ke telur untuk cek mutu sebelum disetor</p>${scr?`<div class="okbox">${scr[0]} · ${scr[1]}<br>+${scr[2]} koin</div><button class="btn" onclick="setor()">Setor ke titik setor</button>`:`<button class="btn" onclick="ambil()">📸 Ambil foto telur</button>`}</div>`;
const ambil=()=>{scr=EG[Math.random()*EG.length|0];show('grading')};
const setor=()=>{coins+=scr[2];scans++;toast('+'+scr[2]+' koin masuk dompet');scr=null;show('grading')};
const grading=()=>scanCard()+grading0();
const titik=()=>`<h3>Titik setor terdekat</h3>${TS.map(t=>`<div class="card"><div class="row" style="padding:0;border:0"><b>${t[0]}</b><span class="b bg">${t[2]}</span></div><div class="mut">${t[1]}</div><a class="mini" style="display:inline-block;margin-top:10px;text-decoration:none" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t[0]+' '+t[1])}" target="_blank" rel="noopener">Navigasi</a></div>`).join('')}`;
const home=()=>home0()+titik();

const certHtml=p=>`<div class="qrbox" style="margin:12px auto;display:block;width:fit-content">${qrsvg()}</div><p class="c mut" style="margin-bottom:8px">Scan QR untuk verifikasi keaslian</p>${row('<span class="mut">ID sertifikat</span>','<b>'+p.q+'</b>')}${row('<span class="mut">Pemasok</span>',p.v)}${row('<span class="mut">Spesifikasi</span>',p.sp)}<ul class="tl">${[['Produksi','Diproduksi oleh '+p.v],['Uji mutu','Skor mutu '+p.sc+'/100'],['Pengemasan','Dikemas dan diberi label QR'],['Distribusi','Dikirim ke titik setor mitra']].map(s=>`<li><b>${s[0]}</b><div class="mut" style="margin:0">${s[1]}</div></li>`).join('')}</ul>`;
const shop=()=>{const p=MK.find(x=>x.id==pid);
if(sub=='list')return`<h2>Belanja kebutuhan peternak</h2>${MK.map(p=>`<div class="card prod"><div class="pe ty">${p.e}</div><div style="flex:1"><b>${p.n}</b><div class="mut" style="margin:0">${rp(p.p)} · ⭐ ${p.sc}</div></div><button class="mini" onclick="detail(${p.id})">Lihat</button></div>`).join('')}`;
if(sub=='detail')return`<button class="mini" onclick="sub='list';show('shop')">← Kembali</button><h2>${p.n}</h2><div class="card c"><div style="font-size:80px">${p.e}</div><div class="big" style="font-size:28px">${rp(p.p)}</div><span class="b bg">⭐ Skor mutu ${p.sc}/100</span></div><div class="card"><h3 style="margin:0 0 4px">Verifikasi mutu</h3>${row('<span class="mut">Pemasok</span>',p.v)}${row('<span class="mut">Spesifikasi</span>',p.sp)}</div><div class="card"><div class="row" style="padding:0;border:0"><h3 style="margin:0">Sertifikat digital & QR</h3><button class="mini" onclick="cert=!cert;show('shop')">${cert?'Tutup':'Lihat'}</button></div>${cert?certHtml(p):'<p class="mut">Jejak lengkap dari pemasok hingga sampai ke kandangmu.</p>'}</div><button class="btn" onclick="sub='pay';pay='';show('shop')">Beli sekarang</button>`;
if(sub=='pay')return`<button class="mini" onclick="sub='detail';show('shop')">← Kembali</button><h2>Pembayaran</h2><div class="card">${row(p.n,rp(p.p))}${row('<span class="mut">Ongkos kirim</span>','Rp10.000')}<div class="row tot"><span>Total</span><b>${rp(p.p+1e4)}</b></div></div><div class="card"><h3>Metode pembayaran</h3><div class="chips">${PAY.map(m=>`<button class="chip${pay==m?' on':''}" onclick="pay='${m}';show('shop')">${m}</button>`).join('')}</div></div><button class="btn" onclick="bayar()">Bayar sekarang</button>`;
return`<div class="card c"><div style="font-size:64px">✅</div><h2 style="margin-top:4px">Pembayaran berhasil!</h2><div class="okbox">+${Math.floor(p.p/1000)} koin MitraKu</div><p class="mut">Mendukung pemasok lokal Sidrap</p><button class="btn" onclick="sub='list';pid=null;show('home')">Kembali ke Beranda</button></div>`};
const detail=id=>{pid=id;sub='detail';cert=false;show('shop')};
const bayar=()=>{if(!pay)return toast('Pilih metode pembayaran dulu');const p=MK.find(x=>x.id==pid);coins+=Math.floor(p.p/1000);beli++;sub='ok';show('shop')};
const wal=()=>{const r=RW.find(x=>x.k==rw);return`<h2>Dompet & hadiah</h2><div class="hero"><small>Total koin MitraKu</small><div class="big">${coins}</div><small>≈ ${rp(coins*100)}</small></div><h3>Tukar poin kamu</h3>${RW.map(x=>`<div class="card prod"><div class="pe ty">${x.i}</div><b style="flex:1">${x.t}</b><button class="mini" onclick="rw='${x.k}';amt=0;show('wal')">Pilih</button></div>`).join('')}${r?`<div class="card"><h3>${r.t}</h3><div class="chips">${r.o.map(o=>`<button class="chip${amt==o[0]?' on':''}" ${coins<o[0]?'disabled style="opacity:.4"':''} onclick="amt=${o[0]};show('wal')">${o[1]} · ${o[0]} koin</button>`).join('')}</div><button class="btn" onclick="tukar()">Tukar sekarang</button></div>`:''}`};
const tukar=()=>{if(!amt||coins<amt)return toast('Pilih nominal yang koinnya cukup');coins-=amt;toast('Penukaran berhasil. Sisa '+coins+' koin');rw=null;amt=0;show('wal')};

// --- Konsumen: AI Match dan logistik pengantaran ---
const kmatch=()=>`<h2>Smart AI Matchmaking</h2><div class="note" style="background:var(--g);color:var(--gI);margin-bottom:12px">Permintaan telurmu dicocokkan dengan kandang terbaik berdasarkan jarak, ketersediaan stok, dan mutu.</div>${REQ.map(r=>`<div class="card"><div class="row" style="padding:0;border:0"><b>${r.u}</b><span class="b ${r.st=='matched'?'bg':'by'}">${r.st=='matched'?'Matched':'Pending'}</span></div><div class="mut">Butuh ${r.kg} kg ${r.m} · 📍 ${r.loc}<br>⏰ Dibutuhkan sebelum ${r.dl}</div>${r.st=='matched'?`<p style="margin:12px 0 8px"><b>⚡ Match ${r.sc}%</b> · ${r.src}</p><div class="stats" style="margin:0"><div class="tile ts"><small>Jarak</small><b>${r.km} km</b></div><div class="tile tg"><small>Mutu</small><b>${r.q}</b></div><div class="tile ty"><small>Estimasi</small><b>${r.est}</b></div></div>${r.sent?'<div class="okbox">✓ Pengiriman disetujui</div>':`<button class="btn" onclick="setuju(${r.id})">✓ Setujui pengiriman</button>`}`:`<button class="btn" onclick="cari(${r.id})">${r.busy?'Mencari kandang terbaik…':'⚡ Cari kandang terbaik'}</button>`}</div>`).join('')}`;
const cari=id=>{const r=REQ.find(x=>x.id==id);if(r.busy)return;r.busy=true;show('kmatch');setTimeout(()=>{Object.assign(r,{busy:false,st:'matched',src:'Kandang Pak Amir · Sidrap',sc:91,km:180,q:'Grade B',est:'1 hari',code:'BT-0914-004'});if(tab=='kmatch')show('kmatch')},2500)};
const setuju=id=>{REQ.find(x=>x.id==id).sent=true;toast('Pengiriman disetujui. Peternak mendapat notifikasi.');show('kmatch')};
const klog=()=>{const L=REQ.filter(r=>r.st=='matched');return`<h2>Logistik pengantaran</h2>${L.map(r=>`<div class="card"><div class="row" style="padding:0;border:0"><b>${r.u}</b><span class="b ${r.sent?'by':'bg'}">${r.sent?'Dalam perjalanan':'Siap diantar'}</span></div><div class="mut">📍 ${r.loc}<br>${r.kg} kg ${r.m}</div>${r.sent?`<button class="mini" style="margin-top:10px" onclick="goLacak('${r.code}')">Lacak pengiriman</button>`:'<p class="mut">Setujui dulu di tab AI Match.</p>'}</div>`).join('')}<h3>Rute pengantaran</h3><div class="card"><ul class="tl"><li><b>Gudang mitra (titik awal)</b><div class="mut" style="margin:0">Makassar</div></li>${L.map(r=>`<li><b>${r.u}</b><div class="mut" style="margin:0">${r.loc} · ${r.kg} kg ${r.m}</div></li>`).join('')}</ul>${row('<b>Total jarak</b>','8,7 km')}${row('<b>Estimasi waktu</b>','± 45 menit')}<button class="btn" onclick="toast('Membuka navigasi rute')">📍 Mulai navigasi</button></div>`};

// ===== Shell aplikasi =====
const TAB={produsen:[['home','🏠','Beranda',home],['panen','🥚','Panen',panen],['grading','⚖️','Grading',grading],['shop','🛍️','Belanja',shop],['wal','👛','Dompet',wal],['qr','🏷️','QR',qr]],konsumen:[['khome','🏠','Beranda',khome],['kpesanan','📦','Pesanan',kpesanan],['kmatch','🤖','AI Match',kmatch],['klog','🚚','Logistik',klog],['klacak','🔎','Lacak',klacak]]};
const show=t=>{tab=t;const L=TAB[role];$('#main').innerHTML=L.find(x=>x[0]==t)[3]();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));if(t=='qr'||t=='klacak')$('#tr').innerHTML=traceHtml(lc);scrollTo(0,0);tick()};
const nav=t=>{if(t=='shop')sub='list';show(t)};
const tick=()=>{const e=$('#sla');if(!e)return;const ms=Math.max(0,end-Date.now()),s=ms/1e3|0;e.textContent=[s/3600|0,(s/60|0)%60,s%60].map(x=>String(x).padStart(2,'0')).join(':');$('#bar').style.width=(100-ms/2592e5*100)+'%'};
setInterval(tick,1000);
const app=()=>{$('#app').innerHTML=`<header class="top"><div class="in"><span class="brand">🥚 MitraKu <span class="rb">${RL[role]}</span></span><span style="display:flex;align-items:center;gap:8px"><span class="av">${esc(user.name[0].toUpperCase())}</span><button onclick="start()" style="border:1px solid var(--line);background:var(--card);border-radius:10px;padding:6px 12px">Keluar</button></span></div></header><main class="wrap" id="main"></main><nav><div class="in">${TAB[role].map(x=>`<button data-t="${x[0]}" onclick="nav('${x[0]}')"><span>${x[1]}</span>${x[2]}</button>`).join('')}</div></nav>`;sub='list';show(TAB[role][0][0])};

// ===== Pilih peran, masuk, daftar =====
const norm=p=>p.replace(/\D/g,'');
const ig=(inner,foot)=>`<div class="ig"><div class="igc"><div class="logo"><span>🥚</span> <b>MitraKu</b></div>${inner}</div>${foot?`<div class="igc igf">${foot}</div>`:''}</div>`;
const start=()=>{$('#app').innerHTML=ig(`<p class="tag">Kamu masuk sebagai apa?</p>
<button class="pick" onclick="pilih('produsen')"><i class="tg">🥚</i><div><b>Produsen</b><span>Peternak mitra: lapor panen, cek harga & pembayaran</span></div></button>
<button class="pick" onclick="pilih('konsumen')"><i class="ts">🛒</i><div><b>Konsumen</b><span>Pembeli: pesan telur & lacak asal barang</span></div></button>`,'')};
const pilih=r=>{role=r;login()};
const login=()=>{const d=role=='produsen'?'0812 3456 7890':'0813 1111 2222';$('#app').innerHTML=ig(`<div class="c"><span class="rb">${RL[role]}</span></div><p class="tag" style="margin-top:10px">Masuk tanpa password. Kode OTP dikirim ke nomor HP kamu.</p><input id="hp" inputmode="tel" placeholder="Nomor HP"><button class="btn" onclick="kirimOtp('masuk')">Masuk</button><div class="or">ATAU</div><p class="c" style="margin:0"><a onclick="$('#hp').value='${d}'">Isi nomor akun demo</a></p>`,`Belum punya akun? <a onclick="daftar()">Daftar</a><br><a onclick="start()" style="font-weight:600;font-size:13px">← Ganti peran</a>`)};
const daftar=()=>{$('#app').innerHTML=ig(`<div class="c"><span class="rb">${RL[role]}</span></div><p class="tag" style="margin-top:10px">Daftar sebagai ${role=='produsen'?'mitra peternak':'konsumen'}.</p><input id="nm" placeholder="Nama lengkap"><input id="hp" inputmode="tel" placeholder="Nomor HP"><button class="btn" onclick="kirimOtp('daftar')">Daftar</button>`,`Sudah punya akun? <a onclick="login()">Masuk</a>`)};
const kirimOtp=m=>{const raw=$('#hp').value,p=norm(raw),k=role+':'+p,n=m=='daftar'?$('#nm').value.trim():ACC[k];
if(m=='daftar'&&!n)return toast('Isi nama lengkap dulu');
if(p.length<9)return toast('Nomor HP tidak valid');
if(m=='masuk'&&!n)return toast('Nomor belum terdaftar. Silakan daftar dulu.');
if(m=='daftar'&&ACC[k])return toast('Nomor sudah terdaftar. Silakan masuk.');
pend={m,k,n};$('#app').innerHTML=ig(`<p class="tag">Kode OTP dikirim ke ${esc(raw)}</p><input id="ot" inputmode="numeric" maxlength="6" placeholder="Kode OTP (demo: 6 angka apa saja)"><button class="btn" onclick="verify()">Verifikasi</button>`,`<a onclick="${m=='daftar'?'daftar':'login'}()">← Kembali</a>`)};
const verify=()=>{if($('#ot').value.length!=6)return toast('Masukkan 6 angka OTP');if(pend.m=='daftar'){ACC[pend.k]=pend.n;persist()}user.name=pend.n;app()};
start();