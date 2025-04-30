import os
import logging
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.middleware.proxy_fix import ProxyFix
import json
from datetime import datetime, timedelta
import automation
from config import SAMPLE_DATA, VIDEO_CATEGORIES

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Custom Jinja2 filters
@app.template_filter('format_number')
def format_number(value):
    """Format a number adding K for thousands, M for millions"""
    try:
        value = float(value)
        if value >= 1000000:
            return f"{value/1000000:.1f}M"
        elif value >= 1000:
            return f"{value/1000:.1f}K"
        else:
            return str(int(value))
    except (ValueError, TypeError):
        return "0"

# Create necessary folders if they don't exist
os.makedirs('generated_videos', exist_ok=True)
os.makedirs('schedules', exist_ok=True)
os.makedirs('content', exist_ok=True)

# Load stored data from files
def load_data(filename, default_data=None):
    try:
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                return json.load(f)
        return default_data if default_data is not None else {}
    except Exception as e:
        logger.error(f"Error loading data from {filename}: {e}")
        return default_data if default_data is not None else {}

# Save data to files
def save_data(filename, data):
    try:
        with open(filename, 'w') as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        logger.error(f"Error saving data to {filename}: {e}")

# Routes
@app.route('/')
def index():
    analytics = load_data('content/analytics.json', SAMPLE_DATA['analytics'])
    recent_videos = load_data('content/videos.json', SAMPLE_DATA['videos'])
    trending_topics = load_data('content/trends.json', SAMPLE_DATA['trending'])
    schedule = load_data('schedules/upcoming.json', SAMPLE_DATA['schedule'])
    
    # Format dates for display
    for video in schedule:
        if 'date' in video:
            video_date = datetime.strptime(video['date'], '%Y-%m-%d %H:%M:%S')
            if video_date.date() == datetime.today().date():
                video['display_date'] = f"Today at {video_date.strftime('%I:%M %p')}"
            elif video_date.date() == (datetime.today() + timedelta(days=1)).date():
                video['display_date'] = f"Tomorrow at {video_date.strftime('%I:%M %p')}"
            else:
                video['display_date'] = video_date.strftime('%b %d, %I:%M %p')
    
    # Ensure chart data is properly formatted
    channel_performance = {
        'views': analytics.get('channel_performance', {}).get('views', [12000, 15000, 18500, 22000, 25000, 27500, 30000]),
        'engagement': analytics.get('channel_performance', {}).get('engagement', [8.5, 9.1, 8.7, 9.3, 9.8, 9.5, 10.2]),
        'dates': analytics.get('channel_performance', {}).get('dates', ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'])
    }
    
    return render_template('index.html', 
                           analytics=analytics, 
                           recent_videos=recent_videos, 
                           trending_topics=trending_topics,
                           schedule=schedule,
                           mode=session.get('automation_mode', 'manual'),
                           categories=VIDEO_CATEGORIES,
                           channel_performance=channel_performance)

@app.route('/content')
def content_page():
    videos = load_data('content/videos.json', SAMPLE_DATA['videos'])
    return render_template('content.html', videos=videos)

@app.route('/analytics')
def analytics_page():
    analytics = load_data('content/analytics.json', SAMPLE_DATA['analytics'])
    return render_template('analytics.html', analytics=analytics)

@app.route('/settings')
def settings_page():
    settings = load_data('content/settings.json', SAMPLE_DATA['settings'])
    return render_template('settings.html', settings=settings)

# API Endpoints
@app.route('/api/research', methods=['POST'])
def research_trends():
    category = request.json.get('category', 'Technology')
    limit = request.json.get('limit', 5)
    
    try:
        trends = automation.research_trends(category, limit)
        return jsonify({'success': True, 'trends': trends})
    except Exception as e:
        logger.error(f"Error researching trends: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/generate-content', methods=['POST'])
def generate_content():
    keyword = request.json.get('keyword', '')
    topic = request.json.get('topic', '')
    
    if not keyword and not topic:
        return jsonify({'success': False, 'error': 'Keyword or topic is required'})
    
    try:
        content = automation.generate_content(keyword, topic)
        return jsonify({'success': True, 'content': content})
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/create-video', methods=['POST'])
def create_video():
    script = request.json.get('script', '')
    title = request.json.get('title', '')
    
    if not script or not title:
        return jsonify({'success': False, 'error': 'Script and title are required'})
    
    try:
        video_path = automation.create_video(script, title)
        return jsonify({'success': True, 'video_path': video_path})
    except Exception as e:
        logger.error(f"Error creating video: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/optimize-seo', methods=['POST'])
def optimize_seo():
    title = request.json.get('title', '')
    description = request.json.get('description', '')
    keywords = request.json.get('keywords', [])
    
    try:
        seo_data = automation.optimize_seo(title, description, keywords)
        return jsonify({'success': True, 'seo_data': seo_data})
    except Exception as e:
        logger.error(f"Error optimizing SEO: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/schedule', methods=['POST'])
def schedule_video():
    title = request.json.get('title', '')
    date = request.json.get('date', '')
    time = request.json.get('time', '')
    
    if not title or not date or not time:
        return jsonify({'success': False, 'error': 'Title, date and time are required'})
    
    try:
        schedule_datetime = f"{date} {time}:00"
        schedule = load_data('schedules/upcoming.json', [])
        
        new_entry = {
            'id': len(schedule) + 1,
            'title': title,
            'date': schedule_datetime
        }
        
        schedule.append(new_entry)
        save_data('schedules/upcoming.json', schedule)
        
        return jsonify({'success': True, 'schedule': schedule})
    except Exception as e:
        logger.error(f"Error scheduling video: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/toggle-mode', methods=['POST'])
def toggle_mode():
    current_mode = session.get('automation_mode', 'manual')
    new_mode = 'autopilot' if current_mode == 'manual' else 'manual'
    session['automation_mode'] = new_mode
    
    return jsonify({'success': True, 'mode': new_mode})

@app.route('/api/full-automation', methods=['POST'])
def full_automation():
    category = request.json.get('category', 'Technology')
    
    try:
        # Run the complete automation pipeline
        trends = automation.research_trends(category, 1)
        if not trends:
            return jsonify({'success': False, 'error': 'No trending topics found'})
        
        topic = trends[0]['keyword']
        content = automation.generate_content(topic, category)
        
        video_path = automation.create_video(content['script'], content['title'])
        seo_data = automation.optimize_seo(content['title'], content['description'], [topic])
        
        return jsonify({
            'success': True, 
            'topic': topic,
            'content': content,
            'video_path': video_path,
            'seo': seo_data
        })
    except Exception as e:
        logger.error(f"Error in full automation: {e}")
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    from config import DEBUG, HOST, PORT
    app.run(host=HOST, port=PORT, debug=DEBUG)
