from django.urls import path
import knox.views

from . import views

import knox

urlpatterns = [
    path("abc/", views.index, name="index"),
    # path("login/", view=views.Login.as_view()),
    path("login/", view=views.kLoginView.as_view()),
    path("sign-up/", view=views.signup),
    # path("logout/", view=views.logout),
    path("logout/", view=knox.views.LogoutView.as_view()),
    path("events/", view=views.EventsView.as_view()),
    path("events/<int:eid>/", view=views.EventView.as_view()),
    path("events/<int:eid>/participants/", view=views.ParticipantsView.as_view()),
    path("events/<int:eid>/comments/", view=views.CommentsView.as_view()),
    path("events/<int:eid>/comments/<int:cid>/vote/", view=views.CommentVotesView.as_view()),
    path("accounts/", view=views.UpdateUserView.as_view()),
    path("accounts/change-password/", view=views.UpdatePasswordView.as_view()),
]