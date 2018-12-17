var PluginFacebook = PluginSocial.extend({
    _callbackSuccess:null,
    _callbackFailed:null,

    ctor:function(){

    },
    setCallback:function(funcSuccess,funcFail){
        this._callbackSuccess = funcSuccess;
        this._callbackFailed = funcFail;
    },
    login:function(callBack){
        this._callback = callBack;
        sdkbox.PluginFacebook.login();
    },
    logout:function(callBack){
        this._callback = callBack;
        sdkbox.PluginFacebook.logout();
        this._callback();
    },
    loadProfile:function(){
        var params = {
            fields:"picture.width(200).height(200){height,url,width},name,email"
        };
        sdkbox.PluginFacebook.api("/me", "GET", params, PluginFacebook.Tag.PROFILE);
    },
    parseProfile:function(data){
        //{
        //   "picture": {
        //     "data": {
        //       "width": 50,
        //       "height": 50,
        //       "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=779834182349290&height=50&width=50&ext=1547547804&hash=AeRF0DGbmNbIJQ2Y",
        //       "is_silhouette": false,
        //       "cache_key": "747803688885673:8c24e545472326dc06e0e2a08655635a"
        //     }
        //   },
        //   "name": "Minh Trung",
        //   "email": "lemin2601@gmail.com",
        //   "id": "779834182349290"
        // }
        data = JSON.parse(data);
        Log.debug(JSON.stringify(data));
        var picture = data["picture"];
        picture = picture["data"];
        var name = data["name"];
        var email = data["email"];
        var id = data["id"];
        var url = picture["url"];
        var is_default = picture["is_silhouette"];
        PlayerInfo.avatar = url;
        PlayerInfo.email = email;
        PlayerInfo.name = name;
        PlayerInfo.id = id;
        sceneMgr.updateProfile();
    },
    init:function(){
        if(!cc.sys.isNative){
            Popups.showMessage("not support login face");
            return;
        }
        sdkbox.PluginFacebook.init();
        sdkbox.PluginFacebook.setListener({
            onLogin: function(isLogin, msg) {
                if(isLogin){
                    PlayerInfo.isLoggedIn = true;
                    this.loadProfile();
                    Log.debug("login successful: %s",JSON.stringify(msg));
                }
                else {
                    PlayerInfo.isLoggedIn = false;
                    Log.debug("login failed");
                }
                if(this._callback){
                    this._callback(isLogin);
                }
            }.bind(this),
            onAPI: function(tag, data) {
                switch(tag){
                    case PluginFacebook.Tag.PROFILE:
                        this.parseProfile(data);
                }
                cc.log("============");
                cc.log("tag=%s", tag);
                cc.log("data=%s", data);
                if (tag == "me") {
                    var obj = JSON.parse(data);
                    Log.debug(obj.name + " || " + obj.email);

                    console.log("picture:" + obj.picture.data.url);
//                console.log(">>" + data);

                } else if (tag == "/me/friendlists") {
                    var obj = JSON.parse(data);
                    var friends = obj.data;
                    for (var i = 0; i < friends.length; i++) {
                        cc.log("id %s", friends[i].id);
                    }
                } else if (tag == "__fetch_picture_tag__") {
                    var obj = JSON.parse(data);
                    var url = obj.data.url;
                    cc.log("get friend's profile picture=%s", url);
                    self.iconSprite.updateWithUrl(url);
                }
            }.bind(this),
            onSharedSuccess: function(data) {
                Log.debug("share successful");
            },
            onSharedFailed: function(data) {
                Log.debug("share failed");
            },
            onSharedCancel: function() {
                Log.debug("share canceled");
            },
            onPermission: function(isLogin, msg) {
                if(isLogin) {
                    Log.debug(isLogin);
                    Log.debug("request permission successful %s", JSON.stringify(msg));
                    this.loadProfile();
                }
                else {
                    Log.debug("request permission failed");
                }

                if(this._callback){
                    this._callback(isLogin);
                }
            }.bind(this),
            onFetchFriends: function(ok, msg) {
                Log.debug(ok + ":"+msg, "onFetchFriends");

                self.menu.removeAllChildren();
                self.menu.cleanup();
                var friends = sdkbox.PluginFacebook.getFriends();
                for (var i = 0; i < friends.length; i++) {
                    var friend = friends[i];
                    cc.log("-----------");
                    cc.log(">> uid=%s", friend.uid);
                    cc.log(">> name=%s", friend.name);
                    cc.log(">> first name=%s", friend.firstName);
                    cc.log(">> last name=%s", friend.lastName);
                    cc.log(">> is installed=%s", friend.isInstalled);

                    // self.invitableFBUserID = friend.uid;

                    var foo = ( function() {
                        var uid = friend.uid;
                        return {
                            onClick: function () {
                                var params = new Object();
                                params.redirect = "false";
                                params.type = "small";
                                sdkbox.PluginFacebook.api(uid+"/picture", "GET", params, "__fetch_picture_tag__");
                            }
                        };
                    } () );

                    // create menu
                    var label = cc.Label.createWithSystemFont(friend.name, "sans", 20);
                    var item = new cc.MenuItemLabel(label, foo.onClick);
                    self.menu.addChild(item);

                    if (friends.length <= 0) {
                        Log.debug("You don't have any friend on this app", "onFetchFriends");
                    }
                }
                self.menu.alignItemsHorizontally();
            },
            onRequestInvitableFriends: function(friendsData) {
                Log.debug(JSON.stringify(friendsData));

                var friends = friendsData["data"];
                if (friends.length > 0) {
                    self.invitableFBUserID = friends["uid"];
                }
            },
            onInviteFriendsWithInviteIdsResult: function (result, description) {
                Log.debug("onInviteFriendsWithInviteIdsResult result=" + (result?"ok":"error") + " " + description);
            },
            onInviteFriendsResult: function (result, description) {
                Log.debug("onInviteFriendsResult result=" + (result?"ok":"error") + " " + description);
            }

        });
    }
});
PluginFacebook.Tag ={
    AVATAR:"avatar",
    PROFILE:"profile"
};