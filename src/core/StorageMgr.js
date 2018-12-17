var StorageMgr = cc.Class.extend({
    ctor:function(){

    },
    /**
     *
     * @param key {StorageKey.}
     * @returns {*}
     */
    getItem:function(key){
        return cc.sys.localStorage.getItem(StorageKey.PRE_UPDATED);
    },
    /**
     *
     * @param key {StorageKey.}
     * @param value
     */
    setItem:function(key,value){
        cc.sys.localStorage.setItem(StorageKey.PRE_UPDATED,value);
    },
    clean:function(){

    },
    canPassUpdate:function(){
        var updated = this.getItem(StorageKey.PRE_UPDATED);//cc.sys.localStorage.getItem(StorageKey.PRE_UPDATED);
        if(updated === "false"){
            this.setNeedUpdate(true);
            return true;
        }
        return false;
    },
    setNeedUpdate:function(b){
        this.setItem(StorageKey.PRE_UPDATED,JSON.stringify(b));
        // cc.sys.localStorage.setItem(StorageKey.PRE_UPDATED,JSON.stringify(b));
    }
});