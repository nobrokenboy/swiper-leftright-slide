/**
 * Created by Vinse on 2016/11/11.
 */
var selector=function (args) {
    var $hasClass = function(el, className) {
        if (!className) return false;
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };
    var $addClass = function(el, className) {
        if (!className) return;
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    };
    var $removeClass = function(el, className) {
        if (!className) return;
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };
    var $addEvent = function ( el, type, listener ) {
        if (el.addEventListener) {
            el.addEventListener(type, listener, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + type, listener);
        } else {
            el["on" + type] = listener;
        }
    };
    var $removeEvent = function ( el, type,listener ) {
        if (el.removeEventListener)
            el.removeEventListener(type, listener);
        else if (el.detachEvent)
            el.detachEvent("on" + type, listener);
        else el["on" + type] = null;
    };
    var $isType = function(type, obj) {
    	//检测数组可以使用Object.prototype.toString()方法进行检测，如果是数组的话，他会返回"[object Array]"
        var _class = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && _class === type;
    };
    //代码复用模式
    var $deepExtend = function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj)
                continue;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if ($isType('Object', obj[key]) && obj[key] !== null)
                        $deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }
        console.log(out);
        return out;
    };
    var self = this;
    self.attr = {
        el: '',//外包含的元素
        activeIndex:3,//指激活的位置
        showNum:5,//展示的li数目
        onInit:function () {},
        onTouch:function () {},
        onMoveEnd:function () {},
    }
    if(typeof args === 'object') {
        $deepExtend(self.attr, args);
    };
    
    //activeIndex可不能从1开始所以要减掉1
    self.attr.activeIndex--;
    //获取传入的dom
    var selector = document.querySelector(self.attr.el);
    //生成它下面的ul和li
    var wrap = selector.querySelector('ul');
    var item = wrap.querySelectorAll('li');
    //没有li就先生成li
    if(!item.length){
        var li = document.createElement('li');
        li.setAttribute('data-value',' ');
        li.innerText = '';
        $addClass(li,'active');
        wrap.appendChild(li);
        item = wrap.querySelectorAll('li');
    }
    var itemHeight = item[0].offsetHeight;
    // 初始高度和歪轴为零
    var initLoaction = self.attr.activeIndex*itemHeight+itemHeight;
    var _y = 0;
    //设置现在的歪轴
    var curentY = 0;
    wrap.style.transform = "translateY(" + curentY + "px)";
    //activeItem是什么
    self.activeItem = false;
    //这个要记下所有li的歪轴
    var items = [];
    //根据显示数来设置高度整个的高度
    selector.style.height = self.attr.showNum*itemHeight +"px";

   //循环获取高度并逐个设置li的高度
    for(var i=0;i<item.length;i++){
        initLoaction = initLoaction- itemHeight;
        var objItem = {
            itemIndex:i,
            itemLocation:initLoaction,
            active:false,
            dom:item[i],
        };
        //三元表达式判断value是不是空的，空的就用text
        objItem.itemName=(item[i].getAttribute('data-value')==null)?item[i].innerText:item[i].getAttribute('data-value');
        if(i==0){
            objItem.active = true;
            curentY = initLoaction;
            self.activeItem = objItem;
            $addClass(item[0],"active");
        }
        //判断是不是有默认active
        if($hasClass(item[i],'active')){
            $removeClass(item[0],"active")
            $addClass(item[i],"active");
            objItem.active = true;
            curentY = initLoaction;
            self.activeItem = objItem;
        }
        item[i].removeAttribute('data-value');
        items.push(objItem);
    };
    //给一个interval让他动的
    var interval = {};
    var max = {
        top:items[0].itemLocation,
        bottom:items[item.length-1].itemLocation,
        _top:items[0].itemLocation+(itemHeight*2),
        _bottom:items[item.length-1].itemLocation-(itemHeight*2)
    };
    //初始化完毕，搞点小动画吧
    wrap.style.transform = "translateY(" + curentY + "px)";
    // var init_i = 0;
    // interval = setInterval(function () {
    //     if(self.activeItem.itemLocation<0){
    //         init_i--;
    //     }else {
    //         init_i++;
    //     }
    //     wrap.style.transform = "translateY(" + init_i + "px)";
    //     if(init_i==self.activeItem.itemLocation){
    //         clearInterval(interval)
    //     }
    // },1)

    // console.log(self.activeItem.itemLocation)
    self.attr.onInit.apply(self);
    //增加开始触摸事件，设置歪轴为当前点击页面的歪轴,还有不可以用匿名函数
    var start = function(e) {
        _y = e.touches[0].pageY;
        clearInterval(interval);
        self.attr.onTouch.apply(self);
    }
    $addEvent(selector, 'touchstart', start);
    //触摸移动的时候要注意取消默认事件
    //当前触摸的歪轴减去刚刚触摸那一下的歪轴就勀得到现在wrap的歪轴
    var move = function (e) {
        e.preventDefault();
        curentY = curentY + (e.touches[0].pageY - _y);
        if(curentY<=max._bottom){
            curentY = max._bottom;
        }
        if(curentY>=max._top){
            curentY = max._top;
        }
        wrap.style.webkitTransform = "translateY(" + (curentY).toString() + "px)";
        wrap.style.transform = "translateY(" + (curentY).toString() + "px)";
        wrap.style.mozTransform = "translateY(" + (curentY).toString() + "px)";
        _y = e.touches[0].pageY;
    }
    $addEvent(selector, 'touchmove', move);
    var end = function () {
        var currentItem = items.sort(function(a, b) {
            return Math.abs(a.itemLocation - curentY) - Math.abs(b.itemLocation - curentY);
        })[0];
        if(currentItem!=self.activeItem){
            for(var i=0;i<item.length;i++){
                $removeClass(item[i],'active');
            }
            $addClass(currentItem.dom,'active');
        }
        self.activeItem = currentItem;

        var _loca = parseInt(curentY);
        //防止双击时获取相同的位置
        if(_loca != currentItem.itemLocation){
            if(self.activeItem.itemLocation-curentY>0){
                interval = setInterval(function () {
                    //往下恢复
                    _loca++;
                    if(_loca>=max.top){
                        clearInterval(interval);
                    }
                    wrap.style.transform = "translateY(" + _loca + "px)";
                    if(_loca==self.activeItem.itemLocation){
                        clearInterval(interval);
                        curentY = _loca;
                    }
                },1);
            }else{
                interval = setInterval(function () {
                    //往上恢复
                    _loca--;
                    if(_loca<=max.bottom){
                        clearInterval(interval);
                        curentY = _loca;
                    }
                    if(_loca==self.activeItem.itemLocation){
                        clearInterval(interval);
                        curentY = _loca;
                    };
                    wrap.style.transform = "translateY(" + _loca + "px)";
                },1);
            }
        }
        self.attr.onMoveEnd.apply(self);
    }
    $addEvent(selector, 'touchend', end );
    self.destroy=function () {
        for(var i=0;i<item.length;i++){
            $removeClass(item[i],'active');
        }
        if(li){
            wrap.removeChild(li);
        }
        $removeEvent(selector,'touchstart',start);
        $removeEvent(selector,'touchmove',move);
        $removeEvent(selector,'touchend',end);
        // wrap.style.transform = "translateY(0px)";
        $hasClass = null;
        $addClass = null;
        $removeClass =null;
        $addEvent = null;
        $isType = null;
        $deepExtend = null;
        $removeEvent = null;
        selector = null;
        wrap =null;
        item =null;
        initLoaction= null;
        curentY= null;
        items = null;
        clearInterval(interval);
        interval = null;
        max= null;
        self = null;
        itemHeight = null;
    }

}