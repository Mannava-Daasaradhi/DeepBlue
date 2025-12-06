import os
import re
from dotenv import load_dotenv

# Modern LangChain Imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory

# Load API Keys
load_dotenv()

# Base Socratic Personality Definition
BASE_SYSTEM_PROMPT = """
You are 'Deep Blue', a Socratic Coding Tutor, guiding a student through complex cyber raids using Python.
Your communication must match the current mission's active role.

RULES:
1. NEVER give the full code solution. Focus on guided discovery.
2. Keep your responses short (under 3 sentences).
3. Be encouraging and maintain the "futuristic combat/programming" tone.
4. If the student's code is empty or syntactically correct but doesn't solve the mission, refer to the MISSION OBJECTIVE.
"""

class SocraticAI:
    def __init__(self):
        # 1. Initialize the Google Brain
        if not os.getenv("GOOGLE_API_KEY"):
            raise ValueError("GOOGLE_API_KEY not found in .env file")

        # NOTE: Model updated to gemini-2.5-flash-preview-09-2025 for best performance
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-preview-09-2025", 
            temperature=0.5
        )

        # 2. Define the Prompt Template (Dynamic System Prompt)
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "{system_prompt}"), # Now dynamic
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])

        # 3. Create the Chain (Chain remains the same structure)
        self.chain = self.prompt | self.llm | StrOutputParser()

        # 4. Memory Management
        self.store = {} 

        def get_session_history(session_id: str) -> InMemoryChatMessageHistory:
            if session_id not in self.store:
                self.store[session_id] = InMemoryChatMessageHistory()
            return self.store[session_id]

        self.conversation = RunnableWithMessageHistory(
            self.chain,
            get_session_history,
            input_messages_key="input",
            history_messages_key="history",
        )

    def _extract_mission_context(self, user_input: str):
        """Extracts mission details from the user_input string sent by the frontend."""
        
        # Regex to find the key sections of the mission detail string
        match_objective = re.search(r"MISSION OBJECTIVE: (.*?)\n", user_input, re.DOTALL)
        match_architect = re.search(r"Architect: (.*?)\n", user_input, re.DOTALL)
        match_translator = re.search(r"Translator: (.*?)\n", user_input, re.DOTALL)
        match_debugger = re.search(r"Debugger: (.*?)$", user_input, re.DOTALL)

        # Set default values if not found
        objective = match_objective.group(1).strip() if match_objective else "General code review."
        
        # We will cycle the focus to keep the tutor dynamic. Let's default to Translator.
        role = "Translator"
        role_description = match_translator.group(1).strip() if match_translator else "Focus on the Python syntax required for the logic."

        # Attempt to detect which role is most relevant based on recent conversation history,
        # but for simplicity in this backend model, we inject the most relevant pieces.
        
        return objective, role, role_description

    def chat(self, user_input: str, user_code: str = "", session_id: str = "default_user"):
        # 1. Extract Mission Context from User Input
        objective, role, role_description = self._extract_mission_context(user_input)
        
        # 2. Build Dynamic System Prompt
        dynamic_prompt = f"""
{BASE_SYSTEM_PROMPT}

CURRENT MISSION CONTEXT:
MISSION OBJECTIVE: {objective}
YOUR CURRENT ROLE ({role}): {role_description}

You must respond as the designated {role}. Use the current student's code below as context for your Socratic guidance.
"""
        
        # 3. Construct the Human Input
        # Remove the mission context from the human input passed to the conversation, 
        # as it's already in the system prompt now.
        clean_input = re.sub(r"MISSION OBJECTIVE:.*?Debugger:.*?$", "", user_input, flags=re.DOTALL).strip()
        
        # Add code to the human input
        full_human_input = f"[STUDENT'S CODE]:\n{user_code}"
        if clean_input and not full_human_input.startswith(clean_input):
            full_human_input = f"{clean_input}\n\n{full_human_input}"

        # 4. Invoke the AI Conversation with dynamic system prompt
        response = self.conversation.invoke(
            {"input": full_human_input, "system_prompt": dynamic_prompt},
            config={"configurable": {"session_id": session_id}}
        )
        return response

ai_tutor = SocraticAI()