//playNode播放器按钮videoNode播放器playBln控制暂停播放的布尔值fullNode全屏lineNode当前的进度条crlNode进度条按钮
var playNode = document.getElementsByClassName('playNode')[0],
	videoNode = document.getElementsByClassName('videoNode')[0],
	fullNode = document.querySelector('.fullNode'),
	playBln = true,
	nowNode = document.querySelector('.now'),
	allNode = document.querySelector('.all'),
	lineNode = document.querySelector('.lineNode'),
	crlNode = document.querySelector('.crlNode'),
	loadNode = document.querySelector('.loadNode'),
	VdragNode = document.querySelector('.v_dragNode');
/*播放暂停的控制*/
playNode.onclick = function () {
	//console.log(playNode.classList);
	//可以使用classList.toggle方法来切换
	//this.classList.toggle('pauseNode');
	//传统方法
	playBln = !playBln;
	if (playBln == false) {
		this.className = 'pauseNode';
		videoNode.play();
	}else{
		this.className = 'playNode';
		videoNode.pause();
	}
};
/*全屏按钮的事件*/
fullNode.onclick = function () {
	if (videoNode.webkitRequestFullscreen) {
		videoNode.webkitRequestFullscreen();
	}else if (videoNode.mozRequestFullScreen) {
		videoNode.mozRequestFullScreen();
	}else{
		videoNode.requestFullscreen();
	}
};
/*视频的总时间计算*/
//解决时间NaN的问题
videoNode.addEventListener('canplay',function () {
	var needTime = parseInt(videoNode.duration),
		s = needTime % 60,
		m = parseInt(needTime / 60)
		timeNum = toDou(m) + ':' + toDou(s);
		allNode.innerHTML = timeNum;
},false);
//当视频播放的时候，需要当前的时间动起来
videoNode.addEventListener('timeupdate',function () {
	//百分比进度
	//console.log(videoNode.currentTime / videoNode.duration *100);
	lineNode.style.width = videoNode.currentTime / videoNode.duration *100 +'%';
	//console.log(lineNode.offsetWidth);
	crlNode.style.left = lineNode.offsetWidth - 8.5 + 'px';
	var needTime = parseInt(videoNode.currentTime),
		s = needTime % 60,
		m = parseInt(needTime / 60)
		timeNum = toDou(m) + ':' + toDou(s);
		nowNode.innerHTML = timeNum;
})
/*time小于十前面加个0*/
function toDou(time) {
	return time < 10 ? '0'+time : time;
}
/*拖拽进度条按钮*/
crlNode.onmousedown = function (e) {
	var ev = e || event;
	var l = ev.clientX - this.offsetLeft;
	videoNode.pause();
	document.onmousemove = function (e) {
		var ev = e || event;
		var needX = ev.clientX - l;
		var maxX = loadNode.offsetWidth - 8.5;
		needX = needX < -8.5 ? -8.5 : needX;
		needX = needX > maxX ? maxX : needX;
		crlNode.style.left = needX + 'px';
		lineNode.style.width = (crlNode.offsetLeft + 8) / loadNode.offsetWidth * 100 + '%';
	};
	document.onmouseup = function () {
		document.onmousemove = document.onmouseup = null;
		videoNode.currentTime = videoNode.duration * (crlNode.offsetLeft + 8) / loadNode.offsetWidth;
        //videoNode.play();
        if (playBln == false) {
        	playNode.className = 'pauseNode';
			videoNode.play();
        }else{
        	playNode.className = 'playNode';
			videoNode.pause();
        }
	}
	return false;
};
/*声音的拖拽按钮*/
VdragNode.onmousedown = function (e) {
	var ev = e || event;
	var l = ev.clientX - this.offsetLeft;
	document.onmousemove = function (e) {
		var ev = e || event;
		var needX = ev.clientX - l;
		var maxX = VdragNode.parentNode.offsetWidth - 2.5;
		needX = needX < -2.5 ? -2.5 : needX;
		needX = needX > maxX ? maxX : needX;
		//计算0-1
		//console.log(VdragNode.offsetLeft);
		//console.log(VdragNode.parentNode.offsetWidth);
		//console.log((VdragNode.offsetLeft+2) / VdragNode.parentNode.offsetWidth);
		var lastVolume = (VdragNode.offsetLeft+2) / VdragNode.parentNode.offsetWidth;
		videoNode.volume = lastVolume < 0 ? 0 : lastVolume;
		VdragNode.style.left = needX + 'px';
	};
	document.onmouseup = function () {
		document.onmousemove = document.onmouseup = null;
	};
	return false;
}




