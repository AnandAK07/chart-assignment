import React, { useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const dailyMetrics = [
    { day: "2023-04-01", value1: 120 },
    { day: "2023-04-02", value1: 110 },
    { day: "2023-04-03", value1: 130 },
];

const monthlyHourlyMetrics = {
    "2023-04": [
        { time: "2023-04-01 00:00", value1: 50, value2: 60 },
        { time: "2023-04-01 01:00", value1: 55, value2: 62 },
        { time: "2023-04-01 02:00", value1: 53, value2: 64 },
    ]
};

const App = () => {
    const [hourlyChartOptions, setHourlyChartOptions] = useState(null);
    const dailyValues = dailyMetrics.map(item => [new Date(item.day).getTime(), item.value1]);

    const updateDetailChart = (start, end) => {
        const startMonth = new Date(start).toISOString().slice(0, 7);
        if (monthlyHourlyMetrics[startMonth]) {
            const hourlyValues1 = monthlyHourlyMetrics[startMonth].map(item => [new Date(item.time).getTime(), item.value1]);
            const hourlyValues2 = monthlyHourlyMetrics[startMonth].map(item => [new Date(item.time).getTime(), item.value2]);
            setHourlyChartOptions({
                chart: { type: 'area', zoomType: 'x' },
                title: { text: 'Hourly Metrics for Parameters (Detail View)' },
                xAxis: { type: 'datetime' },
                yAxis: { title: { text: 'Value' } },
                series: [{
                    name: 'Parameter 1',
                    data: hourlyValues1,
                    color: 'cyan',
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, 'rgba(0, 255, 255, 0.8)'],
                            [1, 'rgba(0, 255, 255, 0.2)']
                        ]
                    },
                    threshold: null
                }, {
                    name: 'Parameter 2',
                    data: hourlyValues2,
                    color: 'orange',
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, 'rgba(255, 165, 0, 0.8)'],
                            [1, 'rgba(255, 165, 0, 0.2)']
                        ]
                    },
                    threshold: null
                }],
                plotOptions: {
                    area: { marker: { enabled: false } }
                }
            });
        }
    };

    const masterChartOptions = {
        chart: {
            type: 'area',
            height: 200,
            zoomType: 'x',
            events: {
                selection: function (event) {
                    const minTime = event.xAxis[0].min;
                    const maxTime = event.xAxis[0].max;
                    updateDetailChart(minTime, maxTime);
                }
            }
        },
        title: { text: 'Master detail type stock chart' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Value' } },
        series: [{
            name: 'Parameter 1',
            data: dailyValues,
            color: 'cyan',
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, 'rgba(0, 255, 255, 0.8)'],
                    [1, 'rgba(0, 255, 255, 0.2)']
                ]
            },
            threshold: null
        }],
        navigator: {
            enabled: true,
            series: { color: 'cyan' }
        },
        rangeSelector: {
            selected: 1
        },
        plotOptions: {
            area: { marker: { enabled: false } }
        }
    };

    return (
        <div>
            <div id="master-chart-container">
                <HighchartsReact
                    highcharts={Highcharts}
                    constructorType={'stockChart'}
                    options={masterChartOptions}
                />
            </div>
            <div id="detail-chart-container">
                {hourlyChartOptions && (
                    <HighchartsReact
                        highcharts={Highcharts}
                        constructorType={'stockChart'}
                        options={hourlyChartOptions}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
