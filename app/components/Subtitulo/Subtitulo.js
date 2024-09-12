import styles from './Subtitulo.module.css';

const Subtitulo = ({ text }) => {
  return <p className={styles.Subtitulo}>{text}</p>;
};

export default Subtitulo;
