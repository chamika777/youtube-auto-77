# YouTube Automation Dashboard Configuration
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Environment Configuration
DEBUG = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 't')
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 5000))

# OpenAI API Configuration
OPENAI_MODEL = "gpt-4o"  # the newest OpenAI model is "gpt-4o" which was released May 13, 2024
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', None)

# Video Categories
VIDEO_CATEGORIES = [
    "Technology",
    "Business",
    "Education",
    "Finance",
    "Health",
    "Science",
    "Marketing",
    "Programming",
    "Artificial Intelligence",
    "Cryptocurrency"
]

# Sample data for demo purposes
SAMPLE_DATA = {
    'analytics': {
        'total_views': 856500,
        'subscribers': 24200,
        'revenue': 2456,
        'videos_published': 128,
        'view_growth': 12.6,
        'subscriber_growth': 7.3,
        'revenue_growth': 18.3,
        'channel_performance': {
            'views': [12000, 15000, 18500, 22000, 25000, 27500, 30000],
            'engagement': [8.5, 9.1, 8.7, 9.3, 9.8, 9.5, 10.2],
            'dates': ['2023-10-01', '2023-11-01', '2023-12-01', '2024-01-01', 
                      '2024-02-01', '2024-03-01', '2024-04-01']
        }
    },
    'videos': [
        {
            'id': 1,
            'title': 'Top 5 AI Tools for Content Creation in 2025',
            'views': 24500,
            'likes': 2100,
            'comments': 345,
            'published': '2 days ago',
            'thumbnail': 'https://images.unsplash.com/photo-1497015455546-1da71faf8d06'
        },
        {
            'id': 2,
            'title': 'Machine Learning Explained: Beginner\'s Guide',
            'views': 42800,
            'likes': 3700,
            'comments': 512,
            'published': '5 days ago',
            'thumbnail': 'https://images.unsplash.com/photo-1459184070881-58235578f004'
        },
        {
            'id': 3,
            'title': 'Quantum Computing: The Future is Now',
            'views': 36200,
            'likes': 2900,
            'comments': 428,
            'published': '1 week ago',
            'thumbnail': 'https://images.unsplash.com/photo-1682506456442-a051e8dae813'
        },
        {
            'id': 4,
            'title': 'Web 3.0: Complete Developer Roadmap',
            'views': 51300,
            'likes': 4500,
            'comments': 632,
            'published': '2 weeks ago',
            'thumbnail': 'https://images.unsplash.com/photo-1485846234645-a62644f84728'
        }
    ],
    'trending': [
        {
            'keyword': 'Artificial Intelligence in Healthcare',
            'interest': 95,
            'icon': 'flame'
        },
        {
            'keyword': 'Next-Gen AR/VR Technology',
            'interest': 92,
            'icon': 'flame'
        },
        {
            'keyword': 'Quantum Computing Breakthroughs',
            'interest': 85,
            'icon': 'flame'
        },
        {
            'keyword': 'Sustainable Energy Solutions',
            'interest': 79,
            'icon': 'bolt'
        },
        {
            'keyword': 'Blockchain Beyond Crypto',
            'interest': 72,
            'icon': 'bolt'
        }
    ],
    'schedule': [
        {
            'id': 1,
            'title': 'Top AI Tools for Marketers',
            'date': '2024-04-29 13:00:00',
            'display_date': 'Today at 1:00 PM'
        },
        {
            'id': 2,
            'title': 'Web 3.0 Development Guide',
            'date': '2024-04-30 09:00:00',
            'display_date': 'Tomorrow at 9:00 AM'
        },
        {
            'id': 3,
            'title': 'Crypto Market Analysis',
            'date': '2024-05-05 16:00:00',
            'display_date': 'May 05, 4:00 PM'
        }
    ],
    'settings': {
        'username': 'JD',
        'channel_name': 'TubeAI',
        'publishing_preferences': {
            'optimal_time': '15:00',
            'days': ['Mon', 'Wed', 'Fri'],
            'video_length': '5-10 minutes',
            'format': '16:9'
        },
        'api_keys': {
            'youtube_connected': True,
            'openai_connected': True,
            'google_trends_connected': True
        }
    }
}
