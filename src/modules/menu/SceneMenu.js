var SceneMenu = BaseScene.extend({
    btnFacebook:null,
    btnUpdate:null,
    btnPlay:null,

    /** @type {ccui.Button}*/
    btnFacebookLogin:null,
    /** @type {ccui.Button}*/
    btnFacebookLogout:null,

    ctor: function(){
        /** @type {cc.WebSprite}*/
        this.wpAvatar = null;
        /** @type {ccui.Text}*/
        this.txtName = null;
        /** @type {ccui.Text}*/
        this.txtEmail = null;

        this._super(res.scene_menu);

        this.txtName.ignoreContentAdaptWithSize(true);
        this.txtEmail.ignoreContentAdaptWithSize(true);
    },
    onEnter:function(){
        this._super();
        this.updateProfile();
    },
    onEnterTransitionDidFinish: function(){
        this._super();
        Log.debug("enter scene Menu");
        popups.showMessage(lang.UPDATE_PREDOWNLOAD_VERSION);
        popups.showMessage(lang.UPDATE_DOWNLOADING_MANIFEST);
        popups.showMessage(lang.UPDATE_FAIL_TO_UPDATE);

        // var url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/440px-Google_2015_logo.svg.png";
        // this.wpAvatar.setUrl(url);
        this.btnFacebook.setPosition(100,100);
        // this.schedule(this.testRunAction.bind(this),3);
        // var nodeGrip = new cc.NodeGrid(cc.rect(0,0,winSize.width,winSize.height));
        // var node = new cc.Node();
        // node.addChild(nodeGrip);
        // this.addChild(node,0);
        // // back gradient
        // var gradient = new cc.LayerGradient( cc.color(255,0,0,255), cc.color(255,255,0,255));
        // nodeGrip.addChild( gradient );
        // this._mGradient = gradient;
        // this.scheduleOnce(function(){
        //     nodeGrip.runAction(cc.sequence(
        //         // cc.scaleTo(0,1),
        //         // cc.shaky3D( 3, cc.size(15,10), 5, false),
        //         cc.waves3D(3, cc.size(15,10), 5, 40 ),
        //         cc.stopGrid()
        //     ));
        // },2);
        // Log.debug("run animation shaky3D");
        // nodeGrip.setPosition(10,10);
        // this._nodeGrip = nodeGrip;
        // this._node = node;
        // this.scheduleOnce(function(){
        //     Log.debug("_node:" + this._node.getScale());
        //     Log.debug("_nodeGrip:" + this._nodeGrip.getScale());
        //     Log.debug("_mGradient:" + this._mGradient.getScale());
        // }.bind(this),7);

    },
    updateProfile:function(){
        this.wpAvatar.setUrl(PlayerInfo.avatar);
        this.txtEmail.setString(PlayerInfo.email);
        this.txtName.setString(PlayerInfo.name);
        // var avatar = new cc.WebSprite(PlayerInfo.avatar);
    },
    testRunAction:function(){
        if(this._positionNewMove == null){
            this._positionNewMove = cc.p(100,100);
        }
        this._positionNewMove.x += 50;
        if(this._actionRun == null){
            this._actionRun = new cc.moveTo(1,this._positionNewMove);
            this._actionRun.retain();
        }
        Log.debug("Run Action:", JSON.stringify(this._positionNewMove));
        this.btnFacebook.runAction(this._actionRun);
    },

    onTouchBegan:function(sender){
        Log.debug("touch" + sender.getName());
        switch(sender){
            case this.btnUpdate:
                // popups.showMessage(lang.UPDATE_PREDOWNLOAD_VERSION);
                var info = new Object();
                info.type  = "link";
                info.link  = "http://www.cocos2d-x.org";
                info.title = "cocos2d-x";
                info.text  = "Best Game Engine";
                info.image = "http://cocos2d-x.org/images/logo.png";
                sdkbox.PluginFacebook.dialog(info);

                break;

            case this.btnFacebook:
                sdkbox.PluginFacebook.login();
                Log.debug("login facebook");
                Log.debug("is LoggedIn: %s", sdkbox.PluginFacebook.isLoggedIn());

                break;
            case this.btnFacebookLogin:
                Log.debug("login fbb");
                sdkbox.PluginFacebook.login();
                break;
            case this.btnFacebookLogout:
                Log.debug("Logout fb");
                pluginSocial.logout(this.onLogout.bind(this));
                break;
            case this.btnPlay:
                Log.debug("userId: %s",sdkbox.PluginFacebook.getUserID());
                Log.debug("token: %s",sdkbox.PluginFacebook.getAccessToken());
                var params = {
                    fields:"picture.width(200).height(200){height,url,width},name,email"
                };
                sdkbox.PluginFacebook.api("/me", "GET", params, "picture");


                Log.debug("is LoggedIn: %s", sdkbox.PluginFacebook.isLoggedIn());
                break;
        }
    },
    onKeyReleased:function(keyCode,event){
        // Log.debug("Press: %s",Log.getKey(cc.KEY,keyCode));
        switch(keyCode){
            case cc.KEY.back:
                cc.game.exit();
        }
    },
    onLogout:function(){
        cc.director.runScene(new SceneLogin());
    }
});