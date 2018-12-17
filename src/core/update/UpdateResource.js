/**
 * 1. create obj
 * 2. addListenUI(func(jsb.EventAssetsManager,AssetsManager.State){};
 * 3. just call update(); it's will do all thing
 * 4. before leave or on finish => call clean();
 * @type {Function}
 */
var UpdateResource = cc.Class.extend({
    /** @type {jsb.AssetsManager}*/
    _am: null,
    _storagePath: null,
    _manifestUrl: "./project.manifest",
    _listenUI: null,
    _loadingManifest: false,
    _manifestFound: false,
    _updating: false,
    _canRetry: false,
    _listener: null,
    _init: false,
    _finished: false,
    _log: true,
    ctor: function(){
        // var key_save_manifest_url = "key_save_manifest_url";
        // this._manifestUrl = cc.sys.localStorage.getItem(key_save_manifest_url);
        // if(this._manifestUrl == ""){
        //     this._manifestUrl = null;
        // }
        this._manifestUrl = 'project.manifest';
        this._storagePath = this.root_path();
        this.log(this._manifestUrl);
        // if(cc.sys.isNative && jsb.fileUtils.isFileExist(this._manifestUrl)){
        //     jsb.fileUtils.removeFile(this._manifestUrl);
        //     Log.debug("delete file :" + this._manifestUrl)
        // }
    },
    update: function(){
        //check init project manifest
        //init asset manager is exist
        Log.debug("update..........");
        this.initAssetsManager();
        this._am.checkUpdate();
        return;
        // if(this._manifestFound){
        //     this.initAssetsManager();
        // }else{
        //     this.checkManifest();
        // }
        // if(this.isExistManifest()){
        //     this.initAssetsManager();
        // } else{
        //     //after init manifest => init assetManifest
        //     this.initDefaultProjectManifest();
        // }
        //check update
        if(this.canUpdate()){
            this.log("assetManager Check Updating...");
            this._updating = true;
            this._am.checkUpdate();
            return true;
        }
        return false;
    },
    checkManifest: function(){
        if(cc.sys.isNative){
            this.log("check manifest" + this._manifestUrl);
            jsb.fileUtils.isFileExist(this._manifestUrl, function(isExist){
                this._manifestFound = isExist;
                this.log("manifest file exist:" + isExist);
                if(this._manifestFound){
                    this.update();
                } else{
                    this.initDefaultProjectManifest();
                }
            }.bind(this));
        }
    },
    addListenUI: function(func){
        this._listenerUI = func;
    },
    canUpdate: function(){
        if(this._am){
            if(this._manifestFound)
            {
                if(!this._updating){
                    return true;
                }
            }
        }
        return false;
    },
    initAssetsManager: function(){
        this.log("initAssetsManager.  ");
        if(!cc.sys.isNative) return;
        this._am = new jsb.AssetsManager(this._manifestUrl, this._storagePath);
        this._am.setVersionCompareHandle(this.versionCompareHandle.bind(this));
        /** @type {jsb.Manifest}*/
        var localManifest = this._am.getLocalManifest();
        Log.debug(localManifest.getPackageUrl());
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(this.verifyCallback.bind(this));
        if(cc.sys.os === cc.sys.OS_ANDROID){
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            this.log("Max concurrent tasks count have been limited to 2 ");
        }
        //add listener
        this._listener = jsb.EventListenerAssetsManager.create(this._am, this.updateCb.bind(this));
        this._listener = cc.eventManager.addListener(this._listener, 1);
        //attension release object
        this._am.retain();
    },
    initDefaultProjectManifest: function(){
        this.log("initDefaultProjectManifest.");
        Log.debug("come here");
        this._loadingManifest = true;
        //project.manifest ==> added on gradle on android studio
        cc.loader.loadJson("project.manifest", this.loadDefaultProjectManifestDone.bind(this));
    },
    isExistManifest: function(){
        if(cc.sys.isNative){
            this._manifestFound = jsb.fileUtils.isFileExist(this._manifestUrl, function(isExist){
            });
        }
        return cc.sys.isNative && this._manifestFound;
    },
    updateCb: function(event){
        this.log("receive event %s", Log.getKey(jsb.EventAssetsManager, event.getEventCode()));
        switch(event.getEventCode()){
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.initDefaultProjectManifest();
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                /** @type {jsb.Manifest}*/
                var manifest = this._am.getLocalManifest();
                Log.debug("Version code: "+manifest.getVersion());

                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                storage.setNeedUpdate(false);

                /** @type {jsb.Manifest}*/
                var manifest = this._am.getLocalManifest();
                // var key_save_manifest_url = "key_save_manifest_url";
                // var manifest_url = this._storagePath +'project.manifest';
                // Log.debug("Version code: "+manifest.getVersion() +"url:" + manifest_url);
                Log.debug("Version code: "+manifest.getVersion());
                // cc.sys.localStorage.setItem(key_save_manifest_url,manifest_url);
                var key_save_cpp = "path_Update_Resource";
                cc.sys.localStorage.setItem(key_save_cpp,this._storagePath);
                // Log.debug("copy file poject.json");
                // var resueEvent = event;
                // var str_read = jsb.fileUtils.getStringFromFile(this.root_path() + "project.json",function(str){
                //     Log.debug("read file project.json done %s", str);
                //     jsb.fileUtils.writeStringToFile(str,"project.json",function(result){
                //         Log.debug("write file project.json done %s", result);
                //         if(this._listenerUI){
                //             this._listenerUI(resueEvent, this.getSate());
                //         }
                //     }.bind(this));
                // }.bind(this));
                // Log.debug("read project.json done %s", str_read);
                //it's not save => because code loaded when come on cpp file
                // this.log("Update search path after update");
                // var searchPaths = cc.sys.localStorage.getItem("search_path");
                // if(searchPaths === null){
                //     searchPaths = jsb.fileUtils.getSearchPaths();
                //     Log.debug("not have local search path save => load default");
                // } else{
                //     searchPaths = JSON.parse(searchPaths);
                //     Log.debug("have local search path '%s'",searchPaths)
                // }
                // var updateResourcePath = UpdateResource.root_path();
                // Log.debug("searchPath:" + JSON.stringify(searchPaths));
                // var isContain = false;
                // for(var i in searchPaths){
                //     if(searchPaths[i] === updateResourcePath){
                //         isContain = true;
                //     }
                // }
                // if(!isContain){
                //     this.log("had contain the resource path on search path");
                // }else{
                //     searchPaths.push(updateResourcePath)
                // }
                // cc.sys.localStorage.setItem("search_path",JSON.stringify(searchPaths));
                // jsb.fileUtils.setSearchPaths(searchPaths);
                // console.log(JSON.stringify(newPaths));
                // Array.prototype.unshift.apply(searchPaths, newPaths);
                // // This value will be retrieved and appended to the default search path during game startup,
                // // please refer to samples/js-tests/main.js for detailed usage.
                // // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
                // cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                // jsb.fileUtils.setSearchPaths(searchPaths);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
            case jsb.EventAssetsManager.ERROR_UPDATING:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                // _.delay(this._am.update.bind(this), 0);
                /** @type {jsb.Manifest}*/
                var manifest = this._am.getLocalManifest();
                this.log(manifest.getPackageUrl());
                setTimeout(function(){
                    this.log("updating...");
                    this._am.update();
                }.bind(this), 0);
                break;
            default:
                break;
        }
        if(this._listenerUI){
            this._listenerUI(event, this.getSate());
        }
    },
    clean: function(){
        this._am.release();
    },
    loadDefaultProjectManifestDone: function(err, data){
        //copy json to manifest url
        Log.debug("load done");
        this.log("loadDefaultProjectManifestDone. err:%s", JSON.stringify(err));
        this.copyDefaultProjectManifest(data, this._manifestUrl)
    },
    copyDefaultProjectManifest: function(data, dst){
        //copying
        this.log("copyDefaultProjectManifest.=> %s data: %s", dst, JSON.stringify(data));
        if(cc.sys.isNative){
            jsb.fileUtils.writeStringToFile(JSON.stringify(data), dst, this.copyDefaultProjectManifestDone.bind(this));
        }
    },
    copyDefaultProjectManifestDone: function(){
        this.log("copyDefaultProjectManifestDone.");
        this._loadingManifest = false;
        this._manifestFound = true;
        //need add schedule because file was not close => not exist
        _.delay(this.update.bind(this), 0);
    },
    verifyCallback: function(path, asset){
        // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
        var compressed = asset.compressed;
        // Retrieve the correct md5 value.
        var expectedMD5 = asset.md5;
        // asset.path is relative path and path is absolute.
        var relativePath = asset.path;
        // The size of asset file, but this value could be absent.
        var size = asset.size;
        if(compressed){
            this.log("Verification passed : " + relativePath);
            return true;
        }
        else{
            this.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
            return true;
        }
    },
    versionCompareHandle: function(versionA, versionB){
        log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for(var i = 0; i < vA.length; ++i){
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if(a === b){
                //continue;
            }
            else{
                return a - b;
            }
        }
        if(vB.length > vA.length){
            return -1;
        }
        else{
            return 0;
        }
    },
    getSate: function(){
        if(this._am){
            return this._am.getState();
        }
        return -1;
    },
    info: function(){
        //check current state
        //update
        //notify event
        var state = this._am.getState();
        this.log("state:" + Log.getKey(AssetsManager.State, state));
        switch(state){
            case AssetsManager.State.UNCHECKED:
            case AssetsManager.State.PREDOWNLOAD_VERSION:
                // this._am.checkUpdate();
                break;
            case AssetsManager.State.DOWNLOADING_VERSION:
            //dang download version
            case AssetsManager.State.VERSION_LOADED:
            //bat dau check version de update
            case AssetsManager.State.PREDOWNLOAD_MANIFEST:
            case AssetsManager.State.DOWNLOADING_MANIFEST:
            case AssetsManager.State.MANIFEST_LOADED:
                //kiem tra xem de biet can update hay khong
                //Need update
                // up to date
                break;
            case AssetsManager.State.NEED_UPDATE:
                // this._am.update();
                break;
            case AssetsManager.State.UPDATING:
            case AssetsManager.State.UNZIPPING:
            case AssetsManager.State.UP_TO_DATE:
            //current version sucess
            case AssetsManager.State.FAIL_TO_UPDATE:
        }
        // this._am.retain();
    },
    log: function(){
        if(this._log){
            Log.debug.apply(Log, arguments);
        }
    }
});
UpdateResource.prototype.root_path = function(){
    if(cc.sys.isNative){
        if(jsb.fileUtils){
            return jsb.fileUtils.getWritablePath() + 'update-resource/'
        }
        return '/'
    } else{
        return ''
    }
};
var AssetsManager = {
    State: {
        UNCHECKED: 0,
        PREDOWNLOAD_VERSION: 1,
        DOWNLOADING_VERSION: 2,
        VERSION_LOADED: 3,
        PREDOWNLOAD_MANIFEST: 4,
        DOWNLOADING_MANIFEST: 5,
        MANIFEST_LOADED: 5,
        NEED_UPDATE: 7,
        UPDATING: 8,
        UNZIPPING: 9,
        UP_TO_DATE: 10,
        FAIL_TO_UPDATE: 11
    }
};
