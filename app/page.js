"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Titulo from './components/Titulo/Titulo';
import Bandera from './components/Bandera/Bandera';
import Input from './components/Input/Input';
import Puntos from './components/Puntos/Puntos';
import Subtitulo from './components/Subtitulo/Subtitulo';
import TablaPuntajes from './components/TablaPuntajes/TablaPuntajes';
import styles from './page.module.css';

const FlagGame = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [showHelp, setShowHelp] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [previousCountry, setPreviousCountry] = useState(null);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
        setCountries(response.data.data);
        selectRandomCountry(response.data.data);
      } catch (error) {
        console.error('Error al obtener los países:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      startTimer();
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [selectedCountry]);

  const startTimer = () => {
    if (timer) {
      clearInterval(timer);
    }

    setTimeLeft(30);
    const newTimer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(newTimer);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimer(newTimer);
  };

  const selectRandomCountry = (countriesArray) => {
    setPreviousCountry(selectedCountry);
    const randomIndex = Math.floor(Math.random() * countriesArray.length);
    setSelectedCountry(countriesArray[randomIndex]);
    setShowAnswer(false);
  };

  const handleGuess = () => {
    if (guess.toLowerCase() === selectedCountry.name.toLowerCase()) {
      setScore(prevScore => prevScore + timeLeft);
      setMessage('¡Correcto!');
      selectRandomCountry(countries);
      startTimer();
    } else {
      setScore(prevScore => prevScore - 1);
      setMessage('Incorrecto. Intenta de nuevo.');
    }
    setGuess('');
  };

  const handleTimeout = () => {
    const correctAnswer = selectedCountry ? selectedCountry.name : 'desconocido';
    setMessage(`¡Se acabó el tiempo! La bandera era de ${correctAnswer}`);
    setScore(prevScore => prevScore - 5);
    setShowAnswer(true);
    selectRandomCountry(countries);
    startTimer();
  };

  const handleHelp = () => {
    if (timeLeft > 2) {
      setShowHelp(true);
      setTimeLeft(prevTime => prevTime - 2);
    } else {
      setMessage('No hay tiempo suficiente para pedir ayuda.');
    }
  };

  const handlePlayerNameSubmit = (name) => {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ name, score });
    localStorage.setItem('scores', JSON.stringify(scores));
    setScore(0);
    selectRandomCountry(countries);
    startTimer();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = ((30 - timeLeft) / 30) * 100;

  return (
    <div className={styles.page}>
      <Titulo />
      {selectedCountry && (
        <div className={styles.contenedor}>
          <Bandera flagSrc={selectedCountry.flag} altText="bandera" />
          <Subtitulo text="¿A qué país pertenece esta bandera?" />
          <Input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Ingresa el nombre del país"
          />
          <button onClick={handleGuess}>Adivinar</button>
          <button onClick={handleHelp}>Pedir Ayuda</button>
          <div className={styles.timerWrapper}>
            <div className={styles.timerCircle} style={{ background: `conic-gradient(#007bff ${progress}%, #f9f9f9 ${progress}%)` }}>
              <span className={styles.timerText}>{formatTime(timeLeft)}</span>
            </div>
          </div>
          {showAnswer && (
            <p className={styles.answerMessage}>La bandera era de: {selectedCountry ? selectedCountry.name : 'desconocido'}</p>
          )}
          <p className={styles.scoreMessage}>{message}</p>
          {showHelp && <p>Ayuda: {selectedCountry.name.slice(0, 2).toUpperCase()}...</p>}
        </div>
      )}
      <Puntos score={score} />
      <form onSubmit={(e) => {
        e.preventDefault();
        handlePlayerNameSubmit(e.target.elements.name.value);
      }}>
        <input type="text" name="name" placeholder="Ingresa tu nombre" required />
        <button type="submit">Guardar Puntaje</button>
      </form>
      <TablaPuntajes />
    </div>
  );
};

export default FlagGame;
