import os
from dotenv import load_dotenv

# Modern LangChain Imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory

# Load API Keys
load_dotenv()

# The Socratic Personality
SOCRATIC_SYSTEM_PROMPT = """
You are 'Deep Blue', a Socratic Coding Tutor. 
Your goal is to help the student derive the answer themselves.

RULES:
1. NEVER give the full code solution.
2. If the user asks "How do I do X?", ask them "What have you tried?" or "What is your logic?"
3. If the user posts code with an error, do not fix it. Instead, point to the line and ask: "What do you think happens here?"
4. Keep your responses short (under 3 sentences).
5. Be encouraging but firm on not giving answers.

Current Topic: Python Basics.
"""

class SocraticAI:
    def __init__(self):
        # 1. Initialize the Google Brain
        if not os.getenv("GOOGLE_API_KEY"):
            raise ValueError("GOOGLE_API_KEY not found in .env file")

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash", 
            temperature=0.5
        )

        # 2. Define the Prompt Template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SOCRATIC_SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])

        # 3. Create the Chain
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

    def chat(self, user_input: str, user_code: str = "", session_id: str = "default_user"):
        full_prompt = user_input
        if user_code:
            full_prompt += f"\n\n[STUDENT'S CODE]:\n{user_code}"

        response = self.conversation.invoke(
            {"input": full_prompt},
            config={"configurable": {"session_id": session_id}}
        )
        return response

ai_tutor = SocraticAI()