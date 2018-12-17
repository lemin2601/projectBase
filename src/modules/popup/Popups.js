/**
 * @extends {BaseNode}
 */
var Popups = BaseNode.extend({
    /** @type {ccui.Text}*/
    txtContent: null,
    /** @type {ccui.Button}*/
    btnOk: null,
    /** @type {ccui.Button}*/
    btnCancel: null,
    /** @type {PopupData[]}*/
    popupContainers: [],

    funcOk:null,
    funCancel:null,

    ctor: function(){
        this._super(res.node_popus);
        this.retain();
        this.setPosition(winSize.width >> 1, winSize.height >> 1);
    },
    onEnter: function(){
        this._super();
        this.setScale(0);
        this.runAction(cc.scaleTo(0.2,1));
        Log.debug("onter");
    },
    onEnterTransitionDidFinish: function(){
        this._super();
        Log.debug("onEnterTransitionDidFinish");
    },
    onExit: function(){
        Log.debug("exit");
        this._super();
        _.delay(this.show.bind(this),0);
    },
    onExitTransitionDidStart: function(){
        this._super();
        Log.debug("onExitTransitionDidStart");
    },
    onTouchBegan: function(sender){
    },
    onTouchMoved: function(sender){
    },
    onTouchEnded: function(sender){
        Log.debug("touch:" + sender.getName());
        switch(sender){
            case this.btnCancel:
                this.funCancel && this.funCancel();
                break;
            case this.btnOk:
                this.funcOk && this.funcOk();
                break;
        }
        this.hide();
    },
    onTouchCancelled: function(sender, type){
    },
    showMessage: function(key){
        var data = new PopupData(key);
        this.popupContainers.push(data);
        this.show();
        // this.txtContent.setString(langMgr.getStr(key));
        // this._show();
    },
    showConfirm: function(key, funcOk, funcCancel){
        var data = new PopupData(key,funcOk,funcCancel);
        this.popupContainers.push(data);
        this.show();
    },
    show: function(){
        if(this.popupContainers.length > 0){
            var curPop = cc.director.getNotificationNode();
            if(curPop == null){
                //show
                var data = this.popupContainers.shift();
                this.txtContent.setString(data.key);
                this.funcOk = data.funcOk;
                this.funCancel = data.funCancel;
                cc.director.setNotificationNode(this);
            } else{
                //wait
                Log.debug("wait, because showing");
            }
        }
    },
    hide: function(){
        this.runAction(cc.sequence(
            // cc.scaleTo(0.2,0),
            cc.callFunc(this.remove,this)
        ));
    },
    remove:function(){
        cc.director.setNotificationNode(null);
    },
    _show: function(){
        Log.debug("show message");
        /** @type {Popups}*/
        var curPopup = cc.director.getNotificationNode();
        if(curPopup !== null){
            Log.debug("push popup to queue");
            curPopup.setNextPopup(this);
        } else{
            cc.director.setNotificationNode(this);
        }
    },
    setNextPopup: function(popup){
        this.nexPopup = popup;
    },
    clean: function(){
        this.release();
    }
});