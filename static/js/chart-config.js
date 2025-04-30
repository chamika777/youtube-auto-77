/**
 * TubeAI Dashboard - Chart Configurations
 * This file contains the chart configurations for analytics visualizations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set Chart.js global defaults
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#8391B0';
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    Chart.defaults.plugins.legend.labels.padding = 20;
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(30, 37, 56, 0.9)';
    Chart.defaults.plugins.tooltip.titleFont = { weight: 'bold' };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
    Chart.defaults.plugins.tooltip.displayColors = false;
    
    // Initialize channel performance chart
    initChannelPerformanceChart();
});

/**
 * Initialize Channel Performance Chart
 */
function initChannelPerformanceChart() {
    const channelPerformanceChart = document.getElementById('channelPerformanceChart');
    if (!channelPerformanceChart) return;
    
    // Get chart data from the data attribute or use default values
    let channelData;
    try {
        channelData = JSON.parse(channelPerformanceChart.getAttribute('data-performance'));
    } catch (e) {
        // Use default data if parsing fails
        channelData = {
            views: [12000, 15000, 18500, 22000, 25000, 27500, 30000],
            engagement: [8.5, 9.1, 8.7, 9.3, 9.8, 9.5, 10.2],
            dates: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
        };
    }
    
    // Create gradient for the area fill
    const ctx = channelPerformanceChart.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(155, 77, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(155, 77, 255, 0)');
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: channelData.dates,
            datasets: [
                {
                    label: 'Views',
                    data: channelData.views,
                    borderColor: '#9B4DFF',
                    backgroundColor: gradient,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#9B4DFF',
                    pointBorderColor: '#FFF',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 3
                },
                {
                    label: 'Engagement',
                    data: channelData.engagement,
                    borderColor: '#54A9FF',
                    pointBackgroundColor: '#54A9FF',
                    pointBorderColor: '#FFF',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        boxHeight: 6,
                        padding: 20,
                        color: '#CCD2E9'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.datasetIndex === 0) {
                                // Format views with K suffix
                                const value = context.parsed.y;
                                label += value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value;
                            } else {
                                // Format engagement as percentage
                                label += context.parsed.y + '%';
                            }
                            return label;
                        }
                    }
                }
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8391B0'
                    }
                },
                y: {
                    position: 'left',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8391B0',
                        callback: function(value) {
                            return value >= 1000 ? value / 1000 + 'K' : value;
                        }
                    }
                },
                y1: {
                    position: 'right',
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8391B0',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
    
    // Store chart instance for later reference if needed
    window.channelPerformanceChart = chart;
}

/**
 * Initialize Performance Chart for Analytics Page
 */
function initPerformanceChart() {
    const performanceChart = document.getElementById('performanceChart');
    if (!performanceChart) return;
    
    // Get chart data or use default values
    let performanceData;
    try {
        performanceData = JSON.parse(performanceChart.getAttribute('data-performance'));
    } catch (e) {
        // Use default data if parsing fails
        performanceData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            views: [12000, 15000, 18500, 22000, 25000, 27500, 30000, 36000, 42000, 48000, 53000, 58000]
        };
    }
    
    // Create gradient
    const ctx = performanceChart.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, 'rgba(155, 77, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(155, 77, 255, 0)');
    
    // Create chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: performanceData.labels,
            datasets: [{
                label: 'Views',
                data: performanceData.views,
                backgroundColor: gradient,
                borderColor: '#9B4DFF',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#9B4DFF',
                pointBorderColor: '#FFF',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed.y;
                            label += value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value;
                            return label;
                        }
                    }
                }
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8391B0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8391B0',
                        callback: function(value) {
                            return value >= 1000 ? value / 1000 + 'K' : value;
                        }
                    }
                }
            }
        }
    });
    
    // Store chart instance for later reference
    window.performanceChart = chart;
    
    // Setup metric switcher for analytics page
    setupMetricSwitcher(chart);
}

/**
 * Setup metric switcher for analytics charts
 */
function setupMetricSwitcher(chart) {
    const metricButtons = document.querySelectorAll('[data-metric]');
    if (!metricButtons.length || !chart) return;
    
    metricButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            metricButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected metric
            const metric = this.getAttribute('data-metric');
            
            // Update chart based on metric
            let data, label, color, bgColor;
            
            switch(metric) {
                case 'views':
                    data = [12000, 15000, 18500, 22000, 25000, 27500, 30000, 36000, 42000, 48000, 53000, 58000];
                    label = 'Views';
                    color = '#9B4DFF';
                    break;
                case 'watch-time':
                    data = [980, 1250, 1580, 1820, 2100, 2350, 2600, 3100, 3650, 4200, 4600, 5100];
                    label = 'Watch Time (hours)';
                    color = '#54A9FF';
                    break;
                case 'subscribers':
                    data = [500, 650, 820, 980, 1200, 1450, 1700, 2000, 2350, 2650, 2950, 3250];
                    label = 'New Subscribers';
                    color = '#3DD598';
                    break;
                case 'revenue':
                    data = [80, 110, 145, 190, 220, 260, 310, 370, 420, 480, 550, 620];
                    label = 'Revenue ($)';
                    color = '#FFB648';
                    break;
            }
            
            // Create gradient for selected color
            const ctx = chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
            gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
            
            // Update chart
            chart.data.datasets[0].data = data;
            chart.data.datasets[0].label = label;
            chart.data.datasets[0].borderColor = color;
            chart.data.datasets[0].backgroundColor = gradient;
            chart.data.datasets[0].pointBackgroundColor = color;
            chart.update();
        });
    });
}

/**
 * Initialize Demographics Charts for Analytics Page
 */
function initDemographicsCharts() {
    // Age chart
    const ageChart = document.getElementById('ageChart');
    if (ageChart) {
        new Chart(ageChart, {
            type: 'bar',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
                datasets: [{
                    label: 'Viewers by Age',
                    data: [28, 35, 22, 9, 4, 2],
                    backgroundColor: [
                        'rgba(155, 77, 255, 0.8)',
                        'rgba(155, 77, 255, 0.9)',
                        'rgba(155, 77, 255, 0.7)',
                        'rgba(155, 77, 255, 0.6)',
                        'rgba(155, 77, 255, 0.5)',
                        'rgba(155, 77, 255, 0.4)'
                    ],
                    borderRadius: 4,
                    barThickness: 16
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
    
    // Gender chart
    const genderChart = document.getElementById('genderChart');
    if (genderChart) {
        new Chart(genderChart, {
            type: 'doughnut',
            data: {
                labels: ['Male', 'Female', 'Other'],
                datasets: [{
                    data: [65, 32, 3],
                    backgroundColor: [
                        'rgba(84, 169, 255, 0.8)',
                        'rgba(252, 90, 90, 0.8)',
                        'rgba(61, 213, 152, 0.8)'
                    ],
                    borderWidth: 0,
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#CCD2E9',
                            boxWidth: 12,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Traffic sources chart
    const trafficChart = document.getElementById('trafficSourcesChart');
    if (trafficChart) {
        new Chart(trafficChart, {
            type: 'pie',
            data: {
                labels: ['YouTube Search', 'Suggested Videos', 'External', 'Browse Features', 'Direct'],
                datasets: [{
                    data: [42.3, 28.7, 15.4, 9.8, 3.8],
                    backgroundColor: [
                        'rgba(84, 169, 255, 0.8)',
                        'rgba(61, 213, 152, 0.8)',
                        'rgba(155, 77, 255, 0.8)',
                        'rgba(255, 182, 72, 0.8)',
                        'rgba(201, 203, 207, 0.8)'
                    ],
                    borderWidth: 0,
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#CCD2E9',
                            boxWidth: 12,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize all analytics charts when on the analytics page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('performanceChart')) {
        initPerformanceChart();
        initDemographicsCharts();
    }
});
