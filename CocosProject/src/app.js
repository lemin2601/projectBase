
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var mainscene = ccs.load(res.MainScene_json);
        this.addChild(mainscene.node);

        var nodeGrip = new cc.NodeGrid(cc.rect(0,0,winSize.width,winSize.height));
        var node = new cc.Node();
        node.addChild(nodeGrip);
        this.addChild(node);
        // back gradient
        var gradient = new cc.LayerGradient( cc.color(255,0,0,255), cc.color(255,255,0,255));
        nodeGrip.addChild( gradient );
        this._mGradient = gradient;
        this.scheduleOnce(function(){
            Log.debug("Run action");
            nodeGrip.runAction(cc.sequence(
                // cc.scaleTo(0,1),
                cc.shaky3D( 3, cc.size(15,10), 5, false),
                // cc.waves3D(3, cc.size(15,10), 5, 40 )
                cc.stopGrid()
            ));
        },2);
        nodeGrip.setPosition(10,10);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

