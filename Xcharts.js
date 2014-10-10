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
 * Xcharts v0.2.3
 * Released under the MIT license
 * Base on D3.js
 * Date: 2014.10.10 JST
 */

var Xcharts = function() {
    this.baseObjectName = 'd3';                 /***base object of charts js, only can fit for D3 until now***/

    this.chart;
    this.chartObject;

    this.graphicSizeWidth;
    this.graphicSizeHeight;

    this.padding = 10;

    this.title;                                  /***title of chart***/
    this.subtitle;                               /***sub title of chart***/

    this.graphicArea;                            /***object of graphic area***/

    this.xAxis;                                  /***object of X Axis***/
    this.xAxisWidth;                             
    this.xScale;                                 /***object of scale on X Axis***/
    this.xAxisPadding = 50;                      /***scale padding on X Axis***/
    this.xScaleNames;                            
    this.xAxiMarginTop = 30;
    this.xDisplayNum;                            /***number of scale on X Axis***/
    this.xColWidth;                              /***the width of X Axis***/
    this.xAxisDescription;
    this.xCategoriesSetting = false;             /***when X scale data type is a custom type, it will be set as true***/
    this.xTimeSetting = false;                   /***when X scale data type is a date type, it will be set as true***/
    this.xDisplayWay = 'point';                  /***when X scale data type is a date type, you can set x scale as interval or point***/
    this.xLabelDirection = 0;
    this.xLabelX;
    this.xLabelY;
    this.xTimeLow;                               /***when X scale data type is a date type, start of that period***/
    this.xTimeHight;                             /***when X scale data type is a date type, end of that period***/

    this.yAxis;                                  /***object of Y Axis***/
    this.yAxisHeight;
    this.yScale;                                 /***object of scale on Y Axis***/
    this.yAxisPadding = 80;
    this.yScaleNames;
    this.yAxiMarginTop = 30;
    this.yMaxValue;
    this.yAxisDescription;

    this.legendArea;
    this.legendOptionArea;

    this.datas;                                  /***datas which should be provided from outside***/

    var graphicKinds = {
        'scatter': 'scatter',
        'line': 'line'
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
        this.setAxisAttribute(attrs.xAxis, attrs.yAxis);
        this.yScaleNames = attrs.yAxis.range;
        this.datas = attrs.datas;
        this.yMaxValue = attrs.yAxis.range[0];
        this.title = attrs.title;
        this.subtitle = attrs.subtitle;
    }

    Xcharts.prototype.setAxisAttribute = function(xAxis, yAxis) {
        if (xAxis.categories != undefined) {
            this.xCategoriesSetting = true;
            this.xScaleNames = xAxis.categories;
            this.xLabelX = 12;
            this.xLabelY = -3;
        }
        else if (xAxis.time != undefined){
            this.xTimeSetting = true;
            this.xTimeLow = new Date(xAxis.time.period[0]);
            this.xTimeHight = new Date(xAxis.time.period[1]);
            this.xScaleNames = new Array(this.xTimeLow, this.xTimeHight);
            if (xAxis.time.display != undefined) {
                this.xDisplayWay = xAxis.time.display;
            }
            this.xLabelX = -10;//55;
            this.xLabelY = 8;
        }
        else {

        }
        this.xAxisWidth = xAxis.width;
        this.yAxisHeight = yAxis.height;
        this.xAxisDescription = xAxis.description.text;
        this.yAxisDescription = yAxis.description.text;
        if (xAxis.labelDirection != undefined) {
            this.xLabelDirection = xAxis.labelDirection;
        }
    }

    Xcharts.prototype.buildChart = function(chartObjectName) {
        this.chartObject = this.getChartObject(chartObjectName);
        this.buildAxis();
    }

    Xcharts.prototype.getChartObject = function(chartObjectName) {
        var chartObject;
        switch (chartObjectName) {
            case 'line':
                chartObject = this.line;
                break;
            case 'scatter':
                chartObject = this.scatter;
                break;
        }
        return chartObject;
    }

    Xcharts.prototype.scatter = {
        type: 'scatter',
        displayCoordinate : function() {

        }
    }

    Xcharts.prototype.line = {
        type: 'line'
    }


    Xcharts.prototype.buildAxis = function() {
        if (this.xCategoriesSetting) {
            this.xDisplayNum = this.xScaleNames.length - 1;
            this.xColWidth = (this.xAxisWidth - this.xAxisPadding - this.padding * 2) / this.xDisplayNum;
            this.xScale = d3.scale.ordinal()
                .domain(this.xScaleNames)
                .rangePoints([this.padding, this.xAxisWidth - this.xAxisPadding - this.padding]);
        }
        else if (this.xTimeSetting) {
            this.xDisplayNum = 5;
            this.xColWidth = (this.xAxisWidth - this.xAxisPadding - this.padding * 2) / this.xDisplayNum;
            this.xScale = d3.time.scale()
                .domain(this.xScaleNames)
                .nice(d3.time.year, 1)
                .range([this.padding, this.xAxisWidth - this.xAxisPadding - this.padding]);
        }
        else {
            this.xScale = d3.scale.linear()
                .domain(this.xScaleNames)
                .range([this.padding, this.xAxisWidth - this.xAxisPadding - this.padding]);
        }
        this.yScale = d3.scale.linear()
            .domain(this.yScaleNames)
            .range([this.padding, this.yAxisHeight - this.yAxisPadding - this.padding]);

        this.xAxis = d3.svg.axis()
            .scale(this.xScale);
        this.yAxis = d3.svg.axis()
            .scale(this.yScale)
            .orient("left");
    }

    Xcharts.prototype.getShapePosition = function(data) {
        var x = 0;
        var y = 0;
        if (data.coordinateType == 'x') {
            if (this.xTimeSetting) {
                var coordinateName = new Date(data.coordinateInfo[0]);
                var months = d3.time.months(this.xTimeLow, coordinateName);
                var monthsCount = months.length;
                if (coordinateName.getDate() != 1) {
                    monthsCount--;
                }
                x = monthsCount * this.xColWidth / 12 + this.xAxisPadding + this.padding;
            }
            else if (this.xCategoriesSetting) {
                var pos = '-1';
                if (typeof data.coordinateInfo == 'string' || typeof data.coordinateInfo == 'number') {
                    pos = data.dataIndex;
                }
                else {
                    pos = this.xScaleNames.indexOf(data.coordinateInfo[0]);
                }
                if (pos != '-1') {
                    x = pos * this.xColWidth + this.xAxisPadding + this.padding;
                }
            }
            return x;
        }
        else if (data.coordinateType == 'y') {
            var yValue = 0;
            if (typeof data.coordinateInfo == 'string' || typeof data.coordinateInfo == 'number') {
                yValue = data.coordinateInfo;
            }
            else {
                yValue = data.coordinateInfo[1];
            }
            y = this.yAxisHeight + this.yAxiMarginTop - this.padding - this.yAxisPadding - 
                ((this.yAxisHeight - this.yAxisPadding - this.padding * 2) / this.yMaxValue * yValue);
            return y;
        }
    }

    Xcharts.prototype.displayShapeList = function(index, shape, datas, color) {
        var className = '.' + shape + index;
        var colorFill = color.fill;
        var colorStroke = color.stroke;
        var thisObject = this;
        var coordinateData;
        this.graphicArea.selectAll(className)
            .data(datas)
            .enter()
            .append(shape)
            .attr("class", className)
            .attr("cx", function(data, index) {
                coordinateData = {
                    coordinateInfo: data,
                    dataIndex: index,
                    coordinateType: 'x'
                };
                return thisObject.getShapePosition(coordinateData);
            })
            .attr("cy", function(data, index) {
                coordinateData = {
                    coordinateInfo: data,
                    dataIndex: index,
                    coordinateType: 'y'
                };
                return thisObject.getShapePosition(coordinateData);
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
                .attr('transform', "translate(" + (this.xAxisWidth + 30) + ", " + (this.yAxisHeight - this.yAxisPadding + this.xAxiMarginTop + 5) + ")")
                .text(this.xAxisDescription);
        }
        
        if (this.yAxisDescription != undefined) {
            this.graphicArea.append('text')
                .attr('transform', 'translate(28,15)rotate(0)')
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

    Xcharts.prototype.drawLine = function(datas) {
        var thisObject = this;
        var coordinateData;
        var line = d3.svg.line()
            .x(function(data, index){
                coordinateData = {
                    coordinateInfo: data,
                    dataIndex: index,
                    coordinateType: 'x'
                };
                return thisObject.getShapePosition(coordinateData);
            })
            .y(function(data, index){
                coordinateData = {
                    coordinateInfo: data,
                    dataIndex: index,
                    coordinateType: 'y'
                };
                return thisObject.getShapePosition(coordinateData);
            });

        this.graphicArea.append("path")
            .attr("class", "high")
            .attr("d", line(datas))
            .attr("stroke-width", "2px")
            .attr("stroke", "#66B3FF")
            .attr("fill", "none");
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
            .attr("x", this.xLabelX)
            .attr("y", this.xLabelY)
            .attr("transform", "rotate(" + this.xLabelDirection + ")")
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
                if (this.chartObject.type == 'line') {
                    this.drawLine(data);
                }
            }
            if (index > 0) {
                this.displayLegend(optionDatas);
            }            
        }    
    } 
}
