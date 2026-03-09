import React, { useState, useRef, useEffect } from 'react';

const QUICK_REPLIES = [
  '¿Qué como antes de la carrera?',
  'Me duele el isquio',
  '¿Cómo bajo mi pace?',
];

export default function AICoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.aiChat(newMessages);
        if (result.error) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: `⚠️ ${result.error}` },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: result.response },
          ]);
        }
      } else {
        // Fallback for browser dev
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'La integración con Devin solo funciona dentro de Electron. Ejecutá la app con `npm run dev`.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="view ai-coach">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="chat-welcome-icon">🏃‍♂️</div>
            <p className="chat-welcome-text">
              ¡Hola Axel! Soy tu coach de running. Preguntame lo que necesites sobre tu entrenamiento para el 21k.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble chat-bubble-assistant">
            <div className="typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick replies */}
      {messages.length === 0 && (
        <div className="quick-replies">
          {QUICK_REPLIES.map((q, i) => (
            <button key={i} className="quick-reply-btn" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí tu pregunta..."
          disabled={loading}
        />
        <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
          →
        </button>
      </form>
    </div>
  );
}
