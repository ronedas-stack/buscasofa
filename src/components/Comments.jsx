import { useEffect, useState } from 'react';
import './Comments.css';

function Comments({ stationId, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [msg, setMsg] = useState('');

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:4000/api/comments/${stationId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [stationId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4000/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, station_id: stationId, comment, rating })
    });
    const data = await res.json();
    if (res.ok) {
      setComment('');
      setRating(5);
      setMsg('¡Comentario enviado!');
      fetchComments();
    } else {
      setMsg(data.message);
    }
  };

  const renderStars = value => '★'.repeat(value) + '☆'.repeat(5 - value);

  return (
    <div className="comments-section">
      <h3>Comentarios de los usuarios</h3>
      {
        !user && (
          <p>Inicia sesión para dejar un comentario.</p>
        )
      }
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <label className="rating-label">Valoración:</label>
          <div className="rating-input">
            {[5, 4, 3, 2, 1].map(value => (
              <label key={value} className={`star-option ${rating === value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                />
                {renderStars(value)}
              </label>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            required
          />
          <button type="submit">Enviar</button>
        </form>
      )}
      {msg && <p>{msg}</p>}
      <ul className="comments-list">
        {comments.map((c, idx) => (
          <li key={idx}>
            <strong>{c.username}</strong> <em>({new Date(c.created_at).toLocaleString()})</em>
            <div className="comment-rating">{renderStars(c.rating || c.stars || 0)}</div>
            <div>{c.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comments;