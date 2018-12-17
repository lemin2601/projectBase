var SceneUpdate = BaseScene.extend(/** @lends SceneUpdate# */{
    _className:"SceneUpdate",
    /** @type {ccui.LoadingBar}*/
    loadingBar: null,
    /** @type {ccui.Text}*/
    txtPercent: null,
    /** @type {ccui.LoadingBar}*/
    loadingBarTotal: null,
    /** @type {ccui.Text}*/
    txtPercentTotal: null,
    /** @type {UpdateResource}*/
    updateResource: null,

    /** @type {ccui.Text}*/
    txtStatus: null,

    ctor: function(){
        Log.debug("create Update");
        this._super(res.scene_update);
        this.txtStatus.ignoreContentAdaptWithSize(true);
    },
    preEnter:function(){
        this.updateResource = new UpdateResource();
        this.updateResource.addListenUI(this.updateCb.bind(this));
        Log.debug("preEnter Update  ");
        sceneMgr.onLoaded(100);
    },
    onEnter: function(){
        this._super();
        this.txtPercent.setString(".../...");
        this.loadingBar.setPercent(0);
        this.txtStatus.setString(langMgr.getStr(lang.UPDATE_PREDOWNLOAD_VERSION))
    },
    onEnterTransitionDidFinish: function(){
        this._super();
        if(!cc.sys.isNative){
            sceneMgr.viewScene(SCENE_IDs.LOGIN);
            return;
        }
        this.schedule(this.startUpdate,1);
    },
    onExit: function(){
        this._super();
        this.updateResource.clean();
    },
    checkUpdateFailed:function(){
        if(this.updateResource){
            Log.debug(Log.getKey(AssetsManager.State,this.updateResource.getSate()));
            if(this.updateResource.getSate() == AssetsManager.State.DOWNLOADING_VERSION){
                Log.debug("failed download file");
                popups.showConfirm("Failed to update",this.confirmContinue,this.confirmExit);
            }else{
                Log.debug("!!failed download file");

            }
        }
    },
    startUpdate:function(){
        this.unschedule(this.startUpdate);
        if(networkMgr.hadConnected()){
            this.updateResource.update();
            this.scheduleOnce(this.checkUpdateFailed,10);
        }else{
            popups.showConfirm("Not network connected, please turn on internet to update newest resource",this.confirmContinue,this.confirmExit);
        }
    },
    confirmContinue:function(){
        sceneMgr.viewScene(SCENE_IDs.LOGIN);
    },
    confirmExit:function(){
        sceneMgr.exit();
    },
    errorNoLocalManifest:function(){
        popups.showConfirm("errorNoLocalManifest",this.confirmContinue,this.confirmExit);
    },
    updateProgression:function(event){
        this.loadingBar.setPercent(event.getPercent());
        // this.loadingBarTotal.setPercent(event.getDownloadedBytes());
        this.txtPercent.setString(event.getPercentByFile() + "/100");
        // this.txtPercentTotal.setString(event.getDownloadedBytes() +" / " + event.getTotalFiles());
        cc.log("Byte progression:" + event.getPercent() / 100);
        cc.log("File progression:" + event.getPercentByFile() / 100);
        // this.panel.byteProgress.progress = event.getPercent();
        // this.panel.fileProgress.progress = event.getPercentByFile();
        //
        // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
        // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
        //
        // var msg = event.getMessage();
        // if (msg) {
        //     this.panel.info.string = 'Updated file: ' + msg;
        //     // cc.log(event.getPercent()/100 + '% : ' + msg);
        // }
    },
    errorDownloadManifest:function(){
        popups.showConfirm("errorDownloadManifest",this.confirmContinue,this.confirmExit);
    },
    /**
     *
     * @param state{AssetsManager.State}
     */
    errorParseManifest:function(state){
        popups.showConfirm("errorParseManifest",this.confirmContinue,this.confirmExit);
    },
    reallyUpToDate:function(){
        this.txtStatus.setString("Ready Update ...");
        // Log.debug('Already up to date with the latest remote version.');
        this.scheduleOnce(function(){
            sceneMgr.viewScene(SCENE_IDs.LOGIN);
        },1);
        // cc.director.runScene(new SceneLoading());
    },
    updateFinished:function(event){
        popups.showMessage("Update Finish.. restart immediate......");
        Log.debug('Update   finished.111 ' + event.getMessage());
        this.txtStatus.setString("updated.....c.");
        this.txtPercent.setString("100/100");
        this.txtPercentTotal.setString("100/100");
        this.loadingBarTotal.setPercent(100);
        this.loadingBar.setPercent(100);
        sceneMgr.restart();

    },
    updateFailed:function(){
        Log.debug('Update failed. ' + event.getMessage());
        this._updating = false;
        this._canRetry = true;
    },
    errorUpdating:function(event){

        Log.debug('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());

    },
    errorDecompress:function(event){
        Log.debug(event.getMessage());
    },
    newVersionFound:function(){

    },
    /**
     *
     * @param event {jsb.EventAssetsManager}
     * @param state {AssetsManager.State}
     */
    updateCb: function(event, state){
        switch(event.getEventCode()){
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                //can down lai file manifest hoac van chayj version cu
                this.errorNoLocalManifest();
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.updateProgression(event);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                //state bi loi
                //khong the tien hanh down load manifest, hoac bi loi download
                this.errorDownloadManifest();
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.errorDownloadManifest();
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.reallyUpToDate();
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.updateFinished(event);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.updateFailed();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.errorUpdating(event);
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.errorDecompress(event);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.newVersionFound();
                break;
            default:
                break;
        }
    }
});