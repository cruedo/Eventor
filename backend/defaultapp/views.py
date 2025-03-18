from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib import auth
from django import views
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q

from rest_framework.decorators import api_view, APIView, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.authentication import SessionAuthentication

import traceback
from .models import Events, Participants, Users, Comments, CommentVotes

from rest_framework import serializers


class UserSlz(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username"]
        extra_kwargs = {
            "username": {"validators": []},
        }

class LoginFormSlz(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"validators": []},
        }

class CreateUserSlz(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password2"]
        extra_kwargs = {
            "email": {"write_only": True},
            "password": {"write_only": True},
        }
    
    def validate(self, vdata):
        if vdata['password'] != vdata['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return vdata
    
    def create(self, vdata):
        # return User.objects.get(id=1)
        u = User.objects.create_user(username=vdata['username'], password=vdata['password'], email=vdata.get('email', None))
        return u
        # pass


@api_view(["POST"])
def signup(req):
    slz = CreateUserSlz(data=req.data)
    # return Response(slz.validated_data if slz.is_valid() else slz.errors)
    if not slz.is_valid():
        return Response(slz.errors)
    u = slz.save()
    auth.login(req, user=u)
    
    return Response(slz.validated_data)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
# @authentication_classes([SessionAuthentication])
def logout(req):
    auth.logout(req)
    rsp = {
        "message": "successfully logged out"
    }
    return Response(rsp)



class Login(APIView):
    def post(self, req):
        slz = LoginFormSlz(data=req.data)
        if not slz.is_valid():
            return Response(slz.errors, status=status.HTTP_400_BAD_REQUEST)
        u = auth.authenticate(username=slz.validated_data["username"], password=slz.validated_data["password"])
        if u is None:
            return Response({"message": "Incorrect username or password"}, status=status.HTTP_403_FORBIDDEN)
        auth.login(req, u)
        return Response({"message": "successfully logged in"})



def index(request):
    if request.method == "POST":
        print(repr(CreateUserSlz))
        from rest_framework.parsers import JSONParser
        bdy = JSONParser().parse(request)
        slz = CreateUserSlz(data=bdy)
        if slz.is_valid():
            print(f"yooo this is valid and initial data= {slz.initial_data}")
            print(slz.validated_data)
            # cres = slz.save()
            # print(f"cres = {cres}")
        else:
            print("invalid data")
            print(slz.errors)
    elif request.method == "GET":
        print("req.get = ", type(request.GET), request.GET)
        aid = request.GET['id']
        u = User.objects.get(id=aid)
        slz = CreateUserSlz(u)
        print("ooooooooooo -> ", request.user, type(request.user))
        return JsonResponse(slz.data)
    
    return HttpResponse("Hello, world. You're at the polls index.")



class EventFormSlz(serializers.ModelSerializer):

    user = UserSlz(read_only=True)
    attendees = serializers.IntegerField(read_only=True)

    def validate(self, vdata):
        # return super().validate(vdata)
        # traceback.print_stack()
        if (vdata.get("latitude", None) is None) != (vdata.get("longitude") is None):
            if vdata.get("latitude", None) is None:
                raise serializers.ValidationError("Longitude given but Latitude not given")
            else:
                raise serializers.ValidationError("Latitude given but Longitude not given")

        return vdata
    
    def create(self, validated_data):
        req = self.context["request"]
        e = Events(**validated_data, user=req.user)
        e.full_clean()
        e.save()
        return e

    class Meta:
        model = Events
        fields = ["id", "user", "title", "description", "city", "country", "start_datetime", "created_datetime", "modified_datetime", "latitude", "longitude", "fees", "capacity", "address", "attendees"]
        extra_kwargs = {
            "fees": {"default": 0},
        }
        read_only_fields = ["created_datetime", "modified_datetime", "id", "user"]

class EventsView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]
    # authentication_classes = []

    def post(self, req):
        slz = EventFormSlz(data=req.data, context={"request": req})
        if not slz.is_valid():
            return Response(slz.errors, status=status.HTTP_400_BAD_REQUEST)
        slz.save()
        return Response(slz.validated_data)
    
    def get(self, req):
        es = Events.objects.select_related("user").annotate(attendees=Count("participants")).order_by("-created_datetime")
        slz = EventFormSlz(es, many=True)
        return Response(slz.data)


class EventView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, req, eid):
        try:
            es = Events.objects.select_related("user").annotate(attendees=Count("participants")).get(id=eid)
        except Events.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        slz = EventFormSlz(es)
        joined = Participants.objects.filter(event=eid, user=req.user if req.user.is_authenticated else None).exists()
        return Response({**slz.data, "joined": joined})
    
    def put(self, req, eid):
        
        try:
            e = Events.objects.get(id=eid)
        except Events.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if e.user != req.user:
            return Response({"message": "Cannot modify event, permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        slz = EventFormSlz(e, data=req.data, partial=True)
        if not slz.is_valid():
            return Response(slz.errors, status=status.HTTP_400_BAD_REQUEST)
        slz.save()
        return Response(slz.validated_data)


class ParticipantFormSlz(serializers.ModelSerializer):
    class Meta:
        model = Participants
        fields = ["event"]

    def validate(self, vdata):
        u = self.context['request'].user
        if Participants.objects.filter(user=u, event=vdata['event']).exists():
            raise serializers.ValidationError("The user is already registered for the event")
        
        participant_count = Participants.objects.filter(event=vdata["event"]).count()
        if vdata["event"].capacity != None and participant_count >= vdata["event"].capacity:
            raise serializers.ValidationError("Event cannot accept any more participants, capacity reached")
        return vdata


    def create(self, vdata):
        req = self.context['request']
        p=Participants(user=req.user, event=vdata['event'])
        p.save()
        return p

class ParticipantsView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, req, eid):
        s=ParticipantFormSlz(data={'event': eid}, context={'request': req})
        if not s.is_valid():
            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
        s.save()
        return Response("foiasmd")
    
    def get(self, req, eid):
        # u = Participants.objects.filter(event_id=eid).select_related('user')
        try:
            e=Events.objects.get(id=eid)
        except Events.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        u = Users.objects.filter(participants__event_id=eid)
        s = UserSlz(u, many=True)
        return Response(s.data)



class CommentFormSlz(serializers.ModelSerializer):
    user = UserSlz(read_only=True)
    votes = serializers.IntegerField(read_only=True)
    class Meta:
        model = Comments
        fields = ["id", "user", "event", "text", "created_datetime", "votes"]
        extra_kwargs = {
            "created_datetime": {"read_only": True},
            "id": {"read_only": True},
            "event": {"write_only": True},
        }

    def create(self, vdata):
        u = self.context["request"].user
        c = Comments(user=u, **vdata)
        c.save()
        return c
    
class CommentsView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, req, eid):
        req.data["event"] = eid
        s = CommentFormSlz(data=req.data, context={"request": req})
        if not s.is_valid():
            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
        c = s.save()
        return Response({"message": "Successfully posted the comment", "comment": {**CommentFormSlz(c).data, "votes": 0, "vote_type": 0}})
    
    def get(self, req, eid):
        
        c = Comments.objects.filter(event=eid)
        cc = c.annotate(votes=Count("commentvotes", filter=Q(commentvotes__is_upvote=True))-Count("commentvotes", filter=Q(commentvotes__is_upvote=False)))


        v = CommentVotes.objects.filter(user=req.user if req.user.is_authenticated else None, comment__event=eid)
        v = CommentVotesFormSlz(v, many=True)
        dv: dict = {i["comment"]: i for i in v.data}


        s = CommentFormSlz(cc, many=True)
        for i in s.data:
            ele = dv.get(i["id"])
            if ele is not None:
                i["vote_type"] = 1 if ele["is_upvote"] else -1
            else:
                i["vote_type"] = 0
        
        return Response(s.data)
    



class CommentVotesFormSlz(serializers.ModelSerializer):
    
    event = serializers.PrimaryKeyRelatedField(queryset=Events.objects.all(), write_only=True)

    class Meta:
        model = CommentVotes
        fields = ["is_upvote", "comment", "event"]
        extra_kwargs = {
            "event": {"write_only": True},
        }

    def validate(self, vdata):
        u = self.context["request"].user
        if CommentVotes.objects.filter(user=u, comment=vdata["comment"]).exists():
            raise serializers.ValidationError("Cannot vote more than once on a comment")
        return vdata
    
    def create(self, vdata):
        vdata.pop("event")
        u = self.context["request"].user
        cv = CommentVotes(user=u, **vdata)
        cv.save()
        return cv
    
class CommentVotesView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, req, eid, cid):
        req.data["comment"] = cid
        req.data["event"] = eid

        s = CommentVotesFormSlz(data=req.data, context={"request": req})
        if not s.is_valid():
            return Response(s.errors)
        s.save()
        return Response({"message": "Successfully voted."})


class UpdateUserSlz(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name"]

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, req):
        s=UpdateUserSlz(req.user)
        return Response(s.data)
    
    def put(self, req):
        s = UpdateUserSlz(req.user, data=req.data, partial=True)
        if not s.is_valid():
            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
        s.save()
        return Response({"message": s.validated_data})

class UpdatePasswordSlz(serializers.ModelSerializer):
    password_new = serializers.CharField(write_only=True)
    password_new2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["password", "password_new", "password_new2"]
    
    def validate(self, vdata):
        if vdata['password_new'] != vdata['password_new2']:
            raise serializers.ValidationError("Confirmed password must match new password.")
        return vdata
    
    def validate_password(self, val):
        u: User = self.context["request"].user
        if not u.check_password(val):
            raise serializers.ValidationError("Incorrect Password")
        return val
    
    def update(self, instance: User, vdata):
        instance.set_password(vdata["password_new"])
        instance.save()
        return instance

class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    
    def put(self, req):
        s = UpdatePasswordSlz(req.user, data=req.data, context={"request": req})
        if not s.is_valid():
            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
        s.save()
        auth.update_session_auth_hash(req, req.user)
        return Response({"message": "Succesfully changed password"})
