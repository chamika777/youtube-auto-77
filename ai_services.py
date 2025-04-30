import os
import json
import logging
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load API keys from environment variables
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# Initialize OpenAI client
try:
    openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
    if openai_client:
        logger.info("OpenAI client initialized successfully")
    else:
        logger.warning("OpenAI API key not found")
except Exception as e:
    logger.error(f"Error initializing OpenAI client: {e}")
    openai_client = None

# Function to generate content using OpenAI
def generate_content(keyword, topic="Technology"):
    """
    Generate content (title, description, script) based on keyword and topic
    """
    logger.debug(f"Generating content for keyword: {keyword}, topic: {topic}")
    
    if not openai_client:
        logger.warning("OpenAI client not available, using sample content")
        return {
            "title": f"Complete Guide to {keyword}: Everything You Need to Know in 2024",
            "description": f"In this comprehensive video, we explore {keyword} and its implications for the {topic} industry. Learn about the latest trends, key players, and how you can leverage this technology in your career or business.\n\n#TubeAI #{topic} #{keyword.replace(' ', '')}",
            "script": f"Hello and welcome to another video from TubeAI! Today, we're diving deep into {keyword}, one of the hottest topics in {topic} right now.\n\nFirst, let's understand what {keyword} actually means. [Definition and background information]\n\nSecond, we'll explore why {keyword} matters in today's landscape. [Importance and relevance]\n\nThird, we'll look at some practical applications and case studies. [Examples and use cases]\n\nFinally, we'll discuss future trends and how you can prepare for them. [Future outlook]\n\nIf you found this video helpful, please hit the like button and subscribe for more content like this. And don't forget to share your thoughts and questions in the comments section below.\n\nThanks for watching!"
        }
    
    try:
        # Craft prompt for content generation
        system_prompt = f"""You are an expert content creator for YouTube who specializes in {topic}. 
        Create high-quality, engaging content about '{keyword}' that will appeal to a YouTube audience.
        Your output should be in JSON format and include:
        1. A catchy, SEO-friendly title (under 70 characters)
        2. A comprehensive description (2-3 paragraphs with hashtags)
        3. A well-structured script for a 5-minute video that includes:
           - An engaging hook
           - Clear explanations of key concepts
           - Practical examples or applications
           - A call-to-action at the end
        
        Respond with JSON in this format: 
        {{"title": "string", "description": "string", "script": "string"}}
        """
        
        user_prompt = f"Create YouTube content about '{keyword}' for a channel focused on {topic}."
        
        # Call OpenAI API for content generation
        response = openai_client.chat.completions.create(
            model="gpt-4o",  # the newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=2000
        )
        
        # Extract and parse the content
        content = json.loads(response.choices[0].message.content)
        return content
    
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        # Fallback to sample content
        return {
            "title": f"{keyword}: Complete Guide for 2024",
            "description": f"Learn everything about {keyword} in this comprehensive guide. We cover the fundamentals, advanced techniques, and practical applications.\n\n#TubeAI #{topic.replace(' ', '')} #{keyword.replace(' ', '')}",
            "script": f"Hello viewers! Welcome to another video by TubeAI. Today we're talking about {keyword}, a fascinating topic in the world of {topic}.\n\nIn this video, we'll cover what {keyword} is, why it matters, and how you can apply it in real-world scenarios.\n\n[Main content section]\n\nThanks for watching! If you found this video helpful, please hit the like button and subscribe for more content like this."
        }

# Function to optimize SEO
def optimize_seo(title, description, keywords):
    """
    Optimize SEO metadata for a video
    """
    logger.debug(f"Optimizing SEO for title: {title}")
    
    if not openai_client:
        logger.warning("OpenAI client not available, using basic SEO optimization")
        tags = []
        for keyword in keywords:
            tags.extend(keyword.split())
            tags.append(keyword.replace(' ', ''))
        
        return {
            "optimized_title": f"{title} | Complete Guide 2024",
            "optimized_description": description + "\n\n" + "Don't forget to like, comment, and subscribe for more content!",
            "tags": list(set(tags))[:10],
            "category": "Education"
        }
    
    try:
        # Craft prompt for SEO optimization
        system_prompt = """You are a YouTube SEO expert. Optimize the given video title, 
        description, and keywords to maximize search visibility and click-through rate.
        Your output should be in JSON format and include:
        1. An optimized title (under 70 characters)
        2. An optimized description with proper formatting and CTAs
        3. A list of 10-15 relevant tags (individual keywords and phrases)
        4. The most appropriate YouTube category
        
        Respond with JSON in this format: 
        {"optimized_title": "string", "optimized_description": "string", "tags": ["string"], "category": "string"}
        """
        
        user_prompt = f"""
        Please optimize the following YouTube video metadata:
        
        Title: {title}
        Description: {description}
        Keywords: {', '.join(keywords)}
        """
        
        # Call OpenAI API for SEO optimization
        response = openai_client.chat.completions.create(
            model="gpt-4o",  # the newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1000
        )
        
        # Extract and parse the SEO data
        seo_data = json.loads(response.choices[0].message.content)
        return seo_data
    
    except Exception as e:
        logger.error(f"Error optimizing SEO: {e}")
        # Fallback to basic SEO optimization
        tags = []
        for keyword in keywords:
            tags.extend(keyword.split())
            tags.append(keyword.replace(' ', ''))
        
        return {
            "optimized_title": f"{title} | Essential Guide 2024",
            "optimized_description": description + "\n\n" + "Please LIKE and SUBSCRIBE for more content!",
            "tags": list(set(tags))[:10],
            "category": "Education"
        }
