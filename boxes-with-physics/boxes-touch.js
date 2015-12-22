(function ($) {
    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    var trackDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                var oldOffset = touch.target.movingBox.offset();

                var potentialLeft = touch.pageX - touch.target.deltaX;
                var potentialTop = touch.pageY - touch.target.deltaY;

                // Don't allow boxes outside drawing areaj-[]
                if (potentialTop + touch.target.height > touch.target.parentOffset.top + touch.target.parentHeight) {
                    potentialTop = touch.target.parentOffset.top + touch.target.parentHeight - touch.target.height;
                }
                if (potentialLeft + touch.target.width > touch.target.parentOffset.left + touch.target.parentWidth) {
                    potentialLeft = touch.target.parentOffset.left + touch.target.parentWidth - touch.target.width;
                }
                if (potentialTop < touch.target.parentOffset.top) {
                    potentialTop = touch.target.parentOffset.top;
                }
                if (potentialLeft < touch.target.parentOffset.left) {
                    potentialLeft = touch.target.parentOffset.left;
                }

                // Reposition the object.
                touch.target.movingBox.offset({
                    left: potentialLeft,
                    top: potentialTop
                });

                // Calculate Top and Left velocities
                var timeElapsed = event.timeStamp - touch.target.previousTime;
                touch.target.velocityTop = (potentialTop - oldOffset.top) / timeElapsed;
                touch.target.velocityLeft = (potentialLeft - oldOffset.left) / timeElapsed;

                touch.target.previousTime = event.timeStamp;
            }
        });

        // Don't do any touch scrolling.
        event.preventDefault();
    };

    var animate = function (element, acceleration) {
        if (!element.isMoved) {
            var oldOffset = element.movingBox.offset();

            var potentialLeft = oldOffset.left + (element.velocityLeft * 10); // JD: 2
            var potentialTop = oldOffset.top + (element.velocityTop * 10); // JD: 2

            if (potentialTop + element.height > element.parentOffset.top + element.parentHeight) {
                potentialTop = element.parentOffset.top + element.parentHeight - element.height;
                element.velocityTop *= -.9; // JD: 2
                // console.log("bottom"); // JD: 3
            }
            if (potentialLeft + element.width > element.parentOffset.left + element.parentWidth) {
                potentialLeft = element.parentOffset.left + element.parentWidth - element.width;
                element.velocityLeft *= -.9; // JD: 2
                // console.log("right"); // JD: 3
            }
            if (potentialTop < element.parentOffset.top) {
                potentialTop = element.parentOffset.top;
                element.velocityTop *= -.9; // JD: 2
                // console.log("top"); // JD: 3
            }
            if (potentialLeft < element.parentOffset.left) {
                potentialLeft = element.parentOffset.left;
                element.velocityLeft *= -.9; // JD: 2
                // console.log("left"); // JD: 3
            }

            // Reposition the object.
            element.movingBox.offset({
                left: potentialLeft,
                top: potentialTop
            });

            element.velocityLeft += (acceleration.x * .02); // JD: 2
            element.velocityTop -= (acceleration.y * .02); // JD: 2
        }
    };

    var animateAll = function (event, jQueryElements) {
        jQueryElements.each(function (index, element) {
            animate(element, event.accelerationIncludingGravity);
        });
        
        // Don't do any touch scrolling.
        event.preventDefault();
    };

    /**
     * Concludes a drawing or moving sequence.
     */
    var endDrag = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (touch.target.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox.
                // touch.target.movingBox = null; // JD: 3
                touch.target.isMoved = false;
            }
        });
    };

    /**
     * Indicates that an element is unhighlighted.
     */
    var unhighlight = function () {
        $(this).removeClass("box-highlight");
    };

    /**
     * Begins a box move sequence.
     */
    var startMove = function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Highlight the element.
            $(touch.target).addClass("box-highlight");

            // Take note of the box's current (global) location.
            var jThis = $(touch.target),
                startOffset = jThis.offset();

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            // touch.target.movingBox = jThis; // JD: 3
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
            touch.target.height = jThis.height();
            touch.target.width = jThis.width();
            touch.target.isMoved = true;

            // touch.target.parentHeight = $(touch.target).parent().height(); // JD: 3
            // touch.target.parentWidth = $(touch.target).parent().width(); // JD: 3
            // touch.target.parentOffset = $(touch.target).parent().offset(); // JD: 3
            // console.log(touch.target.velocityTop); // JD: 3
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    };

    var initializeVelocity = function (element) {
        element.velocityTop = 0;
        element.velocityLeft = 0;
    };

    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    var setDrawingArea = function (jQueryElements) {
        // Set up any pre-existing box elements for touch behavior.
        jQueryElements
            .addClass("drawing-area")
            
            // Event handler setup must be low-level because jQuery
            // doesn't relay touch-specific event properties.
            .each(function (index, element) {
                element.addEventListener("touchmove", trackDrag, false);
                element.addEventListener("touchend", endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", startMove, false);
                element.addEventListener("touchend", unhighlight, false);
                initializeVelocity(element);
                element.movingBox = $(element);
                element.parentOffset = $(jQueryElements).offset();
                element.parentHeight = $(jQueryElements).height();
                element.parentWidth = $(jQueryElements).width();
                element.height = $(element).height();
                element.width = $(element).width();
            });
        window.addEventListener("devicemotion", function (event) {
            // console.log(jQueryElements); // JD: 3
            // console.log("hey"); // JD: 3
            animateAll(event, jQueryElements.find("div.box")); // JD: 4
        }, true);
    };

    $.fn.boxesTouch = function () {
        setDrawingArea(this);
    };
}(jQuery));
