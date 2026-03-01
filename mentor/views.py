from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import openai
import os

openai.api_key = "YOUR_OPENAI_API_KEY"

@csrf_exempt
def mentor_chat(request):
    response_text = ""

    if request.method == "POST":
        user_question = request.POST.get("question")

        try:
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a competitive programming mentor."},
                    {"role": "user", "content": user_question}
                ]
            )

            response_text = completion.choices[0].message["content"]

        except Exception as e:
            response_text = "Error generating response."

    return render(request, "mentor.html", {"response": response_text})