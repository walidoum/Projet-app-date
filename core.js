'use strict';
var SURL='https://lwqvmefgonxzopwunidt.supabase.co';
var SKEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cXZtZWZnb254em9wd3VuaWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MDEzODAsImV4cCI6MjA4OTI3NzM4MH0.4Js6dRrY2gHqJciYEuv6gyhNu_d-c5R-e6WrheGz428';
var SH={'apikey':SKEY,'Authorization':'Bearer '+SKEY,'Content-Type':'application/json','Prefer':'return=representation'};

// ── Helpers ──────────────────────────────────────────────
function uid(){return 'x'+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-5)}
function today(){return new Date().toISOString().slice(0,10)}
function fmtDate(d){if(!d)return '';try{return new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}catch(e){return d}}
function fmtDateS(d){if(!d)return '';try{return new Date(d+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}catch(e){return d}}
function diffDays(s){if(!s)return 0;try{var p=s.split('-');var su=Date.UTC(+p[0],+p[1]-1,+p[2]);var n=new Date();var nu=Date.UTC(n.getFullYear(),n.getMonth(),n.getDate());return Math.max(0,Math.floor((nu-su)/86400000))}catch(e){return 0}}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function deb(fn,ms){var t;return function(){var a=arguments,ctx=this;clearTimeout(t);t=setTimeout(function(){fn.apply(ctx,a)},ms)}}
function fmtAddr(a){var r=(a.road||a.pedestrian||a.footway||'');var n=a.house_number?a.house_number+' ':'';var ci=a.city||a.town||a.village||a.county||'';return[((n+r).trim()),ci,a.country].filter(Boolean).join(', ')}
function shortAddr(dn){var p=dn.split(',').map(function(s){return s.trim()});return p.slice(0,3).join(', ')}
function cityOf(addr){
  var p=(addr||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
  // Mots qui indiquent une rue/voie — pas une ville
  var STREET=/^(rue|avenue|boulevard|impasse|place|chemin|allée|voie|passage|square|cité|parvis|esplanade|route|quai|port|hameau|domaine|résidence|villa)/i;
  // Pays et régions à ignorer
  var SKIP=/^(france|belgique|espagne|italie|allemagne|pays.bas|royaume.uni|suisse|maroc|algérie|tunisie|île.de.france|occitanie|bretagne|normandie|provence|auvergne)/i;
  // Priorité : chercher depuis la fin (city est souvent avant le pays)
  for(var i=p.length-1;i>=0;i--){
    var s=p[i];
    if(!s||s.length<2)continue;
    if(SKIP.test(s))continue;
    if(/^\d+$/.test(s))continue;            // numéro pur
    if(/\d/.test(s)&&/^\d/.test(s))continue; // commence par chiffre (adresse)
    if(STREET.test(s))continue;              // nom de rue
    return s;
  }
  return p[0]||'';
}

// ── Demo data ─────────────────────────────────────────────
var DEMO={
  categories:[
    {id:'c1',name:'Restaurant',icon:'🍽️',color:'#C9A96E',type:'souvenir',anim:'pulse'},
    {id:'c2',name:'Voyage',icon:'✈️',color:'#7BC67E',type:'souvenir',anim:'glow'},
    {id:'c3',name:'Cinema',icon:'🎬',color:'#E8C4C4',type:'souvenir',anim:'none'},
    {id:'c4',name:'Balade',icon:'🌿',color:'#9B8EA0',type:'souvenir',anim:'bounce'},
    {id:'c5',name:'Sport',icon:'💪',color:'#7AB8F5',type:'souvenir',anim:'pulse'},
    {id:'c6',name:'Musique',icon:'🎵',color:'#F5A87A',type:'souvenir',anim:'pulse'},
    {id:'w1',name:'Restos',icon:'🌟',color:'#B0A0D0',type:'wishlist'},
    {id:'w2',name:'Voyages',icon:'🌍',color:'#80C0D0',type:'wishlist'},
    {id:'w3',name:'Activites',icon:'🎯',color:'#F0B880',type:'wishlist'}
  ],
  memories:[
    {id:'m01',title:'Le Petit Chatelet',address:'Paris, France',lat:48.8534,lng:2.3488,date:'2025-09-15',catId:'c1',note:'Notre premier diner.',fav:true,photoRefs:[]},
    {id:'m02',title:'Montmartre',address:'Paris, France',lat:48.8867,lng:2.3431,date:'2025-10-03',catId:'c4',note:'Se perdre dans les ruelles...',fav:true,photoRefs:[]},
    {id:'m03',title:'Amsterdam',address:'Pays-Bas',lat:52.3676,lng:4.9041,date:'2025-11-05',catId:'c2',note:'Notre premier voyage.',fav:true,photoRefs:[]},
    {id:'m04',title:'Versailles',address:'France',lat:48.8049,lng:2.1204,date:'2026-02-14',catId:'c4',note:'Saint-Valentin.',fav:true,photoRefs:[]},
    {id:'m05',title:'La Tour Eiffel',address:'Paris, France',lat:48.8584,lng:2.2945,date:'2026-03-01',catId:'c4',note:'Enfin monter ensemble.',fav:false,photoRefs:[]}
  ],
  wishlist:[
    {id:'w01',title:'Tokyo',address:'Japon',lat:35.6762,lng:139.6503,catId:'w2',note:'Voir les cerisiers'},
    {id:'w02',title:'Rome',address:'Italie',lat:41.9028,lng:12.4964,catId:'w2',note:'La Fontaine de Trevi'},
    {id:'w03',title:'Le Grand Vefour',address:'Paris, France',lat:48.8638,lng:2.3378,catId:'w1',note:'Le plus romantique'}
  ],
  journal:[
    {id:'j01',date:'2026-03-10',title:"Ce que j'aime chez toi",emoji:'❤️',text:"Il y a des soirs ou je te regarde...",link:''},
    {id:'j02',date:'2026-02-14',title:'Saint-Valentin',emoji:'🌹',text:"Je n'oublierai jamais.",link:'m04'}
  ],
  specialDates:[{id:'sd1',name:'Anniversaire de rencontre',day:15,month:9,msg:'Joyeux anniversaire mon amour',emojis:'❤️ ✨ 💕 🌹'}],
  config:{title:'Winnie & Vvs',startDate:'2025-09-15',phrase:"Le jour ou j'ai su que tu seras ma reine",theme:'romantique',customTheme:null}
};

// ── State ─────────────────────────────────────────────────
var S={categories:[],memories:[],wishlist:[],journal:[],specialDates:[],comments:[],config:{}};

// ── Storage ───────────────────────────────────────────────
var STG={K:'wv_app',
  save:function(){try{var d=JSON.parse(JSON.stringify(S));d.memories.forEach(function(m){m.photos=[]});localStorage.setItem(STG.K,JSON.stringify(d))}catch(e){}},
  load:function(){
    var raw=null;try{raw=localStorage.getItem(STG.K)||localStorage.getItem('wv7')||localStorage.getItem('wv6')}catch(e){}
    if(raw){try{var d=JSON.parse(raw);S.categories=d.categories&&d.categories.length?d.categories:JSON.parse(JSON.stringify(DEMO.categories));S.memories=(d.memories||DEMO.memories).map(function(m){m.photoRefs=m.photoRefs||[];m.photos=[];return m});S.wishlist=d.wishlist||JSON.parse(JSON.stringify(DEMO.wishlist));S.journal=d.journal||JSON.parse(JSON.stringify(DEMO.journal));S.specialDates=d.specialDates||JSON.parse(JSON.stringify(DEMO.specialDates));S.comments=d.comments||[];S.config=Object.assign({},DEMO.config,d.config||{});return true}catch(e){}}
    var d=JSON.parse(JSON.stringify(DEMO));S.categories=d.categories;S.memories=d.memories;S.wishlist=d.wishlist;S.journal=d.journal;S.specialDates=d.specialDates;S.config=d.config;return false;
  },
  exportJSON:function(){UI.toast('Preparation...','');IDB.all(function(media){var p=JSON.parse(JSON.stringify(S));p._media=media;p._v=8;var b=new Blob([JSON.stringify(p,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='winnie-vvs-'+today()+'.json';document.body.appendChild(a);a.click();document.body.removeChild(a);UI.toast('Export reussi !','ok')})},
  importJSON:function(file){var reader=new FileReader();reader.onload=function(e){UI.confirm('Importer ?','Remplace toutes les donnees actuelles.',function(){try{var d=JSON.parse(e.target.result);if(!d.memories)throw new Error('invalid');var media=d._media||[];delete d._media;S.categories=d.categories||[];S.memories=(d.memories||[]).map(function(m){m.photos=[];return m});S.wishlist=d.wishlist||[];S.journal=d.journal||[];S.specialDates=d.specialDates||[];S.config=Object.assign({},DEMO.config,d.config||{});STG.save();if(media.length)IDB.importAll(media,function(){UI.toast('Import reussi !','ok');setTimeout(function(){location.reload()},1500)});else{UI.toast('Import reussi !','ok');setTimeout(function(){location.reload()},1500)}}catch(e2){UI.toast('Fichier invalide','er')}})};reader.readAsText(file)}
};

// ── IndexedDB ─────────────────────────────────────────────
var IDB=(function(){
  var db=null,N='wvmedia8',V=1,ST='media';
  function open(cb){if(db){cb(db);return}try{var req=indexedDB.open(N,V);req.onupgradeneeded=function(e){var s=e.target.result.createObjectStore(ST,{keyPath:'id'});s.createIndex('mid','mid',{unique:false})};req.onsuccess=function(e){db=e.target.result;cb(db)};req.onerror=function(){cb(null)}}catch(e){cb(null)}}
  return{
    save:function(mid,files,cb){if(!files||!files.length){cb([]);return}open(function(d){if(!d){cb([]);return}var refs=[],tx=d.transaction(ST,'readwrite'),store=tx.objectStore(ST);files.forEach(function(file){var id='med_'+uid();refs.push({id:id,type:file.type,name:file.name,size:file.size});store.put({id:id,mid:mid,type:file.type,name:file.name,data:file,size:file.size});(function(fid,fmid,ff){var fr=new FileReader();fr.onload=function(ev){DB.upsert('photos',{id:fid,mem_id:fmid,data:ev.target.result,type:ff.type,name:ff.name},null)};fr.readAsDataURL(ff)})(id,mid,file)});tx.oncomplete=function(){cb(refs)};tx.onerror=function(){cb([])}})},
    forMem:function(mid,cb){open(function(d){
      if(!d){IDB._fromSupabase(mid,cb);return;}
      var t=d.transaction(ST,'readonly'),r=t.objectStore(ST).index('mid').getAll(mid);
      r.onsuccess=function(e){
        var local=e.target.result||[];
        if(local.length>0){cb(local);}
        else{IDB._fromSupabase(mid,cb);}
      };
      r.onerror=function(){IDB._fromSupabase(mid,cb);};
    })},
    _fromSupabase:function(mid,cb){
      // Fallback : charger depuis Supabase si pas en local
      fetch(SURL+'/rest/v1/photos?mem_id=eq.'+encodeURIComponent(mid)+'&select=*',{headers:SH})
        .then(function(r){return r.json();})
        .then(function(photos){
          if(!photos||!photos.length){cb([]);return;}
          var out=[];var done=0;
          photos.forEach(function(ph){
            try{
              var b64=ph.data,parts=b64.split(','),bin=atob(parts[1]||parts[0]);
              var arr=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
              var blob=new Blob([arr],{type:ph.type||'image/jpeg'});
              // Sauvegarder en local pour la prochaine fois
              open(function(db){if(db){var tx=db.transaction(ST,'readwrite');tx.objectStore(ST).put({id:ph.id,mid:mid,type:ph.type||'image/jpeg',name:ph.name||ph.id,data:blob,size:blob.size});}});
              out.push({id:ph.id,mid:mid,type:ph.type||'image/jpeg',name:ph.name||ph.id,data:blob,size:blob.size});
            }catch(e){}
            done++;if(done===photos.length)cb(out);
          });
        }).catch(function(){cb([]);});
    },
    one:function(id,cb){open(function(d){if(!d){cb(null);return}var t=d.transaction(ST,'readonly'),r=t.objectStore(ST).get(id);r.onsuccess=function(e){cb(e.target.result||null)};r.onerror=function(){cb(null)}})},
    delMem:function(mid,cb){open(function(d){if(!d){if(cb)cb();return}IDB.forMem(mid,function(ms){if(!ms.length){if(cb)cb();return}var tx=d.transaction(ST,'readwrite'),st=tx.objectStore(ST);ms.forEach(function(m){st.delete(m.id)});tx.oncomplete=function(){if(cb)cb()}})})},
    delOne:function(id,cb){open(function(d){if(!d){if(cb)cb();return}var tx=d.transaction(ST,'readwrite');tx.objectStore(ST).delete(id);tx.oncomplete=function(){if(cb)cb()}})},
    all:function(cb){open(function(d){if(!d){cb([]);return}var r=d.transaction(ST,'readonly').objectStore(ST).getAll();r.onsuccess=function(e){var recs=e.target.result||[];if(!recs.length){cb([]);return}var out=[],done=0;recs.forEach(function(rec){var fr=new FileReader();fr.onload=function(ev){out.push({id:rec.id,mid:rec.mid,type:rec.type,name:rec.name,data:ev.target.result});done++;if(done===recs.length)cb(out)};fr.readAsDataURL(rec.data instanceof Blob?rec.data:new Blob([rec.data],{type:rec.type}))})};r.onerror=function(){cb([])}})},
    importAll:function(recs,cb){open(function(d){if(!d||!recs.length){if(cb)cb();return}var tx=d.transaction(ST,'readwrite'),st=tx.objectStore(ST);st.clear();recs.forEach(function(r){try{var p=r.data.split(','),b=atob(p[1]||p[0]),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);st.put({id:r.id,mid:r.mid,type:r.type,name:r.name,data:new Blob([a],{type:r.type})})}catch(e){}});tx.oncomplete=function(){if(cb)cb()}})}
  };
})();

// ── DB Supabase ───────────────────────────────────────────
var DB={
  get:function(t,cb){fetch(SURL+'/rest/v1/'+t+'?select=*',{headers:SH}).then(function(r){return r.ok?r.json():[]}).then(cb).catch(function(){cb([])})},
  upsert:function(t,d,cb){fetch(SURL+'/rest/v1/'+t,{method:'POST',headers:Object.assign({},SH,{'Prefer':'resolution=merge-duplicates,return=representation'}),body:JSON.stringify(d)}).then(function(r){return r.json()}).then(function(d){if(cb)cb(d)}).catch(function(){if(cb)cb(null)})},
  del:function(t,id,cb){fetch(SURL+'/rest/v1/'+t+'?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:SH}).then(function(){if(cb)cb()}).catch(function(){if(cb)cb()})},
  cfg:function(k,cb){fetch(SURL+'/rest/v1/config?key=eq.'+k+'&select=*',{headers:SH}).then(function(r){return r.json()}).then(function(d){cb(d&&d[0]?d[0].value:null)}).catch(function(){cb(null)})},
  setCfg:function(k,v){fetch(SURL+'/rest/v1/config',{method:'POST',headers:Object.assign({},SH,{'Prefer':'resolution=merge-duplicates'}),body:JSON.stringify({key:k,value:v,updated_at:new Date().toISOString()})}).catch(function(){})},
  pull:function(){
    DB.get('categories',function(rows){
    if(rows&&rows.length){
      S.categories=rows.map(function(r){return{id:r.id,name:r.name,icon:r.icon,color:r.color,type:r.type,anim:r.anim||'none'}});
      STG.save();
      // Re-render les pages qui affichent les catégories
      if(typeof LIST!=='undefined'&&typeof NAV!=='undefined'&&NAV.cur==='list')LIST.render();
      if(typeof MAP!=='undefined'&&typeof NAV!=='undefined'&&NAV.cur==='map'){MAP.render();MAP.renderSubs();}
      if(typeof SETTINGS!=='undefined'&&typeof NAV!=='undefined'&&NAV.cur==='settings')SETTINGS.render();
    }
  });
    DB.get('memories',function(rows){
      if(!rows||!rows.length)return;
      rows.forEach(function(r){var m={id:r.id,title:r.title,address:r.address,lat:r.lat,lng:r.lng,date:r.date,catId:r.cat_id,note:r.note,fav:r.fav,photoRefs:r.photo_refs||[],photos:[]};var ex=S.memories.find(function(x){return x.id===m.id});if(!ex)S.memories.push(m);else Object.assign(ex,m)});
      S.memories=S.memories.filter(function(m){return rows.some(function(r){return r.id===m.id})});
      STG.save();
      S.memories.forEach(function(m){if(!m.photoRefs||!m.photoRefs.length)return;m.photoRefs.forEach(function(ref){IDB.one(ref.id,function(local){if(local)return;fetch(SURL+'/rest/v1/photos?id=eq.'+encodeURIComponent(ref.id)+'&select=*',{headers:SH}).then(function(r){return r.json()}).then(function(photos){if(!photos||!photos[0]||!photos[0].data)return;var b64=photos[0].data,parts=b64.split(','),bin=atob(parts[1]||parts[0]),arr=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);var blob=new Blob([arr],{type:photos[0].type||ref.type||'image/jpeg'});var openReq=indexedDB.open('wvmedia8',1);openReq.onsuccess=function(e){var db=e.target.result,tx=db.transaction('media','readwrite');tx.objectStore('media').put({id:ref.id,mid:m.id,type:photos[0].type||ref.type||'image/jpeg',name:photos[0].name||ref.name||ref.id,data:blob,size:blob.size});tx.oncomplete=function(){if(typeof LIST!=='undefined'&&typeof NAV!=='undefined'&&NAV.cur==='list')setTimeout(function(){LIST.render()},200)}}}).catch(function(){})})})});
      STG.save();if(typeof LIST!=='undefined'&&typeof NAV!=='undefined'&&NAV.cur==='list')LIST.render();if(typeof MAP!=='undefined'&&typeof NAV!=='undefined'&&NAV.cur==='map')MAP.render();
    });
    DB.get('wishlist',function(rows){if(rows)S.wishlist=rows.map(function(r){return{id:r.id,title:r.title,address:r.address,lat:r.lat,lng:r.lng,catId:r.cat_id,note:r.note}})});
    DB.get('journal',function(rows){if(rows)S.journal=rows.map(function(r){return{id:r.id,title:r.title,text:r.text,emoji:r.emoji,date:r.date,link:r.link}});if(typeof JOURNAL!=='undefined'&&typeof NAV!=='undefined'&&NAV.cur==='journal')JOURNAL.render()});
    DB.get('comments',function(rows){
      if(rows&&rows.length){
        S.comments=rows.map(function(r){return{id:r.id,memId:r.mem_id,journalId:r.journal_id||null,author:r.author,text:r.text,createdAt:r.created_at};});
        STG.save();
      }
    });
    DB.cfg('app_config',function(v){if(v){S.config=Object.assign({},S.config,v)}});
  },
  sync:function(){DB.pull();setInterval(DB.pull,8000)},
  addComment:function(memId,journalId,author,text,cb){
    var c={id:uid(),mem_id:memId||null,journal_id:journalId||null,author:author,text:text,created_at:new Date().toISOString()};
    fetch(SURL+'/rest/v1/comments',{method:'POST',
      headers:Object.assign({},SH,{'Prefer':'resolution=merge-duplicates,return=representation'}),
      body:JSON.stringify(c)
    }).then(function(r){return r.json();}).then(function(){
      S.comments.push({id:c.id,memId:memId,journalId:journalId,author:author,text:text,createdAt:c.created_at});
      STG.save();if(cb)cb();
    }).catch(function(){
      // Fallback local
      S.comments.push({id:c.id,memId:memId,journalId:journalId,author:author,text:text,createdAt:c.created_at});
      STG.save();if(cb)cb();
    });
  },
  delComment:function(id,cb){
    S.comments=S.comments.filter(function(c){return c.id!==id;});STG.save();
    fetch(SURL+'/rest/v1/comments?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:SH}).catch(function(){});
    if(cb)cb();
  }
};

// ── Themes ────────────────────────────────────────────────
var THEMES={
  apply:function(id){document.body.setAttribute('data-theme',id);document.querySelectorAll('.tcard').forEach(function(c){c.classList.toggle('on',c.dataset.t===id)});S.config.theme=id;STG.save();if(id==='custom'&&S.config.customTheme)THEMES._applyVars(S.config.customTheme);if(typeof MAP!=='undefined')MAP.retile();UI.toast('Theme applique !','ok')},
  applyCustom:function(){var v={'--bg':document.getElementById('ct-bg').value,'--sur':document.getElementById('ct-sur').value,'--acc':document.getElementById('ct-acc').value,'--acc2':document.getElementById('ct-acc2').value,'--tx':document.getElementById('ct-tx').value,'--tx2':document.getElementById('ct-tx2').value,'--bd':document.getElementById('ct-bd').value,'mapbg':document.getElementById('ct-mapbg').value};S.config.customTheme=v;THEMES._applyVars(v);THEMES.apply('custom');STG.save();UI.closeSheet('sh-customtheme')},
  _applyVars:function(v){var el=document.getElementById('ct-style')||document.createElement('style');el.id='ct-style';var g=v['--acc']?v['--acc']+'33':'rgba(201,169,110,.2)';el.textContent='[data-theme=custom]{'+Object.keys(v).filter(function(k){return k.startsWith('--')}).map(function(k){return k+':'+v[k]}).join(';')+';--glow:'+g+';--sur2:'+v['--sur']+';--glass:'+v['--sur']+'ee;--glass2:'+v['--bg']+'dd}#map{background:'+v.mapbg+'!important}.leaflet-container{background:'+v.mapbg+'!important}';document.head.appendChild(el)},
  restore:function(){var t=S.config.theme||'romantique';document.body.setAttribute('data-theme',t);if(t==='custom'&&S.config.customTheme)THEMES._applyVars(S.config.customTheme)}
};

// ── UI helpers ────────────────────────────────────────────
var _cbcb=null,_blobUrls={};
var UI={
  toast:function(msg,type){var el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.className='show'+(type?' '+type:'');clearTimeout(UI._tt);UI._tt=setTimeout(function(){el.className=''},2800)},
  confirm:function(title,msg,cb){document.getElementById('c-title').textContent=title;document.getElementById('c-msg').textContent=msg;_cbcb=cb;document.getElementById('cov').classList.remove('hidden')},
  openSheet:function(id){UI._prefill(id);var el=document.getElementById(id);if(!el)return;el.classList.remove('hidden');requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('open')})})},
  closeSheet:function(id){var el=document.getElementById(id);if(!el)return;el.classList.remove('open');setTimeout(function(){el.classList.add('hidden')},400)},
  ovc:function(e,el){if(e.target===el)UI.closeSheet(el.id)},
  val:function(id,v){var el=document.getElementById(id);if(el)el.value=v!=null?v:''},
  get:function(id){var el=document.getElementById(id);return el?el.value.trim():''},
  sel:function(id,opts,cur){var el=document.getElementById(id);if(!el)return;el.innerHTML='';opts.forEach(function(o){var op=document.createElement('option');op.value=o.v;op.textContent=o.l;if(o.v===cur)op.selected=true;el.appendChild(op)})},
  mkUrl:function(id,blob){if(_blobUrls[id])try{URL.revokeObjectURL(_blobUrls[id])}catch(e){};var u=URL.createObjectURL(blob);_blobUrls[id]=u;return u},
  revoke:function(){Object.keys(_blobUrls).forEach(function(k){try{URL.revokeObjectURL(_blobUrls[k])}catch(e){}});_blobUrls={}},
  validate:function(ids){var ok=true;ids.forEach(function(id){var el=document.getElementById(id);if(!el)return;if(!el.value.trim()){el.classList.add('err');el.addEventListener('input',function(){el.classList.remove('err')},{once:true});ok=false}});if(!ok)UI.toast('Remplis les champs obligatoires','er');return ok},
  _prefill:function(id){
    if(id==='sh-addmem'){var cats=S.categories.filter(function(c){return c.type==='souvenir'});if(!cats.length){UI.toast("Cree d'abord une categorie dans Reglages",'er');setTimeout(function(){CAT.newCat('souvenir')},300);return}UI.sel('a-cat',cats.map(function(c){return{v:c.id,l:c.icon+' '+c.name}}),cats[0].id);UI.val('a-title','');UI.val('a-addr','');UI.val('a-date',today());UI.val('a-note','');UI.val('a-fav','0');document.getElementById('a-prev').innerHTML='';document.getElementById('a-files').value='';document.getElementById('am-badge').classList.add('hidden');document.getElementById('a-gr').classList.add('hidden');/* NE PAS remettre APP._pos à null ici — il est setté par le long-press AVANT openSheet */if(typeof MEDIA!=='undefined')MEDIA.clear('addmem')}
    if(id==='sh-addwish'){var wc=S.categories.filter(function(c){return c.type==='wishlist'});UI.sel('w-cat',wc.map(function(c){return{v:c.id,l:c.icon+' '+c.name}}),wc[0]?wc[0].id:'');UI.val('w-title','');UI.val('w-addr','');UI.val('w-note','');document.getElementById('aw-badge').classList.add('hidden');document.getElementById('w-gr').classList.add('hidden')}
    if(id==='sh-addjournal'){document.getElementById('j-stitle').textContent='Nouvelle entree';UI.val('j-id','');UI.val('j-title','');UI.val('j-emoji','');UI.val('j-date',today());UI.val('j-text','');var lnk=document.getElementById('j-link');lnk.innerHTML='<option value="">Aucun</option>';S.memories.forEach(function(m){var o=document.createElement('option');o.value=m.id;o.textContent=m.title;lnk.appendChild(o)})}
    if(id==='sh-splash'){UI.val('cfg-title',S.config.title);UI.val('cfg-date',S.config.startDate);UI.val('cfg-phrase',S.config.phrase)}
  }
};
var CN={yes:function(){document.getElementById('cov').classList.add('hidden');if(_cbcb)_cbcb();_cbcb=null},no:function(){document.getElementById('cov').classList.add('hidden');_cbcb=null}};

// ── Media preview ─────────────────────────────────────────
var MEDIA=(function(){
  var _s={addmem:[],editmem:[]};
  return{
    preview:function(input,prevId,ctx){var prev=document.getElementById(prevId);Array.from(input.files).forEach(function(file){_s[ctx].push(file);var wrap=document.createElement('div');wrap.className='mpwrap';var idx=_s[ctx].length-1;if(file.type.startsWith('image/')){var img=document.createElement('img');img.className='mpimg';img.src=URL.createObjectURL(file);wrap.appendChild(img)}else if(file.type.startsWith('video/')){var d=document.createElement('div');d.className='mpvid';d.textContent='🎬';wrap.appendChild(d)}var del=document.createElement('button');del.className='mpdel';del.textContent='x';del.onclick=function(){_s[ctx].splice(idx,1);wrap.remove()};wrap.appendChild(del);prev.appendChild(wrap)});input.value=''},
    get:function(ctx){return _s[ctx]||[]},
    clear:function(ctx){_s[ctx]=[]}
  };
})();

// ── Lightbox ──────────────────────────────────────────────
var LB={_imgs:[],_i:0,
  open:function(imgs,i){LB._imgs=imgs;LB._i=i||0;document.getElementById('lb-img').src=URL.createObjectURL(imgs[LB._i].data);document.getElementById('lb-prev').style.display=imgs.length>1?'':'none';document.getElementById('lb-next').style.display=imgs.length>1?'':'none';document.getElementById('lb').classList.remove('hidden')},
  prev:function(){LB._i=(LB._i-1+LB._imgs.length)%LB._imgs.length;document.getElementById('lb-img').src=URL.createObjectURL(LB._imgs[LB._i].data)},
  next:function(){LB._i=(LB._i+1)%LB._imgs.length;document.getElementById('lb-img').src=URL.createObjectURL(LB._imgs[LB._i].data)},
  close:function(){document.getElementById('lb').classList.add('hidden');LB._imgs=[]}
};

// ── GEO ───────────────────────────────────────────────────
var GEO=(function(){
  var live=deb(function(q,inputId,resId,ctx){var el=document.getElementById(resId);if(!q||q.length<3){if(el)el.classList.add('hidden');return}fetch('https://nominatim.openstreetmap.org/search?format=json&q='+encodeURIComponent(q)+'&limit=5&accept-language=fr').then(function(r){return r.json()}).then(function(data){_show(data,inputId,resId,ctx)}).catch(function(){})},350);
  function _show(data,inputId,resId,ctx){var el=document.getElementById(resId);if(!data.length){el.classList.add('hidden');return}var inp=document.getElementById(inputId);var rect=inp?inp.getBoundingClientRect():null;if(rect){el.style.top=(rect.bottom+4)+'px';el.style.left=rect.left+'px';el.style.width=rect.width+'px'}el.innerHTML='';el.classList.remove('hidden');data.slice(0,5).forEach(function(r){var addr=shortAddr(r.display_name);var p=addr.split(',').map(function(s){return s.trim()});var d=document.createElement('div');d.className='georow';d.innerHTML='<div style="font-size:13px;color:var(--tx);font-weight:500">'+esc(p[0])+'</div><div style="font-size:11px;color:var(--tx2);margin-top:2px">'+esc(p.slice(1).join(', '))+'</div>';d.onclick=function(){document.getElementById(inputId).value=addr;el.classList.add('hidden');var lat=parseFloat(r.lat),lng=parseFloat(r.lon);if(typeof APP!=='undefined')APP._pos={lat:lat,lng:lng};if(ctx==='addmem'){var b=document.getElementById('am-badge');if(b){b.textContent=addr;b.classList.remove('hidden')}var t=document.getElementById('a-title');if(t&&!t.value.trim())t.value=p[0].trim()}if(ctx==='addwish'){var b2=document.getElementById('aw-badge');if(b2){b2.textContent=addr;b2.classList.remove('hidden')}var t2=document.getElementById('w-title');if(t2&&!t2.value.trim())t2.value=p[0].trim()}if(ctx==='editmem'&&typeof APP!=='undefined')APP._epos={lat:lat,lng:lng};if(typeof MAP!=='undefined')MAP.fly(lat,lng)};el.appendChild(d)})}
  var _lm=null,_lc=null;
  return{
    live:live,
    fill:function(addrId,badgeId,titleId){GEO.locate(function(res){if(!res)return;var ai=document.getElementById(addrId);if(ai&&res.addr)ai.value=res.addr;if(badgeId){var b=document.getElementById(badgeId);if(b){b.textContent=res.addr;b.classList.remove('hidden')}}if(titleId){var ti=document.getElementById(titleId);if(ti&&!ti.value.trim()&&res.addr)ti.value=res.addr.split(',')[0].trim()}if(typeof APP!=='undefined')APP._pos={lat:res.lat,lng:res.lng}})},
    locate:function(cb){var btn=document.getElementById('mloc');if(!navigator||!navigator.geolocation){UI.toast('Geolocalisation non disponible','er');if(cb)cb(null);return}if(btn)btn.classList.add('loading');UI.toast('Localisation...','');var done=false;var tmr=setTimeout(function(){if(done)return;done=true;if(btn)btn.classList.remove('loading');UI.toast('GPS lent','er');if(cb)cb(null)},8000);navigator.geolocation.getCurrentPosition(function(pos){if(done)return;done=true;clearTimeout(tmr);var lat=pos.coords.latitude,lng=pos.coords.longitude,acc=pos.coords.accuracy;if(btn){btn.classList.remove('loading');btn.classList.add('on')}UI.toast('Position trouvee !','ok');if(typeof MAP!=='undefined'&&MAP.get()){if(_lm)_lm.remove();if(_lc)_lc.remove();var h='<div style="width:16px;height:16px;border-radius:50%;background:#7BC67E;border:3px solid #fff;box-shadow:0 0 0 5px rgba(123,198,126,.3)"></div>';_lm=L.marker([lat,lng],{icon:L.divIcon({html:h,className:'',iconSize:[16,16],iconAnchor:[8,8]}),zIndexOffset:1000}).addTo(MAP.get());_lc=L.circle([lat,lng],{radius:acc,color:'#7BC67E',fillColor:'#7BC67E',fillOpacity:.1,weight:1.5}).addTo(MAP.get());_lm.bindPopup('<div style="text-align:center;min-width:160px;font-family:Jost,sans-serif"><b style="color:#7BC67E">Ma position</b><br><small>+-'+Math.round(acc)+'m</small><br><button onclick="GEO.addHere('+lat+','+lng+')" style="margin-top:8px;padding:7px 14px;background:var(--acc);color:var(--bg);border:none;border-radius:50px;font-family:Jost,sans-serif;font-size:12px;cursor:pointer;width:100%">Souvenir ici</button><br><button onclick="GEO.addWish('+lat+','+lng+')" style="margin-top:6px;padding:7px 14px;background:transparent;color:var(--acc2);border:1px solid var(--acc2);border-radius:50px;font-family:Jost,sans-serif;font-size:12px;cursor:pointer;width:100%">Wishlist ici</button></div>',{maxWidth:200}).openPopup();MAP.fly(lat,lng,16)}fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+lat+'&lon='+lng+'&accept-language=fr').then(function(r){return r.json()}).then(function(d){var addr=d.address?fmtAddr(d.address):shortAddr(d.display_name);if(cb)cb({lat:lat,lng:lng,addr:addr})}).catch(function(){if(cb)cb({lat:lat,lng:lng,addr:''})})},function(err){if(done)return;done=true;clearTimeout(tmr);if(btn)btn.classList.remove('loading');UI.toast(err.code===1?'Acces refuse':'Position indisponible','er');if(cb)cb(null)},{enableHighAccuracy:true,timeout:7000,maximumAge:60000})},
    addHere:function(lat,lng){if(typeof MAP!=='undefined'&&MAP.get())MAP.get().closePopup();if(typeof APP!=='undefined')APP._pos={lat:lat,lng:lng};UI.openSheet('sh-addmem')},
    addWish:function(lat,lng){if(typeof MAP!=='undefined'&&MAP.get())MAP.get().closePopup();if(typeof APP!=='undefined')APP._pos={lat:lat,lng:lng};UI.openSheet('sh-addwish')}
  };
})();

// ── CAT ───────────────────────────────────────────────────
var CAT={
  newCat:function(type){document.getElementById('cat-stitle').textContent='Nouvelle categorie';UI.val('cat-id','');UI.val('cat-type',type||'souvenir');UI.val('cat-name','');UI.val('cat-icon','');UI.val('cat-anim','pulse');document.getElementById('cat-color').value='#C9A96E';document.getElementById('cat-anim-f').style.display=type==='wishlist'?'none':'';UI.openSheet('sh-cat')},
  edit:function(id){var cat=S.categories.find(function(c){return c.id===id});if(!cat)return;document.getElementById('cat-stitle').textContent='Modifier la categorie';UI.val('cat-id',id);UI.val('cat-type',cat.type);UI.val('cat-name',cat.name);UI.val('cat-icon',cat.icon);UI.val('cat-anim',cat.anim||'pulse');document.getElementById('cat-color').value=cat.color;document.getElementById('cat-anim-f').style.display=cat.type==='wishlist'?'none':'';UI.openSheet('sh-cat')},
  save:function(){var name=UI.get('cat-name'),icon=UI.get('cat-icon');if(!name||!icon){UI.toast('Nom et icone obligatoires','er');return}var eid=UI.get('cat-id'),type=UI.get('cat-type'),color=document.getElementById('cat-color').value,anim=document.getElementById('cat-anim').value;if(eid){var cat=S.categories.find(function(c){return c.id===eid});if(cat){cat.name=name;cat.icon=icon;cat.color=color;if(type==='souvenir')cat.anim=anim}}else S.categories.push({id:uid(),name:name,icon:icon,color:color,type:type,anim:anim});STG.save();S.categories.forEach(function(c){DB.upsert('categories',{id:c.id,name:c.name,icon:c.icon,color:c.color,type:c.type,anim:c.anim||'none'},null)});UI.closeSheet('sh-cat');if(typeof SETTINGS!=='undefined')SETTINGS.render();if(typeof MAP!=='undefined')MAP.render();UI.toast('Categorie '+(eid?'modifiee':'creee')+'!','ok')},
  del:function(id){var cat=S.categories.find(function(c){return c.id===id});if(!cat)return;var n=cat.type==='souvenir'?S.memories.filter(function(m){return m.catId===id}).length:S.wishlist.filter(function(w){return w.catId===id}).length;UI.confirm('Supprimer la categorie ?',n?n+' element(s) utilise(nt) cette categorie.':'',function(){S.categories=S.categories.filter(function(c){return c.id!==id});STG.save();if(typeof SETTINGS!=='undefined')SETTINGS.render();if(typeof MAP!=='undefined')MAP.render();if(typeof LIST!=='undefined')LIST.render();UI.toast('Supprime','')})}
};

// ── NAV ───────────────────────────────────────────────────
var NAV={
  cur: (function(){
    var p=window.location.pathname.split('/').pop().replace('.html','');
    var map={liste:'list',stats:'stats',carte:'map',journal:'journal',reglages:'settings'};
    return map[p]||'map';
  })(),
  go:function(page){
    // Déléguer au FAB si disponible
    if(typeof FAB!=='undefined'){FAB.go(page);return;}
    var pages={list:'liste.html',stats:'stats.html',map:'carte.html',journal:'journal.html',settings:'reglages.html'};
    window.location.replace(pages[page]||'carte.html');
  },
  setActive:function(){
    // Plus de navbar classique, le FAB gère l'état actif
  }
};

// ── Init commun ───────────────────────────────────────────
function initCommon(pageCallback){
  // Thème immédiat depuis localStorage
  try{var _t=JSON.parse(localStorage.getItem('wv_app')||'{}');if(_t.config&&_t.config.theme)document.body.setAttribute('data-theme',_t.config.theme)}catch(e){}
  // Charger les données EN PREMIER (synchrone depuis localStorage)
  STG.load();
  // Restaurer le thème avec les vraies données
  THEMES.restore();
  // Navbar active
  NAV.setActive();
  // Lancer le callback de page MAINTENANT que les données sont chargées
  if(pageCallback)pageCallback();
  // Puis sync Supabase en arrière-plan
  DB.sync();
  // Fermeture géo au clic
  document.addEventListener('click',function(e){if(!e.target.closest('.geobox')&&!e.target.closest('.geores'))document.querySelectorAll('.geores').forEach(function(el){el.classList.add('hidden')})});
  // Escape
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.querySelectorAll('.ov.open').forEach(function(el){UI.closeSheet(el.id)});LB.close()}});
}
