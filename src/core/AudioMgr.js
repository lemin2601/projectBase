var AudioMgr = cc.Class.extend({
    isMuting:false,

    ctor:function(){
        this.isMuting = storage.getItem(true);
    },

    playMusic:function(key, loop){
        if(loop === undefined){ loop = true}
        cc.audioEngine.playMusic(key,loop);
    },
    stopMusic:function(){
        cc.audioEngine.stopMusic();
    },

    playEffect:function(key,loop){
        if(loop === undefined){ loop = true}
        cc.audioEngine.playEffect(key,loop);
    },
    clean:function(){

    }
});