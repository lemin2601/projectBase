var PopupData = cc.Class.extend({
    key: undefined,
    funcOk: undefined,
    funCancel: undefined,
    ctor: function(key, funcOk, funCancel){
        this.key = key;
        this.funCancel = funCancel;
        this.funcOk = funcOk;
    }
});