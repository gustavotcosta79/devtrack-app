from groq import Groq
from core.config import config

class AIService:
    def __init__(self):
        self.client = Groq(api_key=config.groq_api_key)

    def generate_recommendation (self, dev_score: float, top_languages: str, complexity_level: str):
        prompt_messages = [
            {
                "role": "system",
                "content": "És um Mentor técnico Sénior. Responde em português de Portugal. Dá "
                           "Uma recomendação curta (máximo 3 ou 4 linhas) e direta sobre o que o "
                           "programador deve aprender a seguir. Não uses formatação markdown pesada, "
                           "apenas texto simples."
            },
            {
                "role": "user",
                "content": f"Analisa este perfil: DevScore de {dev_score}. Trabalha principalmente com as linguagens "
                           f"{top_languages}. Os seus repositórios são de complexidade: {complexity_level}."
            }
        ]

        response = self.client.chat.completions.create(
            messages = prompt_messages,
            model="llama-3.1-8b-instant",
            temperature=0.7
        )

        text_from_ai = response.choices[0].message.content
        return {"response" : text_from_ai}