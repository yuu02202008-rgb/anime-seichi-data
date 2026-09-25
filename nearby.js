(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  let origin = null, map = null, markers = null, userMarker = null, accuracyCircle = null, busy = false;
  let latest = [], openDetail = null;
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
  function initMap() {
    if(map) return true;
    if(!window.L) { $('mapStatus').textContent='地図を読み込めませんでした。距離表示と近い順の一覧は利用できます。'; return false; }
    map=L.map('nearbyMap').setView([36.2,138.3],5);
    L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',{minZoom:2,maxZoom:18,attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'}).on('tileerror',()=>{$('mapStatus').textContent='地図の背景を読み込めません。通信環境を確認してください。';}).addTo(map);
    markers=L.layerGroup().addTo(map);
    return true;
  }
  function render(results, detail) {
    latest=results;openDetail=detail;
    if(!initMap()) return;
    markers.clearLayers();
    const valid=origin ? results.filter(p=>coordinates(p)) : [];
    // 同じ現地を別作品・別シーンで登録している場合は、地図では1本のピンにまとめる。
    const shown=valid.filter((place,index,list)=>list.findIndex(item=>markerKey(item)===markerKey(place))===index).slice(0,500);
    shown.forEach(p=>{
      const sameSite=valid.filter(item=>markerKey(item)===markerKey(p));
      const popup=document.createElement('div');
      const title=document.createElement('strong');title.textContent=p.name;
      const text=document.createElement('p');text.textContent=[...new Set(sameSite.map(item=>item.work))].join(' / ')+(origin?` · 直線距離 約${format(distance(p))}`:'')+(p.coordinateAccuracy==='approximate'?' · おおよその地点':'');
      popup.append(title,text);
      sameSite.forEach(item=>{
        const button=document.createElement('button');button.textContent=sameSite.length>1?`${item.work}の詳細を見る`:'聖地の詳細を見る';button.onclick=()=>openDetail(item);
        popup.append(button);
      });
      L.circleMarker(coordinates(p),{radius:6,color:'#df693e',fillOpacity:.8,weight:2}).bindPopup(popup).addTo(markers);
      const viewpoint = sameSite.map(item => ({ item, point: viewpointCoordinates(item) })).find(entry => entry.point);
      if (viewpoint) {
        const viewpointPopup = document.createElement('div');
        const heading = document.createElement('strong'); heading.textContent = '撮影地点';
        const description = document.createElement('p'); description.textContent = viewpoint.item.shootingViewpoint.label || viewpoint.item.name;
        viewpointPopup.append(heading, description);
        const button = document.createElement('button'); button.textContent = '聖地の詳細を見る'; button.onclick = () => openDetail(viewpoint.item);
        viewpointPopup.append(button);
        L.circleMarker(viewpoint.point,{radius:6,color:'#2675ce',fillOpacity:.85,weight:2}).bindPopup(viewpointPopup).addTo(markers);
      }
    });
    $('mapStatus').textContent=origin ? `地図上に${shown.length}地点を表示${valid.length>500?'（先頭500地点。条件を絞って探せます）':''}。` : '現在地を使うと、近くの聖地だけを地図に表示します。';
  }
  function locate() {
    if(busy) return;
    if(!navigator.geolocation || !window.isSecureContext) { $('locationStatus').textContent='現在地はHTTPSの公開サイト、または対応するブラウザで利用してください。'; return; }
    busy=true;$('locateButton').disabled=true;$('locationStatus').textContent='現在地を確認しています。ブラウザの位置情報の利用を許可してください。';
    navigator.geolocation.getCurrentPosition(pos=>{
      busy=false;$('locateButton').disabled=false;
      origin=[pos.coords.latitude,pos.coords.longitude];
      $('distanceSort').options[1].disabled=false;$('distanceSort').value='nearby';$('clearLocation').hidden=false;
      $('locationStatus').textContent=`現在地から近い順に表示しています（現在の絞り込み条件内）。位置情報の精度は約${Math.round(pos.coords.accuracy)}mです。`;
      if(initMap()) {
        if(userMarker) map.removeLayer(userMarker);if(accuracyCircle) map.removeLayer(accuracyCircle);
        userMarker=L.marker(origin).addTo(map).bindPopup('現在地');
        accuracyCircle=L.circle(origin,{radius:pos.coords.accuracy,color:'#2675ce',weight:1,fillOpacity:.08}).addTo(map);
        map.setView(origin,13);
      }
      changed();
    },err=>{
      busy=false;$('locateButton').disabled=false;
      $('locationStatus').textContent=err.code===1?'位置情報が許可されていません。ブラウザのサイト設定で許可してから、もう一度お試しください。':err.code===3?'現在地の取得が時間切れになりました。もう一度お試しください。':'現在地を取得できませんでした。端末の位置情報設定を確認してください。';
    },{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
  }
  window.nearby={coordinates,order:results=>$('distanceSort').value==='nearby'&&origin?[...results].sort((a,b)=>distance(a)-distance(b)):results,render,distanceMarkup:p=>origin?`<span class="card-distance">${Number.isFinite(distance(p))?`現在地から約${format(distance(p))}（直線）`:'距離未確認'}</span>`:''};
  $('locateButton').addEventListener('click',locate);
  document.querySelectorAll('[data-nearby-link]').forEach(link=>link.addEventListener('click',locate));
  $('distanceSort').addEventListener('change',changed);
  $('clearLocation').addEventListener('click',()=>{
    origin=null;if(userMarker)map.removeLayer(userMarker);if(accuracyCircle)map.removeLayer(accuracyCircle);userMarker=null;accuracyCircle=null;
    $('clearLocation').hidden=true;$('distanceSort').value='default';$('distanceSort').options[1].disabled=true;
    $('locationStatus').textContent='現在地をクリアしました。現在地は保存していません。';if(map)map.setView([36.2,138.3],5);changed();
  });
  $('fitPlaces').addEventListener('click',()=>{if(!initMap())return;const points=latest.filter(p=>coordinates(p)).slice(0,500).map(coordinates);if(points.length)map.fitBounds(L.latLngBounds(points),{padding:[25,25],maxZoom:15});});
})();
