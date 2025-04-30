/**
 * TubeAI Dashboard - Content Generator
 * This file contains the functionality for content generation and video creation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Setup Content Generation Modal
    setupContentGenerationModal();
    
    // Setup Video Creation Modal
    setupVideoCreationModal();
    
    // Setup SEO Optimization Modal
    setupSeoOptimizationModal();
    
    // Connect content generator to trend buttons
    connectTrendButtons();
});

/**
 * Setup Content Generation Modal
 */
function setupContentGenerationModal() {
    const generateContentModalBtn = document.getElementById('generateContentModalBtn');
    if (!generateContentModalBtn) return;
    
    generateContentModalBtn.addEventListener('click', function() {
        const keyword = document.getElementById('contentKeyword').value.trim();
        const category = document.getElementById('contentCategory').value;
        
        if (!keyword) {
            alert('Please enter a keyword or topic');
            return;
        }
        
        // Show loading spinner
        document.getElementById('contentSpinner').classList.remove('d-none');
        document.getElementById('generatedContentContainer').classList.add('d-none');
        this.disabled = true;
        
        // Call API to generate content
        fetch('/api/generate-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keyword: keyword,
                topic: category
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Hide spinner
            document.getElementById('contentSpinner').classList.add('d-none');
            this.disabled = false;
            
            if (data.success) {
                // Display the generated content
                document.getElementById('generatedTitle').textContent = data.content.title || '';
                document.getElementById('generatedDescription').textContent = data.content.description || '';
                document.getElementById('generatedScript').textContent = data.content.script || '';
                
                // Show the content container
                document.getElementById('generatedContentContainer').classList.remove('d-none');
                
                // Show action buttons
                this.classList.add('d-none');
                document.getElementById('createVideoFromContentBtn').classList.remove('d-none');
                document.getElementById('optimizeSEOFromContentBtn').classList.remove('d-none');
                
                // Store the content in session storage for use in other modals
                sessionStorage.setItem('generatedTitle', data.content.title || '');
                sessionStorage.setItem('generatedDescription', data.content.description || '');
                sessionStorage.setItem('generatedScript', data.content.script || '');
            } else {
                // Show error notification
                alert('Error generating content: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error generating content:', error);
            document.getElementById('contentSpinner').classList.add('d-none');
            this.disabled = false;
            alert('Error connecting to the content generation service');
        });
    });
    
    // Setup content action buttons
    setupContentActionButtons();
}

/**
 * Setup Content Action Buttons
 */
function setupContentActionButtons() {
    // Create Video from Content Button
    const createVideoFromContentBtn = document.getElementById('createVideoFromContentBtn');
    if (createVideoFromContentBtn) {
        createVideoFromContentBtn.addEventListener('click', function() {
            // Close the content modal
            const contentModal = bootstrap.Modal.getInstance(document.getElementById('contentGenerationModal'));
            contentModal.hide();
            
            // Open the video creation modal
            const videoModal = new bootstrap.Modal(document.getElementById('videoCreationModal'));
            
            // Populate the video creation form with the generated content
            document.getElementById('videoScriptInput').value = sessionStorage.getItem('generatedScript') || '';
            document.getElementById('videoTitleInput').value = sessionStorage.getItem('generatedTitle') || '';
            
            // Show the video modal
            videoModal.show();
        });
    }
    
    // Optimize SEO from Content Button
    const optimizeSEOFromContentBtn = document.getElementById('optimizeSEOFromContentBtn');
    if (optimizeSEOFromContentBtn) {
        optimizeSEOFromContentBtn.addEventListener('click', function() {
            // Close the content modal
            const contentModal = bootstrap.Modal.getInstance(document.getElementById('contentGenerationModal'));
            contentModal.hide();
            
            // Open the SEO optimization modal
            const seoModal = new bootstrap.Modal(document.getElementById('seoOptimizationModal'));
            
            // Populate the SEO form with the generated content
            document.getElementById('seoTitleInput').value = sessionStorage.getItem('generatedTitle') || '';
            document.getElementById('seoDescriptionInput').value = sessionStorage.getItem('generatedDescription') || '';
            
            // Extract keywords from the title
            const title = sessionStorage.getItem('generatedTitle') || '';
            const keywords = extractKeywords(title);
            document.getElementById('seoKeywordsInput').value = keywords.join(', ');
            
            // Show the SEO modal
            seoModal.show();
        });
    }
}

/**
 * Setup Video Creation Modal
 */
function setupVideoCreationModal() {
    const startVideoCreationBtn = document.getElementById('startVideoCreationBtn');
    if (!startVideoCreationBtn) return;
    
    startVideoCreationBtn.addEventListener('click', function() {
        const script = document.getElementById('videoScriptInput').value.trim();
        const title = document.getElementById('videoTitleInput').value.trim();
        
        if (!script) {
            alert('Please enter a video script');
            return;
        }
        
        if (!title) {
            alert('Please enter a video title');
            return;
        }
        
        // Show progress bar and status
        document.getElementById('videoCreationProgress').classList.remove('d-none');
        document.getElementById('videoCreationResult').classList.add('d-none');
        this.disabled = true;
        
        // Update progress bar
        const progressBar = document.getElementById('videoCreationProgress').querySelector('.progress-bar');
        const statusText = document.getElementById('videoCreationStatus');
        
        // Simulate video creation progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            progressBar.style.width = progress + '%';
            
            if (progress === 20) {
                statusText.textContent = 'Generating audio from script...';
            } else if (progress === 40) {
                statusText.textContent = 'Creating visual elements...';
            } else if (progress === 60) {
                statusText.textContent = 'Adding transitions and effects...';
            } else if (progress === 80) {
                statusText.textContent = 'Finalizing video...';
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                
                // Call API to create video
                fetch('/api/create-video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        script: script,
                        title: title
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    this.disabled = false;
                    
                    if (data.success) {
                        // Hide progress
                        document.getElementById('videoCreationProgress').classList.add('d-none');
                        
                        // Show result
                        document.getElementById('videoCreationResult').classList.remove('d-none');
                        document.getElementById('videoFilePath').textContent = data.video_path;
                        
                        // Change button text
                        this.textContent = 'Create Another Video';
                        this.classList.remove('btn-primary');
                        this.classList.add('btn-outline-primary');
                        
                        // Add a reload event to button
                        this.removeEventListener('click', arguments.callee);
                        this.addEventListener('click', function() {
                            const videoModal = bootstrap.Modal.getInstance(document.getElementById('videoCreationModal'));
                            videoModal.hide();
                            setTimeout(() => {
                                location.reload();
                            }, 500);
                        });
                    } else {
                        // Show error
                        statusText.textContent = 'Error creating video: ' + (data.error || 'Unknown error');
                        statusText.classList.add('text-danger');
                        this.disabled = false;
                    }
                })
                .catch(error => {
                    console.error('Error creating video:', error);
                    statusText.textContent = 'Error connecting to the video creation service';
                    statusText.classList.add('text-danger');
                    this.disabled = false;
                });
            }
        }, 200);
    });
}

/**
 * Setup SEO Optimization Modal
 */
function setupSeoOptimizationModal() {
    const startSeoOptimizationBtn = document.getElementById('startSeoOptimizationBtn');
    if (!startSeoOptimizationBtn) return;
    
    startSeoOptimizationBtn.addEventListener('click', function() {
        const title = document.getElementById('seoTitleInput').value.trim();
        const description = document.getElementById('seoDescriptionInput').value.trim();
        const keywords = document.getElementById('seoKeywordsInput').value.trim();
        
        if (!title) {
            alert('Please enter a video title');
            return;
        }
        
        // Show spinner
        document.getElementById('seoOptimizationSpinner').classList.remove('d-none');
        document.getElementById('seoOptimizationResult').classList.add('d-none');
        this.disabled = true;
        
        // Parse keywords into array
        const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);
        
        // Call API to optimize SEO
        fetch('/api/optimize-seo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                keywords: keywordsArray
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Hide spinner
            document.getElementById('seoOptimizationSpinner').classList.add('d-none');
            this.disabled = false;
            
            if (data.success) {
                // Display optimized content
                document.getElementById('optimizedTitle').textContent = data.seo_data.optimized_title || '';
                document.getElementById('optimizedDescription').textContent = data.seo_data.optimized_description || '';
                document.getElementById('suggestedTags').textContent = (data.seo_data.tags || []).join(', ');
                
                // Show results
                document.getElementById('seoOptimizationResult').classList.remove('d-none');
                
                // Change button action
                this.textContent = 'Apply Optimization';
                this.removeEventListener('click', arguments.callee);
                this.addEventListener('click', function() {
                    // Apply optimized values to the original inputs
                    document.getElementById('seoTitleInput').value = data.seo_data.optimized_title || '';
                    document.getElementById('seoDescriptionInput').value = data.seo_data.optimized_description || '';
                    document.getElementById('seoKeywordsInput').value = (data.seo_data.tags || []).join(', ');
                    
                    // Reset button
                    this.textContent = 'Optimize';
                    this.disabled = true;
                    
                    // Show confirmation
                    alert('SEO optimization applied successfully!');
                    
                    // Close modal after a delay
                    setTimeout(() => {
                        const seoModal = bootstrap.Modal.getInstance(document.getElementById('seoOptimizationModal'));
                        seoModal.hide();
                    }, 1000);
                });
            } else {
                // Show error
                alert('Error optimizing SEO: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error optimizing SEO:', error);
            document.getElementById('seoOptimizationSpinner').classList.add('d-none');
            this.disabled = false;
            alert('Error connecting to the SEO optimization service');
        });
    });
}

/**
 * Connect Trend Selection to Content Generation
 */
function connectTrendButtons() {
    document.querySelectorAll('.use-trend-btn').forEach(button => {
        button.addEventListener('click', function() {
            const trend = this.getAttribute('data-trend');
            
            // Open content generation modal
            const contentModal = new bootstrap.Modal(document.getElementById('contentGenerationModal'));
            document.getElementById('contentModalTitle').textContent = 'Generate Content';
            
            // Set the keyword field
            document.getElementById('contentKeyword').value = trend;
            
            // Show modal
            contentModal.show();
        });
    });
}

/**
 * Extract Keywords from Title
 * @param {string} title - The title to extract keywords from
 * @returns {string[]} An array of extracted keywords
 */
function extractKeywords(title) {
    // Remove stop words and extract meaningful keywords
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of'];
    const words = title.toLowerCase().split(/\s+/);
    const filteredWords = words.filter(word => {
        // Remove punctuation
        const cleanWord = word.replace(/[^\w\s]/g, '');
        // Filter out stop words and short words
        return cleanWord.length > 2 && !stopWords.includes(cleanWord);
    });
    
    // Get unique keywords
    return [...new Set(filteredWords)];
}
