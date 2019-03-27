<?php

namespace emhome\jcrop;

use yii\web\AssetBundle;

class SimpleAjaxUploaderAsset extends AssetBundle {

    public $sourcePath = '@bower/simple-ajax-uploader/';
    public $js = [
        'SimpleAjaxUploader.min.js'
    ];

}
