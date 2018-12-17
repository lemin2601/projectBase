var Utils = cc.Class.extend({
    _className:"Utils",
    delay:function(){
        for(var i = 0;i < 100;i++){


            sceneMgr.onLoaded(i);

            for(var j =0; j < 10000;j++){
                for(var k =0; k < 10000;k++){
                    var a = 0;
                    var b = 0;
                    var c = a + b;
                }
            }
        }
    },
    getCurrentTime:function(){
        return (new Date()).getTime()
    }
});