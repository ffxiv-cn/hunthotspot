/**
 *  大鸡排工具 - 热点图
 * 	Copyright © FFXIV.CN|FFXIV.XIN 温文尔雅的暖宝宝 2015 - 2017  All Rights Reserved.
 * 	data, image:FINAL FANTASY XIV © 2010 - 2017 SQUARE ENIX CO., LTD. All Rights Reserved.
 */

/**
 * 主程序
 */
;
(function(onwer) {
	
onwer.curAreaid = "2.x";
onwer.dataUrl = "https://api.ffxiv.cn/ajax/hunt/Analysis/";
onwer.isChrome = false;
onwer.huntData = {
	data:{},
	lastaUpdate:0
};

onwer.huntHis = {}

onwer.areas = {
	"2_x": {
		"134":[134,"中拉诺西亚","MiddleLaNoscea",3],
		"135":[135,"拉诺西亚低地","LowerLaNoscea",3],
		"137":[137,"东拉诺西亚","EasternLaNoscea",3],
		"138":[138,"西拉诺西亚","WesternLaNoscea",3],
		"139":[139,"拉诺西亚高地","UpperLaNoscea",3],
		"180":[180,"拉诺西亚外地","OuterLaNoscea",3],
		"140":[140,"西萨纳兰","WesternThanalan",3],
		"141":[141,"中萨纳兰","CentralThanalan",3],
		"145":[145,"东萨纳兰","EasternThanalan",3],
		"146":[146,"南萨纳兰","SouthernThanalan",3],
		"147":[147,"北萨纳兰","NorthernThanalan",3],
		"148":[148,"黑衣森林中央林区","CentralShroud",3],
		"152":[152,"黑衣森林东部林区","EastShroud",3],
		"153":[153,"黑衣森林南部林区","SouthShroud",3],
		"154":[154,"黑衣森林北部林区","NorthShroud",3],
		"155":[155,"库尔札斯中央高地","CoerthasCentralHighlands",3],
		"156":[156,"摩杜纳","MorDhona",3]
	},
	"3_x": {
		"397":[397,"库尔札斯西部高地","CoerthasWesternHighlands",5],
		"398":[398,"龙堡参天高地","TheDravanianForelands",5],
		"399":[399,"龙堡内陆低地","TheDravanianHinterlands",5],
		"400":[400,"翻云雾海","TheChurningMists",5],
		"401":[401,"阿巴拉提亚云海","TheSeaofClouds",5],
		"402":[402,"魔大陆阿济兹拉","AzysLla",5]
	},
	"4_x": {}
}

onwer.getMaps = function(mapid){
	
}

onwer.changeArea = function(e){
	if(e != undefined){
		onwer.curAreaid = e;
	}
		
	var ucs = onwer.areas[onwer.curAreaid];
	var html0 = '<option value="{0}" arr="{3}">{1} {2} ({3})</option>';
	var html1 = '<select data-placeholder="选择一个地区..." id="sc_uc"  class="chosen-select form-control" style="position: absolute; z-index: 5;" >{0}</select>';
	var html = "";
	html += '<option value=""> </option>';
	for(var i in ucs){
		html += html0.format(ucs[i][0],ucs[i][1],"",ucs[i][3]);
	}
	$("#sc_uc_div").html(html1.format(html));
	$('#sc_uc').chosen({
		allow_single_deselect: true,
		placeholder_text:"",
		search_contains: true,
		width: '100%'
	});
	$('#sc_uc').on('change', function(e){
	   	console.log($("#sc_uc").val())
	   	var id = $("#sc_uc").val();
	   	if(id == ""){
	   		$("#left_item_list .tager_item_list").removeClass("hidden");
	   	}else{
	   		$("#left_item_list .tager_item_list").addClass("hidden");
	   		$("#left_item_list .it_uc_"+id).removeClass("hidden");
	   	}
			   
	});
	var curTime = new Date().getTime();
	if(curTime - onwer.huntData.lastaUpdate > (10 * 60 * 60 * 1000) ){
		$.ajax({type: "get",url: onwer.dataUrl,	async: true,success: 
			function(data) {
				onwer.huntData.data = data;
				onwer.huntData.lastaUpdate = curTime;
				onwer.drawList();
			}
		})
	}else
	onwer.drawList();
}

onwer.drawList = function(){
	
	var html_0 = '<li class="tager_item_list it_uc_{0}" arr1={1} arr2={0}  arr3={2} ><a href="javascript:void(0)"><span class="name">{2}</span></a></li>';
	var html = "";
	var ucs = {};
	var data = onwer.huntData.data;
			
	for(var i = 0; i < data.length; i++) {
		//var uc_num = ucs[data[i]["MapID"]] == undefined ? 0 : ucs[data[i]["MapID"]][3];
		//console.log(uc_num)
		//ucs[data[i]["MapID"]] = [data[i]["MapID"],data[i]["MapName"],"",uc_num+1];
		if(onwer.areas[onwer.curAreaid][data[i]["MapID"]] == undefined)
			continue;
		html += html_0.format(data[i]["MapID"],data[i]["Name"],data[i]["MapName"]+" - "+data[i]["Name"]+"("+ data[i]["Type"] +")");
	}
			
	$("#left_item_list").html(html);
			
	$("#sc_uc_btns .btn").removeClass("btn-info");
	$("#"+onwer.curAreaid).addClass("btn-info");
	
	$("#left_item_list li").on("click",function(e){
		var name = this.getAttribute("arr1");
		var name2 = this.getAttribute("arr3");
		var mapid = this.getAttribute("arr2");
		var mapImg = onwer.findMapImg(mapid);
		console.log("name = "+name)
		if(onwer.huntHis[name] == undefined){
			console.log("name = "+name+" -- 缓存不存在、重新请求")
			onwer.getHuntData(name,name2,mapImg);
		}else{
			onwer.createData(onwer.huntHis[name],name,name2,mapImg);
		}
		//
	})
}

onwer.findMapImg = function(mapId){
	if(onwer.areas["2_x"][mapId] != undefined)
		return "img/map/500/"+onwer.areas["2_x"][mapId][2]+".png"
	if(onwer.areas["3_x"][mapId] != undefined)
		return "img/map/500/"+onwer.areas["3_x"][mapId][2]+".png"
	if(onwer.areas["4_x"][mapId] != undefined)
		return "img/map/500/"+onwer.areas["4_x"][mapId][2]+".png"
}

onwer.getHuntData = function(name,name2,name3){
	console.log("getHuntData",name,name2,name3)
	var urls = onwer.dataUrl + name;
	$.ajax({type: "get",url: urls.replace(" ","%20"),async: true,success: function(data) {
		onwer.huntHis[name] = data;
		onwer.createData(data,name,name2,name3);
	} })
}

onwer.createData = function (data,name,mapname,mapimg) {
	console.log("createData",0,mapname,mapimg)
	var arr = onwer.createArray(42, 42);
	var lage = 0;
	var out = [];
	for(var i in data) {
		try{
			var tem = data[i];
			if(tem["Counts"] > lage)
				lage = tem["Counts"];
			var temx = tem["X"];
			var temy = tem["Y"];
			arr[42 - temy][temx-1][2] = tem["Counts"];
		}catch(e){
			console.log("数据有误！",name,mapname,data[i])
			new $.zui.Messager('发现非法提交的数据! data = '+JSON.stringify(data[i]), {  type: 'danger'}).show();
		}
		
	}
	//console.log(JSON.stringify(arr))
	for(var i = 0; i < arr.length; i++) {
		for(var j = 0; j < arr[i].length; j++) {
			out.push(arr[i][j]);
		}
	}
	
	onwer.drawEchart(out, lage,name,mapname,mapimg)
}

onwer.createArray = function(x, y) {
	var arr = [];
	for(var i = 0; i < x; i++) {
		var tem = [];
		for(var j = 0; j < y; j++) {
			//var index = i * x + j;
			tem[j] = [j, i, 0];
		}
		arr[i] = tem;
	}
	return arr;
}

onwer.createXYData = function(x) {
	var arr = [];
	for(var i = 0; i < x; i++) {
		arr.push(i)
	}
	return arr;
}

onwer.drawEchart = function(data, lage,huntName,mapname,mapimg){
option = {
tooltip: {
	formatter: function(params,params1,params2,params3){
		var xy = (params["data"][0] +1 ) +"," + (42 - params["data"][1]);
		return params["seriesName"]+"("+ xy +") <br/> 出现次数"+params["data"][2];
	},
	axisPointer: {
		type: "cross", // 'line' 直线指示器 'shadow' 阴影指示器 'cross' 十字准星指示器。
		label:{show:false},
		crossStyle:{
			type:"dotted",
			color: "#0ffdca",
		}
	}
},
xAxis: {
	type: 'category',
	data: onwer.createXYData(42, "x"),
	position: "top",
	axisTick: {
		show: true,
		alignWithLabel: true,
	},
	show: true,
	axisLabel: {
		formatter: function(v) {
			return parseInt(v)  + 1;
		}
	},
	axisPointer:{
		label:{show:false}
	}
},
yAxis: {
	type: 'category',
	position: "left",
	data: onwer.createXYData(42, "y"),
	axisTick: {
		show: true,
		alignWithLabel: true,
	},
	show: true,
	axisLabel: {
		formatter: function(v) {
			return 42 - parseInt(v);
		}
	},
	axisPointer:{
		label:{show:false}
	}
},
grid: {
	left: 30,
	top: 30,
	right: 30,
	bottom: 50
},
graphic: [
{
	type: 'image',
	id: 'bg',
	left: 30,
	top: 30,
	z: -10,
	bounding: 'raw',
	origin: [75, 75],
	style: {image: mapimg,width: 500,height: 500,opacity: 1	}
},{
	type: 'text',
	id: 'title',
	left: 30,
	bottom: 6,
	z: -1,
	style: {fill: '#0000',text: huntName ,font: '18px Microsoft YaHei'}
}
],
visualMap: {
	min: 0,
	max: lage,
	calculable: true,
	realtime: false,
	inRange: {
		color: ['rgba(255, 73, 0, 0)', 'rgba(255, 73, 0, 0.3)', 'rgba(255, 73, 0, 0.35)', 'rgba(255, 73, 0, 0.4)', 'rgba(255, 73, 0, 0.40)',
			'rgba(255, 73, 0, 0.45)', 'rgba(255, 73, 0, 0.5)', 'rgba(255, 73, 0, 0.55)', 'rgba(255, 73, 0, 0.65)', 'rgba(255, 73, 0, 0.7)', 'rgba(255, 73, 0, 0.75)'
		]
	},
	orient: 'horizontal',
	left: 'center',
	bottom: '0'
},
series: [{
	name: mapname,
	type: 'heatmap',
	data: data,
	itemStyle: {
		emphasis: {
			borderColor: 'rgba(255, 255, 255, 0)',
			borderWidth: 1
		}
	},
	progressive: 1000,
	animation: true
}]
};

try{
	echarts.dispose(document.getElementById('main'));
}catch(e){
	console.log(e)
}

var myChart = echarts.init(document.getElementById('main'));
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

}
	
}(window.huntspot = {}));

/**
 * 自定义工具
 */
;
(function(mt){
mt._copy = function(obj){
	if(obj != "" )
		return JSON.parse(JSON.stringify(obj));
	else
		return undefined;
}
}(window._MT = {}));

/**
 * String 扩展
 */
String.prototype.format = function() {
	if(arguments.length == 0) return this;
	for(var s = this, i = 0; i < arguments.length; i++)
		s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
	return s;
};