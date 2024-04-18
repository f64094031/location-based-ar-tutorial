import LatLon from 'https://cdn.jsdelivr.net/npm/geodesy@2.3.0/latlon-ellipsoidal-vincenty.js'; //匯入橢球距離的計算工具程式
//用法: const d = new LatLon(22.9987062, 120.2199947).distanceTo(new LatLon(23.9987062, 120.2199947));

//計算位置API
const TrackAPI = "https://d0e4-140-116-47-115.ngrok-free.app/TrackAPI2.php";
let entrancePosition = [{"x":120.2200520,"y":22.9987154,"z":27.033},{"x":120.2200649,"y":22.9987299,"z":31.634},{"x":120.2200666,"y":22.9987492,"z":31.634}];
// 		<!--0.一樓大門: gps-entity-place="latitude: 22.9986416; longitude: 120.2199345;" position="0 26.728 0"-->
// 		
// 		<!--1.經緯廳: gps-entity-place="latitude: 22.9987154; longitude: 120.2200520;" position="0 27.033 0"-->
// 		
// 		<!--2.大一教室: gps-entity-place="latitude: 22.9987299; longitude: 120.2200649;" position="0 31.634 0"-->
// 		
// 		<!--3.電腦教室: gps-entity-place="latitude: 22.9987492; longitude: 120.2200666;" position="0 31.634 0"-->
// 		
// 		<!--4.圖書室: gps-entity-place="latitude: 22.9987189; longitude: 120.2202121;" position="0 31.634 0"-->
// 		
// 		<!--5.55210實驗室: gps-entity-place="latitude: 22.9987382; longitude: 120.2202138;" position="0 31.634 0"-->
// 		
// 		<!--6.55316實驗室: gps-entity-place="latitude: 22.9987492; longitude: 120.2200666;" position="0 36.148 0"-->

//window.onload
//window.onload() 方法用于在网页加载完毕后立刻执行的操作，即当 HTML 文档加载完毕后，立刻执行某个方法。
//window.onload() 通常用于 <body> 元素，在页面完全载入后(包括图片、css文件等等)执行脚本代码。
window.onload = function(){
	
	//陀螺儀監聽	//獲取羅盤資料z	//手機z軸向(朝前)相對於N軸向之順時針角度
	let theta_rad;
	window.addEventListener('deviceorientation', function(event) { //get azimuth 處理方位角
		let head; 
		//     判斷是否為 iOS 裝置
		if(event.webkitCompassHeading) {
			//webkitCompassHeading表示「手機與地球正北方的夾角」，而 Android 則直接用 alpha 即可。
			head = event.webkitCompassHeading; // iOS 裝置必須使用 event.webkitCompassHeading
		}
		else {
			head = event.alpha;
		}

		document.write(head);
		document.write("<br/>");
		document.write(event.beta);
		document.write("<br/>");
		document.write(event.gamma);

		//let theta = -(head-180-90); //N軸轉向手機x軸向(朝右)的逆時針角度
		let theta = -head;
		theta_rad = theta * Math.PI /180; //換成弧度
	}, 1500); //取得網頁就緒當下之方位角，且不隨每次的位置更新重複執行


	if(head){
		setInterval(function() {
			//處理位置之計算
			//let height = 31.634; //假設固定於2樓移動
			$.getJSON( TrackAPI, function (data){
				let userHeight = data.z + 26.728;
				let point = {x: data.x, y: data.y}; //用戶即時平面位置座標(判斷within使用)
				let position = {coords:{longitude: data.x, latitude: data.y, altitude: userHeight}}; //用戶即時位置座標
				console.log("longitude: " + position.coords.longitude + " latitude: " + position.coords.latitude + " altitude: " + position.coords.altitude);
				document.getElementById("demo").innerHTML = "longitude: " + position.coords.longitude + "<br> latitude: " + position.coords.latitude + "<br> altitude: " + position.coords.altitude;
				SetLocation(position, theta_rad);
			});
		}, 1500);
	}
}

function SetLocation(position, degree){
	//let target = document.querySelectorAll('a-'+type+'.'+classtype);
	let target = document.querySelectorAll(".classroom");
	//console.log(target);

	for(let j=0; j<3; j++){
			let H = entrancePosition[j].z - position.coords.altitude;
			let user = new LatLon(position.coords.latitude, position.coords.longitude);

			//(AR內容緯度, 使用者經度)與(使用者緯度, 使用者經度)之距離N(m) 
			//也就是說將AR內容平移置與使用者相同經度，計算兩者間之距離N
			let N = new LatLon(entrancePosition[j].y, position.coords.longitude).distanceTo(user);
							
			//(使用者緯度, AR內容經度)與(使用者緯度, 使用者經度)之距離E(m) 
			//也就是說將AR內容平移置與使用者相同緯度，計算兩者間之距離E(假設兩點緯度差極小) 
			let E = new LatLon(position.coords.latitude, entrancePosition[j].x).distanceTo(user);
			console.log("N: " + N);
			console.log("E: " + E);

			if (entrancePosition[j].x-position.coords.longitude < 0){ E = -E;}
			if (entrancePosition[j].y-position.coords.latitude < 0){ N = -N;}

			let z = Math.cos(degree)*E + Math.sin(degree)*N;
			let x	= Math.cos(degree)*N - Math.sin(degree)*E; //換算至手機相機局部坐標系中(公尺) //正交轉換(尺度與形狀保持不變)Y軸旋轉量=degree, 平移量X=0, Y=0, Z=H

			let target_att = document.createAttribute('position');
			target_att.value = x+" "+H+" "+z;
			target[j].setAttributeNode(target_att);
			console.log(target[j]);
		// 	The Difference Between setAttribute() and setAttributeNode()
		// 	The setAttribute() method replaces attribute values.
		// 	The setAttributeNode() method replaces Attribute objects.
		// 	You must create an Attr object and set the Attr value before adding the attribute to an element.
	}
}