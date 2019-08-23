<?php
/**
 * Building Image Editor Software
 *
 * PHP version 7.2.9
 *
 * @category Image_Editor
 * @package  Imageeditor
 * @author   Synclarity <admin@synclarity.in>
 * @license  http://www.php.net/license/3_01.txt  PHP License 3.01
 * @link     https://synclarity.in
 */
require_once 'vendor/autoload.php';
require_once 'constant.php';
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
?>
<?php // @codingStandardsIgnoreStart ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Image Editor</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/sweetalert2.css" />
    <link rel="stylesheet" href="css/cropper.css">
    <link rel="stylesheet" href="css/custom.css">

</head>

<body>
    <div class="loading" style="display:none;"></div>

    <div class="search-panel">
        <div class="search-form form-row">
            <div class="col-auto my-1">
                <label class="sr-only" for="query">Search high-resolution images</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text"><i class="fa fa-search" aria-hidden="true"></i></div>
                    </div>
                    <input type="text" class="form-control search-text" id="query"
                        placeholder="Search high-resolution images" onkeypress="runScript(event)">
                </div>
            </div>
            <div class="col-auto my-1">
                <button type="button" class="btn btn-primary" onClick="getImages()">Search</button>
            </div>
            <div class="form-row site-filters">
                <div class="col-auto my-1">
                    <div class="custom-control custom-radio mr-sm-2">
                        <input type="radio" class="custom-control-input" value="all" name="site-filter" id="all"
                            checked>
                        <label class="custom-control-label" for="all">All</label>
                    </div>
                </div>
                <div class="col-auto my-1">
                    <div class="custom-control custom-radio mr-sm-2">
                        <input type="radio" class="custom-control-input" value="unsplash" name="site-filter"
                            id="unplash">
                        <label class="custom-control-label" for="unplash">Unsplash</label>
                    </div>
                </div>
                <div class="col-auto my-1">
                    <div class="custom-control custom-radio mr-sm-2">
                        <input type="radio" class="custom-control-input" value="pexels" name="site-filter" id="pexels">
                        <label class="custom-control-label" for="pexels">Pexels</label>
                    </div>
                </div>
                <div class="col-auto my-1">
                    <div class="custom-control custom-radio mr-sm-2">
                        <input type="radio" class="custom-control-input" value="pixabay" name="site-filter"
                            id="pixabay">
                        <label class="custom-control-label" for="pixabay">Pixabay</label>
                    </div>
                </div>
            </div>

            <!-- <input type="text" id="query" name="query" />
            <input type="button" onClick="defaultImageCall()" name="search" value="Search" /> -->
        </div>

    </div>
    <div class="section">
        <div class="image-content">

        </div>
        <div class="loader mt-4">
            <img src="https://gifimage.net/wp-content/uploads/2017/08/loading-gif-transparent-2.gif">
        </div>
    </div>

    <div class="modal fade bd-example-modal-xl" id="editor-modal" tabindex="-1" role="dialog" data-keyboard="false"
        data-backdrop="false" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Image Processing Toolbar</h5>
                    <span class="top-action-btn">
                        <button onClick="editImage()" class="btn" title="Edit"><img src="assets/img/edit2.png"></button>
                        <button onClick="saveImage()" class="btn save-download" title="Download"><img src="assets/img/download2.png"></button>
                        <!-- <button onClick="download_image()" class="btn" title="Download"><img
                                src="assets/img/download2.png"></button> -->

                        <!-- <form onsubmit="get_action(this);" method="post" class="pure-form ajax_form download-original"
                            data-target="#cboxLoadedContent" style="display: inline-block;">
                            <div>
                                <input type="hidden" name="attachment" value="1">
                            
                                <button type="submit" class="btn" title="Download"><img src="assets/img/download2.png"></button>
                            </div>
                        </form> -->
                        <form onsubmit="get_save_download(this);" method="post" class="pure-form ajax_form"
                            data-target="#cboxLoadedContent" style="display:none">
                            <div>
                                <input type="hidden" name="attachment" value="1">
                            
                                <button type="submit" class="btn download" title="Download"><img src="assets/img/save2.png"></button>
                            </div>
                        </form>

                    </span>
                    <span class="undo-redo">
                        <button class="btn undo" title="Undo" disabled><img src="assets/img/back-arrow.png"></button>
                        <button class="btn redo" title="Redo" disabled><img src="assets/img/forward.png"></button>
                    </span>

                    <!-- <button onClick="applyChanges()" class="btn btn-primary">Apply</button> -->
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="alert alert-info resp-msg" role="alert">Your work has been saved</div>
                <div class="row" style="margin:0;">

                    <div class="col-md-9 temp-img-container">
                        <img id="temp-img" crossorigin="anonymous" style="max-width: 100%;display:none;">
                        <img id="disp-img" crossorigin="anonymous" style="max-width: 100%;">
                        <img id="edited-img" crossorigin="anonymous" style="display:none;max-width: 100%;">
                        <canvas id="canvas1">
                            Your browser does not support the HTML5 canvas element.
                        </canvas>
                        <canvas id="canvas3" style="display:none">
                            Your browser does not support the HTML5 canvas element.
                        </canvas>
                        <div id="container-canvas"></div>
                    </div>
                    <div class="col-md-3 bg-white">
    <div class="credit-info">
        <div class="row">
            <div class="photo">
                <a class="userlink" href="#" target="_blank">
                    <img id="user-photo" src="https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_960_720.png">
                </a>
            </div>
            <div class="details">
                <a href="#" class="userlink" target="_blank">
                    <span class="username"></span>
                    <span class="source"></span>
                </a>
            </div>
        </div>

    </div>
   <div class="main-action-content action-btns">
    <a onclick="setCrop()">
        <i class="fa fa-crop" aria-hidden="true"></i><br>
        Crop
    </a>
    <a onclick="initFilters()">
        <i class="fa fa-filter" aria-hidden="true"></i><br>
        Filters
    </a>
    <a onclick="setOverlay()">
        <img src="assets/img/overlay.svg" style="width: 40px;"><br>
        Overlay
    </a>
    <a onclick="setTextBox()">
        <i class="fa fa-font" aria-hidden="true"></i><br>
        text
    </a>
    <a onclick="setResizeBox()">
        <i class="fa fa-arrows-alt" aria-hidden="true"></i><br>
        Resize
    </a>

    <br>
    <button class="btn panel-btns close-edit btn-secondary">Close</button>
    <div class="control-panels">
        <div class="crop edit-ops">
            <button class="btn panel-btns close-crop btn-secondary">Close</button>
            <button class="btn panel-btns apply-crop btn-primary">Apply</button>
            <div class="aspect-ratios">
                <div class="ratio" data-ratio="3:2">
                    <div class="ratio-rect" style="width: 100px;height: 66.27px;">
                        <div class="ratio-name">
                            3:2
                        </div>
                    </div>

                </div>

                <div class="ratio" data-ratio="5:3">
                    <div class="ratio-rect" style="width: 100px;height: 60px;">
                        <div class="ratio-name">
                            5:3
                        </div>
                    </div>

                </div>

                <div class="ratio" data-ratio="4:3">
                    <div class="ratio-rect" style="width: 100px;height: 75px;">
                        <div class="ratio-name">
                            4:3
                        </div>
                    </div>

                </div>

                <div class="ratio" data-ratio="5:4">
                    <div class="ratio-rect" style="width: 100px;height: 80px;">
                        <div class="ratio-name">
                            5:4
                        </div>
                    </div>

                </div>

                <div class="ratio" data-ratio="6:4">
                    <div class="ratio-rect" style="width: 100px;height: 66.67px;">
                        <div class="ratio-name">
                            6:4
                        </div>
                    </div>

                </div>
                <div class="ratio" data-ratio="7:5">
                    <div class="ratio-rect" style="width: 100px;height: 71.43px;">
                        <div class="ratio-name">
                            7:5
                        </div>
                    </div>

                </div>
                <div class="ratio" data-ratio="10:8">
                    <div class="ratio-rect" style="width: 100px;height: 80px;">
                        <div class="ratio-name">
                            10:8
                        </div>
                    </div>

                </div>
                <div class="ratio" data-ratio="16:9">
                    <div class="ratio-rect" style="width: 100px;height: 56.25px;">
                        <div class="ratio-name">
                            16:9
                        </div>
                    </div>

                </div>

            </div>
        </div>
        <div class="filters edit-ops">
            <div class="filters">
                <button class="btn panel-btns close-filter btn-secondary">Close</button>
                <button class="btn panel-btns apply-filter btn-primary">Apply</button>
                <h3>Filters <span class="icon_list"></span></h3>
                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="Grayscale" onClick="setFilter()" id="filter1">
                        <label class="custom-control-label" for="filter1">Grayscale</label>
                    </div>
                </section>
                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="GaussianBlur" onClick="setFilter()"
                            id="filter2">
                        <label class="custom-control-label" for="filter2">GaussianBlur</label>
                    </div>
                </section>
                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="StackBlur" onClick="setFilter()" id="filter3">
                        <label class="custom-control-label" for="filter3">StackBlur</label>
                    </div>
                </section>
                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="Brightness" onClick="setFilter()" id="filter4">
                        <label class="custom-control-label" for="filter4">Brightness</label>
                    </div>
                </section>
                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="Channels" onClick="setFilter()" id="filter5">
                        <label class="custom-control-label" for="filter5">Channels</label>
                    </div>
                </section>
                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="Flip" onClick="setFilter()" id="filter6">
                        <label class="custom-control-label" for="filter6">Flip</label>
                    </div>
                </section>
                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="Mosaic" onClick="setFilter()" id="filter7">
                        <label class="custom-control-label" for="filter7">Mosaic</label>
                    </div>
                </section>
                <!-- <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="Resize"
                            onClick="setFilter()" id="filter8">
                        <label class="custom-control-label" for="filter8">Resize</label>

                        <div class="form-row align-items-center size-panel">
                            <div class="col-auto">

                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">W</div>
                                    </div>
                                    <input type="text" class="form-control" id="img_width"
                                        placeholder="width" onkeyup="setHeight()">
                                </div>
                            </div>
                            <div class="col-auto">

                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">H</div>
                                    </div>
                                    <input type="text" class="form-control" id="img_height"
                                        placeholder="height" onkeyup="setWidth()">
                                </div>
                            </div>
                            <div class="col-auto">

                            </div>
                            <br>
                            <div class="col-auto">
                                <button type="button" onClick="setSize()"
                                    class="btn btn-primary mb-2">Set</button>
                            </div>
                        </div>

                    </div>
                </section> -->
                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="Sepia" onClick="setFilter()" id="filter9">
                        <label class="custom-control-label" for="filter9">Sepia</label>
                    </div>
                </section>
                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="Sharpen" onClick="setFilter()" id="filter10">
                        <label class="custom-control-label" for="filter10">Sharpen</label>
                    </div>
                </section>
                <!-- <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <input type="checkbox" class="custom-control-input" value="Transpose" onClick="setFilter()" id="filter11">
                        <label class="custom-control-label" for="filter11">Transpose</label>
                    </div>
                </section> -->
            </div>
        </div>

        <div class="overlay edit-ops">
            <button class="btn panel-btns close-overlay btn-secondary">Close</button>
            <button class="btn panel-btns apply-overlay btn-primary">Apply</button>
            <br>
            <div class="overlay-colors mt-3">
                <label for="opacityRange">Opacity range: <span class="opacity"></span></label>
                <input type="range" class="custom-range" min="0" max="1" step="0.1" onChange="setOpacity()" id="opacityRange">
                <br>
                <div class="color-rect" style="" onClick="showOpacity('rgba(0,0,0,op)')">
                    <div style="width: 60px;height: 60px;background:rgba(0,0,0,1)"></div>

                </div>
                <div class="color-rect" style="" onClick="showOpacity('rgba(255,255,255,op)')">
                    <div style="width: 60px;height: 60px;background:rgba(255,255,255,1);"></div>

                </div>
                <div class="color-rect" style="" onClick="showOpacity('rgba(255,0,0,op)')">
                    <div style="width: 60px;height: 60px;background:rgba(255,0,0,1);"></div>

                </div>
            </div>
            <hr>
            <p>Custom Color</p>
            <div class="form-inline">


                <div class="form-group  mb-2">
                    <br>
                    <!-- <label for="custom-overlay" class="sr-only">Custom Color</label>
                    <input type="text" class="form-control" id="custom-overlay"
                        placeholder="rgba(0,0,0,1)" style="width: 140px;margin-right:10px;"> -->
                    <input type="color" id="overlay-color" name="head" value="#e66465">
                    <button type="button" class="btn btn-primary custom-overlay">Custom Preview</button>
                </div>

            </div>
        </div>

        <div class="text-overlay edit-ops">
            <button class="btn panel-btns text-overlay-cancel btn-secondary">Close</button>
            <button class="btn panel-btns text-overlay-apply btn-primary">Apply</button>

            <div class="edit-option">
                <br>
                <div>
                    <div class="form-group row">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Add Text</label>
                        <div class="col-sm-10">
                            <textarea class="form-control" id="overlay-text" rows="2" onkeyup="updateActiveText()"></textarea>

                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Font</label>
                        <div class="col-sm-10">

                            <select class="form-control form-control-sm" id="font-family" onChange="updateActiveText()">
                                <option value="'Dancing Script', cursive">Dancing Script</option>
                                <option value="'Lato', sans-serif">Lato</option>
                                <option value="'Montserrat', sans-serif">Montserrat</option>
                                <option value="'Merriweather', serif">Merriweather</option>
                                <option value="'Open Sans', sans-serif">Open Sans</option>
                                <option value="'Poppins', sans-serif">Poppins</option>
                                <option value="'Roboto', sans-serif">Roboto</option>
                                <option value="'Raleway', sans-serif">Raleway</option>
                                <option value="Times New Roman">Times New Roman</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Size</label>
                        <div class="col-sm-10">
                            <input type="text" value="14" class="form-control" id="font-size" placeholder="Font size"
                                onkeyup="updateActiveText()">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Weight</label>
                        <div class="col-sm-10">
                            <select class="form-control form-control-sm" id="font-wt" onChange="updateActiveText()">
                                <option value="normal">normal</option>
                                <option value="bold">bold</option>
                                <option value="bolder">bolder</option>
                                <option value="lighter">lighter</option>

                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Color</label>
                        <div class="col-sm-10">
                            <input type="color" id="color" onChange="updateActiveText()" name="head" value="#e66465">
                        </div>
                    </div>

                    <br>

                    <button class="btn panel-btns btn-primary addText" onClick="addText()">Add</button>
                    <button class="btn panel-btns btn-primary updateText" onClick="updateText()">Update</button>
                    <button class="btn panel-btns btn-primary cancelUpdateText">Cancel</button>

                </div>
            </div>
        </div>

        <div class="resize-box edit-ops">
            <div class="">
                <button class="btn panel-btns close-resize btn-secondary">Close</button>
                <button class="btn panel-btns apply-resize btn-primary">Apply</button>

                <section class="type">
                    <div class="custom-control custom-checkbox mr-sm-2">
                        <!-- <input type="checkbox" class="custom-control-input" value="Resize"
                            onClick="setFilter()" id="filter8">
                        <label class="custom-control-label" for="filter8">Resize</label> -->

                        <div class="form-row align-items-center size-panel-123 mt-4">
                            <div class="col-auto">

                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">W</div>
                                    </div>
                                    <input type="text" class="form-control" id="img_width" placeholder="width" onkeyup="setHeight()">
                                </div>
                            </div>
                            <div class="col-auto">

                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">H</div>
                                    </div>
                                    <input type="text" class="form-control" id="img_height" placeholder="height"
                                        onkeyup="setWidth()">
                                </div>
                            </div>
                            <div class="col-auto">

                            </div>
                            <br>
                            <div class="col-md-12">
                                <button type="button" onClick="setSize()" class="btn btn-primary mb-2 panel-btns">Set</button>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>

    </div>
   </div>
</div>
                </div>

            </div>
        </div>
    </div>
    <img src="">
    <script>
        var post_size = <?php echo FILE_SIZE; ?>
    </script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script src="js/sweetalert2.all.min.js"></script>
    <script src="js/cropper.js"></script>
    <script src="js/fabric.min.js"></script>
    <script src="js/filters.js"></script>
    <script src="js/konva.min.js"></script>
    <script src="js/ocanvas-2.10.0.js"></script>
    <script src="js/imagefilters.js"></script>
    <script src="js/canvas_processing.js"></script>
    <script src="js/custom.js"></script>
    <?php // @codingStandardsIgnoreEndt ?>

</body>


</html>
