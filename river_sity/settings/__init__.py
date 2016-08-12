# -*- coding: utf-8 -*-
from .base import *
try:
    from .local import *
except ImportError:
    print('No module named "local.py". Please, make this module from local.skeleton')
