<?php

namespace emhome\jcrop;

use yii\web\AssetBundle;

class Asset extends AssetBundle {

    /**
     * @inheritdoc
     */
    public $sourcePath = '@emhome/jcrop/assets';

    /**
     * @inheritdoc
     */
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
