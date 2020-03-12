//https://api.highcharts.com/highcharts/colorAxis.type
//https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/coloraxis/logarithmic-with-emulate-negative-values/

/**
 * Custom Axis extension to allow emulation of negative values on a logarithmic
 * color axis. Note that the scale is not mathematically correct, as a true
 * logarithmic axis never reaches or crosses zero.
 */

export default function (H) {
    // Pass error messages
    H.addEvent(H.ColorAxis, 'init', function (e) {
        this.allowNegativeLog = e.userOptions.allowNegativeLog;
    });

    // Override conversions
    H.wrap(H.ColorAxis.prototype, 'log2lin', function (proceed, num) {
        if (!this.allowNegativeLog) {
            return proceed.call(this, num);
        }

        var isNegative = num < 0,
            adjustedNum = Math.abs(num),
            result;
        if (adjustedNum < 10) {
            adjustedNum += (10 - adjustedNum) / 10;
        }
        result = Math.log(adjustedNum) / Math.LN10;
        return isNegative ? -result : result;
    });
    H.wrap(H.ColorAxis.prototype, 'lin2log', function (proceed, num) {
        if (!this.allowNegativeLog) {
            return proceed.call(this, num);
        }

        var isNegative = num < 0,
            absNum = Math.abs(num),
            result = Math.pow(10, absNum);
        if (result < 10) {
            result = (10 * (result - 1)) / (10 - 1);
        }
        return isNegative ? -result : result;
    });
}
