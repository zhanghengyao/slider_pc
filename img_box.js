(function(window){
    var Swipe = window.Swipe || {};
    window.Swipe = Swipe;
    Swipe.mobile = (function(){
        var touch = {
            distance: 30,  //滑动距离，超过该距离触发swipe事件，单位像素。
            duration: 1000 //滑动时长，超过该时间不触发swipe，单位毫秒。
        };

        /**
        * 绑定事件
        * @param  el        触发事件的元素
        * @param  swipe     事件名称，可选值为swipeLeft,swipeRight,swipeUp,swipeDown
        * @param  callback  事件回调函数
        * @param  isStopPropagation   是否停止冒泡，true为停止冒泡
        * @param  isPreventDefault    是否阻止默认事件，true为阻止默认事件
        * @param  triggerOnMove       swipe事件有两种触发方式，一种是在touchmove过程中，只要满足滑动距离条件即触发。
        *                             一种是在touchend中，进入滑动距离判断，如果满足滑动距离触发。
        *                             默认是在touchend中触发。
        */
        function bindSwipe(el, swipe, callback, triggerOnMove, isStopPropagation, isPreventDefault){
            var startPoint, endPoint, timer;

            /**
            * 计算滑动方向
            * 首先根据x方向和y方向滑动的长度决定触发x方向还是y方向的事件。
            * 然后再判断具体的滑动方向。
            * 如果滑动距离不够长，不判断方向。
            */
            function swipeDirection(x1, y1, x2, y2){
                var diffX = x1 - x2,
                    diffY = y1 - y2,
                    absX = Math.abs(diffX),
                    absY = Math.abs(diffY),
                    swipe;

                if(absX >= absY){
                    if(absX >= touch.distance){
                        swipe = diffX > 0 ? 'swipeLeft' : 'swipeRight';
                    }
                }else{
                    if(absY >= touch.distance){
                        swipe = diffY > 0 ? 'swipeUp' : 'swipeDown';
                    }
                }

                return swipe;
            }

            // 清除本次滑动数据
            function clearSwipe(){
                startPoint = undefined;
                endPoint = undefined;

                if(timer !== undefined){
                    clearTimeout(timer);
                    timer = undefined;
                }
            }

            /**
            * 判断是否符合条件，如果符合条件就执行swipe事件
            * @param  el     {HTMLElement}  元素
            * @param  event  {Event}        Touch原始事件
            * @param  return 如果执行了事件，就返回true。
            */
            function execSwipe(el, event){
                if(startPoint && endPoint && swipeDirection(startPoint.x, startPoint.y, endPoint.x, endPoint.y) === swipe){
                    callback.call(el, event);
                    return true;
                }
            }

            el.addEventListener('touchstart', function(event){
                var self = this, touchPoint = event.touches[0];

                if(isStopPropagation){
                    event.stopPropagation();
                }

                if(isPreventDefault){
                    event.preventDefault();
                }

                startPoint = {
                    x: Math.floor(touchPoint.clientX),
                    y: Math.floor(touchPoint.clientY)
                };

                timer = setTimeout(function(){
                    //如果超时，清空本次touch数据
                    clearSwipe();
                }, touch.duration);
            });

            el.addEventListener('touchmove', function(event){
                var self = this, touchPoint = event.touches[0];

                if(isStopPropagation){
                    event.stopPropagation();
                }

                if(isPreventDefault){
                    event.preventDefault();
                }

                if(startPoint){
                    endPoint = {
                        x: Math.floor(touchPoint.clientX),
                        y: Math.floor(touchPoint.clientY)
                    };

                    //执行swipe事件判断，是否符合触发事件
                    if(triggerOnMove){
                        if(execSwipe(self, event)){
                            clearSwipe();
                        }
                    }
                }
            });

            el.addEventListener('touchend', function(event){
            	var self = this;
                if(isStopPropagation){
                    event.stopPropagation();
                }

                if(isPreventDefault){
                    event.preventDefault();
                }

                execSwipe(self, event);
                //清除本次touch数据
                clearSwipe();
            });
        }

        /**
        * @param  el        {HTMLElement}  HTML元素
        * @param  callback  {Function}     事件回调函数
        * @param  options   {Object}       可选参数
        *                   isStopPropagation  {Boolean}  是否停止冒泡，true为停止冒泡
        *                   isPreventDefault   {Boolean}  是否阻止默认事件，true为阻止默认事件
        *                   triggerOnMove      {Boolean}
        *                                       swipe事件有两种触发方式，一种是在touchmove过程中，只要满足滑动距离条件即触发。
        *                                       一种是在touchend中，进入滑动距离判断，如果满足滑动距离触发。
        *                                       默认值为false，在touchend中触发。
        */
        touch.swipeLeft = function(el, callback, options){
            if(options){
                bindSwipe(el, 'swipeLeft', callback, options.triggerOnMove, options.isStopPropagation, options.isPreventDefault);
            }else{
                bindSwipe(el, 'swipeLeft', callback);
            }

        };

        touch.swipeRight = function(el, callback, options){
            if(options){
                bindSwipe(el, 'swipeRight', callback, options.triggerOnMove, options.isStopPropagation, options.isPreventDefault);
            }else{
                bindSwipe(el, 'swipeRight', callback);
            }
        };

        touch.swipeUp = function(el, callback, options){
            if(options){
                bindSwipe(el, 'swipeUp', callback, options.triggerOnMove, options.isStopPropagation, options.isPreventDefault);
            }else{
                bindSwipe(el, 'swipeUp', callback);
            }
        };

        touch.swipeDown = function(el, callback, options){
            if(options){
                bindSwipe(el, 'swipeDown', callback, options.triggerOnMove, options.isStopPropagation, options.isPreventDefault);
            }else{
                bindSwipe(el, 'swipeDown', callback);
            }
        };

        return touch;
    })();
})(window);
(function(global,$){
	var Slider = { 
	isIE : true, 
	m_imageSource : [], 
	m_selIdx : 0, 
	m_direction : 1, 
	m_img_index:0,
	m_mainviewer : null, 
	m_delayTimer : null, 
	m_imgTimer:null,
	m_curObj : null, 
	m_tarObj : null, 
	m_inited : false, 
	_overflow_x:false,
	_overflow_y:false,
	m_id:null,
	m_active_size:'80px',
	default_img:'http://ww1.sinaimg.cn/mw690/b26d49cdgw1eistxaemm0g20b40b4q5l.gif',
	loadImgEvent:null,
	init : function(id,w1, h1, s, source,current){ 
		this.m_img_index = 0;
		this.isIE = document.all ? true : false; 
		this.m_id = id;
		this.imageWidth = w1; 
		this.imageHeight = h1; 
		this.m_spaceWidth = s; 
		this.m_imageSource = source;		 
		var index = 0;
		if(current){
			for (var i = 0; i < source.length; i++) {
				if(source[i].thumbImg===current.thumbImg){
					index = i;
					break;
				}
			};
		}
		this.m_selIdx = index;

		this.writeCanvas(id);
		this.initImg(source,this.initElement.bind(this))
	}, 
	initElement:function(){
		this.m_mainviewer = document.getElementById('_swipe_'+this.m_selIdx).cloneNode(true);
		this.m_mainviewer.src = this.m_imageSource[this.m_selIdx].img
		this.m_mainviewer.style.position='absolute' 
		this.m_mainviewer.style.zIndex=12222
		this.mini_container.style.display = 'inline'
		this.bind(); 
		this.start(); 
	},
	isMobile:function(){
		var u = navigator.userAgent;
    	var ismobile = u.indexOf('iPhone') > -1 || u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; 
    	return ismobile;
	},
	render:function(){

	},
	initImg:function(source,callback){
		if(Slider.m_img_index>=source.length){
			callback&&callback()
			return;
		}
		Slider.imgDetecting(source[Slider.m_img_index].thumbImg,function(){				
				Slider.mini_container.innerHTML += '<img id=_swipe_'+Slider.m_img_index+' src="'+source[Slider.m_img_index].thumbImg+'" border="0" style="'+(Slider.isIE?'filter:alpha(opacity=50)':'opacity:0.5')+';width:'+Slider.imageWidth+'px;height:'+Slider.imageHeight+'px;bottom:0;margin-right:20px;" index="'+Slider.m_img_index+'" data-img=""/>';
				Slider.m_img_index++
				setTimeout(function(){
					Slider.initImg(source,callback)
				},0)
			},function(){				
				Slider.mini_container.innerHTML += '<img id=_swipe_'+Slider.m_img_index+' src="'+Slider.default_img+'" border="0" style="'+(Slider.isIE?'filter:alpha(opacity=50)':'opacity:0.5')+';width:'+Slider.imageWidth+'px;height:'+Slider.imageHeight+'px;bottom:0;margin-right:20px;" index="'+Slider.m_img_index+'" data-img=""/>';
				Slider.m_img_index++
				setTimeout(function(){
					Slider.initImg(source,callback)
				},0)
			})	
	},
	writeCanvas : function(id){ 
		var _temp = document.getElementById(id),_main,_child,_container=document.querySelector('.page');
		if(_temp){
			_temp.innerHTML = ''
		}else{
			_main = document.createElement('div')
			_child = document.createElement('div')
			_main.id = id;
			_child.id='mini_container'
			with(_main.style){
				width = '100%'
				height='100%'
				position='absolute'
				top=0
				right=0
				bottom=0
				left=0
				overflow='hidden'
				backgroundColor='black'
				zIndex=10000
			}
			with(_child.style){
				position='fixed';
				bottom=0;
				height='80px';
				overflow='hidden';	
				display='none';			
			}
			_main.appendChild(_child)
			_container?_container.appendChild(_main):document.body.appendChild(_main)
			_temp = document.getElementById(id)
		}		
		this.container = _temp; 
		this.mini_container = document.getElementById('mini_container')
	}, 
	reload:function(urls){
		var list = this.mini_container.childNodes,length = urls.length
		for (var i = list.length - 1,j=0; i >= 0; i--) {
			if(list[i].src==Slider.default_img){	
				if(j<length){
					list[i].src = urls[j]
					j++;
				}else{
					break;
				}			
			}
		};
	},
	bind : function(obj, evt, fun){ 
		var obj = this.container,is_mobile = this.isMobile(); 
		for(var i=0;i<obj.childNodes.length;i++){ 			
			if(is_mobile){
				this.attachEvent(this.container.childNodes[i], "touchend" , this.click.bind(this)); 
			}else{
				this.attachEvent(this.container.childNodes[i], "mouseover", this.mouseover); 
				this.attachEvent(this.container.childNodes[i], "mouseout" , this.mouseout); 
				this.attachEvent(this.container.childNodes[i], "click" , this.click.bind(this)); 
			}
			
		} 
	}, 
	attachEvent : function(obj, evt, fun){
		if (Slider.isIE){ 
			obj.attachEvent("on"+evt, fun) 
		}else{ 
			obj.addEventListener(evt, fun, false); 
		} 
	}, 
	mouseover : function(e){ 
		if(!e)e=window.event; 
		var obj = e.srcElement || e.target; 
		if(obj.tagName==='IMG'){
			if(obj.getAttribute('index')!=Slider.m_selIdx){
				Slider.shadow(obj,0.8)				
			}			
		}
	}, 
	mouseout : function(e){ 
		if(!e)e=window.event; 
		var obj = e.srcElement || e.target; 
		if(obj.tagName==='IMG'){
			if(obj.getAttribute('index')!=Slider.m_selIdx){
				Slider.shadow(obj,0.5)
			}
		}
	}, 
	imgDetecting:function(src,load,err){
		var _img = document.createElement('img')
		_img.src = src
		_img.onload = function(){
			load&&load(_img)
		}
		_img.onerror = function(){
			err&&err(_img)
		}
	},
	imgShow:function(obj,loadingSrc){	
		var _src = loadingSrc;
		Slider.m_selIdx = obj.getAttribute("index"); 
		_src||(_src=Slider.m_imageSource[Slider.m_selIdx].img);		
		// Slider.m_curObj = mobj; 
		Slider.m_tarObj = obj; 
		Slider.imgDetecting(_src,function(_img){
			if(Slider.m_delayTimer)clearInterval(Slider.m_delayTimer)
			Slider.m_delayTimer = Slider.fadeIn(200,5,_img.width,_img.height,_src); 
			Slider.shadow(obj,0.8) 
		},function(e){
			var _img = e.path[0]
		})
	},
	click : function(e){ 
		if(!e)e=window.event; 
		var obj = e.srcElement || e.target,mobj = Slider.m_mainviewer,_this = this; 
		var _index = obj.getAttribute('index')
		if(obj.tagName==='IMG'){
			if(obj.src===Slider.default_img){
				var thumb_src = Slider.m_imageSource[_index].thumbImg				
				this.loadImgEvent&&this.loadImgEvent(1)
				this.requestImg(thumb_src,function(){
					obj.src = thumb_src
					_this.imgShow(obj)
				})
			}else{
				var img_src = Slider.m_imageSource[_index].img	
				console.log('img_src:',img_src)
				this.imgDetecting(img_src,function(){
					Slider.imgShow(obj)
				},function(){
					Slider.imgShow(obj,Slider.default_img)
					Slider.loadImgEvent&&Slider.loadImgEvent(2)
					Slider.requestImg(img_src,function(){
						Slider.imgShow(obj)
					})
				})
			}		
		}		
	}, 
	getParam :function (url,param) { 
		var url = decodeURI(url)
		var theRequest = new Object(); 
		if (url.indexOf("?") != -1) { 
			var str = url.substr(1); 
			strs = str.split("&"); 
			for(var i = 0; i < strs.length; i ++) { 
				theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
			} 
		} 
		return theRequest[param]; 
	},
	requestImg:function(url,callback){
		console.log('requestImg......')
			var _this = this;
			Slider.imgDetecting(url,function(){
				console.log('load')
				_this.m_direction = 1
				if(Slider.m_imgTimer){
					clearInterval(Slider.m_imgTimer)
				}
				callback&&callback()
			},function(){
				console.log('error:'+_this.m_direction)
				if(_this.m_direction<3){
					_this.m_direction++
					if(Slider.m_imgTimer){
						clearInterval(Slider.m_imgTimer)
					}
					Slider.m_imgTimer = setTimeout(function(){
						console.log('url:',url)
						_this.requestImg(url,callback)
					},2000)
				}else{
					_this.m_direction = 1
					// callback&&callback()
				}
			})
	},
	shadow:function(obj,value){
		var ieValue = value*100;
		if (Slider.isIE){ 
			obj.style.filter = "alpha(opacity="+ieValue+")"; 
		}else{ 
			obj.style.opacity = value; 
		} 
	},
	start : function(){ 
		var obj = this.m_mainviewer,_clientWidth = document.body.clientWidth,_this=this; 
		this.shadow(obj,1)
		this.container.appendChild(obj); 	
		this.imgDetecting(Slider.m_imageSource[Slider.m_selIdx].img,function(_img){
			var imgObj = _this.imgZoom({img_width:_img.width,img_height:_img.height})
			var _width = imgObj.img_width,_height = imgObj.img_height;
			obj.style.width = _width+"px"; 
			obj.style.height = _height+"px"	
		})
		obj.style.top='0';
		obj.style.right='0';
		obj.style.bottom=this.imageHeight+10+'px';
		obj.style.left='0';
		obj.style.margin='auto';
		obj.id = '_show_img';
		this.m_curObj = this.mini_container.childNodes[this.m_selIdx]; 
		this.m_tarObj = obj;  
		var _left = (_clientWidth-Slider.imageWidth)/2-this.m_curObj.getBoundingClientRect().left
		this.m_curObj.style.width = this.m_active_size
		this.m_curObj.style.height = this.m_active_size
		this.mini_container.style.left = _left+'px';		
		this.shadow(this.m_curObj,1)
	}, 
	close:function(){
		if(Slider.m_delayTimer){
			clearInterval(Slider.m_delayTimer)
		}
		if(Slider.m_imgTimer){
			clearInterval(Slider.m_imgTimer)
		}
		var _main = document.getElementById(Slider.m_id)
		_main&&_main.parentNode.removeChild(_main)
	},
	next : function(){ 
		var obj = this.mini_container; 
		var mobj = this.m_mainviewer; 
		if(this.m_selIdx == obj.childNodes.length-2){ 
			this.m_direction = -1; 
		} 
		if(this.m_selIdx == 0){ 
			this.m_direction = 1; 
		} 
		Slider.m_curObj = mobj; 
		Slider.m_tarObj = obj.childNodes[this.m_selIdx]; 
		this.m_delayTimer = this.fadeIn(200,5); 
		mobj.src = obj.childNodes[this.m_selIdx].src; 
		if(this.m_direction==-1){ 
			this.m_selIdx --; 
		}else{ 
			this.m_selIdx ++; 
		} 
	}, 
	imgZoom:function(imgObj){
		var img_width = imgObj.img_width
		var img_height = imgObj.img_height
		var _clientWidth = document.body.clientWidth,_clientHeight = document.getElementById('_swipe_img_').scrollHeight-100;
		var _width = img_width,_height = img_height;
		var rate_width = _clientWidth/_width
		var rate_height = _clientHeight/_height
		var rate = rate_width<rate_height?rate_width:rate_height
		if(rate<1){
			_width = _width*rate
			_height= _height*rate
		}
		return {
			img_width:_width,
			img_height:_height
		}
	},
	fadeIn : function(aa, ab,img_width,img_height,loadingSrc){ 
		var obj = this.mini_container,imgObj={img_width:img_width,img_height:img_height}; 
		var t1 = obj.offsetLeft||0, t3 = 0,t4 = 0;
		var _clientWidth = document.body.clientWidth,_width = 0,_height = 0;
		imgObj = this.imgZoom(imgObj)
		_width = imgObj.img_width
		_height = imgObj.img_height
		
		var _left = (_clientWidth-Slider.imageWidth)/2-Slider.m_tarObj.getBoundingClientRect().left
		var k1 = _left/ab; 
		var k3 = -_width/ab; 
		var k4 = -_height/ab; 
		var mobj = this.m_mainviewer; 
		mobj.src = loadingSrc||this.m_imageSource[Slider.m_selIdx].img;// obj.childNodes[Slider.m_selIdx].src;
		mobj.setAttribute('index',Slider.m_selIdx)
		return setInterval(function(){
			if(ab<1){ 
				clearInterval(Slider.m_delayTimer); 
				for (var i = obj.childNodes.length - 1; i >= 0; i--) {
					Slider.shadow(obj.childNodes[i],0.5)
					obj.childNodes[i].style.width=Slider.imageWidth+'px';
					obj.childNodes[i].style.height=Slider.imageHeight+'px';
				};
				Slider.m_curObj = obj.childNodes[Slider.m_selIdx]; 
				Slider.m_tarObj = mobj; 
				Slider.shadow(Slider.m_curObj,1)
				Slider.m_curObj.style.width=Slider.m_active_size;
				Slider.m_curObj.style.height=Slider.m_active_size;
				return; 
			} 
			ab--;
			t1+=k1;
			t3-=k3;
			t4-=k4;		
			obj.style.left = t1+'px';	
			with(mobj.style){			
				width = t3+'px'
				height = t4+'px'
			} 
		} 
		,aa/ab) 
	} 
} 

global.Slider = function(current,urls){
	Slider.init('_swipe_img_',65,65,20, urls,current); 
	Slider.loadImgEvent = function(value){
		var obj = Slider.m_imageSource[Slider.m_selIdx]
		if(obj.realName){
			$.ajax({
					type:'GET',
					url:'http://wyxj.cume.cc/node/weixin/hardware/deviceUploadFile',
					data:{
						_accessId : obj.accessId || 0,
					    _deviceId : obj.deviceId,
					    _realName : obj.realName,
					    _isSmall  : value
					  }
				}).done(function(res){

				})
			}				
	}
}	
global.SliderReload = function(urls){
	Slider.reload(urls)
}
global.SliderClose = function(){
	Slider.close()
}
})(window,jQuery)
