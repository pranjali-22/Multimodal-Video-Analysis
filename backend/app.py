import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def get_gemini_api_key():
    return os.getenv('GEMINI_API_KEY')

# Function to ask a question using the Gemini API
def ask_gemini(ques):
    api_key = get_gemini_api_key()
    if not api_key:
        raise ValueError("Gemini API key is missing from the .env file")

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=ques,
        )


        answer = response.text  
        return answer.strip()

    except Exception as e:
        return f"An error occurred: {str(e)}"

if __name__ == "__main__":
    question = "What is the capital of France?"
    answer = ask_gemini(question)
    print("Answer:", answer)
