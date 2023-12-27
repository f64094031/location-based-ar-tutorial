//window.onload
//window.onload() 方法用于在网页加载完毕后立刻执行的操作，即当 HTML 文档加载完毕后，立刻执行某个方法。
//window.onload() 通常用于 <body> 元素，在页面完全载入后(包括图片、css文件等等)执行脚本代码。

import LatLon from 'https://cdn.jsdelivr.net/npm/geodesy@2.3.0/latlon-ellipsoidal-vincenty.js'; //匯入橢球距離的計算工具程式
//用法: const d = new LatLon(22.9987062, 120.2199947).distanceTo(new LatLon(23.9987062, 120.2199947));

//計算位置API
const TrackAPI = "https://d0e4-140-116-47-115.ngrok-free.app/TrackAPI2.php";
let entrancePosition = [{"x":120.2199345,"y":22.9986416,"z":26.728},{"x":120.2200520,"y":22.9987154,"z":27.033},
				       					{"x":120.2200649,"y":22.9987299,"z":31.634},{"x":120.2200666,"y":22.9987492,"z":31.634},
				       					{"x":120.2202121,"y":22.9987189,"z":31.634},{"x":120.2202138,"y":22.9987382,"z":31.634},
												{"x":120.2200666,"y":22.9987492,"z":36.148}];

window.onload = function(){
	//處理位置之計算
	//let height = 31.634; //假設固定於2樓移動
	$.getJSON( TrackAPI, function (data){
		let userHeight = data.z + 26.728;
		let point = {x: data.x, y: data.y}; //用戶即時平面位置座標(判斷within使用)
		let position = {coords:{longitude: data.x, latitude: data.y, altitude: userHeight}}; //用戶即時位置座標
		console.log("longitude: " + position.coords.longitude + "latitude: " + position.coords.latitude + "altitude: " + position.coords.altitude);
	});

	window.addEventListener('deviceorientation', function(event) { //get azimuth 處理方位角
		//陀螺儀監聽	//獲取羅盤資料z//手機-z軸向(朝前)相對於N軸向之順時針角度
		let head; 
		//     判斷是否為 iOS 裝置
		if(event.webkitCompassHeading) {
			head = event.webkitCompassHeading; // iOS 裝置必須使用 event.webkitCompassHeading
		}
		else {
			head = event.alpha;
		}
		if (head == undefined){ head = 0; } //無羅盤資料則預設朝向正北
		let theta = -(head-180-90); //N軸轉向手機x軸向(朝右)的逆時針角度
		let theta_rad = theta * Math.PI /180; //換成弧度
		let routeAll = document.querySelectorAll('a-entity.route');
		for (let i=0; i<routeAll.length; i++){
			routeAll[i].setAttribute('rotation','0 '+head+' 0'); //確定路線模型旋轉角
		};
	}, {once: true}); //取得網頁就緒當下之方位角，且不隨每次的位置更新重複執行
	
	SetLocation(position, theta_rad);
}

function SetLocation(position, degree){
	let target = document.getElementById("arrow");
	let H = entrancePosition[0].x - position.coords.altitude;
	let user = new LatLon(position.coords.latitude, position.coords.longitude);

	//(AR內容緯度, 使用者經度)與(使用者緯度, 使用者經度)之距離N(m) 
	//也就是說將AR內容平移置與使用者相同經度，計算兩者間之距離N
	let N = new LatLon(ancpos[j].y, position.coords.longitude).distanceTo(user);
					
	//(使用者緯度, AR內容經度)與(使用者緯度, 使用者經度)之距離E(m) 
	//也就是說將AR內容平移置與使用者相同緯度，計算兩者間之距離E(假設兩點緯度差極小) 
	let E = new LatLon(position.coords.latitude, ancpos[j].x).distanceTo(user);

	if (entrancePosition[0].x-position.coords.longitude < 0){ E = -E;}
	if (entrancePosition[0].y-position.coords.latitude < 0){ N = -N;}

	let z = Math.cos(degree)*E + Math.sin(degree)*N;
	let x	= Math.cos(degree)*N - Math.sin(degree)*E; //換算至手機相機局部坐標系中(公尺)

	let target_att = document.createAttribute('position');
	target_att.value = x+" "+H+" "+z;
	target.setAttributeNode(target_att);
}

