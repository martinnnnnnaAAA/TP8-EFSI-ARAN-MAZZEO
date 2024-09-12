import styles from './Puntos.module.css';

const Puntos = ({ score }) => {
  return <p className={styles.Puntos}>Puntaje: {score}</p>;
};

export default Puntos;
