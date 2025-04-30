/**
 * TubeAI Dashboard - Main JavaScript
 * This file contains the core functionality for the dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Format numbers
    formatNumbers();
    
    // Toggle Automation Mode
    setupAutomationModeToggle();
    
    // Manual Control Buttons
    setupManualControlButtons();
    
    // Schedule Form
    setupScheduleForm();
    
    // Trending Topic Selection
    setupTrendingTopicSelection();
    
    // Handle content text overflow
    handleTextOverflow();
});

/**
 * Format numbers for display (adding K, M, etc.)
 */
function formatNumbers() {
    document.querySelectorAll('.format-number').forEach(element => {
        const value = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        if (value >= 1000000) {
            element.textContent = (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            element.textContent = (value / 1000).toFixed(1) + 'K';
        }
    });
}

/**
 * Setup Automation Mode Toggle Switch
 */
function setupAutomationModeToggle() {
    const modeSwitch = document.getElementById('automationModeSwitch');
    if (!modeSwitch) return;
    
    modeSwitch.addEventListener('change', function() {
        const isAutopilot = this.checked;
        
        // Show loading state
        this.disabled = true;
        
        // Send request to toggle mode
        fetch('/api/toggle-mode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mode: isAutopilot ? 'autopilot' : 'manual'
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Mode changed to:', data.mode);
            // Re-enable switch
            modeSwitch.disabled = false;
            
            // Show notification
            showNotification(
                isAutopilot ? 'Autopilot Mode Enabled' : 'Manual Mode Enabled',
                isAutopilot ? 'TubeAI will now run automated tasks based on your schedule.' : 'You now have full manual control over all operations.'
            );
        })
        .catch(error => {
            console.error('Error toggling mode:', error);
            // Reset switch to previous state
            modeSwitch.checked = !isAutopilot;
            modeSwitch.disabled = false;
            
            // Show error notification
            showNotification(
                'Error Changing Mode',
                'There was a problem changing the mode. Please try again.',
                'error'
            );
        });
    });
}

/**
 * Setup Manual Control Buttons
 */
function setupManualControlButtons() {
    // Start Trend Research Button
    const trendResearchBtn = document.getElementById('startTrendResearchBtn');
    if (trendResearchBtn) {
        trendResearchBtn.addEventListener('click', function() {
            const contentModal = new bootstrap.Modal(document.getElementById('contentGenerationModal'));
            document.getElementById('contentModalTitle').textContent = 'Research Trends';
            
            // Clear and reset modal content
            document.getElementById('contentKeyword').value = '';
            document.getElementById('generatedContentContainer').classList.add('d-none');
            document.getElementById('createVideoFromContentBtn').classList.add('d-none');
            document.getElementById('optimizeSEOFromContentBtn').classList.add('d-none');
            
            // Show modal
            contentModal.show();
        });
    }
    
    // Generate Content Button
    const generateContentBtn = document.getElementById('generateContentBtn');
    if (generateContentBtn) {
        generateContentBtn.addEventListener('click', function() {
            const contentModal = new bootstrap.Modal(document.getElementById('contentGenerationModal'));
            document.getElementById('contentModalTitle').textContent = 'Generate Content';
            
            // Clear and reset modal content
            document.getElementById('contentKeyword').value = '';
            document.getElementById('generatedContentContainer').classList.add('d-none');
            document.getElementById('createVideoFromContentBtn').classList.add('d-none');
            document.getElementById('optimizeSEOFromContentBtn').classList.add('d-none');
            
            // Show modal
            contentModal.show();
        });
    }
    
    // Create Video Button
    const createVideoBtn = document.getElementById('createVideoBtn');
    if (createVideoBtn) {
        createVideoBtn.addEventListener('click', function() {
            const videoModal = new bootstrap.Modal(document.getElementById('videoCreationModal'));
            
            // Clear and reset modal content
            document.getElementById('videoScriptInput').value = '';
            document.getElementById('videoTitleInput').value = '';
            document.getElementById('videoCreationProgress').classList.add('d-none');
            document.getElementById('videoCreationResult').classList.add('d-none');
            
            // Show modal
            videoModal.show();
        });
    }
    
    // Optimize SEO Button
    const optimizeSEOBtn = document.getElementById('optimizeSEOBtn');
    if (optimizeSEOBtn) {
        optimizeSEOBtn.addEventListener('click', function() {
            const seoModal = new bootstrap.Modal(document.getElementById('seoOptimizationModal'));
            
            // Clear and reset modal content
            document.getElementById('seoTitleInput').value = '';
            document.getElementById('seoDescriptionInput').value = '';
            document.getElementById('seoKeywordsInput').value = '';
            document.getElementById('seoOptimizationSpinner').classList.add('d-none');
            document.getElementById('seoOptimizationResult').classList.add('d-none');
            
            // Show modal
            seoModal.show();
        });
    }
    
    // Upload to YouTube Button
    const uploadYouTubeBtn = document.getElementById('uploadYouTubeBtn');
    if (uploadYouTubeBtn) {
        uploadYouTubeBtn.addEventListener('click', function() {
            window.open('https://studio.youtube.com/channel/upload', '_blank');
        });
    }
    
    // Start Automation Button
    const startAutomationBtn = document.getElementById('startAutomationBtn');
    if (startAutomationBtn) {
        startAutomationBtn.addEventListener('click', function() {
            // Show loading state
            const originalText = this.innerHTML;
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Starting Automation...';
            
            // Get the default selected category
            const categorySelect = document.getElementById('contentCategory');
            const category = categorySelect ? categorySelect.value : 'Technology';
            
            // Send request to start automation
            fetch('/api/full-automation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: category
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Reset button
                startAutomationBtn.disabled = false;
                startAutomationBtn.innerHTML = originalText;
                
                if (data.success) {
                    // Show success notification
                    showNotification(
                        'Automation Complete',
                        `Successfully created a video about "${data.topic}"`,
                        'success'
                    );
                    
                    // Update the page content (in a real app, we would reload the data)
                    // For demo purposes, we'll just show an alert
                    console.log('Automation result:', data);
                } else {
                    // Show error notification
                    showNotification(
                        'Automation Failed',
                        data.error || 'There was a problem running the automation.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error('Error starting automation:', error);
                
                // Reset button
                startAutomationBtn.disabled = false;
                startAutomationBtn.innerHTML = originalText;
                
                // Show error notification
                showNotification(
                    'Automation Error',
                    'There was a problem starting the automation. Please try again.',
                    'error'
                );
            });
        });
    }
    
    // AI Content Assistant Buttons
    setupContentAssistantButtons();
}

/**
 * Setup Content Assistant Buttons
 */
function setupContentAssistantButtons() {
    // Generate Script Button
    const generateScriptBtn = document.getElementById('generateScriptBtn');
    if (generateScriptBtn) {
        generateScriptBtn.addEventListener('click', function() {
            const prompt = document.getElementById('contentPrompt').value.trim();
            if (!prompt) {
                showNotification('Input Required', 'Please enter a topic or keyword to generate content.', 'warning');
                return;
            }
            
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating...';
            
            // Call API to generate content
            fetch('/api/generate-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keyword: prompt,
                    topic: 'Technology'
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Reset button
                generateScriptBtn.disabled = false;
                generateScriptBtn.innerHTML = 'Generate Script';
                
                if (data.success) {
                    // Open content generation modal
                    const contentModal = new bootstrap.Modal(document.getElementById('contentGenerationModal'));
                    document.getElementById('contentModalTitle').textContent = 'Generated Content';
                    
                    // Fill in content
                    document.getElementById('contentKeyword').value = prompt;
                    document.getElementById('generatedTitle').textContent = data.content.title || '';
                    document.getElementById('generatedDescription').textContent = data.content.description || '';
                    document.getElementById('generatedScript').textContent = data.content.script || '';
                    
                    // Show content and action buttons
                    document.getElementById('generatedContentContainer').classList.remove('d-none');
                    document.getElementById('generateContentModalBtn').classList.add('d-none');
                    document.getElementById('createVideoFromContentBtn').classList.remove('d-none');
                    document.getElementById('optimizeSEOFromContentBtn').classList.remove('d-none');
                    
                    // Show modal
                    contentModal.show();
                } else {
                    // Show error notification
                    showNotification(
                        'Content Generation Failed',
                        data.error || 'There was a problem generating content.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error('Error generating content:', error);
                
                // Reset button
                generateScriptBtn.disabled = false;
                generateScriptBtn.innerHTML = 'Generate Script';
                
                // Show error notification
                showNotification(
                    'Generation Error',
                    'There was a problem connecting to the content generation service.',
                    'error'
                );
            });
        });
    }
    
    // Generate Title Button
    const generateTitleBtn = document.getElementById('generateTitleBtn');
    if (generateTitleBtn) {
        generateTitleBtn.addEventListener('click', function() {
            const prompt = document.getElementById('contentPrompt').value.trim();
            if (!prompt) {
                showNotification('Input Required', 'Please enter a topic or keyword to generate a title.', 'warning');
                return;
            }
            
            // Show loading state
            this.disabled = true;
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating...';
            
            // Simulate API call (would be a real API call in production)
            setTimeout(() => {
                // Reset button
                this.disabled = false;
                this.innerHTML = originalText;
                
                // Show result
                const titles = [
                    `Ultimate Guide to ${prompt}: Everything You Need to Know in 2024`,
                    `${prompt} Explained: The Complete Beginner's Tutorial`,
                    `Top 10 ${prompt} Trends That Are Changing the Industry`,
                    `How ${prompt} Is Revolutionizing Technology in 2024`,
                    `The Future of ${prompt}: Predictions and Expert Insights`
                ];
                
                const randomTitle = titles[Math.floor(Math.random() * titles.length)];
                document.getElementById('contentPrompt').value = randomTitle;
                
                // Show notification
                showNotification('Title Generated', 'A new title has been generated based on your input.', 'success');
            }, 1500);
        });
    }
    
    // Generate Keywords Button
    const generateKeywordsBtn = document.getElementById('generateKeywordsBtn');
    if (generateKeywordsBtn) {
        generateKeywordsBtn.addEventListener('click', function() {
            const prompt = document.getElementById('contentPrompt').value.trim();
            if (!prompt) {
                showNotification('Input Required', 'Please enter a topic or keyword to generate SEO keywords.', 'warning');
                return;
            }
            
            // Show loading state
            this.disabled = true;
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating...';
            
            // Call API to optimize SEO
            fetch('/api/optimize-seo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: prompt,
                    description: '',
                    keywords: [prompt]
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Reset button
                this.disabled = false;
                this.innerHTML = originalText;
                
                if (data.success) {
                    // Show SEO modal
                    const seoModal = new bootstrap.Modal(document.getElementById('seoOptimizationModal'));
                    
                    // Fill in results
                    document.getElementById('seoTitleInput').value = prompt;
                    document.getElementById('optimizedTitle').textContent = data.seo_data.optimized_title || '';
                    document.getElementById('suggestedTags').textContent = (data.seo_data.tags || []).join(', ');
                    
                    // Show results
                    document.getElementById('seoOptimizationResult').classList.remove('d-none');
                    
                    // Show modal
                    seoModal.show();
                } else {
                    // Show error notification
                    showNotification(
                        'SEO Optimization Failed',
                        data.error || 'There was a problem optimizing SEO.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error('Error optimizing SEO:', error);
                
                // Reset button
                this.disabled = false;
                this.innerHTML = originalText;
                
                // Show error notification
                showNotification(
                    'SEO Optimization Error',
                    'There was a problem connecting to the SEO service.',
                    'error'
                );
            });
        });
    }
}

/**
 * Setup Schedule Form
 */
function setupScheduleForm() {
    const saveScheduleBtn = document.getElementById('saveScheduleBtn');
    if (!saveScheduleBtn) return;
    
    saveScheduleBtn.addEventListener('click', function() {
        const titleInput = document.getElementById('videoTitle');
        const dateInput = document.getElementById('scheduleDate');
        const timeInput = document.getElementById('scheduleTime');
        
        // Validate inputs
        if (!titleInput.value.trim()) {
            titleInput.classList.add('is-invalid');
            return;
        } else {
            titleInput.classList.remove('is-invalid');
        }
        
        if (!dateInput.value) {
            dateInput.classList.add('is-invalid');
            return;
        } else {
            dateInput.classList.remove('is-invalid');
        }
        
        if (!timeInput.value) {
            timeInput.classList.add('is-invalid');
            return;
        } else {
            timeInput.classList.remove('is-invalid');
        }
        
        // Show loading state
        saveScheduleBtn.disabled = true;
        saveScheduleBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Scheduling...';
        
        // Prepare data
        const scheduleData = {
            title: titleInput.value.trim(),
            date: dateInput.value,
            time: timeInput.value
        };
        
        // Send schedule request
        fetch('/api/schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scheduleData),
        })
        .then(response => response.json())
        .then(data => {
            // Reset button
            saveScheduleBtn.disabled = false;
            saveScheduleBtn.innerHTML = 'Schedule';
            
            if (data.success) {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleModal'));
                modal.hide();
                
                // Show success notification
                showNotification(
                    'Video Scheduled',
                    `"${scheduleData.title}" has been scheduled successfully.`,
                    'success'
                );
                
                // In a real app, we would update the UI with the new schedule
                // For demo purposes, we'll just reload the page after a delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // Show error notification
                showNotification(
                    'Scheduling Failed',
                    data.error || 'There was a problem scheduling the video.',
                    'error'
                );
            }
        })
        .catch(error => {
            console.error('Error scheduling video:', error);
            
            // Reset button
            saveScheduleBtn.disabled = false;
            saveScheduleBtn.innerHTML = 'Schedule';
            
            // Show error notification
            showNotification(
                'Scheduling Error',
                'There was a problem connecting to the scheduling service.',
                'error'
            );
        });
    });
}

/**
 * Setup Trending Topic Selection
 */
function setupTrendingTopicSelection() {
    const trendButtons = document.querySelectorAll('.use-trend-btn');
    trendButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trend = this.getAttribute('data-trend');
            
            // Open content generation modal
            const contentModal = new bootstrap.Modal(document.getElementById('contentGenerationModal'));
            document.getElementById('contentModalTitle').textContent = 'Generate Content';
            
            // Set the trend as the keyword
            document.getElementById('contentKeyword').value = trend;
            
            // Show modal
            contentModal.show();
        });
    });
    
    // Category filter for trends
    const trendCategories = document.querySelectorAll('.trend-category');
    trendCategories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryName = this.getAttribute('data-category');
            
            // Show loading state
            const trendsList = document.getElementById('trendingTopicsList');
            trendsList.innerHTML = `
                <div class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 text-muted">Fetching trends for ${categoryName}...</p>
                </div>
            `;
            
            // Send request to get trends for this category
            fetch('/api/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: categoryName,
                    limit: 5
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Clear loading state
                    trendsList.innerHTML = '';
                    
                    // Add trends to the list
                    data.trends.forEach(trend => {
                        const trendItem = document.createElement('div');
                        trendItem.className = 'trending-topic-item';
                        trendItem.innerHTML = `
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-${trend.icon === 'flame' ? 'fire text-danger' : 'bolt text-warning'} me-2"></i>
                                    <h6 class="trending-topic-title mb-0">${trend.keyword}</h6>
                                </div>
                                <button class="btn btn-sm btn-outline-primary use-trend-btn" data-trend="${trend.keyword}">
                                    Use
                                </button>
                            </div>
                            <div class="d-flex align-items-center mb-2">
                                <small class="text-muted me-2">Interest: ${trend.interest}%</small>
                                <div class="progress flex-grow-1" style="height: 6px;">
                                    <div class="progress-bar ${trend.interest >= 85 ? 'bg-danger' : trend.interest >= 75 ? 'bg-warning' : 'bg-primary'}" 
                                         role="progressbar" 
                                         style="width: ${trend.interest}%" 
                                         aria-valuenow="${trend.interest}" 
                                         aria-valuemin="0" 
                                         aria-valuemax="100"></div>
                                </div>
                            </div>
                        `;
                        trendsList.appendChild(trendItem);
                    });
                    
                    // Re-attach event listeners
                    setupTrendingTopicSelection();
                    
                    // Show notification
                    showNotification(
                        'Trends Updated',
                        `Showing top trending topics for ${categoryName}.`,
                        'success'
                    );
                } else {
                    // Show error in the trends list
                    trendsList.innerHTML = `
                        <div class="text-center py-4">
                            <i class="fas fa-exclamation-circle text-warning fa-2x mb-3"></i>
                            <p class="text-muted">Could not load trends for ${categoryName}.</p>
                            <button class="btn btn-sm btn-outline-primary mt-2" id="retryTrendsBtn">
                                <i class="fas fa-sync me-2"></i> Retry
                            </button>
                        </div>
                    `;
                    
                    // Add retry button functionality
                    document.getElementById('retryTrendsBtn').addEventListener('click', function() {
                        const event = new MouseEvent('click');
                        category.dispatchEvent(event);
                    });
                    
                    // Show error notification
                    showNotification(
                        'Error Loading Trends',
                        data.error || `Could not load trends for ${categoryName}.`,
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error('Error fetching trends:', error);
                
                // Show error in the trends list
                trendsList.innerHTML = `
                    <div class="text-center py-4">
                        <i class="fas fa-exclamation-circle text-warning fa-2x mb-3"></i>
                        <p class="text-muted">Could not connect to the trends service.</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" id="retryTrendsBtn">
                            <i class="fas fa-sync me-2"></i> Retry
                        </button>
                    </div>
                `;
                
                // Add retry button functionality
                document.getElementById('retryTrendsBtn').addEventListener('click', function() {
                    const event = new MouseEvent('click');
                    category.dispatchEvent(event);
                });
            });
        });
    });
}

/**
 * Handle text overflow for video titles and descriptions
 */
function handleTextOverflow() {
    const videoTitles = document.querySelectorAll('.video-title');
    videoTitles.forEach(title => {
        if (title.scrollHeight > title.clientHeight) {
            title.title = title.textContent;
        }
    });
}

/**
 * Show a notification
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, warning, error)
 */
function showNotification(title, message, type = 'success') {
    // In a real app, we would use a toast or notification library
    // For this demo, we'll use a simple alert
    let icon, color;
    
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            color = 'var(--success-color)';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            color = 'var(--warning-color)';
            break;
        case 'error':
            icon = 'fa-times-circle';
            color = 'var(--danger-color)';
            break;
        default:
            icon = 'fa-info-circle';
            color = 'var(--primary-color)';
    }
    
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '1050';
    toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="fas ${icon} me-2" style="color: ${color}"></i>
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}
