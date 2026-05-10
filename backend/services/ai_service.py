from groq import Groq
from core.config import config

class AIService:
    def __init__(self):
        self.client = Groq(api_key=config.groq_api_key)

    def generate_recommendation (self, dev_score: float, top_languages: str, complexity_level: str):
        prompt_messages = [
                    {
                        "role": "system",
                        "content": (
                            "You are a demanding but encouraging Tech Lead and Career Mentor. "
                            "Your goal is to analyze a developer's metrics and provide ONE incisive and actionable technical recommendation. "
                            "Maximum of 3 sentences. "
                            "Structure your response as follows: 1) A brief compliment or observation about their current level and stack. "
                            "2) The obvious next technical step for them to evolve (e.g., suggesting a design pattern, learning CI/CD, automated testing, system architecture, or a complementary language). "
                            "Do not use markdown formatting (no asterisks or bold text)."
                        )
                    },
                    {
                        "role": "user",
                        "content": (
                            f"Evaluate this developer. Their overall level is a DevScore of {dev_score} "
                            f"(on a scale where 0-39 is Junior, 40-79 is Mid-Level, and 80-100 is Senior). "
                            f"They mainly program in: {top_languages}. "
                            f"The typical size/complexity of their repositories is: {complexity_level}. "
                            "What should they learn or start doing in their next projects to level up?"
                        )
                    }
                ]

        response = self.client.chat.completions.create(
            messages = prompt_messages,
            model="llama-3.1-8b-instant",
            temperature=0.7
        )

        text_from_ai = response.choices[0].message.content
        return text_from_ai