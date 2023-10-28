from pathlib import Path

from PIL import Image

from app.tasks.celery_app import celery


@celery.task
def process_pic(path: str):
    im_path = Path(path)
    im = Image.open(im_path)
    im_resized_small = im.resize((200, int(200 / im.width * im.height)))
    im_resized_small.save(f'{im_path.parent}/small_{im_path.name}')

