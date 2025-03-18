from django.db import models

# Create your models here.

from django.contrib.auth.models import User as Users

# class Users(models.Model):
#     username = models.CharField(max_length=50)
#     password = models.CharField(max_length=100)
#     email = models.EmailField()
#     city = models.CharField(max_length=70)
#     country = models.CharField(max_length=70)
#     phone = models.CharField(max_length=15)
#     display_name = models.CharField(max_length=50)
#     created_datetime = models.DateTimeField(auto_now_add=True)

class Events(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    title = models.CharField(max_length=70)
    description = models.TextField(blank=True)
    city = models.CharField(max_length=70, blank=True)
    country = models.CharField(max_length=70, blank=True)
    start_datetime = models.DateTimeField()
    created_datetime = models.DateTimeField(auto_now_add=True)
    modified_datetime = models.DateTimeField(auto_now=True)
    latitude = models.DecimalField(decimal_places=7, max_digits=11, null=True, blank=True)
    longitude = models.DecimalField(decimal_places=7, max_digits=11, null=True, blank=True)
    fees = models.DecimalField(decimal_places=3, max_digits=10)
    capacity = models.PositiveIntegerField(blank=True, null=True)
    address = models.CharField(max_length=100, blank=True)

class Participants(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    created_datetime = models.DateTimeField(auto_now_add=True)

class Comments(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    created_datetime = models.DateTimeField(auto_now_add=True)
    text = models.TextField()

class CommentVotes(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comments, on_delete=models.CASCADE)
    is_upvote = models.BooleanField()
    created_datetime = models.DateTimeField(auto_now_add=True)

