var NetworkMgr = cc.Class.extend({
    _className:"NetworkMgr",
    ctor:function(){

    },
    hadConnected:function(){
        if(cc.sys.os === cc.sys.OS_ANDROID){
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Connectivity", "isConnectedToInternet", "()Z");

        }
        if(cc.sys.os === cc.sys.OS_ANDROID){
            //for ios
        }
        return false;
    },
    isWifi:function(){
        return !this.is3G();
    },
    is3G:function(){
        if(cc.sys.os === cc.sys.OS_ANDROID){
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Connectivity", "isConnectionTypeMobile", "()Z");
        }
        return false;
    }
});