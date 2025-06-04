define("ace/theme/custom_dark",["require","exports","module","ace/lib/dom"],function(require, exports, module){
    exports.isDark = true;
    exports.cssClass = "ace-custom-dark";
    exports.cssText = ".ace-custom-dark .ace_gutter {\n" +
        "background: #2b2b2b;\n" +
        "color: #8f908a;\n" +
    "}\n" +
    ".ace-custom-dark {\n" +
        "background-color: #1e1e1e;\n" +
        "color: #f8f8f2;\n" +
    "}\n" +
    ".ace-custom-dark .ace_cursor {\n" +
        "color: #f8f8f0;\n" +
    "}\n" +
    ".ace-custom-dark .ace_marker-layer .ace_selection {\n" +
        "background: #3e4451;\n" +
    "}\n" +
    ".ace-custom-dark.ace_multiselect .ace_selection.ace_start {\n" +
        "box-shadow: 0 0 3px 0px #1e1e1e;\n" +
    "}\n" +
    ".ace-custom-dark .ace_marker-layer .ace_step {\n" +
        "background: rgb(102, 82, 0);\n" +
    "}\n" +
    ".ace-custom-dark .ace_marker-layer .ace_bracket {\n" +
        "margin: -1px 0 0 -1px;\n" +
        "border: 1px solid #3e4451;\n" +
    "}\n" +
    ".ace-custom-dark .ace_marker-layer .ace_active-line {\n" +
        "background: #383c4a;\n" +
    "}\n" +
    ".ace-custom-dark .ace_gutter-active-line {\n" +
        "background-color: #383c4a;\n" +
    "}\n" +
    ".ace-custom-dark .ace_marker-layer .ace_selected-word {\n" +
        "border: 1px solid #3e4451;\n" +
    "}\n" +
    ".ace-custom-dark .ace_invisible {\n" +
        "color: #52524d;\n" +
    "}";
    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
