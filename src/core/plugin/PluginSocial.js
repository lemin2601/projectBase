var PluginSocial = cc.Class.extend({
    ctor:function(){
        
    },
    init:function(){

    },
    login:function(){
        
    },
    logout:function(){
        
    },
    isSocial:function(key){
        if(this instanceof  PluginFacebook){
            return key === PluginSocial.Key.Facebook;
        }
        return false;
    }
});
PluginSocial.Key = {
    Facebook:"fb",
    Google:"gg"
};