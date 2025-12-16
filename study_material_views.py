from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import FileResponse
from  study_material_model import StudyMaterial

@login_required
def study_material_list(request):
    materials = StudyMaterial.objects.all().order_by('-uploaded_at')
    return render(request, 'study_material/list.html', {'materials': materials})

@login_required
def upload_study_material(request):
    if request.method == 'POST' and request.user.is_staff:
        title = request.POST.get('title')
        description = request.POST.get('description')
        file = request.FILES.get('file')

        StudyMaterial.objects.create(
            title=title,
            description=description,
            file=file,
            uploaded_by=request.user
        )
        return redirect('study_material_list')

    return render(request, 'study_material/upload.html')

@login_required
def download_material(request, material_id):
    material = get_object_or_404(StudyMaterial, id=material_id)
    return FileResponse(material.file.open(), as_attachment=True)
