from groq import Groq
from core.config import config

class AIService:
    def __init__(self):
        self.client = Groq(api_key=config.groq_api_key)

    def generate_recommendation (self, dev_score: float, top_languages: str, complexity_level: str):
        prompt_messages = [
            {
                "role": "system",
                "content": ("És um Tech Lead e Mentor de Carreira exigente mas encorajador. "
                            "O teu objetivo é analisar as métricas de um programador e dar UMA recomendação técnica incisiva e acionável. "
                            "Responde em português de Portugal. Máximo de 3 frases. "
                            "Estrutura a resposta assim: 1) Um breve elogio ou constatação sobre o nível e stack atual. "
                            "2) O passo técnico óbvio seguinte para ele evoluir (ex: sugerir um padrão de desenho, aprender CI/CD, testes automáticos, arquitetura, ou uma linguagem complementar). "
                            "Não uses formatação markdown (sem asteriscos ou bold).")
            },
            {
                "role": "user",
                "content": (f"Avalia este programador. O seu nível global é um DevScore de {dev_score} (numa escala onde 0-39 é Júnior, 40-79 é Pleno e 80-100 é Sénior). "
                            f"Ele programa essencialmente em: {top_languages}. "
                            f"O tamanho/complexidade típica dos seus repositórios é: {complexity_level}. "
                            "O que é que ele deve aprender ou começar a fazer nos seus projetos a seguir para subir de nível?")
            }
        ]

        response = self.client.chat.completions.create(
            messages = prompt_messages,
            model="llama-3.1-8b-instant",
            temperature=0.7
        )

        text_from_ai = response.choices[0].message.content
        return text_from_ai