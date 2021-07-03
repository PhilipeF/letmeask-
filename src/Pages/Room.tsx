import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom';

import '../styles/room.scss';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
};

export function Room() {
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const { user } = useAuth();

  const roomId = params.id;

  async function handlreSendQuestion(event: FormEvent) {
    event.preventDefault(); //para ele não recarregar a tela

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main className='content'>
        <div className='room-title'>
          <h1>Sala de React</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={handlreSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className='form-footer'>
            {user ? (
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <p>sdsd</p>
            )}
            <span>
              Para enviar um pergunta, <button>faça seu loguin</button>.
            </span>
          </div>
          <Button type='submit' disabled={!user}>
            Enviar pergunta
          </Button>
        </form>
      </main>
    </div>
  );
}
