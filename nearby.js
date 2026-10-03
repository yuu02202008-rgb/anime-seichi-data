(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  let origin = null, map = null, markers = null, userMarker = null, accuracyCircle = null, busy = false, baseTiles = null, locationState = 'idle', locationAccuracy = 0;
  let latest = [], openDetail = null;
  const labels = {
    ja: { detail:"聖地の詳細を見る", viewpoint:"撮影地点", viewpointMap:"撮影場所の地図を開く", useLocation:"現在地を使うと、近くの聖地だけを地図に表示します。", mapUnavailable:"地図を読み込めませんでした。距離表示と近い順の一覧は利用できます。", tileError:"地図の背景を読み込めません。通信環境を確認してください。", shown:n=>`地図上に${n}地点を表示`, current:"現在地", unknown:"距離未確認", line:"直線", distance:"現在地から約", approximate:"おおよその地点", https:"現在地はHTTPSの公開サイト、または対応するブラウザで利用してください。", locating:"現在地を確認しています。ブラウザの位置情報の利用を許可してください。", nearby:n=>`現在地から近い順に表示しています。位置情報の精度は約${n}mです。`, denied:"位置情報が許可されていません。ブラウザのサイト設定で許可してから、もう一度お試しください。", timeout:"現在地の取得が時間切れになりました。もう一度お試しください。", unavailable:"現在地を取得できませんでした。端末の位置情報設定を確認してください。", cleared:"現在地をクリアしました。現在地は保存していません。" },
    en: { detail:"View location details", viewpoint:"Viewpoint", viewpointMap:"Open viewpoint area in Google Maps", useLocation:"Use your location to show nearby anime locations on the map.", mapUnavailable:"The map could not be loaded. Distance and nearby sorting are still available.", tileError:"The map background could not be loaded. Check your connection.", shown:n=>`Showing ${n} locations on the map`, current:"Your location", unknown:"Distance unavailable", line:"straight line", distance:"About", approximate:"Approximate location", https:"Location is available on the HTTPS public site or a supported browser.", locating:"Checking your location. Allow location access in your browser.", nearby:n=>`Sorted by distance from your location. Accuracy is about ${n} m.`, denied:"Location access is not allowed. Allow it in your browser settings and try again.", timeout:"Location lookup timed out. Try again.", unavailable:"Your location could not be obtained. Check device location settings.", cleared:"Location cleared. It was not saved.", englishTileLimit:"English map labels are available at zoom levels 5–11. Detailed views use the standard Japanese map." }
  };
  const lang = () => localStorage.getItem("anime-seichi-language") === "en" ? "en" : "ja";
  const t = (key, value) => typeof labels[lang()][key] === "function" ? labels[lang()][key](value) : labels[lang()][key];
  const localized = () => window.animeSeichiI18n || {};
  const placeName = (place) => localized().place?.(place, lang()) || place.name;
  const workName = (work) => localized().work?.(work, lang()) || work;
  const viewpointName = (label) => localized().viewpoint?.(label, lang()) || label;
  const coordinates = (place) => {
    if (place.privacyProtected) return null;
    const parts = String(place.coordinates || '').trim().split(/[,，]/).map(s => s.trim());
    if (parts.length !== 2 || parts.some(s => !/^[+-]?\d+(?:\.\d+)?$/.test(s))) return null;
    const point = parts.map(Number);
    if (!(Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180)) return null;
    // 日本の住所なのに日本の範囲外なら、桁抜けなどの入力ミスとして扱う。
    const placeText = `${place.prefecture || ''}${place.city || ''}${place.address || ''}`;
    const isJapaneseAddress = /[ぁ-んァ-ン一-龯]/.test(placeText);
    if (isJapaneseAddress && !(point[0] >= 20 && point[0] <= 46 && point[1] >= 122 && point[1] <= 154)) return null;
    return point;
  };
  const km = (a,b) => {
    const rad = n => n * Math.PI / 180;
    const h = Math.sin(rad(b[0]-a[0])/2)**2 + Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(rad(b[1]-a[1])/2)**2;
    return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1,h)));
  };
  const distance = p => origin && coordinates(p) ? km(origin,coordinates(p)) : Infinity;
  const format = n => n < 1 ? `${Math.round(n*1000)}m` : `${n.toFixed(1)}km`;
  const markerKey = place => {
    if (place.mapGroup) return `group:${place.mapGroup}`;
    const point = coordinates(place);
    return point ? `coordinate:${point[0].toFixed(4)},${point[1].toFixed(4)}` : `place:${place.id}`;
  };
  const viewpointCoordinates = place => {
    const value = place.shootingViewpoint?.coordinates;
    if (!value) return null;
    const parts = String(value).split(/[,，]/).map(Number);
    return parts.length === 2 && parts.every(Number.isFinite) ? parts : null;
  };
  const changed = () => window.dispatchEvent(new Event('nearbychange'));
  function syncMapLanguage() {
    if (!map) return;
    const status = $('mapStatus');
    const useEnglishTiles = lang() === 'en' && map.getZoom() <= 11;
    const layerName = useEnglishTiles ? 'english' : 'std';
    if (baseTiles?.layerName === layerName) return;
    if (baseTiles) map.removeLayer(baseTiles);
    baseTiles = L.tileLayer(`https://cyberjapandata.gsi.go.jp/xyz/${layerName}/{z}/{x}/{y}.png`, {
      minZoom:5, maxZoom:18,
      attribution:`<a href="https://maps.gsi.go.jp/development/ichiran.html">${lang() === 'en' ? 'Geospatial Information Authority of Japan' : '国土地理院'}</a>`
    });
    baseTiles.layerName = layerName;
    baseTiles.on('tileerror',()=>{$('mapStatus').textContent=t('tileError');}).addTo(map);
  }
  function initMap() {
    if(map) return true;
    if(!window.L) { $('mapStatus').textContent=t('mapUnavailable'); return false; }
    map=L.map('nearbyMap',{scrollWheelZoom:false,minZoom:5,maxZoom:18}).setView([36.2,138.3],5);
    map.on('zoomend',syncMapLanguage);
    map.on('zoomend',()=>render(latest,openDetail));
    syncMapLanguage();
    markers=L.layerGroup().addTo(map);
    return true;
  }
  function renderLocationStatus() {
    const key = ({idle:'useLocation',locating:'locating',nearby:'nearby',denied:'denied',timeout:'timeout',unavailable:'unavailable',cleared:'cleared',https:'https'})[locationState] || 'useLocation';
    $('locationStatus').textContent = locationState === 'nearby' ? t(key, locationAccuracy) : t(key);
  }
  function render(results, detail) {
    latest=results;openDetail=detail;
    if(!initMap()) return;
    markers.clearLayers();
    const valid=results.filter(p=>coordinates(p));
    // 同じ現地を別作品・別シーンで登録している場合は、地図では1本のピンにまとめる。
    const shown=valid.filter((place,index,list)=>list.findIndex(item=>markerKey(item)===markerKey(place))===index).slice(0,500);
    shown.forEach(p=>{
      const sameSite=valid.filter(item=>markerKey(item)===markerKey(p));
      const popup=document.createElement('div');
      const title=document.createElement('strong');title.textContent=placeName(p);
      const text=document.createElement('p');text.textContent=[...new Set(sameSite.map(item=>workName(item.work)))].join(' / ')+(origin?` · ${t('distance')} ${format(distance(p))} (${t('line')})`:'')+(p.coordinateAccuracy==='approximate'?` · ${t('approximate')}`:'');
      popup.append(title,text);
      sameSite.forEach(item=>{
        const button=document.createElement('button');button.textContent=sameSite.length>1?`${workName(item.work)} · ${t('detail')}`:t('detail');button.onclick=()=>openDetail(item);
        popup.append(button);
        if(item.shootingViewpoint?.mapUrl){const link=document.createElement('a');link.href=item.shootingViewpoint.mapUrl;link.target='_blank';link.rel='noopener';link.textContent=t('viewpointMap');popup.append(link);}
      });
      L.circleMarker(coordinates(p),{radius:6,color:'#df693e',fillOpacity:.8,weight:2}).bindPopup(popup).addTo(markers);
      const viewpoint = sameSite.map(item => ({ item, point: viewpointCoordinates(item) })).find(entry => entry.point);
      if (viewpoint) {
        const viewpointPopup = document.createElement('div');
        const heading = document.createElement('strong'); heading.textContent = t('viewpoint');
        const description = document.createElement('p'); description.textContent = viewpointName(viewpoint.item.shootingViewpoint.label) || placeName(viewpoint.item);
        viewpointPopup.append(heading, description);
        const button = document.createElement('button'); button.textContent = t('detail'); button.onclick = () => openDetail(viewpoint.item);
        viewpointPopup.append(button);
        L.circleMarker(viewpoint.point,{radius:6,color:'#2675ce',fillOpacity:.85,weight:2}).bindPopup(viewpointPopup).addTo(markers);
      }
    });
    $('mapStatus').textContent=`${t('shown', shown.length)}${valid.length>500?(lang()==='en'?' (first 500)':'（先頭500地点）'):''}.${lang()==='en'&&map.getZoom()>11?` ${t('englishTileLimit')}`:''}`;
  }
  function locate() {
    if(busy) return;
    if(!navigator.geolocation || !window.isSecureContext) { locationState='https';renderLocationStatus(); return; }
    busy=true;locationState='locating';$('locateButton').disabled=true;renderLocationStatus();
    navigator.geolocation.getCurrentPosition(pos=>{
      busy=false;$('locateButton').disabled=false;
      origin=[pos.coords.latitude,pos.coords.longitude];
      locationState='nearby';locationAccuracy=Math.round(pos.coords.accuracy);renderLocationStatus();
      $('distanceSort').options[1].disabled=false;$('distanceSort').value='nearby';$('clearLocation').hidden=false;
      if(initMap()) {
        if(userMarker) map.removeLayer(userMarker);if(accuracyCircle) map.removeLayer(accuracyCircle);
        userMarker=L.marker(origin).addTo(map).bindPopup(t('current'));
        accuracyCircle=L.circle(origin,{radius:pos.coords.accuracy,color:'#2675ce',weight:1,fillOpacity:.08}).addTo(map);
        map.setView(origin,13);
      }
      changed();
    },err=>{
      busy=false;$('locateButton').disabled=false;
      locationState=err.code===1?'denied':err.code===3?'timeout':'unavailable';renderLocationStatus();
    },{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
  }
  window.nearby={coordinates,order:results=>$('distanceSort').value==='nearby'&&origin?[...results].sort((a,b)=>distance(a)-distance(b)):results,render,distanceMarkup:p=>origin?`<span class="card-distance">${Number.isFinite(distance(p))?`${t('distance')} ${format(distance(p))} (${t('line')})`:t('unknown')}</span>`:''};
  $('locateButton').addEventListener('click',locate);
  document.querySelectorAll('[data-nearby-link]').forEach(link=>link.addEventListener('click',locate));
  $('distanceSort').addEventListener('change',changed);
  $('clearLocation').addEventListener('click',()=>{
    origin=null;if(userMarker)map.removeLayer(userMarker);if(accuracyCircle)map.removeLayer(accuracyCircle);userMarker=null;accuracyCircle=null;
    $('clearLocation').hidden=true;$('distanceSort').value='default';$('distanceSort').options[1].disabled=true;
    locationState='cleared';renderLocationStatus();if(map)map.setView([36.2,138.3],5);changed();
  });
  window.addEventListener('anime-language-change', () => { syncMapLanguage(); renderLocationStatus(); if (latest.length || origin) render(latest, openDetail); });
  $('fitPlaces').addEventListener('click',()=>{if(!initMap())return;const points=latest.filter(p=>coordinates(p)).slice(0,500).map(coordinates);if(points.length)map.fitBounds(L.latLngBounds(points),{padding:[25,25],maxZoom:15});});
})();
