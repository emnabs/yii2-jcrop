<?php

use yii\helpers\Html;
?>

<div class="cropper-widget">
    <?= Html::activeHiddenInput($model, $widget->attribute, ['class' => 'photo-field']); ?>
    <?= Html::hiddenInput('width', $widget->width, ['class' => 'width-input']); ?>
    <?= Html::hiddenInput('height', $widget->height, ['class' => 'height-input']); ?>
    <div class="square-block">
        <div class="square-block-dummy"></div>
        <div class="square-block-box">
            <div class="new-photo-area">
                <div class="cropper-label">
                    <div><?= Yii::t('jcrop', 'Drag Photo'); ?></div>
                    <div><?= Yii::t('jcrop', 'Or'); ?></div>
                    <div><?= Html::button(Yii::t('jcrop', 'Select Photo'), ['class' => 'btn btn-primary']) ?></div>
                </div>
            </div>
            <?=
            Html::img($model->{$widget->attribute} != '' ? $model->{$widget->attribute} : null, [
                'class' => 'jcrop-thumbnail hidden'
            ])
            ?>
        </div>
    </div>
    <div class="cropper-buttons">
        <?= Html::button('重新上传', ['class' => 'btn btn-sm btn-info upload-new-photo hidden']) ?>
        <?= Html::button('裁剪', ['class' => 'btn btn-sm btn-success crop-photo hidden']) ?>
        <?= Html::button('重新裁剪', ['class' => 'btn btn-sm btn-success recrop-photo hidden']) ?>
        <?= Html::button('清除', ['class' => 'btn btn-sm btn-info delete-photo hidden']) ?>
    </div>
</div>