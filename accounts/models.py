from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cf_handle = models.CharField(max_length=50, blank=True)
    lc_handle = models.CharField(max_length=50, blank=True)
    cc_handle = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.user.username
