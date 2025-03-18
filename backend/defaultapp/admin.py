from django.contrib import admin
from .models import Events, Participants, Comments, CommentVotes

# Register your models here.
admin.site.register([Events, Participants, Comments, CommentVotes])
