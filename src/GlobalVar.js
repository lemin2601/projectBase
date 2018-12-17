/** @type {cc.Size}*/
var winSize = null;
/** @type {NetworkMgr}*/
var networkMgr = null;
/** @type {SceneMgr}*/
var sceneMgr = null;
/** @type {LangMgr}*/
var langMgr = null;
/** @type {Popups}*/
var popups = null;
/** @type {AudioMgr}*/
var audio = null;
/** @type {StorageMgr}*/
var storage = null;
/** @type {PluginSocial}*/
var pluginSocial = null;
/** @type {Utils}*/
var utils = null;
var SCENE_IDs = {
    LOADING:0,
    LOGIN:1,
    MENU:2,
    GAME:3,
    UPDATE:4
};

var BUILD_MODE = {
    DEV:0,
    PRIVATE:1,
    LIVE:2
};
