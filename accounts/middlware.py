from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import logout
from datetime import datetime, timedelta

class SessionTimeoutMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated:
            last_activity = request.session.get('last_activity')
            
            if last_activity:
                # 30 minute timeout
                last_activity_time = datetime.fromisoformat(last_activity)
                if datetime.now() - last_activity_time > timedelta(minutes=30):
                    logout(request)
                    return redirect('/login/')
            
            request.session['last_activity'] = datetime.now().isoformat()