import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load env to get your key
load_dotenv(dotenv_path="backend/.env") 

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ Error: GOOGLE_API_KEY not found in .env")
    exit()

print(f"🔑 Checking models for Key: {api_key[:5]}... (hidden)")

try:
    genai.configure(api_key=api_key)
    print("\n✅ AVAILABLE MODELS:")
    count = 0
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f" - {m.name}")
            count += 1
            
    if count == 0:
        print("⚠️ No models found. Your API Key might be invalid or has no permissions.")
    else:
        print(f"\n✨ Found {count} models. Use one of the names above in your rag_agent.py")

except Exception as e:
    print(f"\n❌ API Connection Failed: {e}")