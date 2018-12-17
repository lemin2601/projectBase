SceneMgr = cc.Class.extend({
    _className: "SceneMgr",
    ctor: function(){
        /** @type {SceneLoading}*/
        this._sceneLoading = null;
    },
    init: function(){
        return true;
    },
    /**
     *
     * @returns {SceneLoading}
     * @private
     */
    _getSceneLoading: function(){
        if(this._sceneLoading == null){
            this._sceneLoading = new SceneLoading();
            this._sceneLoading.retain();
        }
        return this._sceneLoading;
    },
    viewScene: function(sceneIds){
        Log.debug("viewScene:%s", Log.getKey(SCENE_IDs,sceneIds));
        var curScene = cc.director.getRunningScene();
        var sceneLoading = this._getSceneLoading();
        if(curScene != null){
            Log.debug("currentScene not null");
            curScene.retain();
            sceneLoading.setCurScene(curScene);
        }else{
            Log.debug("currentScene null");
            sceneLoading.setCurScene(null);
        }
        sceneLoading.setPreViewSceneId(sceneIds);
        cc.director.runScene(sceneLoading);
    },
    /**
     *
     * @param percent {number} 0 - 100
     */
    onLoaded: function(percent){
        var loading = this._getSceneLoading();
        loading.onShowLoaded(percent);
    },
    /**
     *
     * @param sceneIds
     * @returns {BaseScene}
     */
    getScene: function(sceneIds){
        var curScene;
        switch(sceneIds){
            case SCENE_IDs.LOADING:
                Log.error("not view sceneLoading,bz auto show when load resource");
                break;
            case SCENE_IDs.UPDATE:
                curScene = new SceneUpdate();
                break;
            case SCENE_IDs.LOGIN:
                curScene = new SceneLogin();
                break;
            case SCENE_IDs.MENU:
                curScene = new SceneMenu();
                break;
            case SCENE_IDs.GAME:
                curScene = new HelloWorldScene();
                break;
        }
        return curScene;
    },
    loadResource: function(res){
    },
    exit:function(){
        setTimeout(function(){
            cc.game.exit();
        },0);
    },
    restart:function(){

        // this._sceneLoading.release();
        // this._sceneLoading = null;
        setTimeout(function(){
            cc.director.setNotificationNode(null);
            Log.debug("game restart");
            cc.game.restart();
        }, 1000);
    },
    updateProfile:function(){
        var curScene = cc.director.getRunningScene();
        if(curScene){
            curScene.updateProfile && curScene.updateProfile();
        }
    }

});
