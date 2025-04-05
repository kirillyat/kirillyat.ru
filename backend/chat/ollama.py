import os
import logging
from ollama import Client
from .models import Conversation, Message

logger = logging.getLogger(__name__)

host = os.environ.get("OLLAMA_HOST", "http://ollama:11434")
client = Client(host=host)

# Default system prompt that defines the assistant's behavior
DEFAULT_SYSTEM_PROMPT = """You are a helpful, respectful and honest assistant.
Always answer as helpfully as possible, while being safe.
Your answers should be informative, thoughtful, and concise.
If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct.
If you don't know the answer to a question, please don't share false information."""


def get_or_create_conversation(session_id):
    """Get or create a conversation for the given session ID"""
    conversation, created = Conversation.objects.get_or_create(session_id=session_id)

    # If this is a new conversation, add the system prompt
    if created:
        Message.objects.create(
            conversation=conversation, role="system", content=DEFAULT_SYSTEM_PROMPT
        )

    return conversation


def get_conversation_messages(conversation):
    """Get all messages for a conversation formatted for Ollama"""
    messages = []

    for msg in conversation.messages.all():
        messages.append({"role": msg.role, "content": msg.content})

    return messages


def process(input_text, session_id="default"):
    """Process a message in the context of a conversation"""
    logger.info(f"Processing input text: {input_text} for session: {session_id}")
    logging.info(f"Ollama Host: {host}")

    # Get or create the conversation
    conversation = get_or_create_conversation(session_id)

    # Add the user message to the database
    Message.objects.create(conversation=conversation, role="user", content=input_text)

    # Get all messages for this conversation
    messages = get_conversation_messages(conversation)

    # Send the conversation to Ollama
    response = client.chat(
        model="llama2",
        messages=messages,
    )

    # Save the assistant's response to the database
    Message.objects.create(
        conversation=conversation,
        role="assistant",
        content=response["message"]["content"],
    )

    # Update the conversation's timestamp
    conversation.save()

    return response
