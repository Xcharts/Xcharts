/*
    Copyright (c) 2014 Xcharts
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

/*
 * Xcharts v0.1
 * Released under the MIT license
 * Base on D3.js
 * Date: 2014.09.06 JST
 */

var Xcharts = function() {
    this.baseObjectName = 'd3';

    this.chart;
    this.chartObject;

    this.graphicSizeWidth;
    this.graphicSizeHeight;

    this.padding = 10;

    this.title;
    this.subtitle;

    this.graphicArea;

    this.xAxis;
    this.xAxisWidth;
    this.xScale;
    this.xAxisPadding = 50;
    this.xScaleNames;
    this.xAxiMarginTop = 30;
    this.xDisplayNum;
    this.xColWidth;
    this.xAxisDescription;

    this.yAxis;
    this.yAxisHeight;
    this.yScale;
    this.yAxisPadding = 80;
    this.yScaleNames;
    this.yAxiMarginTop = 30;
    this.yMaxValue;
    this.yAxisDescription;

    this.legendArea;
    this.legendOptionArea;

    this.datas;

    var graphicKinds = {
        'scatter': 'scatter',
        'chart': ''
    };

    Xcharts.prototype.init = function(attrs) {
        this.setAttributes(attrs);
        this.build();
        return this;
    }

    Xcharts.prototype.build = function() {
        var chartObjectName = graphicKinds[this.chart.type];
        if (chartObjectName != undefined) {
            this.buildChart(chartObjectName);
        }
        else {
            alert('you must set a type for chart');
            return false;
        }
    }

    Xcharts.prototype.setAttributes = function(attrs) {
        this.chart = attrs.chart;
        this.graphicSizeHeight = attrs.size.height;
        this.graphicSizeWidth = attrs.size.width;
        this.xScaleNames = attrs.xAxis.categories;
        this.yScaleNames = attrs.yAxis.range;
        this.xAxisWidth = attrs.xAxis.width;
        this.yAxisHeight = attrs.yAxis.height;
        this.xAxisDescription = attrs.xAxis.description.text;
        this.yAxisDescription = attrs.yAxis.description.text;
        this.datas = attrs.datas;
        this.yMaxValue = attrs.yAxis.range[0];
        this.title = attrs.title;
        this.subtitle = attrs.subtitle;
    }

    Xcharts.prototype.buildChart = function(chartObjectName) {
        this.chartObject = this.getChartObject(chartObjectName);
        this.buildAxis();
    }

    Xcharts.prototype.getChartObject = function(chartObjectName) {
        var chartObject;
        switch (chartObjectName) {
            case '':

                break;
            case 'scatter':
                chartObject = this.scatter;
                break;
        }
        return chartObject;
    }

    Xcharts.prototype.scatter = {
        displayCoordinate : function() {

        }
    }


    Xcharts.prototype.buildAxis = function() {
        this.xDisplayNum = this.xScaleNames.length - 1;
        this.xColWidth = (this.xAxisWidth - this.xAxisPadding - this.padding * 2) / this.xDisplayNum;

        this.xScale = d3.scale.ordinal()
            .domain(this.xScaleNames)
            .rangePoints([this.padding, this.xAxisWidth - this.xAxisPadding - this.padding]);
        this.yScale = d3.scale.linear()
            .domain(this.yScaleNames)
            .range([this.padding, this.yAxisHeight - this.yAxisPadding - this.padding]);

        this.xAxis = d3.svg.axis()
            .scale(this.xScale);
        this.yAxis = d3.svg.axis()
            .scale(this.yScale)
            .orient("left");
    }

    Xcharts.prototype.displayShapeList = function(index, shape, datas, color) {
        var className = '.' + shape + index;
        var colorFill = color.fill;
        var colorStroke = color.stroke;
        var thisObject = this;
        this.graphicArea.selectAll(className)
            .data(datas)
            .enter()
            .append(shape)
            .attr("class", className)
            .attr("cx", function(data, index) {
                var xValue = data[0];
                var pos = thisObject.xScaleNames.indexOf(xValue);
                if (pos != '-1') {
                    return (pos * thisObject.xColWidth) + thisObject.xAxisPadding + thisObject.padding;
                }
            })
            .attr("cy", function(data, index) {
                return thisObject.yAxisHeight + thisObject.yAxiMarginTop - thisObject.padding - thisObject.yAxisPadding - ((thisObject.yAxisHeight - thisObject.yAxisPadding - thisObject.padding * 2) / thisObject.yMaxValue * data[1] );
            })
            .attr("r", 0)
            .attr("stroke", colorStroke)
            .attr("stroke-width", "1px")
            .attr("fill", colorFill)
            .transition()
            .duration(1000)
            .attr("r", 5);
    }

    Xcharts.prototype.displayTitle = function() {
        if (this.title != undefined) {
            var x = this.xAxisWidth / 2;
            var title = this.graphicArea.append("text")
                .attr("text-anchor", "middle")
                .attr("color", "#333333")
                .attr("class", "title")
                .attr("fill", "#333333")
                .attr("width", this.graphicSizeWidth)
                .attr("x", x)
                .attr("y", 10)
                .attr("opacity", 1)
                .text(this.title.text);
        }
        if (this.subtitle != undefined) {
            var x = this.xAxisWidth / 2;
            var title = this.graphicArea.append("text")
                .attr("text-anchor", "middle")
                .attr("class", "subtitle")
                .attr("color", "#333333")
                .attr("fill", "#333333")
                .attr("width", this.graphicSizeWidth)
                .attr("x", x)
                .attr("y", 25)
                .attr("opacity", 1)
                .text(this.subtitle.text);
        }
    }

    Xcharts.prototype.displayAxiLabel = function() {
        if (this.xAxisDescription != undefined) {
            this.graphicArea.append('text')
                .attr({'id': 'xLabel', 'text-anchor': 'middle'})
                .attr('transform', "translate(" + (this.xAxisWidth + 20) + ", " + (this.yAxisHeight - this.yAxisPadding + this.xAxiMarginTop + 5) + ")")
                .text(this.xAxisDescription);
        }
        
        if (this.yAxisDescription != undefined) {
            this.graphicArea.append('text')
                .attr('transform', 'translate(0,' + this.yAxisHeight / 2 + ')rotate(-90)')
                .attr({'id': 'yLabel', 'text-anchor': 'middle'})
                .text(this.yAxisDescription);
        }  
    }

    Xcharts.prototype.displayLegend = function(optionDatas) {
        var legendArea = this.graphicArea.append("g")
            .attr("class", "legendArea")
            .attr('transform', "translate(" + (this.xAxisWidth + 20) + ", " + 10 + ")");

        legendArea.append("rect")
            .attr({x: "0.5", y: "0.5", width: "107", height: "85"})
            .attr("stroke", "#333333")
            .attr("stroke-width", "1px")
            .attr("fill", "#FFFFFF");

        this.legendArea = legendArea;
        this.legendOptionArea = this.legendArea.append("g");
        this.addOptionInLegend(optionDatas);
    }

    Xcharts.prototype.addOptionInLegend = function(optionDatas) {
        var optionArea;
        for (index in optionDatas) {
            optionArea = this.legendOptionArea.append("g")
                .attr('transform', "translate(45, " + (12 + 16 * parseInt(index)) +")");
            optionArea.append(optionDatas[index].shape)
                .attr("cx", -30)
                .attr("cy", 0)
                .attr("r", 0)
                .attr("stroke", optionDatas[index].colorStroke)
                .attr("stroke-width", "1px")
                .attr("fill", optionDatas[index].colorFill)
                .attr("r", 5);
            optionArea.append('text')
                .attr('transform', "translate(-15,4)")
                .text(optionDatas[index].text);
        }
    }

    Xcharts.prototype.show = function(selectorId) {
        var svg = d3.select('#' + selectorId)
            .append("svg")
            .attr("width", this.graphicSizeWidth)
            .attr("height", this.graphicSizeHeight);

        this.graphicArea = svg.append('g')
            .classed('chart', true)
            .attr('transform', 'translate(15, 10)');

        this.graphicArea.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + this.xAxisPadding + ", " + (this.yAxisHeight - this.yAxisPadding + this.xAxiMarginTop) + ")")
            .call(this.xAxis)
            .selectAll("text")
            .attr("x", 12)
            .attr("y", -3)
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

        this.graphicArea.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + this.xAxisPadding + "," + this.yAxiMarginTop + ")")
            .call(this.yAxis);

        this.displayTitle();
        this.displayAxiLabel();

        if (this.datas != undefined) {
            var datas = this.datas;
            var shape;
            var data;
            var color;
            var optionDatas = new Array();
            for (index in datas) {
                shape = datas[index].shape;
                data = datas[index].data;
                color = datas[index].color;
                this.displayShapeList(index, shape, data, color);
                optionDatas[index] = {
                    text: datas[index].name,
                    colorStroke: datas[index].color.stroke,
                    colorFill: datas[index].color.fill,
                    shape: datas[index].shape
                };
            }
            this.displayLegend(optionDatas);
        }    
    } 
}
