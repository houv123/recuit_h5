$(function(){
    var pageSwiper = new Swiper('#page-swiper', {
        direction: 'vertical',
        speed:800
    });
    var qstSwiper = new Swiper('#qst-swiper',{
        direction: 'vertical',
        speed:800
    });
    qstSwiper.lockSwipeToPrev();

//模拟滚动条
    var $scrollBar = $('#scroll-bar');
    var infoBoard = $('#info-board')[0];
    var originTop = parseInt($scrollBar.css('top'));
    var radio = infoBoard.clientHeight / infoBoard.scrollHeight;
    function cusScrollBar(){
        $scrollBar.height(parseInt(infoBoard.clientHeight * radio));
        if(radio >=1){
            $scrollBar.css('display','none');
        }
    }
    cusScrollBar();
    function isTouchDevice(){
        try{
            document.createEvent("TouchEvent");
            return true;
        }catch(e){
            return false;
        }
    }
    function touchScroll(id){
        if(isTouchDevice()){ //if touch events exist...
            var el=document.getElementById(id);
            var scrollStartPos=0;

            el.addEventListener("touchstart", function(event) {
                scrollStartPos=this.scrollTop+event.touches[0].clientY;
                event.preventDefault();
            },false);

            el.addEventListener("touchmove", function(event) {
                this.scrollTop=scrollStartPos-event.touches[0].clientY;
                $scrollBar.css('top',originTop + this.scrollTop * radio);
                event.preventDefault();
            },false);
        }
    }
    touchScroll('info-board');

    //分享提示
    $('#check-btn').on('touchend',function(e){
        $('#p5-mask').css('display','block');
        e.preventDefault();
    });
    $('#p5-mask').click(function(){
        $(this).css('display','none');
    });

    //动画方法
    var slice = [].slice;
    function defineDelay(el){
        el = el.length || [el];
        var getStr = function(t){
            return '-webkit-animation-delay: ' +t +'s;animation-delay: ' +t +'s;';
        };

        for(var i= 0,len=el.length;i<len;i++){
            var t = el[i].getAttribute('data-delay');
            if(t){
                el[i].style.cssText += getStr(t);
            }
        }
    }
    function triggerAM($el){
        $el.each(function(index,item){
            var effect = $(this).attr('data-effect');

            if(effect){
                $(this).addClass(effect);
            }

        })
    }
    triggerAM($('.animated','#page1'));



//首页btn拖动
    function drag(el){
        var startPos = {
            x:0,
            y:0
        };
        var originPos = {
            x:0,
            y:0
        };
        var elDimen = {
            x:el.offsetWidth + 10,
            y:el.offsetHeight + 10
        };
        var boundary = {
            maxW:document.documentElement.clientWidth || document.body.clientWidth,
            maxH:document.documentElement.clientHeight || document.body.clientHeight
        };
       
        el.addEventListener('touchstart',function(e){
            startPos.x = e.touches[0].pageX;
            startPos.y = e.touches[0].pageY;
            originPos.x = el.offsetLeft;
            originPos.y = el.offsetTop;

            
             
        },false);

        el.addEventListener('touchmove',function(e){
            el.style.left = e.touches[0].pageX - (startPos.x - originPos.x) + 'px';
            el.style.top = e.touches[0].pageY - (startPos.y - originPos.y) + 'px';
            e.preventDefault();
        },false);
       
        el.addEventListener('touchend',function(e){
                        e.preventDefault();
                        var L = parseInt(el.style.left);
                        var T = parseInt(el.style.top);
                        if(L - 10 < 0){
                            el.style.left = 10 + 'px';
                        }else if(L + elDimen.x > boundary.maxW){
                            el.style.left = boundary.maxW - elDimen.x +'px';
                        }
                        if(T - 10 < 0){
                            el.style.top = 10 + 'px';
                        }else if(T + elDimen.y >boundary.maxH){
                            el.style.top = boundary.maxH - elDimen.y + 'px';
                        }
                    });
        

    }
    drag($('#tap-btn')[0]);

 //首页点击顺序出现
    function createEles($eles){
        var out = [];
        var toStr = Object.prototype.toString;
        $eles.each(function(){
            var  index = $(this).attr('data-index');
            if(!index){
                return;
            }
            if(toStr.call(out[index]) === '[object Array]'){
                out[index].push(this);
            }else{
                out[index] = [this];
            }
        });

        return out;
    }

    var tapIndex = 0;
    var pageFirstAnimateEles = createEles($('.animated','#page1'));
    $('#tap-btn').on('touchstart',function(){
        var pickedEles = pageFirstAnimateEles[tapIndex];
        this.style.fontSize = 0;
        $(pickedEles).addClass('ac');
        if(tapIndex === pageFirstAnimateEles.length - 1){
            setTimeout(function(){
                $('#start-btn').addClass('ac');

            },800);
        }
        tapIndex++;
    });


    //preventDefault
    $('.js-noDefault').on('touchmove',false);


    //点击到下一张
    var timeOutId = 0;
    $('.js-tapToNext').on('click',function(){
        timeOutId && clearTimeout(timeOutId);
        if(this.type && this.type === 'radio'){
            timeOutId = setTimeout(function(){qstSwiper.slideNext()},300);
            return;
        }
        pageSwiper.slideNext();
    });


    //性别选择结束后动态插入最后一个问题
    var boyStr = {
        tit:'Q7:你的身高是168-187CM，体重不低于50公斤吗？',
        a:'A、完全符合，我就是机长的标准身材',
        b:'B、身高是硬伤，我也没办法'
    };
    var girlStr = {
        tit:'Q7:你的身高是160-175CM，体重不低于45公斤吗？',
        a:'A.完美身材，不要太羡慕哦',
        b:'B.万万没想到，身材是我成为机长路上的绊脚石'
    };

    $('#test-begin').on('click',function(){
        var temp = $('.gender-btn:checked').value === 'boy'?boyStr:girlStr;

        var str = '<div class="swiper-slide"><div class="sd-cont p4">' +
            '<section><img src="img/p4/copter.png" alt="" class="img1 animated fadeInUp"></section>'+
            '<section class="animated fadeInUp"><img src="img/p4/qst_board.png" alt="">' +'<h2>' +temp.tit +'</h2>' +'</section>' +
            '<section><label><input type="radio" name="qst14" value="1" class="qst-last"><span>' +temp.a +'</span></label>' +
            '<label><input type="radio" name="qst14" value="2" class="qst-last"><span>' +temp.b+'</span></label></section></div></div>';


         qstSwiper.appendSlide(str);
          pageSwiper.slideNext();

    });
//最后一题按钮
    var testRest = [];//测试结果
    $('#qst-swiper').one('click','.qst-last',function(){
        testRest.push(this.value);
        $(':checked','#qst-swiper').each(function(index,item){
            testRest.unshift(item.value);
        });
        setTimeout(function(){
            pageSwiper.slideNext();
        },500);
    });
//动画触发
    pageSwiper.on('slideChangeEnd',function(swiper){
        var active = swiper.activeIndex;
        var cur = swiper.slides[active];
        if(active === 3){
            $(cur).find('.qst-one .animated').addClass('ac');
            return ;
        }
        $(cur).find('.animated').addClass('ac');
    });
    qstSwiper.on('slideChangeEnd',function(swiper){
        var active = swiper.activeIndex;
        var cur = swiper.slides[active];

        $(cur).find('.animated').addClass('ac');
    });
    window.onload = function(){
        var curT = +new Date();
        var diff  = curT - entryT;
        setTimeout(function(){
            var $mask = $('#page-mask');
            $mask.children().remove();
            $mask.animate({opacity:0},2000,function(){
                $(this).remove();
            });
        },Math.max(0,1000-diff));
    }

});