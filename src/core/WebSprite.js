cc.WebSprite = cc.Sprite.extend({
    ctor: function(imgUrl, defaultImg){
        this._super(defaultImg);
        this.setUrl(imgUrl);
    },
    setUrl:function(imgUrl){
        if(imgUrl === "") return;
        if(cc.sys.isNative){
            var tex = cc.textureCache.getTextureForKey(imgUrl);
            if(!tex){
                tex = cc.textureCache.addImage(imgUrl,function(texture){
                    this.initWithTexture(texture);
                },this);
            }else{
                this.initWithTexture(tex);
            }
        } else{
            var that = this;
            cc.loader.loadImg(imgUrl, {isCrossOrigin: true}, function(err, texture){
                var texture2d = new cc.Texture2D();
                texture2d.initWithElement(texture);
                texture2d.handleLoadedTexture();
                that.initWithTexture(texture2d);
            });
        }
        // Log.debug("load texture from internet");
        // cc.loader.loadImg(imgUrl, {isCrossOrigin: true}, function(err, texture){
        //     // Log.debug("update url:" + JSON.stringify(texture));
        //     // Use texture to create sprite frame
        //     // that.setSpriteFrame(texture);
        //     cc.textureCache.addImage(imgUrl);
        //     if(cc.sys.isNative){
        //         that.initWithTexture(texture);
        //     } else{
        //         var texture2d = new cc.Texture2D();
        //         texture2d.initWithElement(texture);
        //         texture2d.handleLoadedTexture();
        //         that.initWithTexture(texture2d);
        //     }
        // });

    }
});