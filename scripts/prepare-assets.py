from pathlib import Path
from PIL import Image, ImageOps
import shutil

source = Path(r'C:\Users\Marti\Desktop\AutoskolaTymy')
project = Path(__file__).resolve().parent.parent
target = project / 'public' / 'images'
target.mkdir(parents=True, exist_ok=True)
assets = {
    'logo': (source / 'autoskolatymylogo.png', 600),
    'peter': (next((source / 'Foto').rglob('peterwithlogo.png')), 720),
    'tibor': (next((source / 'Foto').rglob('tiborwithlogo.png')), 720),
    'hero': (source / 'Foto/FotoVozidiel/DSC05941.JPG', 1536),
    'hyundai': (source / 'Foto/FotoVozidiel/DSC05902.JPG', 1600),
    'cvicisko': (source / 'Foto/FotoCviciska/DSC05885.JPG', 1200),
    'cvicisko-detail': (source / 'Foto/FotoCviciska/DSC05876.JPG', 1000),
    'ucebna': (source / 'Foto/Foto ucebne/IMG_1712.JPG', 1400),
    'ucebna-detail': (source / 'Foto/Foto ucebne/IMG_1717.JPG', 1000),
}
for name, (path, width) in assets.items():
    image = ImageOps.exif_transpose(Image.open(path))
    image.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
    image.save(target / f'{name}.webp', 'WEBP', quality=86, method=6)
    if name == 'hero':
        social = ImageOps.fit(image.convert('RGB'), (1200, 630))
        social.save(target / 'social.jpg', quality=88)
    print(f'{name}: {image.size}')
for filename in ['prihlaska.pdf', 'ziadost.pdf']:
    directory = project / 'public' / 'documents'
    directory.mkdir(exist_ok=True)
    shutil.copy2(source / filename, directory / filename)
shutil.copy2(source / 'tymyicon.ico', project / 'public' / 'favicon.ico')
