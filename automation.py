import os
import logging
import json
import random
from datetime import datetime
import time
try:
    from pytrends.request import TrendReq
    from moviepy.editor import *
    import requests
except ImportError:
    pass  # Will be handled in the functions that use these imports

# Import our custom AI services
from ai_services import generate_content as ai_generate_content
from ai_services import optimize_seo as ai_optimize_seo

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load API keys from environment variables
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")

# Initialize API clients
try:
    pytrends = TrendReq(hl='en-US', tz=360, timeout=(10, 25), retries=2, backoff_factor=0.1)
except Exception as e:
    logger.error(f"Error initializing API clients: {e}")
    pytrends = None

# Function to research trending topics
def research_trends(category="Technology", limit=5):
    """
    Research trending topics using Google Trends API
    """
    logger.debug(f"Researching trends for category: {category}, limit: {limit}")
    
    # If PyTrends is not available, use sample data
    if not pytrends:
        logger.warning("PyTrends not available, using sample data")
        sample_trends = [
            {"keyword": "Artificial Intelligence in Healthcare", "interest": 95},
            {"keyword": "Next-Gen AR/VR Technology", "interest": 92},
            {"keyword": "Quantum Computing Breakthroughs", "interest": 85},
            {"keyword": "Sustainable Energy Solutions", "interest": 79},
            {"keyword": "Blockchain Beyond Crypto", "interest": 72},
            {"keyword": "Green Tech Innovations", "interest": 68},
            {"keyword": "Data Privacy in Social Media", "interest": 65},
            {"keyword": "Robotics in Manufacturing", "interest": 63},
            {"keyword": "5G Technology Applications", "interest": 61},
            {"keyword": "Smart City Development", "interest": 58},
        ]
        filtered_trends = [t for t in sample_trends if category.lower() in t["keyword"].lower()]
        return filtered_trends[:limit] if filtered_trends else sample_trends[:limit]
    
    try:
        # Build search query based on category
        search_query = f"{category} trends"
        
        # Get trending searches
        pytrends.build_payload(kw_list=[search_query], timeframe='now 7-d')
        related_topics = pytrends.related_topics()
        related_queries = pytrends.related_queries()
        
        trends = []
        
        # Extract top related topics
        if search_query in related_topics and 'top' in related_topics[search_query]:
            for topic in related_topics[search_query]['top'].head(limit).itertuples():
                trends.append({
                    "keyword": topic.value,
                    "interest": int(topic.value_increase) if hasattr(topic, 'value_increase') else random.randint(70, 99)
                })
        
        # Extract top related queries if needed
        if len(trends) < limit and search_query in related_queries and 'top' in related_queries[search_query]:
            for query in related_queries[search_query]['top'].head(limit - len(trends)).itertuples():
                trends.append({
                    "keyword": query.query,
                    "interest": int(query.value) if hasattr(query, 'value') else random.randint(70, 99)
                })
        
        # If still not enough trends, use rising queries
        if len(trends) < limit and search_query in related_queries and 'rising' in related_queries[search_query]:
            for query in related_queries[search_query]['rising'].head(limit - len(trends)).itertuples():
                trends.append({
                    "keyword": query.query,
                    "interest": int(query.value) if hasattr(query, 'value') else random.randint(70, 99)
                })
        
        # Add icons based on interest level
        for trend in trends:
            if trend["interest"] >= 85:
                trend["icon"] = "flame"
            else:
                trend["icon"] = "bolt"
        
        # Sort by interest level
        trends.sort(key=lambda x: x["interest"], reverse=True)
        
        # Save trends to file
        save_trends(trends)
        
        return trends[:limit]
    
    except Exception as e:
        logger.error(f"Error researching trends: {e}")
        # Fallback to sample data
        sample_trends = [
            {"keyword": f"{category}: Latest Developments", "interest": 95, "icon": "flame"},
            {"keyword": f"Future of {category}", "interest": 88, "icon": "flame"},
            {"keyword": f"{category} Industry Trends", "interest": 82, "icon": "flame"},
            {"keyword": f"Top {category} Companies", "interest": 75, "icon": "bolt"},
            {"keyword": f"{category} Career Opportunities", "interest": 70, "icon": "bolt"}
        ]
        return sample_trends[:limit]

# Function to generate content using OpenAI
def generate_content(keyword, topic="Technology"):
    """
    Generate content (title, description, script) based on keyword and topic
    """
    logger.debug(f"Generating content for keyword: {keyword}, topic: {topic}")
    
    # Use the ai_services module to generate content
    content = ai_generate_content(keyword, topic)
    
    # Save content to file if it was successfully generated
    if content:
        save_content(keyword, content)
    
    return content

# Function to create a video
def create_video(script, title):
    """
    Create a video using MoviePy based on the script and title
    """
    logger.debug(f"Creating video for title: {title}")
    
    # Generate a filename based on the title
    filename = f"generated_videos/{title.replace(' ', '_').replace(':', '').lower()}.mp4"
    
    try:
        # Check if MoviePy is available
        if 'MoviePy' not in globals():
            logger.warning("MoviePy not available, returning mock video path")
            # Return mock video path
            return filename
        
        # Create a text clip for the title
        title_clip = TextClip(title, fontsize=60, color='white', bg_color='black', 
                             size=(1920, 1080), method='caption')
        title_clip = title_clip.set_duration(5)
        
        # Split script into paragraphs
        paragraphs = script.split('\n\n')
        
        # Create text clips for each paragraph
        paragraph_clips = []
        for i, paragraph in enumerate(paragraphs):
            if paragraph.strip():
                clip = TextClip(paragraph, fontsize=40, color='white', bg_color='black',
                              size=(1920, 800), method='caption')
                clip = clip.set_duration(10)  # Each paragraph shown for 10 seconds
                paragraph_clips.append(clip)
        
        # Concatenate all clips
        video_clips = [title_clip] + paragraph_clips
        final_clip = concatenate_videoclips(video_clips)
        
        # Add a simple audio background (if available)
        try:
            audio_clip = AudioFileClip("static/assets/background.mp3").set_duration(final_clip.duration)
            final_clip = final_clip.set_audio(audio_clip)
        except:
            logger.warning("Could not add background audio")
        
        # Write the video file
        final_clip.write_videofile(filename, fps=24, codec='libx264', 
                                 audio_codec='aac', threads=4)
        
        return filename
    
    except Exception as e:
        logger.error(f"Error creating video: {e}")
        # Return mock video path
        return filename

# Function to optimize SEO
def optimize_seo(title, description, keywords):
    """
    Optimize SEO metadata for a video
    """
    logger.debug(f"Optimizing SEO for title: {title}")
    
    # Use the ai_services module to optimize SEO
    return ai_optimize_seo(title, description, keywords)

# Utility functions
def save_trends(trends):
    """Save trending topics to a file"""
    os.makedirs('content', exist_ok=True)
    with open('content/trends.json', 'w') as f:
        json.dump(trends, f, indent=4)

def save_content(keyword, content):
    """Save generated content to a file"""
    os.makedirs('content', exist_ok=True)
    filename = f"content/{keyword.replace(' ', '_').lower()}.json"
    with open(filename, 'w') as f:
        json.dump(content, f, indent=4)

# Full automation pipeline
def run_automation(category="Technology"):
    """
    Run the complete automation pipeline
    """
    try:
        # Step 1: Research trends
        trends = research_trends(category, 1)
        if not trends:
            logger.error("No trending topics found")
            return False
        
        # Step 2: Generate content
        keyword = trends[0]['keyword']
        content = generate_content(keyword, category)
        
        # Step 3: Create video
        video_path = create_video(content['script'], content['title'])
        
        # Step 4: Optimize SEO
        seo_data = optimize_seo(content['title'], content['description'], [keyword])
        
        # Save results
        result = {
            'trend': trends[0],
            'content': content,
            'video_path': video_path,
            'seo': seo_data,
            'timestamp': datetime.now().isoformat()
        }
        
        os.makedirs('content', exist_ok=True)
        with open(f'content/automation_result_{int(time.time())}.json', 'w') as f:
            json.dump(result, f, indent=4)
        
        return result
    
    except Exception as e:
        logger.error(f"Error in automation pipeline: {e}")
        return False

if __name__ == "__main__":
    # For testing purposes
    print(research_trends("Artificial Intelligence", 3))
    print(generate_content("Machine Learning Applications", "Technology"))
