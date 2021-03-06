from django.db import models

# Create your models here.
import os
import itertools
import shutil


class DirectoryListing:
    virtual_dir = 'vfs/virtual_driver'
    listing = {}

    def get_path(self, path: str) -> dict:
        case = {True: self.get_dir_info, False: self.get_file_info}
        full_path = os.path.join(os.getcwd(), self.virtual_dir, path)
        is_dir = os.path.isdir(full_path)
        listing = case[is_dir](path)
        return listing

    def get_dir_info(self, directory: str = 'root'):
        key = os.path.basename(directory)
        listing = {key: {}}

        listing[key]['size'] = 0
        listing[key]['is_folder'] = os.path.isdir(
            os.path.join(os.getcwd(), self.virtual_dir, directory))

        for dirpath, dirnames, filenames in os.walk(
                os.path.join(os.getcwd(), self.virtual_dir, directory)):
            if dirpath.endswith(directory):
                listing[key]['path'] = directory
                listing[key]['folders'] = dirnames
                listing[key]['files'] = filenames

            for f in itertools.chain(dirnames, filenames):
                fp = os.path.join(dirpath, f)
                listing[key]['size'] += os.path.getsize(fp)

        return listing

    def get_file_info(self, filepath: str) -> dict:
        basename = os.path.basename(filepath)
        fullpath = os.path.join(os.getcwd(), self.virtual_dir, filepath)
        listing = {basename: {}}
        listing[basename]['size'] = os.path.getsize(fullpath)
        listing[basename]['is_folder'] = os.path.isdir(fullpath)


        with open(fullpath, 'r') as f:
            listing[basename]['source'] = f.read()
        return listing

    def create_path(self, path):
        try:
            os.mkdir(os.path.join(os.getcwd(), self.virtual_dir, path))
        except Exception:
            return False
        else:
            return True

    def create_file(self, path):
        try:
            full_path = os.path.join(os.getcwd(), self.virtual_dir, path)
            with open(full_path, 'w'):
                pass
        except Exception:
            return False
        else:
            return True

    def remove_path(self, path):
        full_path = os.path.join(os.getcwd(), self.virtual_dir, path)
        try:
            os.remove(full_path)
        except IsADirectoryError:
            try:
                shutil.rmtree(full_path)
            except Exception:
                return False
            else:
                return True
        except Exception:
            return False
        else:
            return True

    def save_to_file(self, path, new_name, source, **kw):
        path = ''.join(path)
        new_name = ''.join(new_name)
        source = ''.join(source)

        old_path = path.split(': /')[1]
        path = os.sep.join(old_path.split(os.sep)[:-1])
        new_path = os.path.join(path, new_name)

        result = {'path': new_path}

        old_path = os.path.join(os.getcwd(), self.virtual_dir, old_path)
        new_path = os.path.join(os.getcwd(), self.virtual_dir, new_path)

        os.remove(old_path)
        with open(new_path, 'w') as f:
            f.write(source)

        return result
