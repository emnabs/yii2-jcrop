<?php

namespace emhome\jcrop;

use yii\web\AssetBundle;

class Asset extends AssetBundle {

    public $sourcePath = '@emhome/jcrop/assets';
    public $css = [
        'css/jcrop.css'
    ];

    /**
     * @inheritdoc
     */
    public $js = [
        'js/jcrop.js'
    ];

    /**
     * @inheritdoc
     */
    public $depends = [
        'yii\web\JqueryAsset',
        'emhome\jcrop\JcropAsset',
        'emhome\jcrop\SimpleAjaxUploaderAsset',
    ];

}
