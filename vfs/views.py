import simplejson as simplejson
from django.shortcuts import render
from django.http.response import HttpResponse

# Create your views here.
from django.views import generic
from . import models


class IndexView(generic.ListView):
    template_name = 'vfs/index.html'
    context_object_name = 'model'

    def get_queryset(self):
        listing = models.DirectoryListing()
        return listing.get_path('root')


def ajax_get_dir(request):
    # return HttpResponse(simplejson.dumps({'d': 'abs'}, ensure_ascii=False), content_type='application/json')
    if request.method in 'GET':
        listing = models.DirectoryListing()
        data = listing.get_path(request.GET['path'])
        data['key'] = list(data.keys())[0]
        data['self'] = request.GET['path']
        data = simplejson.dumps(data, ensure_ascii=False)
        return HttpResponse(data, content_type='application/json')
