var BaseScene = cc.Scene.extend(/** @lends BaseScene# */{
    /**
     * example: "res/ui/Scene.json"
     * @param pathJson
     * @param deepChildren => do sau cua node de matching variable defined
     */
    ctor: function(pathJson, deepChildren){
        this._super();
        if(pathJson === undefined){
            Log.error("miss path json ui to load scene");
            return;
        }
        BaseCocosStudio.Instance.sync(this, pathJson, deepChildren);
        this._registerHandleKey();
    },
    _registerHandleKey:function(){
        if (cc.sys.capabilities.hasOwnProperty('keyboard'))
        {
            cc.eventManager.addListener(
                {
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed:this.onKeyPressed,
                    onKeyReleased:this.onKeyReleased
                }, this);
        }
    },
    preEnter:function(){
       sceneMgr.onLoaded(100);
    },
    onEnter:function(){
        this._super();
        Log.debug("%s onEnter",this._className);
    },
    onEnterTransitionDidFinish:function(){
        this._super();
        Log.debug("%s onEnterTransitionDidFinish",this._className);
    },
    onExitTransitionDidStart:function(){
        this._super();
        Log.debug("%s onExitTransitionDidStart",this._className);
    },
    onExit:function(){
        this._super();
        Log.debug("%s onExit",this._className);
    },
    onKeyPressed:function(keyCode,event){
        // Log.debug("Press: %s",Log.getKey(cc.KEY,keyCode));
    },
    onKeyReleased:function(keyCode,event){
        // Log.debug("Press: %s",Log.getKey(cc.KEY,keyCode));
        switch(keyCode){
            case cc.KEY.back:
                if(this._backToExit == null){
                    this._backToExit = true;
                }
                _.delay(function(){
                    delete  this._backToExit;
                }.bind(this), 500);
                if(this._backToExit){
                    Log.debug("exit game");
                    cc.game.exit();
                }else{
                    Log.debug("press again to exit");
                }
        }
    },
    onTouchBegan:function(sender){

    },
    onTouchMoved:function(sender){

    },
    onTouchEnded:function(sender){

    },
    onTouchCancelled:function(sender){

    }
});