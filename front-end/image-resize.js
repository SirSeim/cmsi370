(function ($) {
    var trackDrag = function (event) {
        if (event.target.isResizing) {
            var potentialWidth = (event.pageX - event.target.deltaX)*2;
            var potentialHeight = (event.pageY - event.target.deltaY)*2;

            if(potentialHeight - event.target.originalHeight > potentialWidth - event.target.originalWidth) {
                potentialWidth = event.target.originalWidth * (potentialHeight / event.target.originalHeight);
            } else {
                potentialHeight = event.target.originalHeight * (potentialWidth / event.target.originalWidth);
            }

            event.target.resizingImage.width(potentialWidth);
            event.target.resizingImage.height(potentialHeight);
        }

        event.stopPropagation();
        event.preventDefault();
    };

    var endDrag = function (event) {
        event.target.isResizing = false;

        event.stopPropagation();
        event.preventDefault();
    };

    var startDrag = function (event) {
        var jThis = event.target.resizingImage;
        event.target.deltaX = jThis.offset().left;
        event.target.deltaY = jThis.offset().top;
        event.target.isResizing = true;

        event.stopPropagation();
        event.preventDefault();
    };

    var setImage = function (jQueryElements) {
        jQueryElements
            .mousedown(startDrag)
            .mousemove(trackDrag)
            .mouseup(endDrag)
            .each(function (index, element) {
                element.resizingImage = $(element);
                element.originalHeight = element.height();
                element.originalWidth = element.width();
                element.isResizing = false;
            });
    };

    $.fn.resizeImage = function () {
        setImage(this);
    };
}(jQuery));
