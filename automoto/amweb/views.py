
from django.http import HttpResponse
from django.shortcuts import render



import geojson



def mainView(request):
    return render(request,'main.html',context={})
# Create your views here.
def jsonView(request):
    point = geojson.utils.generate_random("Point")
    
    #fc = geojson.FeatureCollection(point)
    dump = geojson.dumps(point, sort_keys=True)
    return HttpResponse(dump, content_type="application/json")
