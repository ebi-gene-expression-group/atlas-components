//This function is a plug-in function of heatmap to provide y axis spanning
//Wrap the highchart component into this function to use it
(function(H){
  `object` === typeof module && module.exports ?
  module.exports = H :
  H(Highcharts)}
)
(
  function (H) {
    `use strict`;
    var addEvent = H.addEvent,
        doc = document,
        body = doc.body;

    H.wrap(H.Chart.prototype, `init`, function (proceed) {

        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        var chart = this,
            options = chart.options,
            panning = options.chart.panning || true,
            zoomType = options.chart.zoomType || '',
            container = chart.container,
            yAxis = chart.yAxis[0],
            downYPixels,
            downYValue,
            isDragging = false,
            hasDragged = 0;

        // Enabled if panning is true and zoomType hasn’t been set
        // if (panning && zoomType === ``) {

            addEvent(container, `mousedown`, function (e) { stat
                // TODO Is this necessary? It seems like the browser changes the cursor already...
                //body.style.cursor = `move`;

                downYPixels = chart.pointer.normalize(e).chartY;
                downYValue = yAxis.toValue(downYPixels);

                isDragging = true;
            });

            addEvent(doc, `mousemove`, function (e) {
                if (isDragging) {
                    var dragYPixels = chart.pointer.normalize(e).chartY,
                        dragYValue = yAxis.toValue(dragYPixels),

                        yExtremes = yAxis.getExtremes(),

                        yUserMin = yExtremes.userMin,
                        yUserMax = yExtremes.userMax,
                        yDataMin = yExtremes.dataMin,
                        yDataMax = yExtremes.dataMax,

                        yMin = yUserMin !== undefined ? yUserMin : yDataMin,
                        yMax = yUserMax !== undefined ? yUserMax : yDataMax,

                        newMinY,
                        newMaxY;

                    // determine if the mouse has moved more than 10px
                    hasDragged = Math.abs(downYPixels - dragYPixels);

                    if (hasDragged > 100) {

                        newMinY = yMin - (dragYValue - downYValue);
                        newMaxY = yMax - (dragYValue - downYValue);

                        yAxis.setExtremes(newMinY, newMaxY, true, false);
                    }
                }
            });

            addEvent(doc, `mouseup`, function () {
                if (isDragging) {
                    isDragging = false;
                }
            });
        //}
    });
  }
);
