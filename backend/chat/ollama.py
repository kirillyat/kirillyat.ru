import os
import logging

logger = logging.getLogger(__name__)
from ollama import Client

host = os.environ.get("OLLAMA_HOST", "http://ollama:11434")
client = Client(
    host=host,
)


def process(input_text):
    logger.info(f"Processing input text: {input_text}")
    logging.info(f"ollama Host: {host}")
    response = client.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": input_text,
            },
        ],
    )
    return response
