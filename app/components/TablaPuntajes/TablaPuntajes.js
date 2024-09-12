"use client";

import React, { useState, useEffect } from 'react';
import styles from './TablaPuntajes.module.css';

const TablaPuntajes = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('scores')) || [];
    setScores(storedScores);
  }, []);

  return (
    <div className={styles.tablaPuntajes}>
      <h2>Tabla de Puntajes</h2>
      {scores.length === 0 ? (
        <p>No hay puntajes disponibles.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{score.name}</td>
                <td>{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaPuntajes;
