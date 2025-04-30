import os
import json
import time
import logging
import schedule
from datetime import datetime
import automation

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("automation_scheduler.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def load_schedule():
    """Load the schedule from file"""
    try:
        if os.path.exists('schedules/upcoming.json'):
            with open('schedules/upcoming.json', 'r') as f:
                return json.load(f)
        return []
    except Exception as e:
        logger.error(f"Error loading schedule: {e}")
        return []

def save_schedule(schedule_data):
    """Save the schedule to file"""
    try:
        os.makedirs('schedules', exist_ok=True)
        with open('schedules/upcoming.json', 'w') as f:
            json.dump(schedule_data, f, indent=4)
    except Exception as e:
        logger.error(f"Error saving schedule: {e}")

def process_scheduled_video(video_id, title):
    """Process a scheduled video"""
    logger.info(f"Processing scheduled video: {title} (ID: {video_id})")
    
    try:
        # Extract category from title
        categories = ["Technology", "AI", "Business", "Finance", "Crypto", "Web", "Marketing"]
        category = next((c for c in categories if c.lower() in title.lower()), "Technology")
        
        # Run automation with the extracted category
        result = automation.run_automation(category)
        
        if result:
            logger.info(f"Successfully automated video creation for: {title}")
            
            # Log the result
            log_entry = {
                "id": video_id,
                "title": title,
                "processed_at": datetime.now().isoformat(),
                "result": {
                    "trend": result["trend"]["keyword"],
                    "generated_title": result["content"]["title"],
                    "video_path": result["video_path"]
                }
            }
            
            # Save log
            os.makedirs('logs', exist_ok=True)
            with open(f'logs/processed_{video_id}_{int(time.time())}.json', 'w') as f:
                json.dump(log_entry, f, indent=4)
            
            return True
        else:
            logger.error(f"Automation failed for scheduled video: {title}")
            return False
    
    except Exception as e:
        logger.error(f"Error processing scheduled video {title}: {e}")
        return False

def check_schedule():
    """Check for videos that need to be processed"""
    logger.info("Checking schedule for videos to process")
    
    schedule_data = load_schedule()
    current_time = datetime.now()
    updated_schedule = []
    processed_any = False
    
    for video in schedule_data:
        try:
            # Parse scheduled datetime
            scheduled_time = datetime.strptime(video['date'], '%Y-%m-%d %H:%M:%S')
            
            # Check if it's time to process this video
            if current_time >= scheduled_time:
                # Process the video
                success = process_scheduled_video(video['id'], video['title'])
                if success:
                    logger.info(f"Successfully processed video: {video['title']}")
                    processed_any = True
                else:
                    # Keep it in the schedule for retry
                    updated_schedule.append(video)
                    logger.warning(f"Failed to process video, will retry: {video['title']}")
            else:
                # Not time yet, keep in schedule
                updated_schedule.append(video)
        
        except Exception as e:
            logger.error(f"Error checking schedule for video {video.get('title', 'unknown')}: {e}")
            # Keep problematic entries for manual review
            updated_schedule.append(video)
    
    # Save updated schedule if any videos were processed
    if processed_any:
        save_schedule(updated_schedule)
    
    return processed_any

def run_scheduler():
    """Run the main scheduler loop"""
    logger.info("Starting scheduler")
    
    # Schedule the check_schedule function to run every hour
    schedule.every(1).hours.do(check_schedule)
    
    # Also run it once at startup
    check_schedule()
    
    # Keep the scheduler running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute for any pending tasks

if __name__ == "__main__":
    logger.info("Daily Runner started")
    try:
        run_scheduler()
    except KeyboardInterrupt:
        logger.info("Daily Runner stopped by user")
    except Exception as e:
        logger.error(f"Daily Runner crashed: {e}")
