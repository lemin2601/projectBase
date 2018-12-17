var SceneLogin = BaseScene.extend({
    _className:"SceneLogin",
    /** @type {ccui.Button}*/
    btnLoginFacebook: null,
    ctor: function(){
        this._super(res.scene_login);
    },
    webLoadScaleCallback: function(pSender, data){
        // pSender is the sprite
        // data is the size we want the sprite
        pSender.setScaleX(data / pSender.getContentSize().width);
        pSender.setScaleY(data / pSender.getContentSize().height);
    },
    preEnter: function(){
        var i = 0;
        sceneMgr.onLoaded(100);

        // this.interval = setInterval(function(){
        //     sceneMgr.onLoaded(i);
        //     if(i >= 100){
        //         Log.debug("Clear inter val");
        //         clearInterval(this.interval);
        //     }
        //     i++;
        // }.bind(this), 0);
        // Log.debug("runScene Loading..." + utils.getCurrentTime());
        // utils.delay();
        // Log.debug("runScene Loading..." + utils.getCurrentTime());
    },
    onEnter: function(){
        this._super();
        // var url = "http://cdn.shephertz.com/repository/files/eb075343180ff254993d760eaeff219d9c6f3cd768c976f4cb7c25e6a6a7a88e/8e8984598d28645d304057d9a59cfd28e4648a60/ee227a6df135380c8bb1c4e9ad071c07e1fe284a.png";
        // var url = "https://discuss.cocos2d-x.org/user_avatar/discuss.cocos2d-x.org/pandamicro/240/20374_1.png";
        var url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/440px-Google_2015_logo.svg.png";
        var img = new cc.WebSprite(url, res.btn_a_0);
        img.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        // this.scheduleOnce(function(){
        //    Log.debug("restart game");
        //    sceneMgr.restart();
        // },4);
        this.addChild(img);
        // var action = cc.CallFunc.create(this, this.webLoadScaleCallback, 40);
        // var image = cc.WebSprite.create("http://cdn.shephertz.com/repository/files/eb075343180ff254993d760eaeff219d9c6f3cd768c976f4cb7c25e6a6a7a88e/8e8984598d28645d304057d9a59cfd28e4648a60/ee227a6df135380c8bb1c4e9ad071c07e1fe284a.png", action);
        // this.addChild(image);
        //WORKING
        // var sprite = cc.Sprite.create("http://www.corsproxy.com/cdn.shephertz.com/repository/files/eb075343180ff254993d760eaeff219d9c6f3cd768c976f4cb7c25e6a6a7a88e/8e8984598d28645d304057d9a59cfd28e4648a60/ee227a6df135380c8bb1c4e9ad071c07e1fe284a.png");
        //
        // var spritelocal = cc.Sprite.create(res.btn_a_1);
        //
        // sprite.setPosition(cc.p(100,100));
        // spritelocal.setPosition(cc.p(size.width-100,100));
        //
        // this.addChild(spritelocal,2);
        // this.addChild(sprite,3);
    },
    onEnterTransitionDidFinish:function(){
        this._super();
        this.scheduleOnce(this.autoLogin,0);
    },
    autoLogin:function(){
        if(pluginSocial == null){
            pluginSocial = new PluginFacebook();
            pluginSocial.init();
            pluginSocial.login(this.onLoginSuccess.bind(this));
        }
    },
    onTouchEnded: function(sender){
        switch(sender){
            case this.btnLoginFacebook:
                pluginSocial.login(this.onLoginSuccess.bind(this));
        }
    },
    onLoginSuccess: function(isLogin){
        if(isLogin){
            sceneMgr.viewScene(SCENE_IDs.MENU);
            // cc.director.runScene(new SceneMenu())
        }
    }
});