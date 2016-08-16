#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from django.conf.urls import url
from . import views

app_name = 'vfs'

urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'get_path\S*', views.ajax_get_dir, name='get_path'),
    url(r'create_path\S*', views.ajax_create_path, name='create_path'),
    url(r'create_file\S*', views.ajax_create_file, name='create_file'),
    url(r'remove\S*', views.ajax_remove, name='remove'),
    url(r'save_to_file\S*', views.ajax_save_to_file, name='save_to_file'),
]
